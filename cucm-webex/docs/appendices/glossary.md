# Appendices: Templates, Checklists & Reference Materials 

> **Document Reference:** ABV-COLLAB-MIG-2026 | Appendices
> **Cross-References:** All Chapters
> **Style:** Templates & Checklists (Sonnet 4.5)

---

## Appendix Directory

| Appendix | Title | Purpose |
|----------|-------|---------|
| **A** | Information Gathering Sheet | Pre-provisioning data collection |
| **B** | Pre-Implementation Checklist | Vendor, technical, resource readiness |
| **C** | Detailed Test Case Scenarios | Comprehensive validation testing |
| **D** | Performance Baseline Template | Quality metrics tracking |
| **E** | Operational Readiness Review (ORR) | Go-live gate checklist |
| **F** | Go/No-Go Decision Template | Executive sign-off |
| **G** | Hypercare Runbook | Post-cutover support |
| **H** | Handover Meeting Agenda | Knowledge transfer |
| **I** | India Compliance Audit Template | DoT/TRAI validation |
| **J** | Emergency Contacts & Escalation | Quick reference |

---

## Appendix A: Information Gathering Sheet 

## A.1 Organization Details

```
+-----------------------------------------------------------------+
|  ABHAVTECH - PROVISIONING INFORMATION SHEET                      |
|  Complete before starting any provisioning activities            |
+-----------------------------------------------------------------+
|                                                                 |
|  ORGANIZATION DETAILS                                          |
|  ===================                                           |
|  Legal Name: Abhavtech Private Limited                         |
|  Primary Domain: abhavtech.com                                 |
|  Country: India (HQ)                                           |
|  Industry: AI Technology                                       |
|                                                                 |
|  PRIMARY CONTACTS                                              |
|  ================                                              |
|  Project Sponsor: _______________________                      |
|  Project Manager: _______________________                      |
|  Technical Lead: ________________________                      |
|  Voice Engineering Lead: ________________                      |
|  Network Lead: __________________________                      |
|  Security Lead: _________________________                      |
|  Telecom Lead: __________________________                      |
|                                                                 |
|  CONTACT INFORMATION                                           |
|  ===================                                           |
|  PM Email: ______________________________                      |
|  PM Phone: ______________________________                      |
|  Technical Lead Email: __________________                      |
|  Technical Lead Phone: __________________                      |
|  Emergency Contact (24x7): ______________                      |
|                                                                 |
+-----------------------------------------------------------------+
```

## A.2 Webex Tenant Information

```
+-----------------------------------------------------------------+
|  WEBEX TENANT DETAILS                                            |
+-----------------------------------------------------------------+
|                                                                 |
|  Organization ID: ________________________                     |
|  Control Hub URL: admin.webex.com                              |
|  Home Region: APAC                                             |
|  Partner Name: __________________________                      |
|  Partner Contact: _______________________                      |
|                                                                 |
|  LICENSES ORDERED                                              |
|  ================                                              |
|  Webex Calling Professional: 3,200                             |
|  Webex Calling Common Area: 50                                 |
|  Contract Start Date: ___________________                      |
|  Contract End Date: _____________________                      |
|  License Order Confirmation #: __________                      |
|                                                                 |
|  ADMIN ACCOUNTS (Initial)                                      |
|  ========================                                      |
|  Full Admin 1: __________________________                      |
|  Full Admin 2: __________________________                      |
|  Full Admin 3: __________________________                      |
|                                                                 |
+-----------------------------------------------------------------+
```

## A.3 PSTN Details by Region

```
+-----------------------------------------------------------------+
|  PSTN CONFIGURATION DETAILS                                      |
+-----------------------------------------------------------------+
|                                                                 |
|  INDIA (Local Gateway)                                         |
|  =====================                                         |
|  Primary PSTN Provider: Tata Teleservices                      |
|  Secondary Provider: Airtel                                    |
|  Account Manager: _______________________                      |
|  Support Contact: _______________________                      |
|  SIP Trunk Credentials Received: [ ] Yes  [ ] No               |
|                                                                 |
|  DID Ranges:                                                   |
|  Mumbai: +91-22-4960-XXXX (Qty: _______)                       |
|  Chennai: +91-44-6XXX-XXXX (Qty: _______)                      |
|  Bangalore: +91-80-6XXX-XXXX (Qty: _______)                    |
|  Delhi: +91-11-6XXX-XXXX (Qty: _______)                        |
|  Noida: +91-120-6XXX-XXXX (Qty: _______)                       |
|  Hyderabad: +91-40-6XXX-XXXX (Qty: _______)                    |
|                                                                 |
|  EMEA & AMERICAS (Cloud Connected PSTN)                        |
|  ======================================                        |
|  CCPP Provider: IntelePeer                                     |
|  Account Manager: _______________________                      |
|  Support Contact: _______________________                      |
|  Provider Portal URL: ___________________                      |
|                                                                 |
|  DID Ranges:                                                   |
|  UK (London): +44-20-XXXX-XXXX (Qty: _______)                  |
|  Germany (Frankfurt): +49-69-XXXX-XXXX (Qty: _______)          |
|  US (New Jersey): +1-201-XXX-XXXX (Qty: _______)               |
|  US (Dallas): +1-214-XXX-XXXX (Qty: _______)                   |
|                                                                 |
|  NUMBER PORTING                                                |
|  ==============                                                |
|  Numbers to Port: _______ (total count)                        |
|  Porting Request Submitted: [ ] Yes  [ ] No                    |
|  Porting Date Confirmed: _______________                       |
|  LOA Signed: [ ] Yes  [ ] No                                   |
|                                                                 |
+-----------------------------------------------------------------+
```

## A.4 Identity & Directory Information

```
+-----------------------------------------------------------------+
|  IDENTITY PROVIDER DETAILS                                       |
+-----------------------------------------------------------------+
|                                                                 |
|  AZURE AD / IDENTITY PROVIDER                                  |
|  ============================                                  |
|  IdP Type: Azure AD / Okta / Other: __________                 |
|  Tenant ID: _____________________________                      |
|  Primary Domain: ________________________                      |
|                                                                 |
|  SSO CONFIGURATION                                             |
|  =================                                             |
|  SAML Entity ID: ________________________                      |
|  ACS URL: _______________________________                      |
|  IdP Metadata URL: ______________________                      |
|  SSO Admin Contact: _____________________                      |
|                                                                 |
|  SCIM PROVISIONING                                             |
|  =================                                             |
|  SCIM Endpoint: _________________________                      |
|  Bearer Token Generated: [ ] Yes  [ ] No                       |
|  Sync Scope (OU/Groups): ________________                      |
|                                                                 |
|  USER POPULATION                                               |
|  ===============                                               |
|  Total Users in Directory: ______________                      |
|  Users for Webex Calling: 3,200                                |
|  User Export Completed: [ ] Yes  [ ] No                        |
|                                                                 |
+-----------------------------------------------------------------+
```

## A.5 Network Information

```
+-----------------------------------------------------------------+
|  NETWORK DETAILS                                                 |
+-----------------------------------------------------------------+
|                                                                 |
|  INTERNAL DNS SERVERS                                          |
|  ====================                                          |
|  Primary DNS: ___________________ (IP: _______________)        |
|  Secondary DNS: _________________ (IP: _______________)        |
|  DNS Admin Contact: _____________________________              |
|                                                                 |
|  FIREWALL                                                      |
|  ========                                                      |
|  Firewall Type: Palo Alto / Cisco FTD / Other: ______         |
|  Firewall Admin Contact: ________________________              |
|  Change Request Process: ________________________              |
|  SSL Inspection: Enabled / Disabled                            |
|  Webex Bypass Configured: [ ] Yes  [ ] No                      |
|                                                                 |
|  VOICE VLAN                                                    |
|  ==========                                                    |
|  Voice VLAN ID: ____________                                   |
|  Voice Subnet: ______________                                  |
|  DHCP Scope: ________________                                  |
|                                                                 |
|  QoS                                                           |
|  ===                                                           |
|  QoS Policy Exists: [ ] Yes  [ ] No                            |
|  Voice DSCP: EF (46)                                           |
|  Video DSCP: AF41 (34)                                         |
|  Signaling DSCP: CS3 (24)                                      |
|                                                                 |
|  SD-WAN (Reference: ABV-SDWAN-2024)                            |
|  ==================================                            |
|  SD-WAN Platform: Cisco Viptela                                |
|  SD-WAN Admin Contact: ______________________                  |
|  Voice Policy Configured: [ ] Yes  [ ] No                      |
|                                                                 |
+-----------------------------------------------------------------+
```

## A.6 CUCM Current Environment

```
+-----------------------------------------------------------------+
|  CUCM ENVIRONMENT DETAILS                                        |
+-----------------------------------------------------------------+
|                                                                 |
|  CLUSTER INFORMATION                                           |
|  ===================                                           |
|  CUCM Version: ___________________                             |
|  Publisher FQDN: _________________                             |
|  Publisher IP: ___________________                             |
|  Subscriber 1 FQDN: ______________                             |
|  Subscriber 2 FQDN: ______________                             |
|                                                                 |
|  CURRENT INVENTORY                                             |
|  =================                                             |
|  Total Registered Phones: __________                           |
|  Total Users: _____________________                            |
|  Total DNs: _______________________                            |
|  Total DIDs: ______________________                            |
|                                                                 |
|  FEATURES IN USE                                               |
|  ===============                                               |
|  Hunt Groups: _________                                        |
|  Call Pickup Groups: __________                                |
|  Call Park Slots: _____________                                |
|  Auto Attendants: _____________                                |
|  Shared Lines: ________________                                |
|                                                                 |
|  VOICEMAIL                                                     |
|  =========                                                     |
|  Unity Connection Version: _____________                       |
|  Unity FQDN: __________________________                        |
|  Total Mailboxes: _____________________                        |
|                                                                 |
|  DATA EXPORT COMPLETED                                         |
|  =====================                                         |
|  Phones Export: [ ] Yes  [ ] No                                |
|  Users Export: [ ] Yes  [ ] No                                 |
|  Hunt Groups Export: [ ] Yes  [ ] No                           |
|  Speed Dials Export: [ ] Yes  [ ] No                           |
|  Call Forwards Export: [ ] Yes  [ ] No                         |
|                                                                 |
+-----------------------------------------------------------------+
```

---

## Appendix B: Pre-Implementation Checklist 

## B.1 Vendor & Contract Readiness

| Item | Owner | Due Date | Status | Notes |
|------|-------|----------|--------|-------|
| **Cisco/Partner Contract Signed** | Procurement | | [ ] | Webex Calling licenses |
| **License Order Confirmed** | Procurement | | [ ] | 3,200 Professional |
| **CCPP Agreement (IntelePeer)** | Telecom | | [ ] | EMEA & Americas PSTN |
| **Tata Teleservices Contract** | Telecom | | [ ] | India PSTN primary |
| **Airtel Contract (Backup)** | Telecom | | [ ] | India PSTN secondary |
| **Support Contract Active** | Procurement | | [ ] | Cisco TAC access |
| **Partner SOW Signed** | PMO | | [ ] | Implementation services |

## B.2 Technical Readiness

| Item | Owner | Due Date | Status | Notes |
|------|-------|----------|--------|-------|
| **Network Assessment Complete** | Network | | [ ] | Bandwidth, latency |
| **Firewall Rules Approved** | Security | | [ ] | Per Chapter 5 |
| **Firewall Rules Deployed** | Network | | [ ] | All sites |
| **SSL Inspection Bypass** | Security | | [ ] | Webex domains |
| **DNS Forwarders Configured** | Network | | [ ] | Per Chapter 5 |
| **QoS Policy Verified** | Network | | [ ] | Voice priority |
| **Voice VLAN Ready** | Network | | [ ] | All sites |
| **LGW Hardware Procured** | Procurement | | [ ] | India sites (7 units) |
| **LGW IOS-XE Licensed** | Network | | [ ] | CUBE features |
| **LGW Rack Space Ready** | Facilities | | [ ] | India sites |

## B.3 Identity & Access Readiness

| Item | Owner | Due Date | Status | Notes |
|------|-------|----------|--------|-------|
| **Azure AD Tenant Accessible** | Identity | | [ ] | Admin access |
| **SSO App Created** | Identity | | [ ] | Cisco Webex enterprise app |
| **SAML Metadata Exchanged** | Identity | | [ ] | IdP <-> Webex |
| **SCIM Provisioning Tested** | Identity | | [ ] | User sync working |
| **MFA Configured** | Identity | | [ ] | For admins |
| **User Population Identified** | HR/IT | | [ ] | 3,200 users |
| **User Export Available** | HR/IT | | [ ] | CSV ready |

## B.4 CUCM Readiness

| Item | Owner | Due Date | Status | Notes |
|------|-------|----------|--------|-------|
| **CUCM Data Export Complete** | Voice Eng | | [ ] | Phones, users, features |
| **User Mapping Spreadsheet** | Voice Eng | | [ ] | CUCM -> Webex |
| **Feature Inventory Documented** | Voice Eng | | [ ] | HG, AA, Pickup |
| **Coexistence Trunk Designed** | Voice Eng | | [ ] | CUBE config ready |
| **Coexistence Trunk Tested** | Voice Eng | | [ ] | Bidirectional calls |
| **Configuration Freeze Planned** | Voice Eng | | [ ] | 48 hrs before cutover |
| **DRS Backup Taken** | Voice Eng | | [ ] | Full cluster backup |

## B.5 Resource Readiness

| Item | Owner | Due Date | Status | Notes |
|------|-------|----------|--------|-------|
| **Project Team Assigned** | PMO | | [ ] | All roles filled |
| **Training Schedule Finalized** | Training | | [ ] | Agent + admin training |
| **Training Materials Ready** | Training | | [ ] | Guides, videos |
| **Help Desk Briefed** | Help Desk | | [ ] | L1 support ready |
| **Communication Plan Approved** | PMO | | [ ] | User notifications |
| **War Room Booked** | PMO | | [ ] | Cutover location |
| **Bridge Line Reserved** | PMO | | [ ] | Cutover communication |

## B.6 Compliance & Security Readiness

| Item | Owner | Due Date | Status | Notes |
|------|-------|----------|--------|-------|
| **Security Review Complete** | Security | | [ ] | Architecture approved |
| **India DoT Compliance Verified** | Compliance | | [ ] | OSP registration valid |
| **GDPR Assessment Complete** | Compliance | | [ ] | EMEA data handling |
| **Data Residency Confirmed** | Compliance | | [ ] | Regional DCs assigned |
| **Recording Policy Approved** | Legal | | [ ] | Consent requirements |
| **E911 Configuration Designed** | Voice Eng | | [ ] | US sites |
| **Emergency Routing Designed** | Voice Eng | | [ ] | India 112 routing |

---

## Appendix C: Detailed Test Case Scenarios 

## C.1 Voice Call Test Cases

### Test Case V-01: Internal Call (Same Site)

```
+-----------------------------------------------------------------+
|  TEST CASE V-01: INTERNAL CALL - SAME SITE                       |
+-----------------------------------------------------------------+
|                                                                 |
|  Objective: Verify extension-to-extension calling within site  |
|  Prerequisites: Both users migrated to Webex, phones online    |
|                                                                 |
|  TEST STEPS:                                                   |
|  -----------                                                    |
|  [ ] 1. User A (Ext 1001) picks up handset                     |
|  [ ] 2. User A dials extension 1002                            |
|  [ ] 3. Verify dial tone heard                                 |
|  [ ] 4. Verify ringback tone heard                             |
|  [ ] 5. User B (Ext 1002) phone rings                          |
|  [ ] 6. User B answers call                                    |
|  [ ] 7. Verify two-way audio (both parties hear each other)    |
|  [ ] 8. Verify no echo or distortion                           |
|  [ ] 9. Verify caller ID shows "User A - 1001"                 |
|  [ ] 10. Either party hangs up                                 |
|  [ ] 11. Verify call ends cleanly                              |
|  [ ] 12. Verify call appears in call history (both users)      |
|                                                                 |
|  EXPECTED RESULTS:                                             |
|  ----------------                                               |
|  * Call setup time: <3 seconds                                 |
|  * Audio quality: MOS >4.0                                     |
|  * Caller ID: Displayed correctly                              |
|  * Call history: Recorded in Control Hub                       |
|                                                                 |
|  ACTUAL RESULTS:                                               |
|  ---------------                                                |
|  Call Setup Time: _______ seconds                              |
|  Audio Quality: Excellent / Good / Fair / Poor                 |
|  Caller ID Correct: [ ] Yes  [ ] No                            |
|  Call History Logged: [ ] Yes  [ ] No                          |
|                                                                 |
|  STATUS: [ ] PASS  [ ] FAIL  [ ] BLOCKED                       |
|  Tester: _________________ Date: ___________                   |
|  Notes: _______________________________________________        |
|                                                                 |
+-----------------------------------------------------------------+
```

### Test Case V-02: Internal Call (Cross-Site)

```
+-----------------------------------------------------------------+
|  TEST CASE V-02: INTERNAL CALL - CROSS SITE                      |
+-----------------------------------------------------------------+
|                                                                 |
|  Objective: Verify extension calling between different sites   |
|  Prerequisites: Users at different sites migrated to Webex     |
|                                                                 |
|  TEST STEPS:                                                   |
|  -----------                                                    |
|  [ ] 1. User A (Mumbai - Ext 1001) dials Chennai Ext 2001      |
|  [ ] 2. Verify call routes correctly (not via PSTN)            |
|  [ ] 3. User B (Chennai - Ext 2001) phone rings                |
|  [ ] 4. User B answers call                                    |
|  [ ] 5. Verify two-way audio                                   |
|  [ ] 6. Verify audio quality acceptable (cross-WAN)            |
|  [ ] 7. Verify caller ID shows Mumbai user info                |
|  [ ] 8. Call ends cleanly                                      |
|                                                                 |
|  EXPECTED RESULTS:                                             |
|  ----------------                                               |
|  * Call routes via Webex cloud (not PSTN)                      |
|  * Audio quality: MOS >3.8 (cross-site tolerance)              |
|  * No PSTN charges incurred                                    |
|                                                                 |
|  STATUS: [ ] PASS  [ ] FAIL  [ ] BLOCKED                       |
|  Tester: _________________ Date: ___________                   |
|                                                                 |
+-----------------------------------------------------------------+
```

### Test Case V-03: Coexistence Call (Webex to CUCM)

```
+-----------------------------------------------------------------+
|  TEST CASE V-03: COEXISTENCE - WEBEX TO CUCM                     |
+-----------------------------------------------------------------+
|                                                                 |
|  Objective: Verify migrated users can call non-migrated users  |
|  Prerequisites: Coexistence trunk configured and active        |
|                                                                 |
|  TEST STEPS:                                                   |
|  -----------                                                    |
|  [ ] 1. Webex user (Ext 1001) dials CUCM user (Ext 3001)       |
|  [ ] 2. Verify call routes via CUBE trunk                      |
|  [ ] 3. CUCM phone rings                                       |
|  [ ] 4. CUCM user answers                                      |
|  [ ] 5. Verify two-way audio                                   |
|  [ ] 6. Verify caller ID displays correctly on CUCM phone      |
|  [ ] 7. Test transfer from CUCM user to another CUCM user      |
|  [ ] 8. Test transfer from CUCM user back to Webex user        |
|  [ ] 9. Call ends cleanly                                      |
|                                                                 |
|  EXPECTED RESULTS:                                             |
|  ----------------                                               |
|  * Seamless calling between platforms                          |
|  * Caller ID preserved across platforms                        |
|  * Transfer works in both directions                           |
|                                                                 |
|  STATUS: [ ] PASS  [ ] FAIL  [ ] BLOCKED                       |
|  Tester: _________________ Date: ___________                   |
|                                                                 |
+-----------------------------------------------------------------+
```

### Test Case V-04: PSTN Outbound (India - Toll Bypass Validation)

```
+-----------------------------------------------------------------+
|  TEST CASE V-04: PSTN OUTBOUND - INDIA TOLL BYPASS               |
+-----------------------------------------------------------------+
|                                                                 |
|  Objective: Verify PSTN calls route via correct LGW per zone   |
|  Prerequisites: Zone configuration complete, LGWs registered   |
|                                                                 |
|  TEST STEPS (INTRA-CIRCLE - COMPLIANT):                        |
|  --------------------------------------                         |
|  [ ] 1. Mumbai user (Zone: Mumbai) dials Mumbai PSTN number    |
|  [ ] 2. Verify call routes via LGW-Mumbai (not other LGW)      |
|  [ ] 3. Check LGW logs: show call active voice brief           |
|  [ ] 4. Verify call connects                                   |
|  [ ] 5. Verify audio quality                                   |
|  [ ] 6. Verify CDR shows Mumbai LGW                            |
|                                                                 |
|  TEST STEPS (INTER-CIRCLE - COMPLIANT):                        |
|  --------------------------------------                         |
|  [ ] 7. Mumbai user dials Delhi PSTN number                    |
|  [ ] 8. Verify call routes via LGW-Mumbai (NOT LGW-Delhi)      |
|  [ ] 9. This is CORRECT - call originates from Mumbai circle   |
|  [ ] 10. Verify CDR shows Mumbai LGW                           |
|                                                                 |
|  COMPLIANCE CHECK:                                             |
|  -----------------                                              |
|  [ ] All India PSTN calls egress from user's assigned Zone     |
|  [ ] No toll bypass violation (call doesn't hop circles)       |
|  [ ] CDR matches expected routing                              |
|                                                                 |
|  STATUS: [ ] PASS  [ ] FAIL  [ ] BLOCKED                       |
|  Tester: _________________ Date: ___________                   |
|  Compliance Officer Sign-off: _____________                    |
|                                                                 |
+-----------------------------------------------------------------+
```

### Test Case V-05: PSTN Outbound (EMEA/Americas via CCPP)

```
+-----------------------------------------------------------------+
|  TEST CASE V-05: PSTN OUTBOUND - CCPP                            |
+-----------------------------------------------------------------+
|                                                                 |
|  Objective: Verify PSTN calls via Cloud Connected PSTN         |
|  Prerequisites: CCPP trunk active, DIDs assigned               |
|                                                                 |
|  TEST STEPS:                                                   |
|  -----------                                                    |
|  [ ] 1. London user dials UK mobile number                     |
|  [ ] 2. Verify call routes via IntelePeer (CCPP)               |
|  [ ] 3. Verify call connects                                   |
|  [ ] 4. Verify outbound caller ID shows user's DID             |
|  [ ] 5. Verify audio quality                                   |
|  [ ] 6. Repeat for Frankfurt user (EU PSTN)                    |
|  [ ] 7. Repeat for New Jersey user (US PSTN)                   |
|  [ ] 8. Repeat for Dallas user (US PSTN)                       |
|                                                                 |
|  CALLER ID VERIFICATION:                                       |
|  -----------------------                                        |
|  [ ] UK: Shows +44-20-XXXX-XXXX                                |
|  [ ] Germany: Shows +49-69-XXXX-XXXX                           |
|  [ ] US: Shows +1-XXX-XXX-XXXX                                 |
|  [ ] STIR/SHAKEN attestation: A (full)                         |
|                                                                 |
|  STATUS: [ ] PASS  [ ] FAIL  [ ] BLOCKED                       |
|  Tester: _________________ Date: ___________                   |
|                                                                 |
+-----------------------------------------------------------------+
```

### Test Case V-06: PSTN Inbound (DID to User)

```
+-----------------------------------------------------------------+
|  TEST CASE V-06: PSTN INBOUND - DID                              |
+-----------------------------------------------------------------+
|                                                                 |
|  Objective: Verify inbound PSTN calls reach correct user       |
|  Prerequisites: DIDs assigned to users, porting complete       |
|                                                                 |
|  TEST STEPS:                                                   |
|  -----------                                                    |
|  [ ] 1. From external phone, dial user's DID                   |
|  [ ] 2. Verify call reaches Webex user's phone                 |
|  [ ] 3. Verify caller ID shows external caller's number        |
|  [ ] 4. User answers call                                      |
|  [ ] 5. Verify two-way audio                                   |
|  [ ] 6. User hangs up                                          |
|  [ ] 7. Call again - let it ring to voicemail                  |
|  [ ] 8. Verify voicemail records message                       |
|  [ ] 9. Verify MWI (message waiting indicator) lights          |
|  [ ] 10. Verify email notification received                    |
|                                                                 |
|  REGIONAL TESTS:                                               |
|  ---------------                                                |
|  [ ] India DID: +91-22-4960-XXXX -> Mumbai user                 |
|  [ ] UK DID: +44-20-XXXX-XXXX -> London user                    |
|  [ ] Germany DID: +49-69-XXXX-XXXX -> Frankfurt user            |
|  [ ] US DID: +1-201-XXX-XXXX -> New Jersey user                 |
|                                                                 |
|  STATUS: [ ] PASS  [ ] FAIL  [ ] BLOCKED                       |
|  Tester: _________________ Date: ___________                   |
|                                                                 |
+-----------------------------------------------------------------+
```

### Test Case V-07: Emergency Calling (112/999/911)

```
+-----------------------------------------------------------------+
|  TEST CASE V-07: EMERGENCY CALLING                               |
+-----------------------------------------------------------------+
|                                                                 |
|  [!]️  WARNING: DO NOT DIAL REAL EMERGENCY NUMBERS FOR TESTING    |
|  Use test numbers provided by carrier or coordinate with PSAP  |
|                                                                 |
|  Objective: Verify emergency calls route correctly             |
|  Prerequisites: Emergency routing configured, test coordinated |
|                                                                 |
|  INDIA (112) - Via Local Gateway:                              |
|  --------------------------------                               |
|  [ ] 1. Mumbai user dials 112                                  |
|  [ ] 2. Verify routes via LGW-Mumbai                           |
|  [ ] 3. Verify callback number transmitted                     |
|  [ ] 4. Verify location information (if configured)            |
|                                                                 |
|  UK (999) - Via CCPP:                                          |
|  --------------------                                           |
|  [ ] 5. London user dials 999                                  |
|  [ ] 6. Verify routes via IntelePeer                           |
|  [ ] 7. Verify callback number transmitted                     |
|                                                                 |
|  US (911) - Kari's Law / RAY BAUM's Act:                       |
|  ----------------------------------------                       |
|  [ ] 8. New Jersey user dials 911                              |
|  [ ] 9. Verify direct dial (no prefix required)                |
|  [ ] 10. Verify security desk notification triggered           |
|  [ ] 11. Verify dispatchable location transmitted              |
|       (Street address + floor/room)                            |
|  [ ] 12. Verify callback number transmitted                    |
|                                                                 |
|  NOTIFICATIONS VERIFIED:                                       |
|  -----------------------                                        |
|  [ ] Email to security team                                    |
|  [ ] On-screen notification (if configured)                    |
|                                                                 |
|  STATUS: [ ] PASS  [ ] FAIL  [ ] BLOCKED                       |
|  Tester: _________________ Date: ___________                   |
|  Compliance Sign-off: _____________________                    |
|                                                                 |
+-----------------------------------------------------------------+
```

## C.2 Feature Test Cases

### Test Case F-01: Hunt Group

```
+-----------------------------------------------------------------+
|  TEST CASE F-01: HUNT GROUP                                      |
+-----------------------------------------------------------------+
|                                                                 |
|  Objective: Verify hunt group call distribution                |
|  Prerequisites: Hunt group configured with 4 members           |
|                                                                 |
|  TEST STEPS:                                                   |
|  -----------                                                    |
|  [ ] 1. Call hunt group pilot number                           |
|  [ ] 2. Verify call rings Member 1 first (circular)            |
|  [ ] 3. Member 1 does not answer (20 sec timeout)              |
|  [ ] 4. Verify call rolls to Member 2                          |
|  [ ] 5. Member 2 answers call                                  |
|  [ ] 6. Verify two-way audio                                   |
|  [ ] 7. End call                                               |
|  [ ] 8. Call again - verify starts with Member 2 (next in line)|
|  [ ] 9. Test with all members busy - verify overflow action    |
|  [ ] 10. Verify hunt group stats in Control Hub                |
|                                                                 |
|  DISTRIBUTION TESTS:                                           |
|  -------------------                                            |
|  [ ] Circular: Rotates through members                         |
|  [ ] Top Down: Always starts with first member                 |
|  [ ] Longest Idle: Goes to most available agent                |
|  [ ] Simultaneous: All ring at once                            |
|                                                                 |
|  STATUS: [ ] PASS  [ ] FAIL  [ ] BLOCKED                       |
|  Tester: _________________ Date: ___________                   |
|                                                                 |
+-----------------------------------------------------------------+
```

### Test Case F-02: Auto Attendant

```
+-----------------------------------------------------------------+
|  TEST CASE F-02: AUTO ATTENDANT                                  |
+-----------------------------------------------------------------+
|                                                                 |
|  Objective: Verify IVR menu and routing                        |
|  Prerequisites: AA configured with menu options                |
|                                                                 |
|  TEST STEPS:                                                   |
|  -----------                                                    |
|  [ ] 1. Call Auto Attendant main number                        |
|  [ ] 2. Verify welcome greeting plays                          |
|  [ ] 3. Verify menu options announced                          |
|  [ ] 4. Press 1 - verify transfers to Sales                    |
|  [ ] 5. Call again, Press 2 - verify transfers to Support      |
|  [ ] 6. Call again, Press 3 - verify transfers to HR           |
|  [ ] 7. Call again, Press 0 - verify transfers to Operator     |
|  [ ] 8. Call again, Press # - verify menu repeats              |
|  [ ] 9. Call again, wait (no input) - verify timeout action    |
|  [ ] 10. Call again, press invalid key - verify error handling |
|                                                                 |
|  AFTER HOURS TEST:                                             |
|  -----------------                                              |
|  [ ] 11. Call outside business hours                           |
|  [ ] 12. Verify after-hours greeting plays                     |
|  [ ] 13. Verify after-hours routing works                      |
|                                                                 |
|  STATUS: [ ] PASS  [ ] FAIL  [ ] BLOCKED                       |
|  Tester: _________________ Date: ___________                   |
|                                                                 |
+-----------------------------------------------------------------+
```

### Test Case F-03: Voicemail

```
+-----------------------------------------------------------------+
|  TEST CASE F-03: VOICEMAIL                                       |
+-----------------------------------------------------------------+
|                                                                 |
|  Objective: Verify voicemail deposit and retrieval             |
|  Prerequisites: Voicemail enabled for user                     |
|                                                                 |
|  TEST STEPS - DEPOSIT:                                         |
|  ---------------------                                          |
|  [ ] 1. Call user's extension                                  |
|  [ ] 2. Let phone ring (don't answer)                          |
|  [ ] 3. Verify call forwards to voicemail after X rings        |
|  [ ] 4. Verify greeting plays                                  |
|  [ ] 5. Leave message (include date/time in message)           |
|  [ ] 6. Hang up                                                |
|  [ ] 7. Verify MWI light illuminates on phone                  |
|  [ ] 8. Verify email notification received (if enabled)        |
|  [ ] 9. Verify voicemail transcription (if enabled)            |
|                                                                 |
|  TEST STEPS - RETRIEVAL:                                       |
|  ------------------------                                       |
|  [ ] 10. Press voicemail button on phone                       |
|  [ ] 11. Enter PIN when prompted                               |
|  [ ] 12. Listen to new message                                 |
|  [ ] 13. Verify message content (date/time correct)            |
|  [ ] 14. Delete message                                        |
|  [ ] 15. Verify MWI light turns off                            |
|                                                                 |
|  TEST STEPS - WEB ACCESS:                                      |
|  ------------------------                                       |
|  [ ] 16. Login to settings.webex.com                           |
|  [ ] 17. Navigate to voicemail                                 |
|  [ ] 18. Verify messages listed                                |
|  [ ] 19. Play message from web                                 |
|  [ ] 20. Delete message from web                               |
|                                                                 |
|  STATUS: [ ] PASS  [ ] FAIL  [ ] BLOCKED                       |
|  Tester: _________________ Date: ___________                   |
|                                                                 |
+-----------------------------------------------------------------+
```

### Test Case F-04: Call Forward

```
+-----------------------------------------------------------------+
|  TEST CASE F-04: CALL FORWARDING                                 |
+-----------------------------------------------------------------+
|                                                                 |
|  Objective: Verify all call forward scenarios                  |
|  Prerequisites: User with call forward permissions             |
|                                                                 |
|  TEST STEPS - FORWARD ALL:                                     |
|  -------------------------                                      |
|  [ ] 1. Enable "Forward All Calls" to extension 1050           |
|  [ ] 2. Call user's extension                                  |
|  [ ] 3. Verify call immediately forwards to 1050               |
|  [ ] 4. Verify caller ID shows original caller                 |
|  [ ] 5. Disable forward all                                    |
|                                                                 |
|  TEST STEPS - FORWARD BUSY:                                    |
|  --------------------------                                     |
|  [ ] 6. Enable "Forward When Busy" to extension 1050           |
|  [ ] 7. Place user on an active call (make them busy)          |
|  [ ] 8. Call user's extension from another phone               |
|  [ ] 9. Verify call forwards to 1050                           |
|  [ ] 10. Disable forward busy                                  |
|                                                                 |
|  TEST STEPS - FORWARD NO ANSWER:                               |
|  -----------------------------                                  |
|  [ ] 11. Enable "Forward When No Answer" to voicemail          |
|  [ ] 12. Set ring count to 4                                   |
|  [ ] 13. Call user's extension, don't answer                   |
|  [ ] 14. Count rings (should be 4)                             |
|  [ ] 15. Verify forwards to voicemail                          |
|                                                                 |
|  TEST STEPS - FORWARD NOT REACHABLE:                           |
|  ------------------------------------                           |
|  [ ] 16. Enable "Forward When Not Reachable" to mobile         |
|  [ ] 17. Disconnect user's phone from network                  |
|  [ ] 18. Call user's extension                                 |
|  [ ] 19. Verify forwards to mobile number                      |
|                                                                 |
|  STATUS: [ ] PASS  [ ] FAIL  [ ] BLOCKED                       |
|  Tester: _________________ Date: ___________                   |
|                                                                 |
+-----------------------------------------------------------------+
```

### Test Case F-05: Call Recording

```
+-----------------------------------------------------------------+
|  TEST CASE F-05: CALL RECORDING                                  |
+-----------------------------------------------------------------+
|                                                                 |
|  Objective: Verify call recording and consent compliance       |
|  Prerequisites: Recording policy enabled                       |
|                                                                 |
|  TEST STEPS - AUTOMATIC RECORDING:                             |
|  ---------------------------------                              |
|  [ ] 1. User with recording policy makes outbound call         |
|  [ ] 2. Verify recording announcement plays (if configured)    |
|  [ ] 3. Complete call with conversation                        |
|  [ ] 4. End call                                               |
|  [ ] 5. Navigate to Control Hub -> Analytics -> Recordings       |
|  [ ] 6. Locate recording for test call                         |
|  [ ] 7. Play recording                                         |
|  [ ] 8. Verify both parties audio recorded                     |
|  [ ] 9. Verify recording announcement captured (if enabled)    |
|                                                                 |
|  TEST STEPS - ON-DEMAND RECORDING:                             |
|  ---------------------------------                              |
|  [ ] 10. User makes call (no auto-record policy)               |
|  [ ] 11. During call, user presses "Record" soft key           |
|  [ ] 12. Verify recording starts (indicator visible)           |
|  [ ] 13. User presses "Stop" to stop recording                 |
|  [ ] 14. Verify recording saved                                |
|                                                                 |
|  REGIONAL COMPLIANCE:                                          |
|  --------------------                                           |
|  [ ] India: One-party consent (announcement for CC only)       |
|  [ ] UK: Two-party notification (announcement plays)           |
|  [ ] Germany: Two-party consent (IVR press 1 to consent)       |
|  [ ] US-NJ: Two-party (announcement plays)                     |
|  [ ] US-TX: One-party (announcement plays for consistency)     |
|                                                                 |
|  STATUS: [ ] PASS  [ ] FAIL  [ ] BLOCKED                       |
|  Tester: _________________ Date: ___________                   |
|  Compliance Sign-off: _____________________                    |
|                                                                 |
+-----------------------------------------------------------------+
```

## C.3 Webex App Test Cases

### Test Case A-01: Webex App Soft Phone

```
+-----------------------------------------------------------------+
|  TEST CASE A-01: WEBEX APP - SOFT PHONE                          |
+-----------------------------------------------------------------+
|                                                                 |
|  Objective: Verify Webex App calling functionality             |
|  Prerequisites: Webex App installed, user logged in            |
|                                                                 |
|  TEST STEPS - BASIC CALLING:                                   |
|  ---------------------------                                    |
|  [ ] 1. Open Webex App on desktop                              |
|  [ ] 2. Verify phone icon shows "Ready" status                 |
|  [ ] 3. Click phone icon, enter extension to dial              |
|  [ ] 4. Verify call connects                                   |
|  [ ] 5. Verify audio works (use headset)                       |
|  [ ] 6. Verify mute button works                               |
|  [ ] 7. Verify hold button works                               |
|  [ ] 8. End call                                               |
|                                                                 |
|  TEST STEPS - INBOUND:                                         |
|  ---------------------                                          |
|  [ ] 9. Call user's DID from external phone                    |
|  [ ] 10. Verify Webex App rings (toast notification)           |
|  [ ] 11. Answer call in Webex App                              |
|  [ ] 12. Verify audio quality                                  |
|  [ ] 13. End call                                              |
|                                                                 |
|  TEST STEPS - MOBILE:                                          |
|  --------------------                                           |
|  [ ] 14. Install Webex App on mobile device                    |
|  [ ] 15. Login with same credentials                           |
|  [ ] 16. Make call from mobile app                             |
|  [ ] 17. Receive call on mobile app                            |
|  [ ] 18. Verify call moves between devices (if configured)     |
|                                                                 |
|  STATUS: [ ] PASS  [ ] FAIL  [ ] BLOCKED                       |
|  Tester: _________________ Date: ___________                   |
|                                                                 |
+-----------------------------------------------------------------+
```

## C.4 Integration Test Cases

### Test Case I-01: SSO Login

```
+-----------------------------------------------------------------+
|  TEST CASE I-01: SSO AUTHENTICATION                              |
+-----------------------------------------------------------------+
|                                                                 |
|  Objective: Verify Azure AD SSO and MFA                        |
|  Prerequisites: SSO configured, MFA enabled                    |
|                                                                 |
|  TEST STEPS:                                                   |
|  -----------                                                    |
|  [ ] 1. Navigate to settings.webex.com                         |
|  [ ] 2. Enter corporate email address                          |
|  [ ] 3. Verify redirect to Azure AD login page                 |
|  [ ] 4. Enter Azure AD credentials                             |
|  [ ] 5. Verify MFA challenge (authenticator app)               |
|  [ ] 6. Approve MFA                                            |
|  [ ] 7. Verify redirect back to Webex                          |
|  [ ] 8. Verify user logged in successfully                     |
|  [ ] 9. Verify user attributes populated (name, photo)         |
|  [ ] 10. Logout and repeat for admin user (Control Hub)        |
|                                                                 |
|  FAILURE TESTS:                                                |
|  --------------                                                 |
|  [ ] 11. Enter wrong password - verify error message           |
|  [ ] 12. 5 failed attempts - verify account lockout            |
|  [ ] 13. Deny MFA - verify login blocked                       |
|                                                                 |
|  STATUS: [ ] PASS  [ ] FAIL  [ ] BLOCKED                       |
|  Tester: _________________ Date: ___________                   |
|                                                                 |
+-----------------------------------------------------------------+
```

## C.5 Test Summary Matrix

| Test ID | Test Case | Priority | Status | Tester | Date |
|---------|-----------|----------|--------|--------|------|
| V-01 | Internal Call (Same Site) | P1 | [ ] | | |
| V-02 | Internal Call (Cross-Site) | P1 | [ ] | | |
| V-03 | Coexistence (Webex<->CUCM) | P1 | [ ] | | |
| V-04 | PSTN Outbound (India Toll Bypass) | P1 | [ ] | | |
| V-05 | PSTN Outbound (CCPP) | P1 | [ ] | | |
| V-06 | PSTN Inbound (DID) | P1 | [ ] | | |
| V-07 | Emergency Calling | P1 | [ ] | | |
| F-01 | Hunt Group | P2 | [ ] | | |
| F-02 | Auto Attendant | P2 | [ ] | | |
| F-03 | Voicemail | P2 | [ ] | | |
| F-04 | Call Forward | P2 | [ ] | | |
| F-05 | Call Recording | P2 | [ ] | | |
| A-01 | Webex App Soft Phone | P2 | [ ] | | |
| I-01 | SSO Authentication | P1 | [ ] | | |

**Summary:**
- Total Test Cases: ______
- Passed: ______
- Failed: ______
- Blocked: ______
- Pass Rate: ______%

---

## Appendix D: Performance Baseline Template 

## D.1 Network Performance Baseline

```
+-----------------------------------------------------------------+
|  NETWORK PERFORMANCE BASELINE                                    |
|  Date: ___________  Tester: _______________                     |
+-----------------------------------------------------------------+
|                                                                 |
|  TEST METHODOLOGY:                                             |
|  * Webex Network Test: mediatest.webex.com                     |
|  * Ping/traceroute to Webex endpoints                          |
|  * During business hours (peak load)                           |
|                                                                 |
|  SITE: MUMBAI HQ                                               |
|  ===============                                               |
|  Latency to Webex DC: _______ ms  (Target: <150ms)             |
|  Jitter: _______ ms               (Target: <30ms)              |
|  Packet Loss: _______ %           (Target: <1%)                |
|  UDP Connectivity: PASS / FAIL                                 |
|  TCP Fallback: PASS / FAIL                                     |
|  Download Speed: _______ Mbps                                  |
|  Upload Speed: _______ Mbps                                    |
|                                                                 |
|  SITE: CHENNAI                                                 |
|  =============                                                 |
|  Latency to Webex DC: _______ ms                               |
|  Jitter: _______ ms                                            |
|  Packet Loss: _______ %                                        |
|                                                                 |
|  SITE: LONDON                                                  |
|  ============                                                  |
|  Latency to Webex DC: _______ ms                               |
|  Jitter: _______ ms                                            |
|  Packet Loss: _______ %                                        |
|                                                                 |
|  [Repeat for all sites]                                        |
|                                                                 |
+-----------------------------------------------------------------+
```

## D.2 Call Quality Baseline

```
+-----------------------------------------------------------------+
|  CALL QUALITY BASELINE                                           |
|  Week: ___________  Date Range: _____________ to _____________  |
+-----------------------------------------------------------------+
|                                                                 |
|  OVERALL METRICS (from Control Hub Analytics):                 |
|  ============================================                  |
|  Total Calls Analyzed: ___________                             |
|  Average MOS Score: _______ (Target: >4.0)                     |
|  Peak MOS: _______                                             |
|  Minimum MOS: _______                                          |
|  Calls with MOS <3.5: _______ (______%)                        |
|                                                                 |
|  MOS DISTRIBUTION:                                             |
|  =================                                             |
|  Excellent (4.3-5.0): _______% ################                |
|  Good (4.0-4.3):      _______% ############                    |
|  Fair (3.6-4.0):      _______% ########                        |
|  Poor (<3.6):         _______% ####                            |
|                                                                 |
|  BY SITE:                                                      |
|  ========                                                      |
|  Mumbai:    MOS _______ | Calls _______ | Poor _______         |
|  Chennai:   MOS _______ | Calls _______ | Poor _______         |
|  Bangalore: MOS _______ | Calls _______ | Poor _______         |
|  Delhi:     MOS _______ | Calls _______ | Poor _______         |
|  London:    MOS _______ | Calls _______ | Poor _______         |
|  Frankfurt: MOS _______ | Calls _______ | Poor _______         |
|  NJ:        MOS _______ | Calls _______ | Poor _______         |
|  Dallas:    MOS _______ | Calls _______ | Poor _______         |
|                                                                 |
|  BY CALL TYPE:                                                 |
|  ============                                                  |
|  Internal (Webex-Webex): MOS _______                           |
|  PSTN Outbound:          MOS _______                           |
|  PSTN Inbound:           MOS _______                           |
|  Coexistence (CUCM):     MOS _______                           |
|                                                                 |
+-----------------------------------------------------------------+
```

## D.3 Weekly Performance Tracking

```
+-----------------------------------------------------------------+
|  WEEKLY PERFORMANCE TRACKING                                     |
+-----------------------------------------------------------------+
|                                                                 |
|  MOS SCORE TREND:                                              |
|  ================                                              |
|  Week 1: _______ ######################                        |
|  Week 2: _______ ######################                        |
|  Week 3: _______ ######################                        |
|  Week 4: _______ ######################                        |
|  Target: 4.0     ----------------------|                       |
|                                                                 |
|  CALL VOLUME TREND:                                            |
|  ==================                                            |
|  Week 1: _______ calls                                         |
|  Week 2: _______ calls  (______% change)                       |
|  Week 3: _______ calls  (______% change)                       |
|  Week 4: _______ calls  (______% change)                       |
|                                                                 |
|  ISSUES TREND:                                                 |
|  =============                                                 |
|  Week 1: _______ incidents (P1: ___ P2: ___ P3: ___)           |
|  Week 2: _______ incidents (P1: ___ P2: ___ P3: ___)           |
|  Week 3: _______ incidents (P1: ___ P2: ___ P3: ___)           |
|  Week 4: _______ incidents (P1: ___ P2: ___ P3: ___)           |
|                                                                 |
|  STATUS: 🟢 IMPROVING / 🟡 STABLE / 🔴 DEGRADING               |
|                                                                 |
+-----------------------------------------------------------------+
```

---

## Appendix E: Operational Readiness Review (ORR) 

## E.1 ORR Checklist

```
+-----------------------------------------------------------------+
|  OPERATIONAL READINESS REVIEW (ORR)                              |
|  Project: CUCM to Webex Calling Migration                       |
|  Date: _______________                                          |
+-----------------------------------------------------------------+

SECTION 1: TECHNICAL READINESS (10 Items)
=========================================

[ ] 1.1  All Webex locations configured and validated
        Evidence: Control Hub screenshot showing all locations
        
[ ] 1.2  All PSTN trunks active (LGW + CCPP)
        Evidence: Control Hub PSTN status = Active (all trunks)
        
[ ] 1.3  All LGWs registered and passing traffic
        Evidence: `show voice register status` = Registered (all 7)
        
[ ] 1.4  Coexistence trunk operational (CUCM <-> Webex)
        Evidence: Test call log showing bidirectional calls
        
[ ] 1.5  All DIDs assigned and tested
        Evidence: Inbound call test results for sample DIDs
        
[ ] 1.6  Emergency calling validated (112/999/911)
        Evidence: Test coordination confirmation with carrier
        
[ ] 1.7  All features migrated and tested (HG, AA, VM)
        Evidence: Feature test case results (Appendix C)
        
[ ] 1.8  SSO/MFA authentication working
        Evidence: Login test results showing SSO flow
        
[ ] 1.9  Call quality meets baseline (MOS >4.0)
        Evidence: Week 4 performance report (Appendix D)
        
[ ] 1.10 Network readiness confirmed (all sites)
        Evidence: Network test results (all sites pass)

SECTION 2: OPERATIONAL READINESS (8 Items)
==========================================

[ ] 2.1  Runbooks documented and accessible
        Location: ________________________________
        
[ ] 2.2  On-call rotation schedule published
        Start Date: ___________ Rotation: ___________
        
[ ] 2.3  Escalation matrix defined and communicated
        Evidence: Appendix J distributed to all teams
        
[ ] 2.4  Monitoring and alerting configured
        Evidence: Control Hub alerts active (list rules)
        
[ ] 2.5  Help desk trained and ready
        Training Date: ___________ Attendees: ___________
        
[ ] 2.6  L2 support team trained
        Training Date: ___________ Attendees: ___________
        
[ ] 2.7  Vendor support contracts active
        Cisco TAC Contract #: _______________
        IntelePeer Support: _______________
        
[ ] 2.8  Incident management process defined
        Reference: Chapter 8, Section 8.7

SECTION 3: USER READINESS (5 Items)
===================================

[ ] 3.1  Agent training completed
        Completion Rate: ______% (Target: 100%)
        
[ ] 3.2  Supervisor training completed
        Completion Rate: ______% (Target: 100%)
        
[ ] 3.3  Admin training completed
        Completion Rate: ______% (Target: 100%)
        
[ ] 3.4  User communication sent
        Date Sent: ___________ Method: ___________
        
[ ] 3.5  Training materials accessible
        Location: ________________________________

SECTION 4: COMPLIANCE READINESS (4 Items)
=========================================

[ ] 4.1  India DoT/TRAI compliance validated
        Evidence: Toll bypass test results (V-04)
        Compliance Officer Sign-off: _______________
        
[ ] 4.2  EMEA GDPR data residency confirmed
        Evidence: Control Hub data residency settings
        
[ ] 4.3  US E911 compliance validated
        Evidence: Emergency test results (V-07)
        
[ ] 4.4  Call recording consent configured
        Evidence: Regional announcement test results

+-----------------------------------------------------------------+
```

## E.2 ORR Scoring

| Section | Items | Passed | Score |
|---------|-------|--------|-------|
| Technical Readiness | 10 | | /10 |
| Operational Readiness | 8 | | /8 |
| User Readiness | 5 | | /5 |
| Compliance Readiness | 4 | | /4 |
| **TOTAL** | **27** | | **/27** |

**Scoring Criteria:**
- **GREEN (GO):** 27/27 (100%)
- **YELLOW (CONDITIONAL GO):** 24-26/27 (>90%), no P1 gaps
- **RED (NO-GO):** <24/27 or any P1 gap

---

## Appendix F: Go/No-Go Decision Template 

## F.1 Go/No-Go Meeting Record

```
+-----------------------------------------------------------------+
|  GO/NO-GO DECISION MEETING                                       |
|  Batch: _______________  Date: _______________                  |
|  Site(s): _____________________________________________         |
|  Users: _______________                                         |
+-----------------------------------------------------------------+

MEETING ATTENDEES:
=================

| Name | Role | Present |
|------|------|---------|
| _______________ | Project Manager | [ ] |
| _______________ | Voice Engineering Lead | [ ] |
| _______________ | Network Lead | [ ] |
| _______________ | Help Desk Lead | [ ] |
| _______________ | Site IT Lead | [ ] |
| _______________ | Compliance Officer | [ ] |
| _______________ | Project Sponsor | [ ] |

PRE-REQUISITE STATUS:
====================

| Item | Status | Owner |
|------|--------|-------|
| ORR Score | ___/27 | Voice Eng |
| Test Cases Passed | ___/14 | Voice Eng |
| Open P1 Issues | ___ | Voice Eng |
| Open P2 Issues | ___ | Voice Eng |
| Help Desk Ready | [ ] Yes [ ] No | Help Desk |
| Users Notified | [ ] Yes [ ] No | Comms |
| Rollback Plan Ready | [ ] Yes [ ] No | Voice Eng |
| War Room Staffed | [ ] Yes [ ] No | PM |

OPEN ISSUES SUMMARY:
===================

| Issue ID | Description | Severity | Mitigation |
|----------|-------------|----------|------------|
| | | | |
| | | | |
| | | | |

RISK ASSESSMENT:
================

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| | H/M/L | H/M/L | |
| | H/M/L | H/M/L | |

+-----------------------------------------------------------------+
```

## F.2 Decision and Sign-Off

```
+-----------------------------------------------------------------+
|  DECISION                                                        |
+-----------------------------------------------------------------+

[ ]  GO - Proceed with migration as planned
   Cutover Start Time: _______________
   
[ ]  CONDITIONAL GO - Proceed with noted exceptions
   Conditions/Exceptions:
   1. _________________________________________________
   2. _________________________________________________
   3. _________________________________________________
   
[ ]  NO-GO - Delay migration
   Reason: ______________________________________________
   Rescheduled Date: _______________
   Actions Required:
   1. _________________________________________________
   2. _________________________________________________

DECISION RATIONALE:
===================
___________________________________________________________
___________________________________________________________
___________________________________________________________

SIGN-OFF:
=========

Technical Approval:
| Name | Role | Signature | Date |
|------|------|-----------|------|
| _______________ | Voice Engineering Lead | _____________ | _______ |
| _______________ | Network Lead | _____________ | _______ |
| _______________ | Security Lead | _____________ | _______ |

Operations Approval:
| Name | Role | Signature | Date |
|------|------|-----------|------|
| _______________ | Help Desk Lead | _____________ | _______ |
| _______________ | Operations Manager | _____________ | _______ |

Executive Approval:
| Name | Role | Signature | Date |
|------|------|-----------|------|
| _______________ | Project Sponsor | _____________ | _______ |
| _______________ | IT Director | _____________ | _______ |

FINAL DECISION MADE BY: ___________________________

DATE/TIME: ___________________________

+-----------------------------------------------------------------+
```

---

## Appendix G: Hypercare Runbook 

## G.1 Hypercare Period Definition

| Parameter | Value |
|-----------|-------|
| Duration | 10 business days post-cutover |
| Support Hours | Extended: 7 AM - 10 PM (local time) |
| War Room Location | Mumbai HQ - Conference Room A |
| Bridge Line | +91-22-4960-8888 |
| Escalation | 15 minutes for P1, 30 minutes for P2 |

## G.2 Daily Hypercare Checklist

```
+-----------------------------------------------------------------+
|  HYPERCARE DAILY CHECKLIST                                       |
|  Date: _______________  Day: _____ of 10                        |
+-----------------------------------------------------------------+

MORNING CHECK (7:00 AM):
=======================

[ ] Check Webex status page - No incidents
[ ] Check Control Hub service health - All green
[ ] Check LGW registration status - All registered
[ ] Review overnight alerts - ___ alerts, ___ actioned
[ ] Check help desk queue - ___ open tickets
[ ] Morning standup call completed - Attendees: ___

MIDDAY CHECK (12:00 PM):
========================

[ ] Call quality check - MOS average: _______
[ ] Active incidents: P1: ___ P2: ___ P3: ___
[ ] User issues reported: ___
[ ] Phone registration count: ___ / ___
[ ] PSTN call success rate: ____%

END OF DAY CHECK (6:00 PM):
===========================

[ ] Daily metrics compiled
[ ] All P1/P2 incidents resolved or escalated
[ ] Next day staffing confirmed
[ ] Status report sent to stakeholders
[ ] Help desk handover completed

METRICS SUMMARY:
================

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Incidents opened | <10 | ___ | [ ] |
| Incidents resolved | >90% | ___% | [ ] |
| Avg resolution time | <2 hrs | ___ | [ ] |
| User satisfaction | >90% | ___% | [ ] |
| Call quality (MOS) | >4.0 | ___ | [ ] |

NOTES:
======
_____________________________________________________________
_____________________________________________________________

COMPLETED BY: _______________ TIME: _______________

+-----------------------------------------------------------------+
```

## G.3 Hypercare Exit Criteria

| Criteria | Target | Actual | Met |
|----------|--------|--------|-----|
| Days without P1 incident | 5 consecutive | | [ ] |
| Open P2 incidents | 0 | | [ ] |
| MOS score average | >4.0 | | [ ] |
| User complaints (daily) | <5 | | [ ] |
| Help desk ticket rate | Stable/declining | | [ ] |
| All batches complete | 100% | | [ ] |
| Documentation complete | 100% | | [ ] |
| Knowledge transfer done | Yes | | [ ] |

**Exit Decision:**
- [ ] Exit Hypercare - Transition to BAU
- [ ] Extend Hypercare - ___ additional days

**Approved By:** _______________ **Date:** _______________

---

## Appendix H: Handover Meeting Agenda 

## H.1 Knowledge Transfer Session Plan

```
+-----------------------------------------------------------------+
|  OPERATIONS HANDOVER - KNOWLEDGE TRANSFER                        |
|  Duration: 2 days (10 hours total)                              |
|  Location: _______________                                      |
|  Facilitator: _______________                                   |
+-----------------------------------------------------------------+

DAY 1 (5 hours):
===============

Session 1: System Overview (1.5 hours)
----------------------------------------
[ ] Architecture review and component overview
[ ] Data flows and integration points
[ ] Regional configurations (India, EMEA, Americas)
[ ] Access credentials and admin accounts

Session 2: Control Hub Administration (2 hours)
------------------------------------------------
[ ] User provisioning walkthrough
[ ] Device management
[ ] Feature configuration (HG, AA, VM)
[ ] Analytics and reporting
[ ] Hands-on: Add a test user
[ ] Hands-on: Configure a hunt group

Session 3: LGW Management - India (1.5 hours)
----------------------------------------------
[ ] LGW architecture and locations
[ ] SSH access and credentials
[ ] Health check commands
[ ] Certificate renewal process
[ ] Hands-on: Check LGW status
[ ] Hands-on: Review call trace

DAY 2 (5 hours):
===============

Session 4: Monitoring and Alerting (1 hour)
-------------------------------------------
[ ] Control Hub alerts review
[ ] SIEM integration (if applicable)
[ ] Escalation procedures
[ ] Hands-on: Create an alert rule

Session 5: Troubleshooting (2 hours)
------------------------------------
[ ] Common issues and resolutions
[ ] Troubleshooting decision tree review
[ ] Log analysis techniques
[ ] TAC case opening procedure
[ ] Hands-on: Troubleshoot a simulated issue

Session 6: Compliance and Reporting (1 hour)
--------------------------------------------
[ ] India toll bypass audit procedure
[ ] Recording compliance checks
[ ] Monthly reporting requirements
[ ] Audit log review

Session 7: Q&A and Practice (1 hour)
------------------------------------
[ ] Open Q&A
[ ] Scenario-based exercises
[ ] Final documentation review
[ ] Handover sign-off

+-----------------------------------------------------------------+
```

## H.2 Handover Sign-Off

```
KNOWLEDGE TRANSFER COMPLETION

Training Delivered By: _______________
Training Received By: _______________

Topics Covered:              Sign-Off:
[ ] System Overview          _______________
[ ] Control Hub Admin        _______________
[ ] LGW Management           _______________
[ ] Monitoring/Alerting      _______________
[ ] Troubleshooting          _______________
[ ] Compliance/Reporting     _______________

Documentation Provided:
[ ] Chapter 1-8 Technical Documentation
[ ] Appendices A-J
[ ] Admin credentials (secure handover)
[ ] Vendor contact information

Operations Team Confirmation:
"We confirm receipt of training and documentation and 
are prepared to assume operational responsibility."

Signature: _______________ Date: _______________
Name: _______________
Role: _______________
```

---

## Appendix I: India Compliance Audit Template 

## I.1 Monthly Toll Bypass Audit

```
+-----------------------------------------------------------------+
|  INDIA TOLL BYPASS COMPLIANCE AUDIT                              |
|  Period: _______________ to _______________                     |
|  Auditor: _______________                                       |
+-----------------------------------------------------------------+

AUDIT SCOPE:
============
Total India PSTN Calls: _______________
Sample Size (1% or 100 min): _______________
Sample Period: _______________

ZONE-TO-LGW VERIFICATION:
=========================

| Zone | Expected LGW | Calls Sampled | Compliant | Violations |
|------|--------------|---------------|-----------|------------|
| Mumbai | LGW-Mumbai | | | |
| Chennai | LGW-Chennai | | | |
| Bangalore | LGW-Bangalore | | | |
| Delhi | LGW-Delhi | | | |
| Noida | LGW-Noida | | | |
| Pune | LGW-Mumbai | | | |
| Hyderabad | LGW-Hyderabad | | | |

COMPLIANCE RATE: _______% (Target: 100%)

VIOLATIONS DETAIL:
==================

| Date | User | Zone | Expected LGW | Actual LGW | Cause |
|------|------|------|--------------|------------|-------|
| | | | | | |
| | | | | | |
| | | | | | |

ROOT CAUSE ANALYSIS:
====================
___________________________________________________________
___________________________________________________________

REMEDIATION ACTIONS:
====================
1. ________________________________________________________
2. ________________________________________________________
3. ________________________________________________________

SIGN-OFF:
=========
Auditor: _______________ Date: _______________
Compliance Officer: _______________ Date: _______________

+-----------------------------------------------------------------+
```

---

## Appendix J: Emergency Contacts & Escalation 

## J.1 Emergency Contact List

```
+-----------------------------------------------------------------+
|  EMERGENCY CONTACTS - QUICK REFERENCE                            |
|  Print and post at support desk                                 |
+-----------------------------------------------------------------+

INTERNAL ESCALATION:
====================

| Role | Name | Phone | Email |
|------|------|-------|-------|
| Voice Eng Lead | __________ | __________ | __________ |
| Network Lead | __________ | __________ | __________ |
| Security Lead | __________ | __________ | __________ |
| IT Director | __________ | __________ | __________ |
| Project Sponsor | __________ | __________ | __________ |

VENDOR SUPPORT:
===============

| Vendor | Type | Phone | Portal | Contract # |
|--------|------|-------|--------|------------|
| Cisco TAC | Platform | 1800-103-5312 | support.cisco.com | __________ |
| IntelePeer | PSTN (EMEA/US) | +1-XXX-XXX-XXXX | portal.intelepeer.com | __________ |
| Tata Teleservices | PSTN (India) | 1800-XXX-XXXX | enterprise.tata.com | __________ |
| Airtel | PSTN (India backup) | 1800-XXX-XXXX | airtel.in/business | __________ |

24x7 ON-CALL:
=============

| Week | Primary | Phone | Backup | Phone |
|------|---------|-------|--------|-------|
| Current | __________ | __________ | __________ | __________ |
| Next | __________ | __________ | __________ | __________ |

BRIDGE LINE:
============
War Room Bridge: +91-22-4960-8888
PIN: _______________

+-----------------------------------------------------------------+
```

## J.2 Escalation Matrix

```
+-----------------------------------------------------------------+
|  ESCALATION MATRIX                                               |
+-----------------------------------------------------------------+

P1 - CRITICAL (Service outage >50 users):
=========================================
0 min    Help Desk acknowledges
15 min   Voice Engineering engaged
30 min   Bridge call opened, stakeholders notified
1 hour   TAC case opened (Severity 1)
2 hours  IT Director notified
4 hours  Executive escalation if unresolved

P2 - HIGH (Feature outage or >10 users):
========================================
0 min    Help Desk acknowledges
30 min   Voice Engineering engaged
1 hour   Root cause analysis started
4 hours  TAC case opened (Severity 2) if needed
8 hours  Management update

P3 - MEDIUM (Single user, non-critical):
========================================
0 min    Help Desk acknowledges
2 hours  Initial troubleshooting
4 hours  Voice Engineering if needed
24 hours Resolution target

P4 - LOW (Minor issue, workaround exists):
==========================================
0 min    Help Desk acknowledges
4 hours  Initial response
72 hours Resolution target

+-----------------------------------------------------------------+
```

---

## Appendix Summary 

| Appendix | Pages | Purpose |
|----------|-------|---------|
| A | 3 | Information Gathering Sheet |
| B | 2 | Pre-Implementation Checklist |
| C | 8 | Detailed Test Case Scenarios |
| D | 2 | Performance Baseline Template |
| E | 2 | Operational Readiness Review (ORR) |
| F | 2 | Go/No-Go Decision Template |
| G | 2 | Hypercare Runbook |
| H | 1 | Handover Meeting Agenda |
| I | 1 | India Compliance Audit Template |
| J | 1 | Emergency Contacts & Escalation |

**Total Appendices:** 10
**Estimated Pages:** ~24 pages

---

## Document References

| Reference | Description |
|-----------|-------------|
| Chapter 4 | Compliance requirements |
| Chapter 6 | Implementation procedures |
| Chapter 7 | Migration procedures |
| Chapter 8 | Operations procedures |
| Previous Project | Avaya to Webex CC Implementation Guide |
| Previous Project | KidsWear Greenfield Provisioning Guide |

---

*End of Appendices*

---
