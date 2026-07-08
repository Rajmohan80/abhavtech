# 7.4 WxCC Cutover Runbook

## 7.4.1 Cutover Overview

```
   WXCC CUTOVER - HIGH-LEVEL APPROACH
   CUTOVER TYPE: Weekend Big-Bang (per wave)
   WHY WEEKEND:
   Lowest call volume period
   Maximum time for issue resolution
   Minimal customer impact
   Staff availability for extended hours
   WHY BIG-BANG (NOT PARALLEL):
   UCCX depends on CUCM CTI - no parallel possible after Phase 1
   Single Entry Point cannot route to both UCCX and WxCC simultaneously
   Clean cutover reduces complexity
   CUTOVER SEQUENCE:
   FREEZE   -   SWITCH   -   VERIFY   -   GO LIVE
   UCCX   ROUTING   WXCC
   T-0   T+30 min   T+60 min   T+120 min
   DURATION: ~3 hours (cutover) + 48 hours (stabilization)
```

## 7.4.2 Cutover Team & Roles

| Role | Name | Responsibilities | Contact |
|------|------|------------------|---------|
| **Cutover Manager** | [PM Name] | Overall coordination, Go/No-Go decisions | +91-XXXXX |
| **Voice Engineering Lead** | [Eng Name] | Routing changes, Entry Points, Flows | +91-XXXXX |
| **WxCC Admin** | [Admin Name] | Control Hub configuration, agent activation | +91-XXXXX |
| **CC Operations Manager** | [Ops Name] | Agent coordination, business validation | +91-XXXXX |
| **Network Engineer** | [Net Name] | DNS changes, connectivity issues | +91-XXXXX |
| **QA Lead** | [QA Name] | Test execution, defect logging | +91-XXXXX |
| **Help Desk Lead** | [HD Name] | Agent support, issue triage | +91-XXXXX |
| **Vendor TAC** | Cisco TAC | Escalation support | TAC Case # |

## 7.4.3 Wave 1 Cutover Runbook (Chennai)

```
   WAVE 1 CUTOVER RUNBOOK - CHENNAI
   DATE: [Week 5 Friday]
   START TIME: 6:00 PM IST
   END TIME: 9:00 PM IST (Go-Live ready)
   TIME   TASK   OWNER   STATUS
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   PRE-CUTOVER (4:00 PM - 6:00 PM)
   4:00 PM   Go/No-Go call   Cutover Mgr   -
   4:30 PM   Notify Chennai agents - logout   CC Ops   -
   5:00 PM   Verify all Chennai agents logged   CC Ops   -
   out of UCCX Finesse
   5:30 PM   Final UCCX backup   Voice Eng   -
   5:45 PM   Notify help desk - cutover start   Cutover Mgr   -
   CUTOVER EXECUTION (6:00 PM - 7:30 PM)
   6:00 PM   *** CUTOVER START ***   Cutover Mgr   -
   6:00 PM   Disable Chennai agents in UCCX   Voice Eng   -
   (make agents unavailable)
   6:15 PM   Update Entry Point routing:   WxCC Admin   -
   - Enable WxCC India_Main flow
   - Chennai queues active
   6:30 PM   Verify WxCC Entry Points active   Voice Eng   -
   Control Hub   CC   Entry Points
   6:45 PM   Chennai agents login to WxCC   CC Ops   -
   Agent Desktop
   7:00 PM   Verify 30 agents showing   WxCC Admin   -
   "Available" in WxCC
   7:15 PM   Recording validation (test call)   Voice Eng   -
   7:30 PM   *** CUTOVER COMPLETE ***   Cutover Mgr   -
   VALIDATION (7:30 PM - 9:00 PM)
   7:30 PM   Execute test scenarios:   QA Lead
   -  TC-01: India TF   Sales queue   -
   -  TC-02: Hindi language selection   -
   -  TC-09: Virtual Agent "Abhi"   -
   -  TC-13: Agent hold/resume   -
   -  TC-14: Blind transfer   -
   -  TC-17: Web chat (if applicable)   -
   8:30 PM   Test results review   QA Lead   -
   8:45 PM   Issue resolution (if needed)   Voice Eng   -
   9:00 PM   Go-Live confirmation   Cutover Mgr   -
   GO-LIVE (Saturday 9:00 AM IST)
   9:00 AM   Chennai operations start on WxCC   CC Ops   -
   9:00 AM   Enhanced monitoring begins   Voice Eng   -
   Ongoing   Issue tracking & resolution   All   -
```

## 7.4.4 Wave 3 Cutover Runbook (Mumbai - 24x7)

```
   WAVE 3 CUTOVER RUNBOOK - MUMBAI HQ (24x7)
   DATE: [Week 10 Saturday]
   START TIME: 12:01 AM IST (Saturday, lowest volume)
   END TIME: 6:00 AM IST (Day shift start)
   SPECIAL CONSIDERATIONS:
   Mumbai operates 24x7 - cutover during lowest volume (midnight)
   Night shift (20 agents) handles calls during cutover
   All 120 agents transition by 6:00 AM day shift start
   Supervisor on-site throughout cutover
   TIME   TASK   OWNER   STATUS
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   PRE-CUTOVER (10:00 PM - 12:00 AM)
   10:00 PM   Go/No-Go call (final)   Cutover Mgr   -
   10:30 PM   Night shift briefing   CC Ops   -
   11:00 PM   Verify Wave 1+2 stable   Voice Eng   -
   11:30 PM   Final UCCX Mumbai backup   Voice Eng   -
   11:45 PM   All teams on standby   Cutover Mgr   -
   CUTOVER EXECUTION (12:01 AM - 2:00 AM)
   12:01 AM   *** CUTOVER START ***   Cutover Mgr   -
   12:01 AM   Disable Mumbai agents in UCCX   Voice Eng   -
   12:15 AM   Update India Entry Point routing   WxCC Admin   -
   - All India flows now to WxCC
   12:30 AM   Night shift (20) login to WxCC   CC Ops   -
   12:45 AM   Verify agents "Available" in WxCC   WxCC Admin   -
   1:00 AM   First live customer calls   CC Ops   -
   1:30 AM   Recording validation   Voice Eng   -
   2:00 AM   *** NIGHT SHIFT OPERATIONAL ***   Cutover Mgr   -
   VALIDATION & MONITORING (2:00 AM - 6:00 AM)
   2:00 AM   Execute full test matrix   QA Lead   -
   3:00 AM   Test results review   QA Lead   -
   3:30 AM   Issue resolution window   Voice Eng   -
   5:00 AM   Day shift agents begin login   CC Ops   -
   5:30 AM   Verify 80+ agents available   WxCC Admin   -
   6:00 AM   Day shift handover complete   CC Ops   -
   6:00 AM   *** FULL OPERATIONS ON WXCC ***   Cutover Mgr   -
   POST-CUTOVER MONITORING
   6:00 AM   Enhanced monitoring begins   Voice Eng   -
   8:00 AM   Morning status call   Cutover Mgr   -
   12:00 PM   Midday status call   Cutover Mgr   -
   6:00 PM   Evening status call   Cutover Mgr   -
   Sunday   24-hour stability review   All   -
```

## 7.4.5 Entry Point Routing Switch Procedure

**Procedure: Switch PSTN Routing to WxCC**

| Step | Action | Verification |
|------|--------|--------------|
| 1 | Login to Control Hub (admin.webex.com) | Org = Abhavtech.com |
| 2 | Navigate: Services -> Contact Center -> Entry Points | Entry Point list displayed |
| 3 | Select Entry Point (e.g., India_Main_Voice_EP) | EP details shown |
| 4 | Verify DN Mapping: | |
| | - 1800-266-1000 (India TF) | Mapped |
| | - +91-22-4961-1000 (Mumbai DID) | Mapped |
| 5 | Verify Flow Assignment: India_MainMenu_Flow_v1 | Flow active |
| 6 | Set Entry Point Status: **Active** | Status = Active |
| 7 | Test inbound call to mapped number | Call reaches WxCC flow |

**Entry Points to Activate per Wave:**

| Wave | Entry Points | Numbers |
|------|--------------|---------|
| Wave 1 (Chennai) | India_Main_Voice_EP (partial) | Test DIDs only |
| Wave 2 (London/NJ) | EMEA_Main_Voice_EP, Americas_Main_Voice_EP | +44-20-XXXX, +1-201-XXX |
| Wave 3 (Mumbai) | India_Main_Voice_EP, India_Sales_Direct_EP | 1800-266-1000, 1800-266-1001, +91-22-4961-1000 |
| Post-Cutover | Global_Chat_EP, Global_Email_EP | Web widget, support@abhavtech.com |

## 7.4.6 Agent Login Verification

**Procedure: Verify Agent Desktop Connectivity**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Agent opens browser (Chrome recommended) | Browser launches |
| 2 | Navigate to: desktop.wxcc-us1.cisco.com | Login page displayed |
| 3 | Enter Webex credentials (SSO) | Azure AD login |
| 4 | Select Station: Webex Calling (Extension) | Extension pre-populated |
| 5 | Click "Sign In" | Agent Desktop loads |
| 6 | Change state to "Available" | State changes |
| 7 | Verify Team assignment | Correct team shown |
| 8 | Verify Queue visibility | Assigned queues visible |

**Agent Verification Checklist (per agent):**

```
   AGENT LOGIN VERIFICATION
   Agent Name: ___________________  Extension: __________
   Site:  -  Chennai   -  London   -  NJ   -  Mumbai
   Wave:  -  1   -  2   -  3
   VERIFICATION:
   -  Login successful
   -  Correct Team displayed: ___________________
   -  State change works (Available/Not Ready)
   -  Phone extension registered
   -  Test call received successfully
   -  Agent Assist visible (Premium agents only)
   -  Digital channels visible (if applicable)
   Issues: _________________________________________________________
   Verified By: ___________________  Time: __________
```

---

