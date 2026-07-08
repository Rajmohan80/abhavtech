# Extension Mobility -- Webex Calling Hotdesking

> **[!]️ GAP SEVERITY: HIGH | Affects: Open-plan offices, shared desks, Mumbai HQ**

## 2A.2.1 Problem Statement

CUCM Extension Mobility allows any user to log into any IP phone on the corporate network and receive their personal profile -- extension number, speed dials, ringtone, voicemail access, and calling privileges. This is widely used in Abhavtech's Mumbai HQ hot-desk seating areas and shared workstations across India sites.

Webex Calling offers a **Hotdesking** feature for MPP phones that provides similar functionality with key differences:
- The Webex hotdesking host device must be explicitly configured as a hotdesk station
- Each user must have a Webex Calling license
- Feature is **MPP-phone-only** -- no equivalent for Webex App

## 2A.2.2 Webex Calling Hotdesking Configuration

> **License Note:** Hotdesking in Webex Calling does NOT require an additional license. Any user with a Webex Calling Professional license can use hotdesking. The host device must be a supported Cisco MPP phone (68xx, 78xx, 88xx series).

**Abhavtech hotdesking configuration approach:**

1. Identify all shared/hot-desk stations in Mumbai HQ -- estimated **40 stations** in open-plan floors 3-5
2. Configure each hot-desk MPP phone as a Hotdesking Host in Control Hub: **Users > Devices > select phone > Enable Hotdesking**
3. Set idle extension for each hot-desk station (e.g., `Floor-3-Desk-A`) for incoming calls when no user is logged in
4. Set auto-logout timer -- recommended **8 hours** for Mumbai HQ, **12 hours** for after-hours staff
5. Users log in by pressing the **Hotdesking** softkey and authenticating with Webex credentials
6. Upon login, the phone registers to the user's Webex Calling extension -- all calls, voicemail, and speed dials reflect their profile

## 2A.2.3 Limitation -- No Cross-Platform Hotdesking During Coexistence

During the coexistence period, a CUCM user **cannot** hotdesk into a Webex Calling MPP phone and vice versa. Extension Mobility across platforms is explicitly not supported.

> **Migration Batch Rule:** The migration batch for each site must include all hot-desk stations and the users who share them in the same wave.

## 2A.2.4 Validation Steps

- [ ] Inventory all hot-desk stations (Mumbai HQ floors 3, 4, 5 -- estimated 40 stations)
- [ ] Confirm MPP phone model compatibility (Cisco 8865 and 8845 -- both supported [OK])
- [ ] Configure 5 pilot hotdesk stations during IT department pilot batch
- [ ] Test user login via Webex credentials -- verify extension registration within 30 seconds
- [ ] Test auto-logout timer -- verify idle station reverts to generic extension
- [ ] Test voicemail access from hotdesk phone
- [ ] Document hotdesking procedure in user training materials

---
