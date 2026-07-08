# Abhavtech.com -- Migration Feature Problem / Solution Register
## CUCM -> Webex Calling | UCCX -> Webex Contact Center

---

| Field | Value |
|---|---|
| **Document Code** | ABV-COLLAB-MIG-2026-PSR |
| **Version** | 1.0 -- Initial Release |
| **Date** | June 2026 |
| **Classification** | Internal -- Technical Reference |
| **Purpose** | Formal register of every feature migration problem and its approved solution for Abhavtech's CUCM/UCCX to Webex migration |
| **Scope** | Phase 1: CUCM -> Webex Calling \| Phase 2: UCCX -> Webex Contact Center |
| **Cross-Reference** | Chapters 2A, 3A (Feature Gap Bridge) \| ABV-COLLAB-MIG-2026 v2.1 |

---

## How to Use This Register

Each Problem/Solution card follows a standard structure:

| Field | Description |
|---|---|
| **Problem Statement** | What is the CUCM/UCCX feature and why does it not migrate directly to Webex? |
| **Root Cause** | The fundamental architectural difference causing the gap |
| **Business Impact** | What users, sites, or operations are affected and how |
| **Abhavtech Decision** | The agreed approach chosen from available options |
| **Solution Steps** | Step-by-step implementation guide |
| **Config Reference** | Representative configuration snippet (where applicable) |
| **Validation Steps** | How to confirm the solution is working |
| **Owner** | Who is responsible |
| **Timeline** | When this must be completed |

Cards are organized by Phase and then by risk level (Critical -> High -> Medium -> Low).

---

## Register Summary

| Card ID | Feature / Issue | Phase | Risk | Status |
|---|---|---|---|---|
| [PSR-P1-01](#psr-p1-01) | SRST Survivability -- Survivability GW Required | Phase 1 | 🔴 Critical | Solution Defined |
| [PSR-P1-02](#psr-p1-02) | CSS / Partition -- Outgoing Calling Plan Redesign | Phase 1 | 🔴 Critical | Solution Defined |
| [PSR-P1-03](#psr-p1-03) | Extension Mobility -- Webex Hotdesking (MPP Only) | Phase 1 | 🟠 High | Solution Defined |
| [PSR-P1-04](#psr-p1-04) | Unity Connection -- Voicemail Data Migration | Phase 1 | 🟠 High | Solution Defined |
| [PSR-P1-05](#psr-p1-05) | Forced Auth Codes -- Calling Plan Workflow | Phase 1 | 🟠 High | Solution Defined |
| [PSR-P1-06](#psr-p1-06) | Malicious Call Trace -- Recording + Procedure | Phase 1 | 🟡 Medium | Solution Defined |
| [PSR-P1-07](#psr-p1-07) | Intercom -- No Equivalent | Phase 1 | 🟡 Medium | Accepted Gap |
| [PSR-P2-01](#psr-p2-01) | UCCX Custom Java Steps -- REST API Prerequisite | Phase 2 | 🟠 High | API Dev Required |
| [PSR-P2-02](#psr-p2-02) | Finesse Desktop -- Webex Agent Desktop Rebuild | Phase 2 | 🟠 High | Solution Defined |
| [PSR-P2-03](#psr-p2-03) | Historical Reporting -- UCCX Data Archive | Phase 2 | 🟡 Medium | Solution Defined |
| [PSR-P2-04](#psr-p2-04) | Outbound TRAI DNC Compliance | Phase 2 | 🟡 Medium | Confirm License |
| [PSR-P2-05](#psr-p2-05) | WFM Integration -- Verint/NICE to WxCC WFO | Phase 2 | 🟡 Medium | See UCCX Checklist |

---

## Phase 1: CUCM -> Webex Calling

---

## PSR-P1-01

### SRST Survivability -- Webex Calling Survivability Gateway

> 🔴 **CRITICAL** | Phase 1 -- CUCM to Webex Calling | Migration Type: Partial Replacement Available

---

**Problem Statement**

CUCM Survivable Remote Site Telephony (SRST) allows all Cisco IP phones at branch sites to make and receive calls when the WAN link fails. Webex Calling has no equivalent -- when internet connectivity is lost, all Webex Calling endpoints lose calling capability entirely.

**Root Cause**

Webex Calling is a cloud-hosted service that requires active internet connectivity for call signaling and media. There is no on-premises call control fallback in the base Webex Calling architecture. Cisco introduced the Survivability Gateway feature (IOS-XE 17.6.1+) as a partial mitigation, but it supports only MPP phones and a limited feature set.

**Business Impact**

All 12 Abhavtech sites are at risk. Critical impact on Mumbai and Chennai contact center (175 agents). Branch offices (Noida, Pune, Hyderabad, Bangalore, Delhi) would lose all calling during internet outages. EMEA/Americas sites on CCPP have no LGW and therefore no survivability without additional infrastructure.

**Abhavtech Decision**

Deploy Webex Calling Survivability Gateway on all India LGW routers (IOS-XE 17.12.2 already meets the 17.6.1 requirement). EMEA/Americas sites rely on SD-WAN dual-WAN (ABV-SDWAN-2024 project) for circuit redundancy as the primary mitigation. Softphone/Webex App users are excluded from survivability -- mobile PSTN as backup.

**Solution Steps**

1. Confirm IOS-XE 17.6.1+ on all India LGW routers (current 17.12.2 -- [OK] confirmed)
2. Configure survivability mode under CUBE `voice register global` on Mumbai LGW first
3. Set keepalive OPTIONS timer (5-second interval, 3 retries before failover)
4. Identify all MPP phone MACs per site for survivability pool
5. Test WAN-down failover for each site during a maintenance window
6. Document user communication: Webex App users lose calling in outages -- use mobile
7. Replicate configuration to all India sites
8. Confirm SD-WAN dual-WAN is active at London and Frankfurt

**Config Reference**

```ios
! Survivability Gateway -- apply to each India LGW
voice register global
 mode webex-calling
 max-dn 200
survivability
 application wan-down
 keepalive register
 ping-options timeout 5 retries 3
 fallback local
```

**Validation Steps**

1. Simulate WAN outage -- shut WAN interface on test LGW
2. Verify MPP phone re-registers to local LGW within 30 seconds
3. Make a test PSTN call from MPP in survivability mode -- verify audio
4. Verify Webex App shows offline (expected behaviour)
5. Restore WAN -- verify MPP re-registers to Webex within 60 seconds
6. Document failover/failback times for each site

| Owner | Timeline |
|---|---|
| Collaboration Architecture Team + Network Team (SD-WAN) | Complete 2 weeks before first migration batch (Mumbai pilot) |

---

## PSR-P1-02

### CSS / Partition -- No Direct Equivalent in Webex Calling

> 🔴 **CRITICAL** | Phase 1 -- CUCM to Webex Calling | Migration Type: Redesign Required

---

**Problem Statement**

CUCM Calling Search Spaces and Partitions provide per-device and per-line call routing access control. Different users have different calling privileges enforced by the CUCM CSS matrix. Webex Calling has no equivalent concept -- all call routing permissions are managed through Outgoing Calling Plans at the Location or User level.

**Root Cause**

CUCM's CSS/Partition is a dial-plan access control layer deeply embedded in the CUCM routing engine. Webex Calling uses a Location-first architecture where calling permissions are set by call type (local, national, international, premium) per user or per location. The multi-tier CSS model cannot be imported or converted -- it must be rationalized into Webex Calling's permission model.

**Business Impact**

All 3,200 users affected. Without deliberate CSS-to-Calling-Plan mapping, all users receive the same calling permissions by default. International call cost exposure risk if permissions are too permissive. Restricted devices (lobby phones, analog lines) could be granted unintended PSTN access.

**Abhavtech Decision**

Define 7 Outgoing Calling Plan tiers for Abhavtech (see Chapter 2A.3 mapping table). Apply plans via Control Hub bulk provisioning at migration time. Replace Forced Auth Codes (FAC) with a ServiceNow approval workflow for international access.

**Solution Steps**

1. Export CUCM CSS list from **CUCM Admin > Call Routing > Class of Control**
2. Map each CSS to one of the 7 Abhavtech Webex Calling permission tiers
3. Create User/Location tags in Control Hub to track permission tier per user group
4. Configure Outgoing Calling Plans per Location in Control Hub: **Calling > Locations > [Location] > Outgoing Calling**
5. For individual user overrides (managers, executives), configure per-user Outgoing Calling Plan
6. Implement ServiceNow request form for international access requests with manager approval
7. Verify lobby phones and analog gateways are on Internal Only plan

**Config Reference**

```json
// Control Hub API -- set Outgoing Calling Plan per user
// PATCH /v1/people/{personId}/features/outgoingPermission
{
  "callingPermissions": [
    {"action": "ALLOW",  "callType": "INTERNAL_CALL"},
    {"action": "ALLOW",  "callType": "LOCAL"},
    {"action": "ALLOW",  "callType": "NATIONAL"},
    {"action": "BLOCK",  "callType": "INTERNATIONAL"}
  ]
}
```

**Validation Steps**

1. From each user type (standard, manager, lobby), attempt an international call -- verify block/allow behaviour matches tier definition
2. Test ServiceNow approval workflow end-to-end: submit request, approve, verify Control Hub plan update
3. Verify analog device (fax) cannot dial PSTN outside designated numbers
4. Validate all 7 permission tiers with a test user for each tier

| Owner | Timeline |
|---|---|
| Collaboration Architecture Team + HR (manager approval workflow) | Complete during discovery phase -- before Batch 1 migration |

---

## PSR-P1-03

### Extension Mobility -- Webex Calling Hotdesking (Limited)

> 🟠 **HIGH** | Phase 1 -- CUCM to Webex Calling | Migration Type: Partial Replacement Available

---

**Problem Statement**

CUCM Extension Mobility lets any user log into any IP phone and receive their complete profile (extension, voicemail, speed dials, CSS). Webex Calling Hotdesking provides similar functionality but is limited to MPP phones only, requires explicit device configuration as a hotdesk host, and does not support cross-platform operation during coexistence.

**Root Cause**

Extension Mobility is a CUCM server-side feature that dynamically assigns a device profile to any registered phone. Webex Calling Hotdesking is a phone-side feature (MPP firmware) that re-registers the phone to a different user's Webex account. The latter only works entirely within the Webex Calling ecosystem -- no equivalent for Webex App (softphone) users.

**Business Impact**

Approximately 40 hot-desk stations in Mumbai HQ open-plan floors 3-5. Any user sharing a desk cannot log into a Webex App softphone as a different extension -- they must use a physical MPP phone. During coexistence, CUCM users cannot hotdesk into Webex phones and vice versa, creating a hard batch-alignment requirement.

**Abhavtech Decision**

Configure all 40 hot-desk MPP phones as Hotdesking Hosts in Control Hub. All hot-desk users and their associated desk phones must migrate in the same batch. Webex App users accept the limitation of using their personal Webex extension on any device via the app -- no hotdesking equivalent needed for them.

**Solution Steps**

1. Identify all 40 hot-desk MPP phone MAC addresses and locations (Floor 3: 15, Floor 4: 15, Floor 5: 10)
2. In Control Hub: **Users > Devices > select each phone > Enable Hotdesking**
3. Assign generic idle extension per floor (e.g., 9300 = Floor 3 reception, 9400 = Floor 4)
4. Set auto-logout timer to 8 hours (standard) or 12 hours (after-hours)
5. Brief IT and floor admins on login procedure: press Hotdesking softkey > enter Webex email > authenticate
6. Include hotdesking procedure in user training materials for all Mumbai HQ users

**Validation Steps**

1. Log in as test user on pilot hot-desk MPP phone -- verify extension shows correctly on phone display
2. Receive a test call to the user's extension on the hotdesk phone -- verify ring and audio
3. Access voicemail from the hotdesk phone -- verify correct mailbox
4. Log out (auto or manual) -- verify phone reverts to idle extension
5. Confirm a different user can log into the same phone immediately after logout

| Owner | Timeline |
|---|---|
| Collaboration Architecture Team + Facilities (desk inventory) | Complete Week 2 of Mumbai HQ pilot batch |

---

## PSR-P1-04

### Unity Connection Voicemail -- Data Migration

> 🟠 **HIGH** | Phase 1 -- CUCM to Webex Calling | Migration Type: Partial Replacement -- Data Loss Accepted

---

**Problem Statement**

Unity Connection provides full-featured voicemail with IMAP, custom Class of Service, distribution lists, and multi-greeting options. Webex Calling provides basic voicemail with voicemail-to-email, PIN access, and visual voicemail via the Webex App. Existing voicemail messages and IMAP integrations **cannot be migrated** to Webex.

**Root Cause**

No import/export tool exists between Unity Connection and Webex Calling voicemail. The platforms use fundamentally different storage architectures. Unity Connection stores voice messages as WAV files in a proprietary database; Webex Calling stores voicemail in Cisco cloud infrastructure with no external import capability.

**Business Impact**

All 3,200 users lose historical voicemail messages at migration time. Users relying on IMAP for voicemail (Outlook integration) lose that integration -- must use Webex App or email notification instead. Unity Connection distribution lists must be recreated as email distribution lists.

**Abhavtech Decision**

Accept message data loss with advance user notification (4-week notice, self-service export instructions). Export Unity Connection greetings to WAV for re-upload where critical. Accepted feature gaps: IMAP (replaced by Webex App visual VM and email notification) and distribution lists (replaced by M365 email DLs).

**Solution Steps**

1. **T-28 days:** Send user communication with instructions to save important voicemails to email (Unity Connection allows email forwarding of messages)
2. **T-14 days:** Send reminder
3. **T-7 days:** Export custom greeting WAV files for VIP users via Unity Connection Administration
4. **T-0:** Disable Unity Connection mailbox for migrated users. Webex Calling VM activates automatically.
5. **T+1:** Test voicemail deposit and retrieval for all migrated users
6. Assist IMAP users with switching to Webex App visual voicemail (individual sessions)
7. Recreate Unity Connection distribution lists as M365 distribution groups

**Validation Steps**

1. Leave a voicemail on 3 test user extensions -- verify delivery to email (WAV attachment)
2. Access voicemail via Webex App -- verify visual voicemail list shows correctly
3. PIN-based access -- dial voicemail access number, authenticate with PIN
4. Confirm no Unity Connection voicemail access for migrated users (mailbox disabled)
5. Verify IMAP users receive Webex voicemail-to-email (not IMAP -- inform them)

| Owner | Timeline |
|---|---|
| Collaboration Architecture Team + HR Comms (user notifications) | Notifications: T-28 days before each site batch. Config: T-0 migration day. |

---

## PSR-P1-05

### Forced Authorization Codes -- Calling Plan Workflow Replacement

> 🟠 **HIGH** | Phase 1 -- CUCM to Webex Calling | Migration Type: Redesign Required

---

**Problem Statement**

CUCM Forced Authorization Codes (FAC) require users to enter a PIN before making long-distance or international calls, enforcing call cost control at the per-call level. Webex Calling has **no native FAC equivalent**.

**Root Cause**

FAC is a CUCM dial-plan feature tightly coupled to the CSS/Partition access control model. Webex Calling's simplified calling plan model does not have a PIN-challenge mechanism -- it applies blanket call type permissions at the user or location level.

**Business Impact**

Without a replacement control, any user assigned an International calling plan could make international calls without authorization. For Abhavtech's finance and procurement policy, uncontrolled international calling creates cost exposure risk.

**Abhavtech Decision**

Replace per-call FAC with a **per-user permission model**:
- Default: all standard employees on National plan (international blocked)
- International access: requires ServiceNow request with manager approval -> Control Hub admin updates user's Outgoing Calling Plan
- Exception: C-level, senior managers, and frequent travellers receive permanent International plan

**Solution Steps**

1. Define list of users requiring permanent International plan (HR/Finance approval)
2. Assign permanent International plan to approved users via Control Hub bulk import at migration time
3. Build ServiceNow request form: "Request International Calling Access"
4. Configure approval workflow: requester -> direct manager -> Collaboration Team admin
5. Upon approval, Control Hub admin updates user's Outgoing Calling Plan to International
6. Monthly audit: review all International plan users and confirm ongoing business need

**Validation Steps**

1. Standard employee attempts international call -- verify block with guidance message
2. Submit ServiceNow request, approve, update plan -- verify international calling works
3. Run monthly audit report from Control Hub -- confirm no un-approved International plans

| Owner | Timeline |
|---|---|
| Collaboration Architecture Team + Finance + ServiceNow Admin | ServiceNow form: 4 weeks before Batch 1. Bulk plan assignment: T-0 each migration batch. |

---

## PSR-P1-06

### Malicious Call Trace -- Recording and Procedure Replacement

> 🟡 **MEDIUM** | Phase 1 -- CUCM to Webex Calling | Migration Type: Procedural Workaround

---

**Problem Statement**

CUCM Malicious Call Trace (MCT) allows a user to flag a live call via softkey. CUCM logs the full CLI, timestamp, and trunk details immediately for law enforcement use. This is required under India DoT regulations. **Webex Calling has no native MCT feature.**

**Root Cause**

MCT is a CUCM server-side call logging feature that hooks into the CUCM CDR engine in real time. Webex Calling does not expose a user-triggerable real-time logging mechanism. Call records are available post-call via Control Hub CDR reports.

**Business Impact**

Medium risk -- affects legal and compliance team's ability to respond to nuisance/threatening call incidents. Post-migration, the response process takes longer (call reconstruction vs. real-time flagging).

**Abhavtech Decision**

Replace MCT with a **post-call evidence package** built from call recording + CDR:
- 100% call recording already configured (Chapter 4 compliance framework)
- User procedure: call Security Helpdesk (ext 9911) during/after incident and log a ServiceNow security incident ticket
- Security team retrieves CDR + recording for the reported call

**Solution Steps**

1. Confirm 100% call recording is active for all Webex Calling users (verify in compliance checklist)
2. Create Security Helpdesk procedure document: "Reporting Malicious Calls on Webex"
3. Train all users on the new procedure during site migration change management sessions
4. Create ServiceNow incident template: "Malicious Call Report" with fields for caller number, time, and description
5. Brief Security team on CDR extraction from **Control Hub > Calling > Reports > Call Detail Records**
6. Brief Security team on recording retrieval from the recording platform
7. Document the complete procedure in the Abhavtech Security Procedures wiki

**Validation Steps**

1. Make a test call and log a simulated incident -- verify security team can retrieve CDR within 15 minutes
2. Retrieve recording for the test call -- verify audio quality and correct timestamp
3. Confirm procedure is included in user training materials

| Owner | Timeline |
|---|---|
| Collaboration Architecture Team + Security Team + HR Comms | Procedure documentation: 2 weeks before first batch. User training: T-0 each migration batch. |

---

## PSR-P1-07

### Intercom -- No Equivalent in Webex Calling

> 🟡 **MEDIUM** | Phase 1 -- CUCM to Webex Calling | Migration Type: Accepted Gap

---

**Problem Statement**

CUCM Intercom allows one-way auto-answer push-to-talk between specific extensions -- commonly used between executives and assistants, reception desks, and manufacturing floor communication. Webex Calling has **no native intercom feature**.

**Root Cause**

Intercom relies on CUCM's SCCP/SIP auto-answer signalling (Alert-Info header triggering auto-answer). Webex Calling uses standard SIP without the ability to force auto-answer on a remote endpoint.

**Business Impact**

Low-to-medium impact depending on usage. If Abhavtech uses intercom for executive/assistant pairs or reception-to-floor communication, those workflows must be replaced.

**Abhavtech Decision**

Accepted gap. Replacement options by use case:

| Use Case | Replacement |
|---|---|
| Executive <-> Assistant intercom | Speed dial + quick call (Webex App) |
| Reception desk announcement | Overhead paging system (Singlewire/InformaCast) |
| Floor-to-floor push-to-talk | Microsoft Teams walkie-talkie feature (PTT) |

**Solution Steps**

1. During discovery, survey CUCM intercom pairs in use (CUCM Admin > Device > Phone > search Intercom button)
2. For each intercom pair, determine which replacement option applies
3. Configure speed dial shortcuts for executive/assistant pairs in Control Hub
4. For overhead paging: confirm Singlewire InformaCast integration with Webex Calling (supported via LGW)
5. Communicate the change to affected users during change management sessions

**Validation Steps**

1. Confirm all intercom pairs have been inventoried and assigned a replacement
2. Test speed dial shortcuts for executive/assistant pairs post-migration
3. If Singlewire deployed: test overhead paging announcement via Webex Calling

| Owner | Timeline |
|---|---|
| Collaboration Architecture Team + Facilities | Discovery: 8 weeks before migration. Replacement config: T-0 each affected batch. |

---

## Phase 2: UCCX -> Webex Contact Center

---

## PSR-P2-01

### UCCX Custom Java Steps -- REST API Migration Required

> 🟠 **HIGH** | Phase 2 -- UCCX to Webex Contact Center | Migration Type: Redesign Required -- Backend API Prerequisite

---

**Problem Statement**

Three of Abhavtech's nine UCCX scripts (`SalesQueue.aef`, `BillingQueue.aef`, `TechSupport.aef`) contain custom Java steps that perform backend lookups via JDBC database calls and Salesforce SOAP API. Webex Contact Center Flow Designer does not support embedded code -- all external integrations must use **HTTP Request nodes** calling REST APIs. The target backend systems do not currently expose REST endpoints.

**Root Cause**

UCCX Script Editor allows arbitrary Java code within steps, providing direct database and SOAP API connectivity. WxCC Flow Designer is a no-code/low-code visual tool that only supports HTTP REST calls. REST API wrappers must be built around the existing backend systems before the WxCC migration can proceed.

**Business Impact**

All three affected scripts handle customer-facing prioritisation and data lookup that directly impacts agent experience and call routing quality. If these are not ready at cutover, agents receive no screen pop data, VIP customers are not prioritised, and billing agents cannot see account status during calls -- significant customer experience degradation.

**Abhavtech Decision**

Abhavtech DevOps team to build and deploy three REST API endpoints:
1. **Salesforce VIP lookup** -- via Salesforce REST API with Connected App OAuth2
2. **Billing DB query** -- via Azure API Management gateway wrapping Oracle DB
3. **Product registration lookup** -- via same API gateway pattern

All three endpoints must be in production and load-tested before the WxCC cutover is scheduled.

**Solution Steps**

1. **Immediately:** Assign DevOps resources -- 2 engineers for 6-8 weeks
2. **Week 1-2:** Design API contracts (request/response JSON schema) for all three endpoints
3. **Week 3-4:** Develop and unit-test each endpoint in dev environment
4. **Week 5-6:** Integration testing with WxCC Flow Designer in sandbox tenant
5. **Week 7-8:** Load test each endpoint -- simulate 175 concurrent agent calls
6. **Week 8:** Security review and API gateway rate limiting configuration
7. **T-14 days (before WxCC cutover):** Endpoints promoted to production
8. **WxCC Flow Designer:** Replace UCCX Java step logic with HTTP Request node + Condition node per script

**Config Reference**

```javascript
// WxCC Flow Designer -- SalesQueue VIP Lookup HTTP Request node
// URL: https://api.abhavtech.com/crm/vip-check
// Method: POST
// Body: { "ani": "{{NewPhoneContact.ANI}}" }
// Response mapping: $.vip_flag -> Flow variable: VIPCustomer

// Condition node:
// VIPCustomer == true  -> Route to Priority_Queue
// VIPCustomer == false -> Route to Standard_Queue
```

**Validation Steps**

1. Test each HTTP Request node in Flow Designer sandbox with real ANI values
2. Verify response mapping to Flow variables is correct for all three scripts
3. Simulate API timeout -- verify fallback routing (standard queue) activates
4. Run load test: 175 simultaneous HTTP requests to each endpoint -- confirm < 200ms response time
5. Validate Salesforce screen pop arrives within 3 seconds of call answer in UAT

| Owner | Timeline |
|---|---|
| DevOps Team (API development) + Collaboration Architecture Team (Flow Designer integration) | API development: Start immediately -- complete 8 weeks before WxCC cutover. Flow Designer integration: Final 2 weeks before cutover. |

---

## PSR-P2-02

### Cisco Finesse Agent Desktop -- Webex Agent Desktop Migration

> 🟠 **HIGH** | Phase 2 -- UCCX to Webex Contact Center | Migration Type: Redesign Required -- Feature-by-Feature Rebuild

---

**Problem Statement**

UCCX uses Cisco Finesse as the agent desktop, customised with Salesforce screen-pop gadgets, a wallboard panel, and a custom attendance tracking widget. Webex Contact Center uses the Webex Agent Desktop -- a different application with a JSON-based layout system instead of Finesse's OpenSocialGadgets framework. **No migration tool exists to convert Finesse gadgets to Webex Desktop widgets.**

**Root Cause**

Finesse gadgets use the GSSP (Gadget Server Servlet Pages) and OpenSocial framework. Webex Agent Desktop uses a JSON-based layout configuration and supports iFrame-based custom widgets and native Webex integrations. The two frameworks are architecturally incompatible -- each Finesse customisation must be individually assessed and rebuilt or replaced.

**Business Impact**

All 175 agents are affected. Key operational impacts:
- Salesforce screen pop not available until native connector is configured
- Wallboard integration must be rebuilt
- Custom attendance gadget has no WxCC equivalent and will be permanently decommissioned

**Abhavtech Decision**

Configure Webex Agent Desktop using JSON Desktop Layout. Rebuild Salesforce integration using native WxCC Salesforce connector (Einstein CTI). Replace wallboard with WxCC Analyzer live dashboard on dedicated display screens. Decommission the attendance gadget -- transition to **Microsoft Teams Shifts** for attendance tracking (agreed with HR).

**Solution Steps**

1. Configure Webex Agent Desktop JSON layout in Control Hub: **Calling > Webex Contact Center > Desktop Layout**
2. Enable Salesforce connector: **WxCC Control Hub > Integrations > Salesforce > configure Connected App**
3. Map Salesforce screen pop triggers to ANI lookup (same logic as current Finesse gadget)
4. Test Salesforce screen pop with 10 pilot agents in sandbox
5. Configure WxCC Analyzer live dashboard for wallboard (large screen display at each contact center site)
6. Brief HR team on Teams Shifts for attendance -- migrate agents to Teams Shifts at least 2 weeks before WxCC cutover
7. Conduct agent UAT: 10 pilot agents use Webex Agent Desktop for a full shift in sandbox

**Validation Steps**

1. Salesforce screen pop: place test call -- verify correct account loads within 3 seconds of answer
2. Click-to-dial from Salesforce: click phone number in SF account -- verify call initiates from Webex Agent Desktop
3. Wallboard: verify live queue stats display (AHT, queue depth, agent states)
4. Agent state changes: RONA, available, busy -- verify all states display correctly in Supervisor Desktop
5. Supervisor monitor/barge: test from Supervisor Desktop -- verify agent audio is audible

| Owner | Timeline |
|---|---|
| Collaboration Architecture Team + Salesforce Admin + HR Operations | Desktop Layout config: 3 weeks before cutover. Salesforce connector: 4 weeks before cutover. Attendance migration: 2 weeks before cutover. |

---

## PSR-P2-03

### UCCX Historical Data -- Preservation and WxCC Analyzer Baseline

> 🟡 **MEDIUM** | Phase 2 -- UCCX to Webex Contact Center | Migration Type: Accepted Data Boundary -- Export and Archive

---

**Problem Statement**

UCCX stores 24+ months of historical call and agent performance data. Webex Contact Center Analyzer **cannot import this historical data** -- it begins collecting from the WxCC cutover date only. Management reporting that spans the migration date cannot be produced from a single system.

**Root Cause**

WxCC Analyzer is a cloud-native data platform with no import API for external historical data. UCCX uses a local Informix database for historical data storage that is not accessible post-decommissioning. No migration bridge exists between these systems.

**Business Impact**

Operations and Quality Management teams lose access to pre-migration performance trends for comparative analysis. Compliance reporting requiring 7-year data retention (India regulations) is at risk if UCCX data is not archived before decommissioning.

**Abhavtech Decision**

Perform comprehensive UCCX data export 30 days before cutover. Archive in SharePoint with 7-year retention. Document baseline KPIs from last 90 days of UCCX data. Build combined Excel reporting model for the transition period. WxCC Analyzer to be the system of record from cutover date onward.

**Solution Steps**

1. **T-30 days:** Begin daily UCCX data exports (all reports) using UCCX Historical Reporting Client
2. **T-7 days:** Final comprehensive export -- all historical reports, minimum 24 months
3. Archive all CSVs in SharePoint: **Collaboration Team > CC Migration > UCCX Historical Data**
4. Apply 7-year retention policy to the SharePoint folder
5. Document baseline KPIs: ASA, AHT, FCR, abandonment rate, agent utilisation -- last 90 days average
6. **T-0:** Confirm WxCC Analyzer is collecting data (verify first call records appear within 15 minutes of cutover)
7. **T+30 days:** Validate WxCC Analyzer report accuracy vs. expected call volumes
8. Build combined Excel dashboard template for Operations team (UCCX CSV + WxCC Analyzer export)

**Validation Steps**

1. Verify UCCX export files open correctly and contain expected date ranges
2. Confirm archive location is accessible to the Operations team with correct permissions
3. Confirm 7-year retention policy is applied in SharePoint
4. Verify WxCC Analyzer shows call records within 15 minutes of the first production call on WxCC
5. Validate WxCC Analyzer KPI values match independent count from CDR data

| Owner | Timeline |
|---|---|
| Operations Manager + Collaboration Architecture Team | Export start: T-30 days before WxCC cutover. Archive complete: T-7 days before cutover. |

---

## PSR-P2-04

### Outbound Dialing -- WxCC Outbound Campaign + TRAI DNC Compliance

> 🟡 **MEDIUM** | Phase 2 -- UCCX to Webex Contact Center | Migration Type: Platform Feature -- License and Compliance Prerequisite

---

**Problem Statement**

If Abhavtech uses UCCX Outbound Module for sales/collections campaigns, the equivalent WxCC feature (Outbound Campaign Manager) is a **separately licensed SKU**. Additionally, all outbound commercial calls in India must comply with TRAI's National Customer Preference Register (NCPR / DNC registry) -- campaigns must scrub contact lists against the DNC before dialing. WxCC Campaign Manager supports DNC integration but requires explicit configuration.

**Root Cause**

WxCC Outbound Campaign is a separate product module with its own licensing and configuration portal (Campaign Manager, separate from Control Hub). TRAI DNC compliance is not automatic -- it requires configuring an API connection to the TRAI DNC scrubbing service within Campaign Manager.

**Business Impact**

If outbound campaigns go live on WxCC without DNC scrubbing, Abhavtech risks TRAI regulatory violations with penalties up to **INR 500 per violation per call**. Campaigns targeting India numbers require 100% DNC compliance before dialing.

**Abhavtech Decision**

Confirm with Cisco account team whether Outbound Campaign SKU is included in Abhavtech's WxCC agreement. If confirmed, deploy Campaign Manager, configure TRAI DNC API integration, and test DNC scrubbing before any production outbound campaign is activated. If outbound dialing is not currently used, mark as N/A.

**Solution Steps**

1. Confirm outbound dialing usage in UCCX with Sales and Collections team managers
2. If in use: request Webex Contact Center Outbound Campaign SKU from Cisco account team
3. Configure Campaign Manager portal (separate from Control Hub)
4. Obtain TRAI DNC scrubbing API credentials from a TRAI-registered DNC service provider
5. Configure DNC scrub in Campaign Manager: **Settings > Compliance > DNC Integration**
6. Test campaign with a 10-record list -- verify DNC numbers are excluded before dialing
7. Load first production campaign only after DNC test passes and legal sign-off received

**Validation Steps**

1. Create a test contact list with 5 known DNC numbers and 5 clean numbers
2. Run DNC scrub -- verify only 5 clean numbers remain after scrub
3. Activate test campaign -- verify only clean numbers are dialed
4. Review campaign disposition report -- verify DNC exclusions are logged
5. Obtain written compliance sign-off from Legal team before first production campaign

| Owner | Timeline |
|---|---|
| Contact Center Operations Manager + Legal / Compliance + Cisco Account Team | License confirmation: Immediately. DNC configuration: 3 weeks before first WxCC outbound campaign. |

---

## PSR-P2-05

### WFM Integration -- Verint/NICE to WxCC Workforce Optimisation

> 🟡 **MEDIUM** | Phase 2 -- UCCX to Webex Contact Center | Migration Type: Integration Rebuild

---

**Problem Statement**

If Abhavtech uses a third-party Workforce Management platform (Verint, NICE, Genesys WFM) integrated with UCCX for agent scheduling, adherence monitoring, and forecasting, the UCCX-specific integration must be replaced with a WxCC-compatible integration. WxCC uses a published API set for WFM integration; however, each WFM vendor must be individually validated for WxCC compatibility.

**Root Cause**

UCCX WFM integrations use UCCX's proprietary real-time adherence (RTA) feed and historical data export. WxCC uses REST APIs and webhooks for WFM integration. The UCCX connector is not compatible with WxCC -- the WFM vendor must provide a WxCC-certified connector.

**Business Impact**

Without WFM integration, supervisors lose real-time adherence monitoring and scheduling efficiency tools during the transition period. Impact severity depends on whether Abhavtech uses automated scheduling or manual scheduling.

**Abhavtech Decision**

Confirm WFM platform in use and check vendor's WxCC connector availability. Reference the UCCX-WxCC Master Checklist (Section 1.5 -- Integration Assessment) for the full WFM assessment procedure.

**Solution Steps**

1. Identify WFM platform in use (Verint, NICE, or other)
2. Contact WFM vendor to confirm WxCC connector availability and version
3. Obtain WxCC API credentials from Control Hub: **Developer Resources > API Access**
4. Configure WFM connector with WxCC API credentials per vendor documentation
5. Test real-time agent state feed: verify WFM receives agent state changes within 30 seconds
6. Test historical data feed: verify daily call volumes and AHT data flow correctly
7. Run parallel monitoring period (WFM connected to both UCCX and WxCC during pilot if technically feasible)

**Validation Steps**

1. Agent changes state in Webex Agent Desktop -- verify WFM shows correct state within 30 seconds
2. Check WFM adherence report for previous day -- verify call counts match WxCC Analyzer
3. Confirm supervisor dashboard in WFM shows correct real-time queue statistics

| Owner | Timeline |
|---|---|
| Contact Center Operations Manager + WFM Vendor + Collaboration Architecture Team | WFM connector confirmation: 6 weeks before WxCC cutover. Integration config and testing: 3 weeks before cutover. |

---

## Appendix: Problem/Solution Card Template

Use this template for any additional feature gaps identified during migration execution.

---

### [PSR-XX-XX]

### [Feature Name]

> [Risk Level] | [Phase] | Migration Type: [Type]

---

**Problem Statement**

[Describe the CUCM/UCCX feature and why it cannot be migrated directly.]

**Root Cause**

[Describe the architectural difference that causes the gap.]

**Business Impact**

[Describe which users, sites, or operations are affected and how severely.]

**Abhavtech Decision**

[State the agreed solution approach.]

**Solution Steps**

1. Step one
2. Step two
3. Step three

**Config Reference**

```
[Configuration snippet or N/A]
```

**Validation Steps**

1. Validation step one
2. Validation step two
3. Validation step three

| Owner | Timeline |
|---|---|
| [Team / Role] | [Date or milestone reference] |

---

*© 2026 Abhavtech.com -- Internal Use Only*
*Document Code: ABV-COLLAB-MIG-2026-PSR v1.0*
