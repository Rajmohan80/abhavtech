# Chapter 4: Security, Compliance & Data Residency

!!! info "India Data Center — In-Country Storage (Confirmed by Cisco)"
    Webex Calling India data centers: **Mumbai (primary) + Chennai (secondary)**  
    Webex Contact Center India: **Mumbai DC only**

    The following data is stored in-country within India:

    | Data Type | In India? |
    |---|---|
    | Call recordings | ✅ Yes — India DC |
    | Voicemail | ✅ Yes — India DC |
    | Call Detail Records (CDRs) | ✅ Yes — India DC |
    | Audit logs / syslogs | ✅ Yes — India DC |

    Supported Cloud Connect PSTN partners in India: **Airtel**, **Tata Communications**, **Tata Tele Business Services**  
    *(Reliance Jio is not a certified Webex Cloud Connect partner for Calling/CC)*

## 4.1 Security Architecture

### 4.1.1 Transport Security (TLS/SRTP)

All signaling between Webex Calling/WxCC endpoints and the Cisco cloud is encrypted in transit. TLS 1.2 is the minimum supported version for SIP signaling and HTTPS-based APIs; TLS 1.3 is preferred where the endpoint or device firmware supports it, and Webex disables legacy TLS 1.0/1.1 and weak cipher suites at the edge. Media (audio and video) is encrypted end-to-end using SRTP with AES-128/256, negotiated per call via the SDP security descriptions exchanged during call setup. For the AbhavTech deployment, all WAN Edge IOS-XE devices terminating Local Gateway trunks (Mumbai, Bangalore, Chennai, Delhi, Noida, Hyderabad) must run an IOS-XE release that supports SRTP termination on the CUBE dial-peers facing Webex, and DTLS-SRTP for any WebRTC-based agent desktop media paths in WxCC.

### 4.1.2 Identity & Access Management (SSO/MFA)

AbhavTech uses Azure AD as the identity provider for both Webex Calling and Webex Contact Center, federated via SAML 2.0 through Control Hub's Identity Management settings. Users authenticate against Azure AD; Webex never stores or validates the underlying password. Multi-factor authentication is enforced at the Azure AD Conditional Access layer rather than inside Webex itself, so existing AbhavTech MFA policies (push notification via Microsoft Authenticator, with FIDO2 security keys for administrators) apply uniformly to Webex sign-in without separate configuration. Control Hub administrator accounts additionally require MFA regardless of the Conditional Access policy applied to standard users, since admin-level access can modify Zones, Trusted Network Edges, and PSTN routing.

### 4.1.3 Encryption at Rest

Data at rest -- voicemail, call recordings, CDRs, and user profile data -- is encrypted using AES-256 within the regional Webex data center the user is provisioned against (see the data residency tables in this chapter). Cisco manages the underlying encryption keys as part of the Webex cloud platform; AbhavTech does not need to operate a separate key management service for standard Webex Calling or WxCC encryption. Customers requiring control over their own encryption keys can evaluate Webex's End-to-End Encryption and customer-managed key options for Webex Meetings/Messaging, but this is out of scope for the calling and contact-center platforms covered in this guide.

### 4.1.4 Certificate Requirements

Local Gateway trunks use mutual TLS between the on-premises CUBE (IOS-XE) and the Webex Calling cloud SBC. The LGW certificate must be issued by a publicly trusted Certificate Authority already present in Cisco's trusted root store (e.g., DigiCert, GlobalSign) -- internal/private CAs are not accepted for the cloud-facing trunk. Certificates are typically issued with a 1-2 year validity; AbhavTech's NOC tracks expiry for each of the six Indian circle LGWs (Mumbai, Bangalore, Chennai, Delhi, Noida, Hyderabad) and renews at least 30 days before expiry to avoid an unplanned PSTN outage, since an expired LGW certificate causes the cloud SBC to reject the TLS handshake and the trunk drops to an offline state in Control Hub.

---

## 4.2 Global Compliance Matrix

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH GLOBAL COMPLIANCE MATRIX                              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  CERTIFICATION/REQ      | INDIA | UK    | EU    | AMERICAS | NOTES        |
|  -----------------------+-------+-------+-------+----------+--------------|
|  SOC 2 Type II          |  [OK]   |  [OK]   |  [OK]   |    [OK]    | All regions  |
|  ISO 27001              |  [OK]   |  [OK]   |  [OK]   |    [OK]    | All regions  |
|  ISO 27017 (Cloud)      |  [OK]   |  [OK]   |  [OK]   |    [OK]    | All regions  |
|  ISO 27018 (PII)        |  [OK]   |  [OK]   |  [OK]   |    [OK]    | All regions  |
|  GDPR                   |  N/A  |  [OK]   |  [OK]   |    N/A   | EU/UK only   |
|  UK Data Protection Act |  N/A  |  [OK]   |  N/A  |    N/A   | UK only      |
|  EU Cloud CoC (Level 3) |  N/A  |  N/A  |  [OK]   |    N/A   | EU only      |
|  German BSI C5          |  N/A  |  N/A  |  [OK]   |    N/A   | Germany      |
|  DoT/TRAI (Toll Bypass) |  [OK]   |  N/A  |  N/A  |    N/A   | India ONLY   |
|  -----------------------+-------+-------+-------+----------+--------------|
|                                                                             |
|  PSTN ARCHITECTURE REQUIREMENTS:                                           |
|  ================================                                          |
|                                                                             |
|  REQUIREMENT            | INDIA | UK    | EU    | AMERICAS | NOTES        |
|  -----------------------+-------+-------+-------+----------+--------------|
|  Local Gateway Required | COND* |  NO   |  NO   |    NO    | *See below   |
|  Zone/Edge Config       | COND* |  NO   |  NO   |    NO    | *See below   |
|  CCPP Compliant         |  YES  |  YES  |  YES  |   YES    | All regions  |
|  Geographic PSTN Egress | MAND  |  NO   |  NO   |    NO    | India only   |
|  -----------------------+-------+-------+-------+----------+--------------|
|                                                                             |
|  * INDIA CONDITIONAL:                                                      |
|    - LGW/Zone/Edge REQUIRED for Geographic DIDs (+91-XX-XXXXXXX)          |
|    - LGW/Zone/Edge NOT REQUIRED for ITN numbers (9XXXXXXXXX)              |
|                                                                             |
|  KEY INSIGHT:                                                              |
|  ============                                                              |
|  - UK/EU/Americas: LGW is a BUSINESS choice, not regulatory               |
|  - India: LGW/Zone is regulatory ONLY for geographic DIDs                 |
|  - CCPP is fully compliant for all regions (with Zone for India geo DIDs) |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 4.3 India Telecom Compliance

### 4.3.1 Regulatory Framework

```
+-----------------------------------------------------------------------------+
|              INDIA TELECOM REGULATORY FRAMEWORK                              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  REGULATOR                      | SCOPE                                    |
|  -------------------------------+------------------------------------------|
|  DoT (Dept of Telecom)          | Telecom licensing, VoIP regulations      |
|  TRAI (Telecom Regulatory       | Tariffs, interconnection, quality        |
|       Authority of India)       | of service, toll bypass rules            |
|  -------------------------------+------------------------------------------|
|                                                                             |
|  KEY REGULATIONS:                                                          |
|  ===============                                                           |
|  1. Unified Telecom License - VoIP and PSTN separation                    |
|  2. Toll Bypass Prohibition - No mixing VoIP and PSTN for toll bypass     |
|  3. OSP Guidelines (Nov 2020) - Liberalized but safeguards apply          |
|  4. Data Residency - CDR retention requirements                            |
|                                                                             |
|  CORE PRINCIPLE (Geographic DIDs Only):                                    |
|  ======================================                                    |
|  When using geographic DIDs (+91-XX-XXXXXXX), PSTN calls MUST egress      |
|  from the SAME TELECOM CIRCLE where the user is physically located        |
|                                                                             |
|  EXCEPTION - Internet Telephony Numbers (ITN):                             |
|  =============================================                             |
|  ITN numbers (9XXXXXXXXX) are EXEMPT from toll bypass restrictions        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.3.2 When Zone/Edge Configuration is Required

```
+-----------------------------------------------------------------------------+
|              ZONE/EDGE REQUIREMENT DECISION MATRIX                           |
+-----------------------------------------------------------------------------+
|                                                                             |
|  PSTN OPTION          | NUMBER TYPE     | ZONE/EDGE | LGW HW  | EXAMPLE   |
|  ---------------------+-----------------+-----------+---------+-----------|
|  Local Gateway        | Geographic DID  | REQUIRED  | YES     | +91-22-XXX|
|  CCPP (Tata)          | Geographic DID  | REQUIRED  | NO      | +91-22-XXX|
|  ITN                  | Non-Geographic  | NOT REQ   | NO      | 9XXXXXXXXX|
|  ---------------------+-----------------+-----------+---------+-----------|
|                                                                             |
|  [!]️ CRITICAL INSIGHT:                                                      |
|  Zone/Edge is about TOLL BYPASS COMPLIANCE, not hardware.                  |
|  If you use geographic DIDs, you need Zone/Edge regardless of LGW or CCPP |
|                                                                             |
|  PROHIBITED (Toll Bypass Violation):                                       |
|  ====================================                                      |
|                                                                             |
|    Mumbai User --VoIP--> Bangalore PSTN Egress --> External Number        |
|         ^                        ^                                         |
|         +------------------------+                                         |
|              ILLEGAL! Cross-circle PSTN egress                             |
|                                                                             |
|  PERMITTED:                                                                |
|  ==========                                                                |
|                                                                             |
|    Mumbai User --VoIP--> Mumbai PSTN Egress --> External Number           |
|         ^                      ^                                           |
|         +----------------------+                                           |
|              LEGAL! Same-circle PSTN egress                                |
|                                                                             |
|  ALSO PERMITTED (ITN Exception):                                           |
|  ================================                                          |
|                                                                             |
|    Any Location User --VoIP--> ITN Platform --> External Number           |
|                            (No circle check)                               |
|              LEGAL! ITN exempt from toll bypass                            |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.3.3 Toll Bypass Prevention Architecture

#### 4.3.3.1 Zone Configuration (per Telecom Circle)

A Zone in Control Hub groups one or more Locations under a shared PSTN routing policy, and is the mechanism Webex uses to enforce that geographic-DID users only egress to the PSTN through a Local Gateway or CCPP trunk associated with their own telecom circle. To configure a Zone: in Control Hub, navigate to Calling -> PSTN Connections -> Zones, create a new Zone per telecom circle (for example, Zone-Mumbai-Circle), assign the relevant Trusted Network Edge(s) to that Zone, then assign each Location physically operating within that circle to the Zone. Users provisioned with geographic DIDs inherit the Zone of their assigned Location, and Webex enforces that their PSTN calls route only through trunks belonging to that same Zone.

#### 4.3.3.2 Trusted Network Edge Setup

A Trusted Network Edge defines the public IP ranges Webex treats as belonging to a physical office for Zone-matching purposes. In Control Hub, under Calling -> PSTN Connections -> Trusted Network Edges, an administrator registers the office's public egress IP range (typically the /24 or /29 block advertised by the office firewall or SD-WAN edge) and associates it with a Zone. When a user's client detects it is operating from a source IP within a registered Trusted Network Edge range, Webex treats the user as physically present at that location for toll-bypass enforcement purposes -- this is what allows the platform to detect a Mumbai-provisioned user roaming on Bangalore office WiFi, as shown in the roaming-call-blocking example below.

#### 4.3.3.3 Location-to-Zone Mapping

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH INDIA - ZONE CONFIGURATION                            |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Telecom Circle    | Zone Name           | Locations         | PSTN Type  |
|  ------------------+---------------------+-------------------+------------|
|  Mumbai            | Zone-Mumbai-Circle  | Mumbai HQ, Pune   | LGW        |
|  Karnataka         | Zone-KA-Circle      | Bangalore         | LGW        |
|  Tamil Nadu        | Zone-TN-Circle      | Chennai           | LGW        |
|  Delhi             | Zone-Delhi-Circle   | Delhi             | LGW        |
|  UP West           | Zone-UPW-Circle     | Noida             | LGW        |
|  AP/Telangana      | Zone-AP-Circle      | Hyderabad         | LGW        |
|  ------------------+---------------------+-------------------+------------|
|  N/A (ITN Users)   | No Zone Required    | India WFH/Remote  | ITN        |
|  ------------------+---------------------+-------------------+------------|
|                                                                             |
|  Trusted Network Edges (for Zone-assigned users only):                     |
|  -----------------------------------------------------                     |
|  Mumbai-Edge:     203.45.100.0/24 (Mumbai office public IP range)         |
|  BLR-Edge:        203.47.50.0/24  (Bangalore office public IP range)      |
|  Chennai-Edge:    203.46.75.0/24  (Chennai office public IP range)        |
|  Delhi-Edge:      203.48.10.0/24  (Delhi office public IP range)          |
|  Noida-Edge:      203.49.20.0/24  (Noida office public IP range)          |
|  HYD-Edge:        203.50.30.0/24  (Hyderabad office public IP range)      |
|                                                                             |
|  ITN Users: No Trusted Network Edge assignment (exempt from toll bypass)  |
|                                                                             |
+-----------------------------------------------------------------------------+
```

#### 4.3.3.4 Roaming Call Blocking (Geographic DID Users)

When a user with a geographic DID attempts to place or receive a PSTN call, Webex compares the user's current detected network location (via Trusted Network Edge IP matching, or absence of a Trusted Network Edge match for off-network/remote users) against the Zone assigned to that user. If the user is detected on a Trusted Network Edge belonging to a different Zone than their assigned circle -- for example, a Mumbai-circle user connecting from the Bangalore office -- Webex blocks the outbound or inbound PSTN leg entirely rather than routing it through the Bangalore LGW, since doing so would constitute illegal cross-circle toll bypass under DoT/TRAI rules. The user sees a "PSTN calling not available" message; Webex calling between Webex users (on-net) is unaffected, only PSTN egress/ingress is blocked. ITN users are exempt from this check since they have no Zone assignment.

### 4.3.4 PSTN Option Details for India

#### 4.3.4.1 Local Gateway Requirements by Circle

Each of AbhavTech's six Indian circles (Mumbai, Karnataka/Bangalore, Tamil Nadu/Chennai, Delhi, UP West/Noida, AP-Telangana/Hyderabad) requiring Local Gateway PSTN runs a dedicated CUBE instance on Cisco ISR4000 or Catalyst 8000 series IOS-XE hardware, sized for the circle's concurrent call volume. The CUBE is configured with a SIP trunk dial-peer pointed at the Webex Calling cloud SBC (using the FQDN provided during LGW registration in Control Hub) and a second dial-peer toward the local PSTN carrier (Tata Communications or the circle's incumbent provider) for that circle's geographic DID block. IOS-XE 17.9 or later is required for current Webex Calling LGW certification; AbhavTech standardizes on 17.12.x across all six circle CUBEs for consistency with the SD-WAN WAN Edge fleet documented in the SD-WAN implementation guide.

#### 4.3.4.2 CCPP (Tata Communications) Configuration

Cisco Calling Plan Partner Provider (CCPP) trunks are activated directly from Control Hub under Calling -> PSTN Connections -> Add a Connection -> Cisco Calling Plans/CCPP, selecting Tata Communications as the provider for India. Number porting or new DID provisioning is handled through the CCPP partner's portal, with numbers then assigned to users in Control Hub once active. Critically, CCPP trunks still require Zone assignment for geographic DID users in India -- CCPP being a fully managed cloud PSTN connection does not exempt it from DoT/TRAI toll-bypass rules, only ITN numbers carry that exemption. AbhavTech assigns CCPP-routed geographic DID users to the same circle-based Zones used for LGW, ensuring consistent compliance regardless of which PSTN option a given site uses.

#### 4.3.4.3 Internet Telephony Numbers (ITN)

```
+-----------------------------------------------------------------------------+
|              INTERNET TELEPHONY NUMBERS (ITN) - INDIA                        |
+-----------------------------------------------------------------------------+
|                                                                             |
|  ITN OVERVIEW:                                                             |
|  ==============                                                            |
|  - Special numbers assigned by DoT to PSTN providers                       |
|  - Format: 9XXXXXXXXX (10 digits starting with 9)                          |
|  - EXEMPT from toll bypass restrictions within India                       |
|  - Available through Tata Communications                                   |
|                                                                             |
|  TECHNICAL REQUIREMENTS:                                                   |
|  =======================                                                   |
|  [OK] ITN numbers provisioned in Control Hub                                 |
|  [X] NO Zone configuration required                                         |
|  [X] NO Trusted Network Edge required                                       |
|  [X] NO LGW hardware required                                               |
|                                                                             |
|  BENEFITS:                                                                 |
|  ==========                                                                |
|  [OK] No toll bypass restrictions within India                               |
|  [OK] No MPLS/dedicated connection required                                  |
|  [OK] Works over regular internet                                            |
|  [OK] Users can work from ANYWHERE in India                                  |
|  [OK] No Local Gateway hardware required                                     |
|  [OK] Simplest compliance path                                               |
|                                                                             |
|  LIMITATIONS:                                                              |
|  =============                                                             |
|  [X] Numbers start with '9' (not geographic)                                |
|  [X] Cannot make PSTN calls when outside India                              |
|  [X] May not suit contact center toll-free requirements                    |
|  [X] Limited brand/number recognition                                       |
|                                                                             |
|  BEST FOR:                                                                 |
|  ==========                                                                |
|  - Remote/WFH users in India                                               |
|  - Employees who travel within India                                       |
|  - SMB deployments                                                         |
|  - Hybrid workforce                                                        |
|                                                                             |
|  ABHAVTECH ITN ASSIGNMENT:                                                 |
|  ==========================                                                |
|  - India WFH users (150): Assign ITN numbers                               |
|  - Zone/Trusted Network Edge: Leave BLANK for ITN users                    |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.3.5 India Data Residency

#### 4.3.5.1 India DC Availability

Webex offers an India-region data center for customers requiring in-country data residency, alongside the broader APAC region. AbhavTech's India operations are provisioned against the India DC (Mumbai + Chennai DCs), which stores user profiles, call detail records, voicemail, and recordings within India in compliance with Indian data localisation requirements. This distinction matters primarily for customers with strict data-localization obligations (e.g., RBI-regulated entities); for AbhavTech's general enterprise contact center and calling deployment, India DC provisioning is the standard choice to simplify any future data-residency conversations with customers or auditors, even though OSP and toll-bypass rules (the dominant India-specific compliance driver in this chapter) are independent of DC selection.

#### 4.3.5.2 CDR Retention (1 Year OSP Requirement)

India's OSP (Other Service Provider) guidelines require Call Detail Records to be retained for a minimum of one year and to be available for regulatory inspection. Webex retains CDRs in Control Hub Analytics, but AbhavTech additionally exports CDRs on a scheduled basis (monthly, per the audit evidence cadence in 4.3.7.4) via the Control Hub Analytics API or manual CSV export, and stores the export on-premises or in an AbhavTech-controlled storage location rather than relying solely on Cisco's cloud retention. This satisfies the OSP expectation that CDRs remain accessible to AbhavTech directly, independent of Webex platform availability, for the full one-year window.

#### 4.3.5.3 Audit Logging Requirements

Control Hub's Audit Log captures administrative actions -- Zone and Trusted Network Edge changes, user provisioning, trunk configuration changes, and license assignment -- and is accessible under Management -> Audit Log, with export available in CSV format. AbhavTech's compliance process (4.3.7.4) treats a monthly audit log export as part of the standard evidence package, retained for a minimum of three years to satisfy OSP audit expectations. Audit log access itself is restricted to administrators with the appropriate Control Hub role, and access to the exported logs is limited to the compliance and NOC teams responsible for India regulatory reporting.

### 4.3.6 Contact Center India Compliance

WxCC agents handling India-based interactions are subject to the same OSP and toll-bypass principles as Webex Calling users: agents assigned geographic DIDs or geographic-routed numbers inherit Zone restrictions based on their registered location, while agents using ITN-based access can work from anywhere within India without Zone/Trusted Network Edge configuration. AbhavTech's India WFH agent population (150 of the 175 total CC agents, per the project sizing) are provisioned on the ITN path specifically to support distributed, location-flexible remote work without triggering per-circle Zone administration overhead for each agent's home address. OSP's November 2020 liberalized guidelines remove the prior requirement for a static registered "principal place of business" per agent, which is what makes this WFH-at-scale model compliant.

### 4.3.7 India Compliance Validation Procedures

#### 4.3.7.1 Pre-Go-Live Compliance Checklist

```
+-----------------------------------------------------------------------------+
|              INDIA COMPLIANCE PRE-GO-LIVE CHECKLIST                          |
+-----------------------------------------------------------------------------+
|                                                                             |
|  CHECK                                | VALIDATION METHOD       | STATUS   |
|  -------------------------------------+-------------------------+----------|
|  [ ] Zones created per telecom circle  | Control Hub -> Zones     | ___      |
|  [ ] Trusted Network Edges configured  | Control Hub -> Edges     | ___      |
|  [ ] Locations assigned to Zones       | Location settings       | ___      |
|  [ ] LGW registered and online         | Trunk status = Online   | ___      |
|  [ ] PSTN routes per circle validated  | Test calls per LGW      | ___      |
|  [ ] Toll bypass blocking verified     | Cross-zone call test    | ___      |
|  [ ] ITN users have no Zone assigned   | User settings           | ___      |
|  [ ] CDR logging enabled               | Control Hub analytics   | ___      |
|  [ ] Audit logs accessible             | Audit log export test   | ___      |
|  -------------------------------------+-------------------------+----------|
|                                                                             |
|  SIGN-OFF: _________________ DATE: _____________                           |
|                                                                             |
+-----------------------------------------------------------------------------+
```

Each line item on the pre-go-live checklist is owned by a named role rather than left as a generic task: Zone and Trusted Network Edge creation is owned by the Network/Collaboration Engineer executing the cutover; LGW trunk registration and online-status verification is owned by the same engineer in coordination with the circle's PSTN carrier; toll-bypass and ITN-exemption validation is owned by the Compliance lead, who signs off only after reviewing the test call records in 4.3.7.2; and CDR/audit-log enablement verification is a joint Compliance/NOC sign-off. No circle is marked go-live ready until all checklist rows show a passing status and the Compliance lead has countersigned, consistent with AbhavTech's standard quality-over-speed delivery approach.

#### 4.3.7.2 Toll Bypass Prevention Test Procedures

```
+-----------------------------------------------------------------------------+
|              TOLL BYPASS PREVENTION TEST MATRIX                              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  TEST                           | EXPECTED RESULT      | PASS/FAIL         |
|  -------------------------------+----------------------+-------------------|
|  Mumbai user -> Mumbai PSTN      | [OK] Call completes    | ___               |
|  Mumbai user -> Chennai PSTN     | [OK] Via Mumbai LGW    | ___               |
|  Mumbai user roaming in Chennai | [X] PSTN BLOCKED      | ___               |
|       -> External PSTN           |    (toll bypass)     |                   |
|  Chennai user -> Chennai PSTN    | [OK] Call completes    | ___               |
|  ITN user anywhere -> PSTN       | [OK] Call completes    | ___               |
|  ITN user -> Webex User          | [OK] Call completes    | ___               |
|  -------------------------------+----------------------+-------------------|
|                                                                             |
|  [!]️ CRITICAL TEST: Roaming user MUST be blocked from PSTN calls           |
|     This proves toll bypass prevention is working                          |
|                                                                             |
+-----------------------------------------------------------------------------+
```

For each toll-bypass test case in the matrix above, the validation procedure is: (1) place the test call from the specified user/location combination; (2) capture a SIP trace on the relevant CUBE/LGW using `debug ccsip messages` or `voice iec syslog` to confirm whether the call was offered to the PSTN dial-peer at all; (3) for cases expected to be blocked, confirm Webex returned a SIP 403/488 rejection before the call ever reached the LGW dial-peer, rather than the LGW itself rejecting it -- this distinction matters because it confirms Webex's cloud-side Zone enforcement is the blocking mechanism, not a local CUBE access-list, which would be a weaker and more easily misconfigured control; (4) record the trace reference and result against the corresponding row of the test matrix as part of the audit evidence package.

#### 4.3.7.3 Zone-to-LGW Routing Validation

Routing validation confirms that calls placed by users in a given Zone egress exclusively through the LGW or CCPP trunk associated with that Zone, never through a trunk belonging to a different circle. This is verified by placing a test PSTN call from a representative user in each Zone and confirming, via Control Hub's Call Detail Records and the originating LGW's call logs, that the egress trunk matches the expected circle. Any call observed egressing through a mismatched trunk indicates a Zone-to-Trusted-Network-Edge misconfiguration and must be corrected before go-live, since it represents exactly the cross-circle toll-bypass scenario the Zone architecture exists to prevent.

#### 4.3.7.4 Compliance Audit Evidence Collection

```
+-----------------------------------------------------------------------------+
|              COMPLIANCE AUDIT EVIDENCE PACKAGE                               |
+-----------------------------------------------------------------------------+
|                                                                             |
|  DOCUMENT                            | SOURCE              | FREQUENCY     |
|  ------------------------------------+---------------------+---------------|
|  Zone Configuration Screenshot       | Control Hub         | Per change    |
|  Trusted Network Edge Config         | Control Hub         | Per change    |
|  LGW Certificate Documentation       | IOS-XE show cmds    | Per renewal   |
|  Trunk Status Report                 | Control Hub         | Weekly        |
|  CDR Export (Sample)                 | Control Hub         | Monthly       |
|  Audit Log Export                    | Control Hub         | Monthly       |
|  Test Call Records (Toll Bypass)     | Test documentation  | Per batch     |
|  User Location Assignment Report     | Control Hub export  | Per batch     |
|  ------------------------------------+---------------------+---------------|
|                                                                             |
|  RETENTION: Store evidence for minimum 3 years (OSP audit requirement)    |
|                                                                             |
+-----------------------------------------------------------------------------+
```

Compliance evidence is collected on the cadence shown in the table above (per-change, weekly, or monthly depending on artifact type) and stored in a centralized, access-controlled AbhavTech repository separate from Control Hub itself, so evidence remains available even if Control Hub access changes. Screenshots of Zone and Trusted Network Edge configuration are captured at the time of any change rather than reconstructed later. All evidence is retained for a minimum of three years to align with the OSP audit window referenced elsewhere in this chapter, and the Compliance lead is the designated owner for ensuring the evidence package stays current as circles are added or PSTN routing changes.

#### 4.3.7.5 Periodic Compliance Review Schedule

AbhavTech conducts a quarterly internal review of India PSTN compliance, re-running the toll-bypass test matrix (4.3.7.2) against current Zone/Trusted Network Edge configuration to catch drift introduced by office moves, new circle additions, or LGW hardware changes. An annual review additionally re-validates the full pre-go-live checklist (4.3.7.1) end-to-end and reconciles it against any DoT/TRAI regulatory guidance updates published in the preceding year. Both reviews are logged with date, reviewer, and findings, and feed into the same evidence package retained for audit purposes.

#### 4.3.7.6 Non-Compliance Remediation Procedures

If a toll-bypass or other India compliance violation is detected -- whether through the quarterly review, an automated alert, or an external report -- the Network/Collaboration Engineer on duty immediately suspends the affected Zone-to-Trunk routing or user assignment to stop the non-compliant call path, then escalates to the Compliance lead within the same business day. The Compliance lead determines whether the issue requires disclosure to DoT/TRAI based on severity and duration, documents the root cause and remediation in the evidence package, and the corrected configuration is re-validated against the test matrix before the affected Zone is returned to service.

---

## 4.4 EMEA Compliance

### 4.4.1 EMEA vs India - Key Difference

```
+-----------------------------------------------------------------------------+
|              EMEA vs INDIA COMPLIANCE - KEY DIFFERENCE                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  [!]️ CRITICAL DISTINCTION:                                                  |
|                                                                             |
|  INDIA COMPLIANCE = PSTN Routing Regulations (Toll Bypass)                 |
|  EMEA COMPLIANCE  = Data Residency & Privacy (GDPR)                        |
|                                                                             |
|  IMPACT ON ARCHITECTURE:                                                   |
|  =======================                                                   |
|                                                                             |
|  REQUIREMENT              | INDIA              | UK/EU                     |
|  -------------------------+--------------------+---------------------------|
|  Local Gateway Required   | Conditional*       | NO (Business choice)      |
|  Zone/Edge Configuration  | Conditional*       | NO                        |
|  CCPP Fully Compliant     | YES                | YES                       |
|  Geographic PSTN Egress   | MANDATORY          | NOT REQUIRED              |
|  Data Residency DC        | India (Mumbai + Chennai DCs)    | UK DC / EU DC             |
|  -------------------------+--------------------+---------------------------|
|                                                                             |
|  * India: Required only when using geographic DIDs, not for ITN numbers   |
|                                                                             |
|  UK/EU COMPLIANCE FOCUS:                                                   |
|  =======================                                                   |
|  - WHERE data is stored (Data Residency)                                  |
|  - HOW data is processed (GDPR)                                           |
|  - NOT about PSTN routing paths                                           |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.4.2 EU GDPR Compliance

```
+-----------------------------------------------------------------------------+
|              EU GDPR COMPLIANCE - WEBEX CALLING                              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  GDPR REQUIREMENT              | WEBEX IMPLEMENTATION                      |
|  ------------------------------+------------------------------------------|
|  Data Processing Lawfulness    | Contract basis for service delivery      |
|  Purpose Limitation            | Data used only for collaboration         |
|  Data Minimization             | Collect only necessary data              |
|  Accuracy                      | User can update profile in Webex App     |
|  Storage Limitation            | Configurable retention policies          |
|  Security                      | TLS/SRTP encryption, SOC2/ISO27001       |
|  ------------------------------+------------------------------------------|
|                                                                             |
|  DATA SUBJECT RIGHTS:                                                      |
|  ====================                                                      |
|  - Right to Access: Export via Control Hub                                |
|  - Right to Rectification: User profile updates                           |
|  - Right to Erasure: Data deletion upon request                           |
|  - Right to Portability: Data export in standard format                   |
|                                                                             |
|  PSTN IMPACT: NONE                                                         |
|  ==================                                                        |
|  GDPR does not impose PSTN routing requirements.                          |
|  CCPP is fully compliant for EU locations.                                |
|  LGW is optional (business choice only).                                  |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.4.3 UK Compliance (Post-Brexit)

```
+-----------------------------------------------------------------------------+
|              UK COMPLIANCE - POST-BREXIT                                     |
+-----------------------------------------------------------------------------+
|                                                                             |
|  REGULATION                    | REQUIREMENT                               |
|  ------------------------------+------------------------------------------|
|  UK GDPR                       | Similar to EU GDPR                        |
|  Data Protection Act 2018      | UK-specific data protection              |
|  Ofcom Regulations             | Telecom provider requirements            |
|  ------------------------------+------------------------------------------|
|                                                                             |
|  UK DATA RESIDENCY:                                                        |
|  ==================                                                        |
|  - Primary DC: London                                                      |
|  - Backup DC: Manchester (added October 2024)                             |
|  - Calling media and signaling remain within UK                           |
|  - Separate from EU region (post-Brexit)                                  |
|                                                                             |
|  OFCOM REQUIREMENTS (VoIP):                                                |
|  ==========================                                                |
|  - Emergency services access (999/112) - handled by CCPP provider         |
|  - CLI verification rules (2024) - prevent UK number spoofing             |
|  - Network resilience guidance                                             |
|                                                                             |
|  PSTN IMPACT: NONE                                                         |
|  ==================                                                        |
|  UK has NO requirement for Local Gateway.                                 |
|  CCPP (IntelePeer UK) is fully compliant.                                 |
|  Ofcom VoIP rules are handled by the CCPP provider.                       |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.4.4 German Compliance (BSI C5)

```
+-----------------------------------------------------------------------------+
|              GERMAN COMPLIANCE - BSI C5                                      |
+-----------------------------------------------------------------------------+
|                                                                             |
|  CERTIFICATION                 | STATUS                                    |
|  ------------------------------+------------------------------------------|
|  BSI C5 (Cloud Computing       | [OK] Attested (Webex Meetings/Teams)       |
|  Compliance Criteria Catalogue)|    Extended to Webex Calling             |
|  EU Cloud CoC Level 3          | [OK] Achieved (highest level)              |
|  ------------------------------+------------------------------------------|
|                                                                             |
|  C5 CONTROL AREAS (17 Domains, 114 Requirements):                         |
|  ================================================                          |
|  - Organization of Information Security                                    |
|  - Personnel Security                                                      |
|  - Asset Management                                                        |
|  - Physical Security                                                       |
|  - Operations Security                                                     |
|  - Identity & Access Management                                            |
|  - Cryptography & Key Management                                           |
|  - Communications Security                                                 |
|  - Portability & Interoperability                                         |
|  - Security Incident Management                                            |
|  - Business Continuity                                                     |
|  - Compliance                                                              |
|                                                                             |
|  BaFin REQUIREMENTS (if financial services):                              |
|  ============================================                              |
|  - BAIT (Banking IT Requirements) compliance                              |
|  - Outsourcing guidance documentation                                      |
|  - Applicable if Abhavtech serves financial clients from Germany          |
|                                                                             |
|  PSTN IMPACT: NONE                                                         |
|  ==================                                                        |
|  BSI C5 is about cloud security controls, not PSTN routing.              |
|  CCPP is fully compliant for German locations.                            |
|  LGW is optional (business choice only).                                  |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.4.5 EMEA Data Residency

```
+-----------------------------------------------------------------------------+
|              EMEA DATA RESIDENCY - WEBEX DATA CENTERS                        |
+-----------------------------------------------------------------------------+
|                                                                             |
|  REGION    | PRIMARY DC  | BACKUP DC   | DATA STORED                       |
|  ----------+-------------+-------------+-----------------------------------|
|  UK        | London      | Manchester  | User profiles, content, CDRs      |
|  EU        | Frankfurt   | Amsterdam   | User profiles, content, CDRs      |
|  ----------+-------------+-------------+-----------------------------------|
|                                                                             |
|  DATA TYPES STORED IN REGIONAL DC:                                         |
|  ==================================                                        |
|  [OK] User Profiles                                                          |
|  [OK] User-Generated Content (recordings, voicemails)                        |
|  [OK] Analytics and Troubleshooting Data                                     |
|  [OK] Billing and Operational Data                                           |
|  [OK] Call Detail Records (CDRs)                                             |
|                                                                             |
|  [!]️ UK and EU are SEPARATE Webex Calling regions post-Brexit              |
|     Calling Region is selected at provisioning and CANNOT be changed      |
|                                                                             |
|  WEBEX EU CERTIFICATIONS:                                                  |
|  =========================                                                 |
|  [OK] EU Cloud Code of Conduct - Level 3 (highest)                          |
|  [OK] German BSI C5 Attestation                                              |
|  [OK] EDPS approval (EU Court of Justice uses Webex)                        |
|  [OK] ISO 27001, ISO 27017, ISO 27018                                       |
|  [OK] SOC 2 Type II                                                          |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.4.6 When to Choose LGW in EMEA (Business Decision)

```
+-----------------------------------------------------------------------------+
|              LGW IN EMEA - BUSINESS CHOICE (NOT REGULATORY)                  |
+-----------------------------------------------------------------------------+
|                                                                             |
|  LGW in UK/EU is NEVER a regulatory requirement.                          |
|  It may be chosen for BUSINESS reasons:                                    |
|                                                                             |
|  REASON                        | DESCRIPTION                               |
|  ------------------------------+------------------------------------------|
|  Existing Carrier Contracts    | Keep BT, Vodafone, Deutsche Telekom      |
|  Favorable Per-Minute Rates    | High volume = lower cost with direct SIP |
|  Survivability                 | Local PSTN during cloud outage           |
|  PBX Integration               | Connect to on-prem CUCM during migration |
|  Specific Carrier Features     | Features not available via CCPP          |
|  ------------------------------+------------------------------------------|
|                                                                             |
|  ABHAVTECH EMEA DECISION: CCPP                                            |
|  ==============================                                            |
|  - No regulatory need for LGW                                             |
|  - Simplified operations preferred                                         |
|  - CCPP provides compliant PSTN                                           |
|  - Number porting from BT to IntelePeer                                   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 4.5 Americas Compliance

### 4.5.1 Standard Webex Calling Compliance

Webex Calling and Webex Contact Center carry SOC 2 Type II and ISO 27001/27017/27018 certification globally, including the Americas region serving AbhavTech's New Jersey and Dallas sites. Unlike India, the Americas have no toll-bypass or geographic-circle routing restriction, so PSTN connectivity (whether via Local Gateway or CCPP) is a pure business decision rather than a regulatory one, and Zone/Trusted Network Edge configuration is not required for compliance purposes in this region. Standard Webex security controls -- TLS/SRTP encryption, SOC 2 audit access, and the platform-wide ISO certifications -- apply uniformly without region-specific additions.

### 4.5.2 E911 Requirements

US federal law (Kari's Law and RAY BAUM'S Act) requires that 911 calls route directly without prefix and that a dispatchable location accurate enough for first responders be transmitted with the call. In Webex Calling, this is configured per-user or per-location under Control Hub's Emergency Calling settings, where each New Jersey and Dallas user or shared workspace is assigned a Civic Address or, for larger floors, more granular Emergency Location Identification Numbers (ELINs) tied to specific building zones. AbhavTech validates dispatchable location accuracy as part of US site cutover testing, placing a supervised test call to confirm the address transmitted to the Public Safety Answering Point matches the user's actual physical location, particularly important for remote/WFH agents whose location can change.

---

## 4.6 Recording & Consent by Region

### 4.6.1 India Recording Requirements

India does not impose a specific two-party consent requirement for contact center call recording in the way GDPR-influenced jurisdictions do, but OSP guidelines require that recorded interactions be retained and made available for regulatory inspection, consistent with the CDR retention rules described in 4.3.5.2. AbhavTech's WxCC deployment plays a recording disclosure announcement at the start of India-based customer interactions as a standard consumer-protection practice, and recordings are retained under the same one-year minimum window and audit-evidence handling as CDRs.

### 4.6.2 UK/EU Recording (GDPR Consent)

UK and EU call recording falls under GDPR's lawful-basis and transparency requirements rather than a strict "two-party consent" statute in the US sense, but in practice achieves a similar outcome: callers must be informed that the call may be recorded before recording begins, typically via an IVR announcement at the start of the interaction, and the recording's purpose (quality assurance, training, dispute resolution) must be disclosed. AbhavTech's UK and EU WxCC flows play a recording announcement before connecting to an agent, and recorded data is subject to the same GDPR data-subject rights (access, erasure, portability) described in 4.4.2.

### 4.6.3 US Recording Requirements

US call recording consent requirements vary by state: most states are "one-party consent," meaning only one participant (which can be AbhavTech itself, as the entity controlling the recording) needs to consent, while a minority of states -- including California, Florida, and Pennsylvania -- require all-party consent. Because Webex Contact Center cannot reliably determine which state a calling customer is physically located in at the time of the call, AbhavTech's standard practice is to play a recording disclosure announcement on all US-bound interactions regardless of the caller's state, which satisfies the stricter all-party-consent states and is unnecessary but harmless in one-party states.

---

