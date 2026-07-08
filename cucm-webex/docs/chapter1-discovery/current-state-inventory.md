# Chapter 1: Discovery & Current State Assessment 

> **Related Abhavtech Documentation:**
> - *ABV-SDWAN-2024* - SD-WAN Deployment (network transport infrastructure)
> - *ABV-SDA-ISE-2025* - SD-Access & ISE Deployment (campus network, QoS policies)
> - *ABV-COLLAB-MIG-2026* - This document (collaboration migration)
>
> This chapter builds on the network infrastructure established in the SD-WAN and SD-Access projects. Network readiness assessments reference existing QoS policies, transport circuits, and campus configurations from those deployments.

## 1.1 Current State Infrastructure Inventory

### 1.1.1 Global Site Topology - Collaboration Infrastructure

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH.COM - CURRENT COLLABORATION TOPOLOGY                  |
+-----------------------------------------------------------------------------+
|                                                                             |
|                         +-------------------------+                         |
|                         |     MUMBAI HQ (HUB)     |                         |
|                         |  ====================== |                         |
|                         |  CUCM Cluster (Pub+4Sub)|                         |
|                         |  UCCX Cluster (HA)      |                         |
|                         |  Unity Connection (HA)  |                         |
|                         |  CUBE SBC (HA Pair)     |                         |
|                         |  Expressway C&E (MRA)   |                         |
|                         |  IM&P Cluster           |                         |
|                         +-----------+-------------+                         |
|                                     |                                       |
|         +---------------------------+---------------------------+          |
|         |                           |                           |          |
|         v                           v                           v          |
|  +--------------+           +--------------+           +--------------+    |
|  |    APAC      |           |     EMEA     |           |   AMERICAS   |    |
|  |   REGION     |           |    REGION    |           |    REGION    |    |
|  +------+-------+           +------+-------+           +------+-------+    |
|         |                          |                          |            |
|    +----+----+                +----+----+                +----+----+       |
|    |         |                |         |                |         |       |
|    v         v                v         v                v         v       |
| +------+ +------+        +------+ +------+        +------+ +------+      |
| |Chennai| |India |        |London| |Frank-|        | New  | |Dallas|      |
| | (Hub) | |Branch|        |(Hub) | | furt |        |Jersey| |(Hub) |      |
| +------+ |Sites |        +------+ +------+        +------+ +------+      |
|          +------+                                                          |
|   (Bangalore, Delhi, Noida, Pune, Hyderabad)                               |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 1.1.2 Site Classification Matrix

> **Note:** User counts include enterprise calling users. Contact center agents (175 total) overlap with user counts as they are also enterprise users with calling licenses.

| Site | Region | Site Type | Users | Phones | CC Agents | PSTN Type | Telecom Circle | LAN Subnet |
|------|--------|-----------|-------|--------|-----------|-----------|----------------|------------|
| **Mumbai HQ** | India | Hub | 1,200 | 850 | 120 | Local Gateway | Mumbai | 10.1.0.0/16 |
| **Chennai** | India | Regional Hub | 450 | 320 | 30 | Local Gateway | Tamil Nadu | 10.2.0.0/16 |
| **Bangalore** | India | Branch | 180 | 120 | - | Local Gateway | Karnataka | 10.3.0.0/20 |
| **Delhi** | India | Branch | 150 | 100 | - | Local Gateway | Delhi | 10.4.0.0/20 |
| **Noida** | India | Branch | 120 | 80 | - | Local Gateway | UP West | 10.5.0.0/20 |
| **Pune** | India | Branch | 100 | 60 | - | Shared (Mumbai) | Maharashtra | 10.6.0.0/20 |
| **Hyderabad** | India | Branch | 200 | 140 | - | Local Gateway | AP/Telangana | 10.7.0.0/20 |
| **London** | UK | Regional Hub | 520 | 380 | 15 | CCPP | N/A | 10.20.0.0/16 |
| **Frankfurt** | EU | Branch | 280 | 200 | - | CCPP | N/A | 10.21.0.0/20 |
| **New Jersey** | Americas | Regional Hub | 480 | 350 | 10 | CCPP | N/A | 10.30.0.0/16 |
| **Dallas** | Americas | Branch | 270 | 180 | - | CCPP | N/A | 10.31.0.0/20 |
| **Remote/WFH** | Global | Remote | 250 | - | - | ITN/Mobile | Various | VPN Pools |

**Summary Totals:**

| Region | Users | Phones | CC Agents | PSTN Strategy |
|--------|-------|--------|-----------|---------------|
| India (7 sites) | 2,400 | 1,670 | 150 | Local Gateway per telecom circle |
| EMEA (2 sites) | 800 | 580 | 15 | CCPP (IntelePeer UK/EU) |
| Americas (2 sites) | 750 | 530 | 10 | CCPP (IntelePeer US) |
| Remote/WFH | 250 | - | - | ITN (India) / Standard (others) |
| **TOTAL** | **4,200** | **2,780** | **175** | Hybrid |

> **Clarification:** The project scope references "3,200 enterprise calling users" which excludes the ~1,000 users who are primarily contact center agents or overlap categories. The 4,200 represents total headcount across all locations.

### 1.1.3 CUCM Cluster Architecture

```
+-----------------------------------------------------------------------------+
|              CUCM CLUSTER TOPOLOGY - ABHAVTECH.COM                          |
+-----------------------------------------------------------------------------+
|                                                                             |
|                    +------------------------------+                         |
|                    |      CUCM PUBLISHER          |                         |
|                    |  cucm-pub.abhavtech.com      |                         |
|                    |  IP: 10.1.10.10              |                         |
|                    |  Role: Database Master       |                         |
|                    +------------+-----------------+                         |
|                                 |                                           |
|        +------------------------+------------------------+                 |
|        |            |           |          |             |                 |
|        v            v           v          v             v                 |
|   +---------+ +---------+ +---------+ +---------+ +---------+             |
|   | SUB-01  | | SUB-02  | | SUB-03  | | SUB-04  | | TFTP    |             |
|   | Mumbai  | | Mumbai  | | Chennai | | London  | | Primary |             |
|   |10.1.10.11| |10.1.10.12| |10.2.10.10| |10.20.10.10| |10.1.10.15|        |
|   +---------+ +---------+ +---------+ +---------+ +---------+             |
|                                                                             |
|   CM GROUP ASSIGNMENTS:                                                     |
|   ===================                                                       |
|   Group 1 (India Primary): SUB-01 (Pri), SUB-02 (Sec), Publisher (Ter)    |
|   Group 2 (India Secondary): SUB-03 (Pri), SUB-01 (Sec), Publisher (Ter)  |
|   Group 3 (EMEA): SUB-04 (Pri), SUB-02 (Sec), Publisher (Ter)             |
|   Group 4 (Americas): SUB-02 (Pri), SUB-01 (Sec), Publisher (Ter)         |
|                                                                             |
|   DEVICE POOL MAPPING:                                                      |
|   ====================                                                      |
|   DP_Mumbai_HQ      -> CM Group 1 -> Region: India_Region                    |
|   DP_Chennai        -> CM Group 2 -> Region: India_Region                    |
|   DP_India_Branch   -> CM Group 1 -> Region: India_Region                    |
|   DP_London         -> CM Group 3 -> Region: EMEA_Region                     |
|   DP_Frankfurt      -> CM Group 3 -> Region: EMEA_Region                     |
|   DP_NewJersey      -> CM Group 4 -> Region: Americas_Region                 |
|   DP_Dallas         -> CM Group 4 -> Region: Americas_Region                 |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 1.1.4 CUCM Server Inventory

| Server | Role | FQDN | IP Address | Version | vCPU | RAM | Devices Registered |
|--------|------|------|------------|---------|------|-----|-------------------|
| **CUCM-PUB** | Publisher | cucm-pub.abhavtech.com | 10.1.10.10 | 14.0(1)SU4 | 8 | 16 GB | N/A (DB only) |
| **CUCM-SUB01** | Subscriber | cucm-sub01.abhavtech.com | 10.1.10.11 | 14.0(1)SU4 | 8 | 16 GB | 1,450 |
| **CUCM-SUB02** | Subscriber | cucm-sub02.abhavtech.com | 10.1.10.12 | 14.0(1)SU4 | 8 | 16 GB | 680 |
| **CUCM-SUB03** | Subscriber | cucm-sub03.abhavtech.com | 10.2.10.10 | 14.0(1)SU4 | 8 | 16 GB | 580 |
| **CUCM-SUB04** | Subscriber | cucm-sub04.abhavtech.com | 10.20.10.10 | 14.0(1)SU4 | 8 | 16 GB | 530 |
| **CUCM-TFTP** | TFTP | cucm-tftp.abhavtech.com | 10.1.10.15 | 14.0(1)SU4 | 4 | 8 GB | N/A |

**Cluster Configuration Details:**

| Parameter | Value |
|-----------|-------|
| Enterprise Parameters Version | 14.0(1)SU4 |
| Cluster ID | abhavtech-cucm-01 |
| Certificate Common Name | abhavtech.com |
| Intracluster Communication Protocol | TLS 1.2 |
| Database Replication Status | Active (all nodes) |
| Max Devices per Node | 2,500 |
| ITL File Recovery Password | Configured |
| Cluster Security Mode | Mixed Mode (Secure + Non-Secure) |

### 1.1.5 Unity Connection Deployment

```
+-----------------------------------------------------------------------------+
|              UNITY CONNECTION TOPOLOGY                                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|     +------------------------+     +------------------------+              |
|     |   UNITY PRIMARY        | <---> |   UNITY SECONDARY      |              |
|     |   (Active)             |     |   (Standby)            |              |
|     +------------------------+     +------------------------+              |
|     | FQDN: unity01          |     | FQDN: unity02          |              |
|     |       .abhavtech.com   |     |       .abhavtech.com   |              |
|     | IP: 10.1.10.20         |     | IP: 10.1.10.21         |              |
|     | Version: 14.0(1)SU4    |     | Version: 14.0(1)SU4    |              |
|     | Ports: 450             |     | Ports: 450             |              |
|     | Mailboxes: 3,200       |     | Mailboxes: 3,200       |              |
|     +------------------------+     +------------------------+              |
|                                                                             |
+-----------------------------------------------------------------------------+
```

**Unity Connection Configuration:**

| Parameter | Value |
|-----------|-------|
| Cluster Name | abhavtech-unity-cluster |
| Active Directory Integration | Enabled (abhavtech.com) |
| LDAP Sync Schedule | Every 6 hours |
| Max Greeting Length | 90 seconds |
| Max Message Length | 300 seconds |
| Message Aging | 90 days |
| Single Inbox (Exchange Integration) | Enabled |
| IMAP Client Access | Enabled |
| Speech Recognition | Enabled (English, Hindi) |

**Voicemail Pilot Numbers:**

| Region | Pilot Number | Description | Class of Service |
|--------|--------------|-------------|------------------|
| India | +91-22-4960-9999 | India VM Pilot | COS_India_Standard |
| UK | +44-20-4960-9999 | UK VM Pilot | COS_EMEA_Standard |
| EU | +49-69-4960-9999 | EU VM Pilot | COS_EMEA_Standard |
| Americas | +1-201-496-9999 | US VM Pilot | COS_Americas_Standard |

**Mailbox Distribution:**

| Region | Mailboxes | Storage Used (GB) | Avg Message Count |
|--------|-----------|-------------------|-------------------|
| India | 2,400 | 145 | 42 |
| EMEA | 800 | 52 | 38 |
| Americas | 750 | 48 | 35 |
| **Total** | **3,950** | **245** | **40** |

### 1.1.6 UCCX Contact Center - Current State

> **Note:** Phase 2 content - UCCX to Webex Contact Center migration details are deferred. This section provides inventory reference only.

```
+-----------------------------------------------------------------------------+
|              UCCX CLUSTER TOPOLOGY                                           |
+-----------------------------------------------------------------------------+
|                                                                             |
|     +------------------------+     +------------------------+              |
|     |   UCCX NODE 1          | <---> |   UCCX NODE 2          |              |
|     |   (Primary)            |     |   (Secondary)          |              |
|     +------------------------+     +------------------------+              |
|     | FQDN: uccx01           |     | FQDN: uccx02           |              |
|     |       .abhavtech.com   |     |       .abhavtech.com   |              |
|     | IP: 10.1.10.30         |     | IP: 10.1.10.31         |              |
|     | Version: 12.5(1)SU2    |     | Version: 12.5(1)SU2    |              |
|     | License: Premium       |     | License: Premium       |              |
|     | Agents: 175            |     | Agents: 175            |              |
|     +------------------------+     +------------------------+              |
|                                                                             |
+-----------------------------------------------------------------------------+
```

**UCCX Configuration Summary (Reference Only):**

| Parameter | Value |
|-----------|-------|
| License Type | Premium |
| Total Agent Seats | 175 |
| Concurrent Inbound Ports | 200 |
| Outbound Dialer Ports | 50 |
| Finesse Desktop | Enabled |
| Workforce Optimization | Basic Recording |
| Historical Reporting | Enabled (CUIC) |

### 1.1.7 PSTN and SBC Infrastructure

```
+-----------------------------------------------------------------------------+
|              CURRENT PSTN TOPOLOGY - CUBE SBC                               |
+-----------------------------------------------------------------------------+
|                                                                             |
|                      +--------------------------+                           |
|                      |         CUCM             |                           |
|                      |    (SIP Trunk to CUBE)   |                           |
|                      +------------+-------------+                           |
|                                   | SIP/TLS                                 |
|                      +------------+-------------+                           |
|                      |                          |                           |
|            +---------+----------+   +----------+---------+                 |
|            |    CUBE PRIMARY    |   |   CUBE SECONDARY   |                 |
|            |    (ISR 4451-X)    |   |    (ISR 4451-X)    |                 |
|            +--------------------+   +--------------------+                 |
|            | FQDN: cube01       |   | FQDN: cube02       |                 |
|            | IP: 10.1.10.50     |   | IP: 10.1.10.51     |                 |
|            | IOS-XE: 17.12.03   |   | IOS-XE: 17.12.03   |                 |
|            | DSP: PVDM4-256     |   | DSP: PVDM4-256     |                 |
|            | SIP Sessions: 500  |   | SIP Sessions: 500  |                 |
|            +---------+----------+   +----------+---------+                 |
|                      |                          |                           |
|         +------------+--------------------------+------------+             |
|         |                                                     |             |
|    +----+----+     +----+----+     +----+----+     +----+----+            |
|    |  Tata   |     | Airtel  |     |   BT    |     |  AT&T   |            |
|    | (India) |     | (India) |     |  (UK)   |     |  (US)   |            |
|    |SIP Trunk|     |SIP Trunk|     |ISDN PRI |     |SIP Trunk|            |
|    +---------+     +---------+     +---------+     +---------+            |
|                                                                             |
|    TRUNK CAPACITY:                                                         |
|    ----------------                                                        |
|    Tata Comm (Primary India):  300 concurrent channels                     |
|    Airtel (Backup India):      150 concurrent channels                     |
|    BT Business (UK):           60 concurrent channels (2x E1)              |
|    AT&T (Americas):            90 concurrent channels                      |
|                                                                             |
+-----------------------------------------------------------------------------+
```

**CUBE Hardware Specifications:**

| Component | CUBE-01 (Primary) | CUBE-02 (Secondary) |
|-----------|-------------------|---------------------|
| Platform | ISR 4451-X/K9 | ISR 4451-X/K9 |
| IOS-XE Version | 17.12.03 | 17.12.03 |
| CPU | Dual-core 2.4 GHz | Dual-core 2.4 GHz |
| Memory | 16 GB | 16 GB |
| DSP Module | PVDM4-256 | PVDM4-256 |
| Boost License | Performance (Enabled) | Performance (Enabled) |
| Max SIP Sessions | 1,000 (licensed 500) | 1,000 (licensed 500) |
| Interfaces | 4x GE, 2x NIM slots | 4x GE, 2x NIM slots |
| HA Role | Active | Standby |

**SIP Trunk Configuration Summary:**

| Provider | Trunk Type | Codecs | Registrar | Concurrent Calls | Monthly Cost (USD) |
|----------|-----------|--------|-----------|------------------|-------------------|
| Tata Communications | SIP | G.711, G.729 | sip.tatacommunications.com | 300 | $4,500 |
| Airtel Business | SIP | G.711, G.729 | enterprise.airtel.in | 150 | $2,200 |
| BT Business | ISDN PRI | G.711 | N/A (TDM) | 60 | £2,800 |
| AT&T Business | SIP | G.711, G.729 | sip.att.net | 90 | $2,800 |

### 1.1.8 DID Inventory by Region

**India DID Inventory:**

| City | Telecom Circle | Provider | DID Range | Count | Assignment |
|------|---------------|----------|-----------|-------|------------|
| Mumbai | Mumbai | Tata | +91-22-4960-0000 to +91-22-4960-1999 | 2,000 | HQ Users, CC Main |
| Mumbai | Mumbai | Airtel | +91-22-4960-0000 to +91-22-4960-0499 | 500 | Backup/Overflow |
| Chennai | Tamil Nadu | Tata | +91-44-4960-0000 to +91-44-4960-0799 | 800 | Chennai Office |
| Bangalore | Karnataka | Tata | +91-80-4960-0000 to +91-80-4960-0399 | 400 | Bangalore Office |
| Delhi | Delhi | Tata | +91-11-4960-0000 to +91-11-4960-0299 | 300 | Delhi Office |
| Noida | UP West | Tata | +91-120-496-0000 to +91-120-496-0249 | 250 | Noida Office |
| Pune | Maharashtra | Tata | +91-20-4960-0000 to +91-20-4960-0199 | 200 | Pune Office |
| Hyderabad | AP/Telangana | Tata | +91-40-4960-0000 to +91-40-4960-0349 | 350 | Hyderabad Office |
| **India Toll-Free** | National | Tata | 1800-266-1000, 1800-266-1001 | 2 | Contact Center |

**EMEA DID Inventory:**

| City | Country | Provider | DID Range | Count | Assignment |
|------|---------|----------|-----------|-------|------------|
| London | UK | BT | +44-20-4960-0000 to +44-20-4960-0799 | 800 | London Office |
| London | UK | BT | +44-800-096-1000 | 1 | UK Toll-Free |
| Frankfurt | Germany | Deutsche Telekom | +49-69-4960-0000 to +49-69-4960-0499 | 500 | Frankfurt Office |
| Frankfurt | Germany | Deutsche Telekom | +49-800-096-1000 | 1 | DE Toll-Free |

**Americas DID Inventory:**

| City | Country | Provider | DID Range | Count | Assignment |
|------|---------|----------|-----------|-------|------------|
| New Jersey | USA | AT&T | +1-201-496-0000 to +1-201-496-0799 | 800 | NJ Office |
| Dallas | USA | AT&T | +1-214-496-0000 to +1-214-496-0499 | 500 | Dallas Office |
| Americas | USA | AT&T | +1-800-096-1000 | 1 | US Toll-Free |

**DID Summary:**

| Region | Total DIDs | Assigned | Available | Utilization |
|--------|----------|----------|-----------|-------------|
| India | 4,800 | 3,850 | 950 | 80% |
| EMEA | 1,302 | 1,050 | 252 | 81% |
| Americas | 1,301 | 980 | 321 | 75% |
| **Global Total** | **7,403** | **5,880** | **1,523** | **79%** |

### 1.1.9 Endpoint Inventory

**IP Phone Inventory by Model:**

| Model | Series | Protocol | India | EMEA | Americas | Total | Migration Path |
|-------|--------|----------|-------|------|----------|-------|----------------|
| CP-8865 | 8800 | SIP | 420 | 180 | 165 | 765 | MPP Firmware -> Webex |
| CP-8845 | 8800 | SIP | 380 | 150 | 140 | 670 | MPP Firmware -> Webex |
| CP-8841 | 8800 | SIP | 290 | 80 | 95 | 465 | MPP Firmware -> Webex |
| CP-7841 | 7800 | SIP | 180 | 90 | 75 | 345 | MPP Firmware -> Webex |
| CP-7821 | 7800 | SIP | 150 | 60 | 55 | 265 | MPP Firmware -> Webex |
| CP-8832 | 8800 Conf | SIP | 45 | 12 | 15 | 72 | MPP Firmware -> Webex |
| CP-8811 | 8800 | SIP | 85 | 8 | - | 93 | MPP Firmware -> Webex |
| CP-6871 | 6800 | SIP | - | - | 15 | 15 | Replace (Webex Desk) |
| DX80 | DX | SIP | 20 | - | 10 | 30 | Replace (Webex Desk Pro) |
| CP-3905 | 3900 | SCCP | 100 | - | - | 100 | Replace (analog or soft) |
| **Phone Total** | - | - | **1,670** | **580** | **570** | **2,820** | - |

**Softphone & Client Inventory:**

| Client Type | Platform | India | EMEA | Americas | Total |
|-------------|----------|-------|------|----------|-------|
| Jabber (Windows) | Desktop | 1,800 | 600 | 580 | 2,980 |
| Jabber (Mac) | Desktop | 280 | 140 | 120 | 540 |
| Jabber (iOS) | Mobile | 420 | 180 | 150 | 750 |
| Jabber (Android) | Mobile | 380 | 80 | 60 | 520 |
| Webex App (Pilot) | All | 150 | 50 | 40 | 240 |
| **Client Total** | - | **3,030** | **1,050** | **950** | **5,030** |

**Video Endpoints:**

| Model | Type | Location | Quantity | Migration Path |
|-------|------|----------|----------|----------------|
| Webex Room Kit | MTR | Mumbai HQ | 8 | Already Webex-registered |
| Webex Room Kit Plus | MTR | Chennai, London | 4 | Already Webex-registered |
| Webex Board 55 | Interactive | Mumbai HQ | 3 | Already Webex-registered |
| Webex Desk Pro | Personal | Executive Offices | 12 | Already Webex-registered |
| SX20 | Legacy | Various | 6 | Migrate to Webex Control Hub |
| **Video Total** | - | - | **33** | - |

**Endpoint Migration Summary:**

| Category | Total Count | Already Webex Ready | Requires Firmware Conversion | Requires Replacement |
|----------|-------------|---------------------|------------------------------|----------------------|
| IP Phones | 2,820 | 0 | 2,627 (93%) | 193 (7%) |
| Soft Clients | 5,030 | 240 (5%) | N/A | 4,790 (95%) |
| Video Endpoints | 33 | 27 (82%) | 6 (18%) | 0 |

---

## 1.2 Feature Utilization Analysis

### 1.2.1 CUCM Feature Usage Summary (Phase 1 Scope)

> **Note:** This section covers **enterprise user features** migrating to Webex Calling in Phase 1. Contact center agent features (UCCX) are documented in Section 1.2.4 for Phase 2 planning.

**High-Usage Features (>50% adoption) - Phase 1:**

| Feature | CUCM Configuration | Users/Lines Using | Usage Level | Webex Calling Equivalent |
|---------|-------------------|-------------------|-------------|--------------------------|
| Extension Mobility | EM Profiles | 850 users | High | Hot Desking |
| Single Number Reach | SNR Profiles | 420 profiles | High | Single Number Reach |
| Call Forward All | Per-line config | 2,800 lines | High | Call Forwarding |
| Call Forward Busy | Per-line config | 3,100 lines | High | Call Forwarding |
| Call Forward No Answer | Per-line config | 3,200 lines | High | Call Forwarding |
| Voicemail | Unity Integration | 3,200 users | High | Webex Voicemail |
| Call Park | Park Slots 1-50 | 180 users regularly | Medium-High | Call Park |
| BLF/Speed Dial | SD/BLF buttons | 2,100 phones | High | BLF/Speed Dial |
| Conference (Ad-hoc) | Built-in bridge | 1,800 users | High | Ad-hoc Conference |
| MRA (Remote Access) | Expressway C&E | 450 users | High | Built-in (cloud) |

**Medium-Usage Features (20-50% adoption) - Phase 1:**

| Feature | CUCM Configuration | Users/Lines Using | Usage Level | Webex Calling Equivalent |
|---------|-------------------|-------------------|-------------|--------------------------|
| Hunt Groups (Enterprise) | 12 Hunt Pilots | 73 members | Medium | Hunt Groups |
| Call Pickup | 28 Pickup Groups | 520 users | Medium | Call Pickup Groups |
| Shared Lines | 85 shared appearances | 170 users | Medium | Virtual Lines |
| Intercom | 35 intercom lines | 70 users | Medium | Paging Group |
| Music on Hold | Custom MOH | All users | Medium | Custom MOH |
| Paging | 12 Paging Groups | 180 users | Medium | Paging Groups |

**Low-Usage Features (<20% adoption) - Phase 1:**

| Feature | CUCM Configuration | Users/Lines Using | Usage Level | Webex Calling Equivalent |
|---------|-------------------|-------------------|-------------|--------------------------|
| MLPP | Not configured | 0 | Not Used | N/A |
| Video Calling (desk phones) | Limited | 30 users | Low | Webex Video |
| URI Dialing | Configured | 50 users | Low | SIP URI Dialing |
| Extension Mobility Cross Cluster | Not configured | 0 | Not Used | N/A |

---

### 1.2.2 Feature Migration Mapping (Phase 1)

```
+-----------------------------------------------------------------------------+
|         CUCM TO WEBEX CALLING FEATURE MAPPING (PHASE 1)                     |
+-----------------------------------------------------------------------------+
|                                                                             |
|  CUCM FEATURE              |  WEBEX CALLING EQUIVALENT  |  MIGRATION NOTES |
|  ========================================================================= |
|                                                                             |
|  DIRECT EQUIVALENTS (No Changes Required):                                 |
|  -----------------------------------------                                 |
|  Call Forward All          ->  Call Forwarding           |  1:1 mapping     |
|  Call Forward Busy         ->  Call Forwarding           |  1:1 mapping     |
|  Call Forward No Answer    ->  Call Forwarding           |  1:1 mapping     |
|  Do Not Disturb            ->  Do Not Disturb            |  1:1 mapping     |
|  Call Waiting              ->  Call Waiting              |  1:1 mapping     |
|  Caller ID Blocking        ->  Caller ID Blocking        |  1:1 mapping     |
|  Three-Way Calling         ->  N-Way Conference          |  Enhanced        |
|  Call Transfer             ->  Call Transfer             |  1:1 mapping     |
|  Call Hold                 ->  Call Hold                 |  1:1 mapping     |
|  Last Number Redial        ->  Call History              |  Enhanced        |
|                                                                             |
|  EQUIVALENT WITH DESIGN CHANGES:                                           |
|  -------------------------------                                           |
|  Hunt Groups (Enterprise)  ->  Hunt Groups               |  Recreate config |
|  Call Park                 ->  Call Park                 |  Different slots |
|  Call Pickup               ->  Call Pickup Groups        |  Recreate groups |
|  Shared Lines              ->  Virtual Lines             |  New concept     |
|  Speed Dial/BLF            ->  Speed Dial/BLF            |  Reconfigure     |
|  Extension Mobility        ->  Hot Desking               |  Enable on phone |
|  Single Number Reach       ->  Single Number Reach       |  Reconfigure     |
|  Music on Hold             ->  Music on Hold             |  Upload audio    |
|  Voicemail (Unity)         ->  Webex Voicemail           |  Migrate msgs    |
|                                                                             |
|  ENHANCED IN WEBEX CALLING:                                                |
|  --------------------------                                                |
|  MRA (Expressway)          ->  Native Cloud Access       |  No VPN needed   |
|  IM&P                      ->  Webex Messaging           |  Enhanced        |
|  Jabber                    ->  Webex App                 |  Enhanced UX     |
|  Basic Conferencing        ->  Webex Meetings            |  Full featured   |
|                                                                             |
|  DIFFERENT ARCHITECTURE:                                                   |
|  -----------------------                                                   |
|  CSS/Partitions            ->  Location-based routing    |  Simpler model   |
|  Route Patterns            ->  Dial Plans                |  Cloud-managed   |
|  Translation Patterns      ->  Not required              |  Handled by PSTN |
|  Device Pools              ->  Locations                 |  1:many mapping  |
|  CM Groups                 ->  Cloud HA                  |  Auto-managed    |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 1.2.3 Feature Gap Analysis (Phase 1)

**Features Not Available in Webex Calling (Gaps):**

| CUCM Feature | Gap Description | Workaround/Alternative | Impact Level |
|--------------|-----------------|------------------------|--------------|
| Extension Mobility Cross-Cluster | Not supported | Use single Webex org | Low (not used) |
| MLPP (Precedence) | Not available | Not required by Abhavtech | None |
| Analog FXS Ports | No direct support | Use Webex Calling ATA | Medium |
| SCCP Phones | Must be replaced | Replace CP-3905 phones | Medium |
| Custom Softkeys | Limited customization | Use Webex defaults | Low |
| Device Mobility | Not same concept | Use Hot Desking | Low |
| Bulk Administration Tool (BAT) | CSV import different | Control Hub bulk tools | Low |
| Forced Authorization Codes | Different implementation | Use outbound rules | Low |
| Client Matter Codes | Limited availability | Use account codes | Low |
| Complex Translation Patterns | Simplified in cloud | Most not needed | Low |

**Gap Resolution Matrix:**

| Gap | Current Usage | Resolution | Migration Action |
|-----|--------------|------------|------------------|
| SCCP Phones (CP-3905) | 100 units | Replace with ATA or phones | Procure Cisco ATA 192 |
| DX80 Video Phones | 30 units | Replace | Procure Webex Desk Pro |
| Analog Fax Machines | 8 devices | Use Cisco ATA 192 | Procure 8x ATA |
| Conference Room Polycom | 4 units | Replace with Webex Room | Procure Room Kit Mini |

---

### 1.2.4 UCCX Feature Inventory (Phase 2 - Reference Only)

> **[!]️ PHASE 2 SCOPE:** The following features are part of the UCCX contact center platform and will migrate to **Webex Contact Center**. This section documents the inventory for Phase 2 planning.

**Contact Center Agent Features (UCCX -> Webex Contact Center):**

| UCCX Feature | Current Usage | Agents Using | WxCC Equivalent | Phase 2 Notes |
|--------------|--------------|--------------|-----------------|---------------|
| Finesse Agent Desktop | Primary interface | 165 agents | WxCC Agent Desktop | New UI training required |
| Ready/Not Ready States | 8 reason codes | All agents | WxCC Aux Codes | Recreate reason codes |
| Skills-Based Routing | 18 skills | All agents | WxCC Skills | Migrate skill definitions |
| Agent State Control | Real-time | All agents | WxCC State Control | Similar functionality |
| Wrap-Up Codes | 25 codes | All agents | WxCC Wrap-Up Codes | Migrate code list |
| Agent Call Logs | Finesse gadget | All agents | WxCC Call History | Enhanced in WxCC |

**Contact Center Supervisor Features (UCCX -> Webex Contact Center):**

| UCCX Feature | Current Config | Supervisors | WxCC Equivalent | Phase 2 Notes |
|--------------|----------------|-------------|-----------------|---------------|
| Barge-In | Enabled | 12 | WxCC Supervisor Barge | Native feature |
| Silent Monitoring | Enabled | 12 | WxCC Supervisor Monitor | Native feature |
| Whisper Coaching | Enabled | 8 trainers | WxCC Whisper | Native feature |
| Real-Time Reports | Finesse gadgets | 12 | WxCC Supervisor Dashboard | New interface |
| Team Management | Finesse Team View | 12 | WxCC Team Management | Similar |
| Queue Statistics | Wallboard | All | WxCC Analyzer Real-time | Enhanced |

**Contact Center Recording Features (UCCX -> Webex Contact Center):**

| Feature | Current State | WxCC Equivalent | Migration Notes |
|---------|--------------|-----------------|-----------------|
| Call Recording | UCCX BiB + NICE Engage | WxCC Recording | Cloud-native, included |
| Screen Recording | NICE Engage | WxCC Screen Recording | License required |
| Quality Management | NICE QM | WxCC QM | Evaluate vs continue NICE |
| Recording Export | FTP/API | WxCC Recording API | New API integration |
| Retention Policy | 90 days local | Cloud retention | Configure in Control Hub |

**Contact Center Reporting (UCCX -> Webex Contact Center):**

| Report Type | UCCX Source | WxCC Equivalent | Migration Notes |
|-------------|-------------|-----------------|-----------------|
| Historical Reports | CUIC | WxCC Analyzer | New reporting platform |
| Real-Time Reports | Finesse Gadgets | Analyzer Real-time | New dashboards |
| Agent Performance | CUIC stock reports | Analyzer Agent Reports | Similar metrics |
| Queue Statistics | CUIC stock reports | Analyzer Queue Reports | Similar metrics |
| Custom Reports | CUIC custom | Analyzer Custom | Rebuild custom reports |
| Scheduled Reports | CUIC scheduler | Analyzer Scheduler | Reconfigure schedules |

```
+-----------------------------------------------------------------------------+
|    FEATURE MIGRATION SUMMARY BY PHASE                                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  PHASE 1: CUCM -> WEBEX CALLING                                             |
|  =============================                                             |
|  * Enterprise user features (3,200 users)                                  |
|  * Hunt groups for reception/departments (12 groups, 73 members)           |
|  * Voicemail migration (Unity -> Webex Voicemail)                          |
|  * Softphone migration (Jabber -> Webex App)                               |
|  * Phone firmware conversion (MPP)                                         |
|  * PSTN connectivity (LGW India, CCPP EMEA/Americas)                      |
|                                                                             |
|  PHASE 2: UCCX -> WEBEX CONTACT CENTER                                      |
|  ====================================                                      |
|  * Contact center agents (165 agents)                                      |
|  * Contact Service Queues (10 CSQs -> WxCC Queues)                         |
|  * IVR scripts (8 scripts -> Flow Designer flows)                          |
|  * Supervisor features (barge, monitor, whisper)                          |
|  * Call recording (WxCC native recording)                                  |
|  * Reporting (CUIC -> WxCC Analyzer)                                       |
|  * Agent desktop (Finesse -> WxCC Desktop)                                 |
|  * Skills-based routing (18 skills)                                        |
|                                                                             |
|  [!]️ COEXISTENCE: During Phase 1, CC agents remain on CUCM.                |
|     CUCM-Webex SIP trunk enables interop until Phase 2 completes.         |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 1.3 Migration Dependency Analysis

### 1.3.1 Hunt Group Dependencies

> **Note:** This section distinguishes between **CUCM Hunt Groups** (enterprise users - Phase 1) and **UCCX Contact Service Queues** (contact center - Phase 2). Both are documented here for complete dependency mapping.

**CUCM Hunt Groups (Phase 1 - Webex Calling):**

These are enterprise hunt groups for non-contact center use cases (reception, departmental coverage).

| Hunt Pilot | Hunt Pilot DN | Members | Type | Location | Migration Target |
|------------|--------------|---------|------|----------|------------------|
| HG_Mumbai_Reception | +91-22-4960-0000 | 8 | Circular | Mumbai | Webex Calling Hunt Group |
| HG_Mumbai_IT_Support | +91-22-4960-0001 | 12 | Top Down | Mumbai | Webex Calling Hunt Group |
| HG_Mumbai_HR | +91-22-4960-0002 | 6 | Circular | Mumbai | Webex Calling Hunt Group |
| HG_Mumbai_Finance | +91-22-4960-0003 | 8 | Longest Idle | Mumbai | Webex Calling Hunt Group |
| HG_Chennai_Reception | +91-44-4960-0000 | 4 | Circular | Chennai | Webex Calling Hunt Group |
| HG_Bangalore_Reception | +91-80-4960-0000 | 3 | Circular | Bangalore | Webex Calling Hunt Group |
| HG_Delhi_Reception | +91-11-4960-0000 | 3 | Circular | Delhi | Webex Calling Hunt Group |
| HG_London_Reception | +44-20-4960-0000 | 4 | Circular | London | Webex Calling Hunt Group |
| HG_London_Sales | +44-20-4960-0001 | 10 | Longest Idle | London | Webex Calling Hunt Group |
| HG_NJ_Reception | +1-201-496-0000 | 4 | Circular | New Jersey | Webex Calling Hunt Group |
| HG_NJ_Sales | +1-201-496-0001 | 8 | Longest Idle | New Jersey | Webex Calling Hunt Group |
| HG_Dallas_Reception | +1-214-496-0000 | 3 | Circular | Dallas | Webex Calling Hunt Group |

**CUCM Hunt Group Migration Batching Strategy:**

```
+-----------------------------------------------------------------------------+
|         HUNT GROUP MIGRATION DEPENDENCY MAP (PHASE 1)                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  RULE: All hunt group members must migrate in the SAME batch               |
|                                                                             |
|  Batch 1 (Pilot - 50 users):                                               |
|  +- IT Department (Mumbai) - 25 users                                      |
|  |  +- HG_Mumbai_IT_Support (12 members) <- ALL members in this batch       |
|  +- Non-hunt group IT users - 13 users                                     |
|                                                                             |
|  Batch 2 (Mumbai Wave 1 - 200 users):                                      |
|  +- Reception Team - 8 users                                               |
|  |  +- HG_Mumbai_Reception (8 members) <- ALL members in this batch         |
|  +- HR Department - 45 users                                               |
|  |  +- HG_Mumbai_HR (6 members) <- ALL members in this batch                |
|  +- Non-hunt group users - 147 users                                       |
|                                                                             |
|  Batch 3 (Mumbai Wave 2 - 200 users):                                      |
|  +- Finance Department - 55 users                                          |
|  |  +- HG_Mumbai_Finance (8 members) <- ALL members in this batch           |
|  +- Non-hunt group users - 145 users                                       |
|                                                                             |
|  [!]️ CONSTRAINT: Cannot split hunt group members across batches             |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

### 1.3.2 Contact Center Dependencies (Phase 2 - Reference Only)

> **[!]️ PHASE 2 SCOPE:** The following UCCX Contact Service Queues (CSQs) and agent configurations will be migrated to **Webex Contact Center** as part of the UCCX migration phase. This section documents dependencies for Phase 2 planning.

**UCCX Contact Service Queues (CSQs) -> Webex Contact Center Queues:**

| CSQ Name | Pilot DN | Agents | Skills | Routing Type | WxCC Migration Target |
|----------|----------|--------|--------|--------------|----------------------|
| CSQ_Sales_India | +91-22-4960-1000 | 45 | Sales_EN, Sales_HI | Skills-based | WxCC Queue: Sales_India |
| CSQ_Sales_UK | +44-20-4960-1000 | 12 | Sales_EN | Skills-based | WxCC Queue: Sales_UK |
| CSQ_Sales_US | +1-201-496-1000 | 8 | Sales_EN | Skills-based | WxCC Queue: Sales_US |
| CSQ_Support_L1 | +91-22-4960-2000 | 35 | Support_L1, EN, HI | Skills-based | WxCC Queue: Support_L1 |
| CSQ_Support_L2 | +91-22-4960-2001 | 18 | Support_L2, EN | Skills-based | WxCC Queue: Support_L2 |
| CSQ_Support_Chennai | +91-44-4960-2000 | 25 | Support_L1, Tamil | Skills-based | WxCC Queue: Support_Chennai |
| CSQ_Billing | +91-22-4960-3000 | 15 | Billing, EN, HI | Longest Available | WxCC Queue: Billing |
| CSQ_Toll_Free_India | 1800-266-1000 | 40 | All Skills | Skills-based | WxCC Queue: TollFree_India |
| CSQ_Toll_Free_UK | +44-800-096-1000 | 10 | Sales_EN, Support | Skills-based | WxCC Queue: TollFree_UK |
| CSQ_Toll_Free_US | +1-800-096-1000 | 8 | Sales_EN, Support | Skills-based | WxCC Queue: TollFree_US |

**UCCX Agent Inventory (Phase 2):**

| Site | Voice Agents | Digital Agents | Supervisors | Teams | Skills |
|------|--------------|----------------|-------------|-------|--------|
| Mumbai | 95 | 15 | 8 | 6 | 12 |
| Chennai | 25 | 5 | 2 | 2 | 6 |
| London | 12 | 3 | 1 | 1 | 4 |
| New Jersey | 8 | 2 | 1 | 1 | 4 |
| **Total** | **140** | **25** | **12** | **10** | **18** |

**UCCX IVR Scripts -> Webex Contact Center Flow Designer (Phase 2):**

| Script Name | Type | Prompts | Steps | Complexity | Flow Designer Migration |
|-------------|------|---------|-------|------------|------------------------|
| Main_Menu_EN.aef | Voice | 8 | 24 | Medium | Flow: Main_Menu_English |
| Main_Menu_HI.aef | Voice | 8 | 24 | Medium | Flow: Main_Menu_Hindi |
| Sales_Routing.aef | Voice | 4 | 18 | Medium | Flow: Sales_Router |
| Support_Routing.aef | Voice | 6 | 32 | High | Flow: Support_Router |
| Callback_Request.aef | Voice | 3 | 15 | Low | Flow: Callback_Handler |
| After_Hours.aef | Voice | 2 | 8 | Low | Flow: After_Hours |
| Holiday_Greeting.aef | Voice | 1 | 4 | Low | Flow: Holiday_Message |
| Survey_Post_Call.aef | Voice | 5 | 12 | Medium | Auto CSAT (AI feature) |

**Contact Center Feature Dependencies (Phase 2):**

| UCCX Feature | Current Config | WxCC Equivalent | Migration Notes |
|--------------|----------------|-----------------|-----------------|
| Finesse Desktop | v12.5 | Webex Contact Center Agent Desktop | New UI, retrain agents |
| Skills-Based Routing | 18 skills configured | WxCC Skills | Recreate skill definitions |
| Supervisor Barge | Enabled | WxCC Supervisor Barge | Native feature |
| Supervisor Monitor | Enabled | WxCC Supervisor Monitor | Native feature |
| Whisper Coaching | Enabled | WxCC Whisper | Native feature |
| Call Recording | UCCX BiB + NICE | WxCC Recording | Cloud-native recording |
| Historical Reports | CUIC | WxCC Analyzer | New reporting platform |
| Real-time Reports | Finesse Gadgets | WxCC Supervisor Dashboard | New dashboard |
| Workforce Management | NICE IEX (external) | WxCC WFM or continue NICE | Evaluate options |
| Outbound Dialer | UCCX Outbound | WxCC Campaign Manager | License required |

**Contact Center Integration Dependencies (Phase 2):**

| Integration | Current State | WxCC Migration | Priority |
|-------------|--------------|----------------|----------|
| Salesforce CTI | Jabber + Finesse | Webex CC for Salesforce | P1 |
| CRM Screen Pop | Custom Finesse gadget | WxCC Desktop Connector | P1 |
| IVR Database Lookup | UCCX DB steps | Flow Designer HTTP nodes | P2 |
| Recording Export | NICE Engage | WxCC Recording API | P2 |
| WFM Integration | NICE IEX API | WxCC WFM API | P2 |
| Quality Management | NICE QM | WxCC QM or continue NICE | P3 |

```
+-----------------------------------------------------------------------------+
|         CONTACT CENTER MIGRATION DEPENDENCY SUMMARY (PHASE 2)               |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |  PHASE 2 SCOPE - UCCX -> WEBEX CONTACT CENTER                        |   |
|  |  ===============================================================    |   |
|  |                                                                      |   |
|  |  AGENTS:        165 total (140 voice + 25 digital)                  |   |
|  |  SUPERVISORS:   12                                                   |   |
|  |  QUEUES:        10 CSQs -> 10 WxCC Queues                            |   |
|  |  IVR SCRIPTS:   8 UCCX scripts -> 8 Flow Designer flows              |   |
|  |  SKILLS:        18 skill definitions                                 |   |
|  |  INTEGRATIONS:  6 (Salesforce, CRM, Recording, WFM, etc.)           |   |
|  |                                                                      |   |
|  |  DOCUMENTATION: Chapter 3 (Design), Chapter 7.3 (Cutover)           |   |
|  |  STATUS:        Structure ready, content deferred to Phase 2        |   |
|  |                                                                      |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  [!]️ PHASE 1 DEPENDENCY:                                                    |
|  Contact Center agents must remain on CUCM until Phase 2 cutover.          |
|  Webex Calling coexistence trunks will route CC calls during Phase 1.      |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

### 1.3.3 Shared Line Dependencies

**Shared Line Inventory:**

| Primary User | Primary Extension | Shared With | Use Case | Migration Approach |
|--------------|------------------|-------------|----------|-------------------|
| CEO (Rajan Sharma) | 6001 | EA (Priya Patel) | Executive Assistant | Virtual Line |
| CFO (Amit Kapoor) | 6002 | EA (Sana Khan) | Executive Assistant | Virtual Line |
| CTO (Vikram Mehta) | 6003 | EA (Priya Patel) | Executive Assistant | Virtual Line |
| COO (Lakshmi Iyer) | 6004 | EA (Deepa Nair) | Executive Assistant | Virtual Line |
| Reception Main | 6100 | 8 reception phones | Coverage | Virtual Line |
| London MD (James Wilson) | 7001 | EA (Emma Thompson) | Executive Assistant | Virtual Line |
| US VP Sales (Michael Chen) | 8001 | EA (Jennifer Lopez) | Executive Assistant | Virtual Line |

**Shared Line Migration Rules:**

```
+-----------------------------------------------------------------------------+
|         SHARED LINE -> VIRTUAL LINE MIGRATION                                |
+-----------------------------------------------------------------------------+
|                                                                             |
|  CUCM SHARED LINE CONCEPT:                                                  |
|  +-------------+     +-------------+                                       |
|  |  Phone A    |     |  Phone B    |                                       |
|  |  Line 1:    |     |  Line 1:    |                                       |
|  |  Ext 6001   |---->|  Ext 6001   |  <- Same DN, shared appearance        |
|  |  (Primary)  |     |  (Shared)   |                                       |
|  +-------------+     +-------------+                                       |
|                                                                             |
|  WEBEX CALLING VIRTUAL LINE CONCEPT:                                       |
|  +-------------+     +-----------------------------------------+          |
|  |  User A     |     |  Virtual Line (Ext 6001)                |          |
|  |  Primary    |---->|  +- Primary: User A                     |          |
|  |  Owner      |     |  +- Shared: User B (EA)                 |          |
|  +-------------+     +-----------------------------------------+          |
|                                                                             |
|  MIGRATION STEPS:                                                          |
|  1. Create Virtual Line in Control Hub                                     |
|  2. Assign primary user as owner                                           |
|  3. Add shared appearance to assistant/secondary users                     |
|  4. Configure on devices (phones and Webex App)                           |
|                                                                             |
|  [!]️ CONSTRAINT: Primary user and all shared users must migrate together   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 1.3.4 Integration Dependencies

> **Note:** Integrations are categorized by migration phase. Phase 1 (Webex Calling) integrations migrate with enterprise users. Phase 2 (Webex Contact Center) integrations migrate with the contact center cutover.

**Phase 1 Integrations (Enterprise - Webex Calling):**

| Integration | Type | System | Protocol | Webex Solution | Priority |
|-------------|------|--------|----------|----------------|----------|
| Active Directory | User Sync | AD DS | LDAP/S | Webex Directory Connector | P1 - Pre-migration |
| Microsoft Exchange | Calendar | Exchange 2019 | EWS | Hybrid Calendar Service | P1 - Pre-migration |
| Salesforce (Click-to-Dial) | CRM | Salesforce | REST | Webex for Salesforce | P2 - Batch 1 |
| ServiceNow | ITSM | ServiceNow | REST API | Webex for ServiceNow | P3 - Post-migration |
| Door Entry | Intercom | 2N Helios | SIP | SIP Trunk to LGW | P3 - Site-by-site |
| Paging System | Overhead | Valcom | Multicast | Webex Paging Service | P3 - Site-by-site |
| Emergency Notification | E911 | RedSky E911 | SIP/API | Webex E911 (RedSky) | P1 - Pre-migration |
| Billing/CDR Export | Reporting | SAP | FTP/CSV | Webex Analytics API | P4 - Post-migration |

**Phase 2 Integrations (Contact Center - Webex CC):**

| Integration | Type | System | Protocol | WxCC Solution | Priority |
|-------------|------|--------|----------|---------------|----------|
| Salesforce CTI (Agent) | CRM Screen Pop | Salesforce | CTI | Webex CC for Salesforce | P1 - CC Cutover |
| CRM Screen Pop | Custom Gadget | Internal CRM | REST | WxCC Desktop Connector | P1 - CC Cutover |
| Call Recording | Compliance | NICE Engage | SIPREC | WxCC Native Recording | P1 - CC Cutover |
| Workforce Management | Scheduling | NICE IEX | API | WxCC WFM or NICE API | P2 - Post-cutover |
| Quality Management | QA Scoring | NICE QM | API | WxCC QM or continue NICE | P3 - Evaluate |
| IVR Database Lookup | Customer Data | Oracle DB | JDBC | Flow Designer HTTP | P1 - CC Cutover |
| Outbound Dialer | Campaigns | UCCX Outbound | Internal | WxCC Campaign Manager | P2 - Post-cutover |
| Reporting Export | Analytics | CUIC | SQL/API | WxCC Analyzer API | P2 - Post-cutover |

**Integration Migration Timeline:**

```
+-----------------------------------------------------------------------------+
|         INTEGRATION MIGRATION TIMELINE                                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  PRE-MIGRATION (Before Phase 1 Batch 1):                                   |
|  ========================================                                  |
|  OK Active Directory -> Webex Directory Connector                            |
|  OK Emergency (E911) -> Webex E911 service                                   |
|  OK Exchange Calendar -> Hybrid Calendar Service                             |
|                                                                             |
|  PHASE 1 (CUCM -> Webex Calling):                                           |
|  ===============================                                           |
|  Batch 1: Salesforce Click-to-Dial (enterprise users)                      |
|  Batch 3: ServiceNow integration                                           |
|  Site-by-site: Door entry, Paging systems                                  |
|  Post-migration: CDR/Billing export                                        |
|                                                                             |
|  PHASE 2 (UCCX -> Webex Contact Center):                                    |
|  ======================================                                    |
|  CC Cutover Weekend:                                                        |
|    * Salesforce CTI (agent screen pop)                                     |
|    * CRM Desktop Connector                                                 |
|    * Call Recording (WxCC native)                                          |
|    * IVR Database lookups (Flow Designer)                                  |
|  Post-Cutover:                                                              |
|    * WFM integration (NICE or WxCC native)                                 |
|    * Quality Management                                                     |
|    * Reporting/Analytics export                                            |
|    * Outbound Campaign Manager                                             |
|                                                                             |
|  [!]️ NOTE: Salesforce has TWO integrations:                                 |
|     1. Click-to-dial for enterprise users (Phase 1)                        |
|     2. CTI screen pop for CC agents (Phase 2)                              |
|                                                                             |
+-----------------------------------------------------------------------------+
```

**Integration Architecture - Coexistence Period:**

```
+-----------------------------------------------------------------------------+
|         INTEGRATION ARCHITECTURE DURING COEXISTENCE                         |
+-----------------------------------------------------------------------------+
|                                                                             |
|                    +-------------------------------------+                 |
|                    |        ACTIVE DIRECTORY            |                 |
|                    |        (Single Source)             |                 |
|                    +---------------+---------------------+                 |
|                                    |                                       |
|                    +---------------+---------------+                       |
|                    |                               |                       |
|                    v                               v                       |
|      +-------------------------+    +-------------------------+           |
|      |    CUCM/UCCX            |    |    WEBEX CLOUD          |           |
|      |    (Contact Center)     |    |    (Enterprise Users)   |           |
|      |    -----------------    |    |    -----------------    |           |
|      |    LDAP Sync            |    |    Directory Connector  |           |
|      |    Finesse/Jabber       |    |    Webex App            |           |
|      |    UCCX Recording       |    |    Webex Recording      |           |
|      |    CUIC Reporting       |    |    Webex Analytics      |           |
|      +----------+--------------+    +----------+--------------+           |
|                 |                               |                          |
|                 |      +-------------+          |                          |
|                 +----->|  SIP Trunk  |<---------+                          |
|                        | (Interop)   |                                     |
|                        +-------------+                                     |
|                                                                             |
|  COEXISTENCE INTEGRATION RULES:                                            |
|  ==============================                                            |
|  * AD syncs to BOTH platforms during migration                             |
|  * Enterprise users use Webex integrations                                 |
|  * CC agents continue using UCCX/Finesse integrations                     |
|  * SIP trunk enables calls between platforms                               |
|  * Recording remains on respective platforms                               |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

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

## 1.5 Compliance Readiness Assessment

> **Reference:** Detailed compliance requirements, configurations, and validation procedures are documented in **Chapter 4: Security, Compliance & Data Residency**. This section provides the discovery-phase compliance inventory and gap analysis.

### 1.5.1 Compliance Requirements by Region

```
+-----------------------------------------------------------------------------+
|         COMPLIANCE REQUIREMENTS MATRIX - DISCOVERY SUMMARY                  |
+-----------------------------------------------------------------------------+
|                                                                             |
|  REGION    |  REGULATION        |  PRIMARY REQUIREMENT     |  CHAPTER 4    |
|  ==========================================================================|
|  INDIA     |  DoT/TRAI          |  PSTN toll bypass        |  Section 4.3  |
|            |                    |  prevention (LGW/Zone)   |               |
|            |                    |                          |               |
|  UK        |  UK GDPR           |  Data residency in UK    |  Section 4.4  |
|            |  Ofcom             |  PSTN: no restrictions   |               |
|            |                    |                          |               |
|  EU        |  EU GDPR           |  Data residency in EU    |  Section 4.4  |
|  (Germany) |  BSI C5            |  Cloud security cert     |               |
|            |                    |  PSTN: no restrictions   |               |
|            |                    |                          |               |
|  AMERICAS  |  CCPA (CA users)   |  Privacy rights          |  Section 4.5  |
|            |  SOC 2 Type II     |  Security compliance     |               |
|            |                    |  PSTN: no restrictions   |               |
|                                                                             |
|  [!]️ KEY INSIGHT:                                                           |
|  India = PSTN routing restrictions (regulatory)                            |
|  EMEA/Americas = Data residency only (no PSTN routing rules)               |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 1.5.2 India Compliance Discovery

**DoT/TRAI Toll Bypass Regulation Summary:**

| Requirement | Description | Current State (CUCM) | Webex Calling Solution |
|-------------|-------------|---------------------|------------------------|
| Geographic PSTN Egress | Calls must terminate on PSTN within user's telecom circle | CUBE in Mumbai routes all | LGW per telecom circle |
| Toll Bypass Prevention | VoIP-PSTN calls cannot bypass long-distance charges | Single CUBE (non-compliant for distributed) | Zone + Trusted Edge per circle |
| Licensed Telecom Provider | PSTN provider must be DoT licensed | Tata/Airtel (licensed) | Same providers via LGW |
| ITN Exemption | Internet Telephony Numbers (9XXXXXXXXX) exempt | Not currently used | Option for WFH users |

**India Site Compliance Inventory:**

| Site | Telecom Circle | Current PSTN Egress | Compliant? | Webex Solution |
|------|----------------|---------------------|------------|----------------|
| Mumbai HQ | Mumbai | Local (CUBE Mumbai) | [OK] Yes | LGW Mumbai |
| Chennai | Tamil Nadu | Mumbai CUBE | [!]️ Gap | LGW Chennai + Zone |
| Bangalore | Karnataka | Mumbai CUBE | [!]️ Gap | LGW Bangalore + Zone |
| Delhi | Delhi | Mumbai CUBE | [!]️ Gap | LGW Delhi + Zone |
| Noida | UP West | Mumbai CUBE | [!]️ Gap | LGW Noida + Zone |
| Pune | Maharashtra | Mumbai CUBE | [OK] Yes (same circle) | Shared Mumbai LGW |
| Hyderabad | AP/Telangana | Mumbai CUBE | [!]️ Gap | LGW Hyderabad + Zone |

**India LGW Deployment Requirements:**

| Circle | Site | LGW Model | HA Required | PSTN Provider | Status |
|--------|------|-----------|-------------|---------------|--------|
| Mumbai | Mumbai HQ | ISR 4451-X | Yes (existing CUBE) | Tata SIP | Existing - convert |
| Tamil Nadu | Chennai | ISR 4351 | Yes | Tata SIP | New procurement |
| Karnataka | Bangalore | ISR 4331 | No | Tata SIP | New procurement |
| Delhi | Delhi | ISR 4331 | No | Tata SIP | New procurement |
| UP West | Noida | ISR 4331 | No | Tata SIP | New procurement |
| AP/Telangana | Hyderabad | ISR 4331 | No | Tata SIP | New procurement |

### 1.5.3 EMEA Compliance Discovery

**UK/EU Data Residency Requirements:**

| Location | Regulation | Requirement | Webex Solution | Status |
|----------|-----------|-------------|----------------|--------|
| London | UK GDPR | Data stored in UK | UK Calling Region (London DC) | [OK] Available |
| London | Ofcom | VoIP provider registration | Webex/IntelePeer registered | [OK] Compliant |
| Frankfurt | EU GDPR | Data stored in EU | EU Calling Region (Frankfurt DC) | [OK] Available |
| Frankfurt | BSI C5 | German cloud security | Webex BSI C5 attestation | [OK] Certified |
| Frankfurt | EU Cloud CoC | Cloud code of conduct | Level 3 compliance | [OK] Achieved |

**Germany BSI C5 Compliance Details:**

```
+-----------------------------------------------------------------------------+
|              GERMANY BSI C5 COMPLIANCE - FRANKFURT                          |
+-----------------------------------------------------------------------------+
|                                                                             |
|  CERTIFICATION: BSI C5 (Cloud Computing Compliance Criteria Catalogue)     |
|  STATUS:        [OK] Webex Meetings/Calling attested                         |
|                                                                             |
|  C5 CONTROL DOMAINS (17 Areas, 114 Requirements):                         |
|  ==============================================                            |
|  OK Organization of Information Security                                   |
|  OK Personnel Security                                                      |
|  OK Asset Management                                                        |
|  OK Physical Security                                                       |
|  OK Operations Security                                                     |
|  OK Identity & Access Management                                            |
|  OK Cryptography & Key Management                                           |
|  OK Communications Security                                                 |
|  OK Portability & Interoperability                                         |
|  OK Security Incident Management                                            |
|  OK Business Continuity                                                     |
|  OK Compliance                                                              |
|                                                                             |
|  BaFin APPLICABILITY (Financial Services):                                |
|  ==========================================                                |
|  If Abhavtech serves German financial clients:                            |
|  - BAIT (Banking IT Requirements) may apply                               |
|  - Outsourcing guidance documentation required                             |
|  - Current assessment: NOT APPLICABLE (tech services company)              |
|                                                                             |
|  PSTN IMPACT: NONE                                                         |
|  BSI C5 covers cloud security controls, NOT PSTN routing                  |
|  CCPP is fully compliant for Frankfurt location                           |
|                                                                             |
+-----------------------------------------------------------------------------+
```

**UK Post-Brexit Compliance:**

```
+-----------------------------------------------------------------------------+
|              UK COMPLIANCE - LONDON (POST-BREXIT)                           |
+-----------------------------------------------------------------------------+
|                                                                             |
|  DATA RESIDENCY:                                                           |
|  ==============                                                            |
|  - Primary DC: London                                                      |
|  - Backup DC: Manchester (added October 2024)                             |
|  - UK data does NOT cross to EU or US data centers                        |
|                                                                             |
|  WEBEX UK CALLING REGION:                                                  |
|  =========================                                                 |
|  - Separate from EU region (post-Brexit requirement)                      |
|  - UK customers assigned to UK data center pair                           |
|  - Calling Region selected at provisioning (CANNOT be changed)            |
|                                                                             |
|  COMPLIANCE CERTIFICATIONS:                                                |
|  ===========================                                               |
|  OK UK GDPR (Data Protection Act 2018)                                     |
|  OK Cyber Essentials                                                        |
|  OK ISO 27001                                                               |
|  OK SOC 2 Type II                                                          |
|                                                                             |
|  OFCOM REQUIREMENTS:                                                       |
|  ===================                                                       |
|  - General Conditions of Entitlement for VoIP                             |
|  - Handled by CCPP provider (IntelePeer UK)                               |
|  - No Abhavtech action required                                           |
|                                                                             |
+-----------------------------------------------------------------------------+
```

**EMEA PSTN Compliance (No Routing Restrictions):**

| Requirement | UK | Germany | Notes |
|-------------|-----|---------|-------|
| Local Gateway Required | [X] No | [X] No | Business choice only |
| PSTN Routing Restrictions | [X] None | [X] None | No toll bypass regulations |
| Zone/Edge Configuration | [X] Not needed | [X] Not needed | N/A |
| CCPP Compliant | [OK] Yes | [OK] Yes | Recommended solution |
| Data must stay in region | [OK] Yes | [OK] Yes | Webex compliant |

**EMEA Data Center Assignment:**

| Location | Webex Calling Region | Primary DC | Backup DC | Data Stored |
|----------|---------------------|------------|-----------|-------------|
| London | UK | London | Manchester | All UK Webex data |
| Frankfurt | EU | Frankfurt | Amsterdam | All EU Webex data |

> **[!]️ CRITICAL:** UK and EU are SEPARATE Webex Calling regions post-Brexit. London users MUST be assigned to UK region, Frankfurt users MUST be assigned to EU region. This is selected at provisioning and CANNOT be changed afterward.

### 1.5.4 Compliance Gap Summary

```
+-----------------------------------------------------------------------------+
|         COMPLIANCE GAP ANALYSIS - PRE-MIGRATION                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  GAP ID  |  REGION  |  GAP DESCRIPTION              |  RESOLUTION          |
|  =======================================================================   |
|  CG-001  |  India   |  Chennai PSTN routes via      |  Deploy Chennai LGW  |
|          |          |  Mumbai (cross-circle)        |  + Zone config       |
|          |          |                               |                      |
|  CG-002  |  India   |  Bangalore PSTN routes via    |  Deploy Bangalore    |
|          |          |  Mumbai (cross-circle)        |  LGW + Zone config   |
|          |          |                               |                      |
|  CG-003  |  India   |  Delhi PSTN routes via        |  Deploy Delhi LGW    |
|          |          |  Mumbai (cross-circle)        |  + Zone config       |
|          |          |                               |                      |
|  CG-004  |  India   |  Noida PSTN routes via        |  Deploy Noida LGW    |
|          |          |  Mumbai (cross-circle)        |  + Zone config       |
|          |          |                               |                      |
|  CG-005  |  India   |  Hyderabad PSTN routes via    |  Deploy Hyderabad    |
|          |          |  Mumbai (cross-circle)        |  LGW + Zone config   |
|          |          |                               |                      |
|  CG-006  |  India   |  WFH users lack compliant     |  ITN numbers OR      |
|          |          |  PSTN option                  |  VPN to office       |
|          |          |                               |                      |
|  --------+----------+-------------------------------+----------------------|
|  EMEA    |  None    |  No compliance gaps           |  Use CCPP provider   |
|  Americas|  None    |  No compliance gaps           |  Use CCPP provider   |
|                                                                             |
|  TOTAL GAPS: 6 (all India-related)                                         |
|  RESOLUTION: LGW deployment + Zone/Edge configuration (Chapter 4.3)        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 1.5.5 Compliance Readiness Checklist

| Item | Region | Discovery Status | Action Required | Chapter Reference |
|------|--------|------------------|-----------------|-------------------|
| India telecom circle mapping | India | [OK] Complete | Document in Appendix D | 4.3 |
| LGW hardware requirements | India | [OK] Identified | Procurement (5 new LGWs) | 4.3.3 |
| PSTN provider contracts | India | [OK] Tata/Airtel | Extend for LGW connectivity | 4.3.4 |
| Zone/Edge architecture | India | [!]️ Design needed | Design in Chapter 2.3 | 4.3.5 |
| ITN number procurement | India | [!]️ Not started | Order from Tata for WFH | 4.3.6 |
| UK Calling Region | UK | [OK] Available | Select during provisioning | 4.4.1 |
| UK GDPR data residency | UK | [OK] Webex compliant | Verify London DC assignment | 4.4.2 |
| UK Ofcom registration | UK | [OK] Via CCPP | IntelePeer UK handles | 4.4.2 |
| EU Calling Region | EU | [OK] Available | Select during provisioning | 4.4.3 |
| EU GDPR data residency | Germany | [OK] Webex compliant | Verify Frankfurt DC assignment | 4.4.3 |
| BSI C5 certification | Germany | [OK] Webex certified | Document for audit | 4.4.3 |
| EU Cloud CoC Level 3 | Germany | [OK] Webex certified | Document for audit | 4.4.3 |
| BaFin assessment | Germany | [OK] Not applicable | Tech services (non-financial) | 4.4.3 |
| Data residency validation | All | [!]️ Post-provisioning | Validate in Control Hub | 4.4.4 |
| CCPP provider selection | EMEA/US | [OK] IntelePeer | Contract in progress | 2.3.3 |
| Recording consent mechanism | All | [!]️ Design needed | Per-region consent flows | 4.6 |

---

## 1.6 Business Requirements & Success Criteria

### 1.6.1 Functional Requirements

**Must-Have Requirements (MoSCoW - Must):**

| ID | Requirement | Current State | Webex Solution | Validation Method |
|----|-------------|---------------|----------------|-------------------|
| FR-001 | Make/receive PSTN calls globally | CUCM + CUBE | Webex Calling + LGW/CCPP | Test call matrix |
| FR-002 | Voicemail with message waiting | Unity Connection | Webex Voicemail | MWI light, portal access |
| FR-003 | Call forwarding (all/busy/no answer) | CUCM line settings | Webex user settings | Functional test |
| FR-004 | Hunt groups for reception | CUCM hunt pilots | Webex Hunt Groups | Call distribution test |
| FR-005 | Shared line for executives | CUCM shared lines | Virtual Lines | Line appearance test |
| FR-006 | Remote access without VPN | Expressway MRA | Native cloud access | Off-network test |
| FR-007 | Single Number Reach | CUCM SNR | Webex SNR | Mobile ring test |
| FR-008 | BLF/Speed dial | CUCM BLF | Webex BLF | LED status test |
| FR-009 | India PSTN compliance | CUBE + Tata/Airtel | LGW per circle + Zone | Toll bypass validation |
| FR-010 | UK/EU data residency | N/A (on-prem) | UK/EU Webex DCs | Compliance audit |

**Should-Have Requirements (MoSCoW - Should):**

| ID | Requirement | Current State | Webex Solution | Validation Method |
|----|-------------|---------------|----------------|-------------------|
| FR-011 | Hot desking | Extension Mobility | Webex Hot Desking | Login/logout test |
| FR-012 | Call park/pickup | CUCM call park | Webex Call Park | Park/retrieve test |
| FR-013 | Directory integration | AD LDAP | Directory Connector | User sync verification |
| FR-014 | CRM integration | Jabber CTI | Webex for Salesforce | Click-to-dial test |
| FR-015 | Calendar integration | Exchange EWS | Hybrid Calendar | Presence/booking test |
| FR-016 | HD voice quality | G.711/G.722 | Opus codec | MOS score measurement |

**Could-Have Requirements (MoSCoW - Could):**

| ID | Requirement | Current State | Webex Solution | Priority |
|----|-------------|---------------|----------------|----------|
| FR-017 | Video calling from desk phones | Limited (8865) | 8845/8865 video | Low |
| FR-018 | Custom hold music | Per-partition | Per-location | Low |
| FR-019 | Paging groups | Cisco Paging | Webex Paging | Medium |
| FR-020 | Door entry integration | SIP intercom | LGW SIP | Low |

### 1.6.2 Non-Functional Requirements

**Performance Requirements:**

| ID | Requirement | Target | Measurement | Threshold |
|----|-------------|--------|-------------|-----------|
| NFR-001 | Call setup time | <3 seconds | Time to ringback | Critical if >5s |
| NFR-002 | Audio quality (MOS) | >4.0 | Webex Analytics | Critical if <3.5 |
| NFR-003 | Packet loss | <1% | Network monitoring | Critical if >3% |
| NFR-004 | Jitter | <30ms | Network monitoring | Critical if >50ms |
| NFR-005 | One-way latency | <150ms | Network monitoring | Critical if >250ms |
| NFR-006 | System availability | 99.99% | Webex Status | Critical if <99.9% |

**Security Requirements:**

| ID | Requirement | Implementation | Validation |
|----|-------------|----------------|------------|
| NFR-007 | Signaling encryption | TLS 1.2+ mandatory | Certificate check |
| NFR-008 | Media encryption | SRTP (AES-256) | Wireshark capture |
| NFR-009 | User authentication | SSO via Okta | Login flow test |
| NFR-010 | Admin access control | RBAC in Control Hub | Permission audit |
| NFR-011 | Audit logging | Control Hub audit logs | Log review |
| NFR-012 | Data residency compliance | Regional DC assignment | Compliance report |

**Availability Requirements:**

| ID | Requirement | Target | Design Approach |
|----|-------------|--------|-----------------|
| NFR-013 | Platform uptime | 99.99% | Webex cloud SLA |
| NFR-014 | PSTN failover | RTO <5 min | Dual LGW (India), CCPP redundancy |
| NFR-015 | Survivability | Local calling during WAN outage | Survivable Gateway (future) |
| NFR-016 | Disaster recovery | RPO 0, RTO 1hr | Cloud-native DR |

### 1.6.3 Success Metrics

**Migration Success KPIs:**

| KPI | Metric | Target | Measurement Method |
|-----|--------|--------|-------------------|
| User Adoption | Active users / Total migrated | >95% within 30 days | Control Hub Analytics |
| Call Quality | Average MOS score | >4.0 | Webex Analytics |
| PSTN Reliability | Successful PSTN calls | >99.5% | Call Detail Records |
| Help Desk Tickets | Voice-related tickets | <20 per week (steady state) | ServiceNow reports |
| User Satisfaction | Survey score | >4.0/5.0 | Post-migration survey |
| Feature Parity | Features delivered | 100% must-have | Validation checklist |
| Compliance | Audit findings | 0 critical | Compliance audit |

**Rollback Triggers:**

| Trigger | Threshold | Action |
|---------|-----------|--------|
| Call failure rate | >5% for 30+ minutes | Initiate rollback |
| Audio quality | MOS <3.0 for 50%+ users | Escalate, potential rollback |
| PSTN outage | Total PSTN failure >15 min | Rollback affected batch |
| User-reported issues | >20% batch reporting problems | Pause, assess, potential rollback |
| Compliance violation | Any India toll bypass failure | Immediate rollback, investigate |

**Success Acceptance Criteria:**

```
+-----------------------------------------------------------------------------+
|              MIGRATION SUCCESS ACCEPTANCE CRITERIA                          |
+-----------------------------------------------------------------------------+
|                                                                             |
|  BATCH SIGN-OFF CRITERIA (Required for each migration batch):              |
|  ===========================================================               |
|  [ ] All users can make/receive internal calls                               |
|  [ ] All users can make/receive PSTN calls                                   |
|  [ ] Voicemail accessible and functional                                     |
|  [ ] Call forwarding settings preserved                                      |
|  [ ] BLF/Speed dials functional                                              |
|  [ ] Hunt groups distributing calls correctly                                |
|  [ ] Call quality MOS >4.0 average                                           |
|  [ ] No open P1/P2 incidents                                                 |
|  [ ] User training completed                                                 |
|                                                                             |
|  PHASE SIGN-OFF CRITERIA (Required for phase completion):                  |
|  ========================================================                  |
|  [ ] All batch criteria met for all batches in phase                        |
|  [ ] 72-hour stability period with no major incidents                       |
|  [ ] Help desk ticket volume normalized (<20/week)                          |
|  [ ] User satisfaction survey >4.0/5.0                                      |
|  [ ] Compliance validation passed (India toll bypass, GDPR)                 |
|                                                                             |
|  PROJECT COMPLETION CRITERIA:                                              |
|  ===========================                                               |
|  [ ] 100% users migrated                                                     |
|  [ ] CUCM decommissioning plan approved                                      |
|  [ ] Documentation handoff completed                                         |
|  [ ] Operations team trained and certified                                   |
|  [ ] All integrations functional                                             |
|  [ ] Executive sign-off received                                             |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## Chapter 1 Appendix: Discovery Data Collection Templates

### Template 1.A: CUCM Data Export Commands

```
! CUCM CLI Commands for Data Collection

! Export all phones
admin:run sql select d.name, d.description, dp.name as devicepool, 
n.dnorpattern, n.description as linedesc 
from device d 
inner join devicenumplanmap dnpm on d.pkid = dnpm.fkdevice 
inner join numplan n on dnpm.fknumplan = n.pkid 
inner join devicepool dp on d.fkdevicepool = dp.pkid 
where d.tkclass = 1

! Export all route patterns
admin:run sql select rp.dnorpattern, rp.description, rl.name as routelist, 
pt.name as partition, css.name as css 
from numplan rp 
inner join routepattern rpm on rp.pkid = rpm.fknumplan 
inner join routelist rl on rpm.fkroutelist = rl.pkid
inner join partition pt on rp.fkpartition = pt.pkid
left join callingsearchspace css on rp.fkcallingsearchspace = css.pkid
where rp.tkpatternusage = 1

! Export hunt groups
admin:run sql select hp.dnorpattern, hp.description, hl.name, 
hg.lineselectionorder 
from huntlist hl 
inner join huntgroup hg on hl.pkid = hg.fkhuntlist 
inner join numplan hp on hg.fknumplan = hp.pkid

! Export device pools
admin:run sql select name, description, fkregion, fkcallingsearchspace 
from devicepool

! Export user details
admin:run sql select u.userid, u.firstname, u.lastname, 
eu.telephonenumber, eu.department 
from enduser eu 
inner join enduserenrolledintoldapdirectory u on eu.pkid = u.fkenduser
```

### Template 1.B: Site Data Collection Checklist

| Data Point | Collected | Source | Notes |
|------------|-----------|--------|-------|
| User count by site | [ ] | CUCM/AD | |
| Phone models by site | [ ] | CUCM inventory | |
| DID ranges | [ ] | PSTN provider | |
| Extension ranges | [ ] | CUCM dial plan | |
| Hunt group membership | [ ] | CUCM | |
| Shared line mapping | [ ] | CUCM | |
| Call forwarding settings | [ ] | CUCM BAT export | |
| Speed dial/BLF configs | [ ] | CUCM | |
| Voicemail PIN policy | [ ] | Unity | |
| Network bandwidth | [ ] | Network team | |
| Internet circuit details | [ ] | Network team | |
| Firewall rules | [ ] | Security team | |

---

*End of Chapter 1: Discovery & Current State Assessment*

---
