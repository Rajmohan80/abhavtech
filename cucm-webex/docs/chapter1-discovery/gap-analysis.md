# Gap Analysis

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

