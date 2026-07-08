# Feature Migration

## 2.5 Feature Design

### 2.5.1 Hunt Groups

**Hunt Group Migration from CUCM:**

| Hunt Group | Pilot Number | Pattern | Members | Migration Strategy |
|------------|--------------|---------|---------|-------------------|
| HG-Mumbai-Reception | +91-22-4960-0000 | Circular | 8 | Migrate batch 2 |
| HG-Mumbai-IT | +91-22-4960-0001 | Top Down | 12 | Migrate batch 1 (Pilot) |
| HG-Mumbai-HR | +91-22-4960-0002 | Circular | 6 | Migrate batch 2 |
| HG-Mumbai-Finance | +91-22-4960-0003 | Longest Idle | 8 | Migrate batch 3 |
| HG-Chennai-Reception | +91-44-4960-0000 | Circular | 4 | Migrate batch 4 |
| HG-Bangalore-Reception | +91-80-4960-0000 | Circular | 3 | Migrate batch 4 |
| HG-Delhi-Reception | +91-11-4960-0000 | Circular | 3 | Migrate batch 4 |
| HG-London-Reception | +44-20-4960-0000 | Circular | 4 | Migrate batch 5 |
| HG-London-Sales | +44-20-4960-0001 | Longest Idle | 10 | Migrate batch 5 |
| HG-NJ-Reception | +1-201-496-0000 | Circular | 4 | Migrate batch 6 |
| HG-NJ-Sales | +1-201-496-0001 | Longest Idle | 8 | Migrate batch 6 |
| HG-Dallas-Reception | +1-214-496-0000 | Circular | 3 | Migrate batch 6 |

**Webex Calling Hunt Group Configuration:**

```yaml
# Hunt Group Template - Mumbai Reception
hunt_group:
  name: "HG-Mumbai-Reception"
  location: "ABV-Mumbai-HQ"
  phone_number: "+91-22-4960-0000"
  extension: "8001"
  language: "en_IN"
  time_zone: "Asia/Kolkata"
  call_policies:
    policy: "CIRCULAR"          # Options: CIRCULAR, REGULAR (Top-Down), SIMULTANEOUS, UNIFORM (Longest Idle)
    ring_pattern: "NORMAL"
    forward_enabled: true
    forward_destination: "+91-22-4960-0001"  # Forward to IT Support if no answer
    forward_after_rings: 6
    wait_for_answer: true
    no_answer_number_of_rings: 4
    distinctive_ring: true
  agents:
    - extension: "1001"
      weight: null              # Not applicable for CIRCULAR
    - extension: "1002"
    - extension: "1003"
    - extension: "1004"
```

**Critical: Hunt Group Migration Batching Rule**

```
+-----------------------------------------------------------------------------+
|  [!]️ MIGRATION RULE: Hunt Group members MUST migrate together               |
|                                                                             |
|  All agents in a hunt group must move to Webex Calling in the same batch.  |
|  Split migration (some agents on CUCM, some on Webex) will break routing.  |
|                                                                             |
|  Pre-migration checklist:                                                  |
|  [ ] Identify all hunt group members                                         |
|  [ ] Assign all members to same migration batch                             |
|  [ ] Validate all member phones are MPP-capable                             |
|  [ ] Configure hunt group in Webex before member cutover                    |
+-----------------------------------------------------------------------------+
```

### 2.5.2 Auto Attendants

**Auto Attendant Design:**

| Auto Attendant | Location | Main Number | Hours | Language |
|----------------|----------|-------------|-------|----------|
| AA-Mumbai-Main | Mumbai HQ | +91-22-4960-0000 | 24/7 | English/Hindi |
| AA-Chennai | Chennai | +91-44-4960-0000 | Business | English/Tamil |
| AA-London-Main | London | +44-20-4960-0000 | Business | English |
| AA-Frankfurt-Main | Frankfurt | +49-69-4960-0000 | Business | German/English |
| AA-NewJersey | New Jersey | +1-201-496-0000 | Business | English |
| AA-TollFree-India | Mumbai | 1800-266-1000 | 24/7 | English/Hindi |
| AA-TollFree-UK | London | +44-800-096-1000 | Business | English |
| AA-TollFree-US | New Jersey | +1-800-096-1000 | Business | English |

**Sample Auto Attendant Menu (Mumbai Main):**

```
+-----------------------------------------------------------------------------+
|              AA-MUMBAI-MAIN - IVR MENU STRUCTURE                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  GREETING: "Welcome to Abhavtech. Your call may be recorded for quality."  |
|                                                                             |
|  BUSINESS HOURS (9 AM - 6 PM IST):                                         |
|  =================================                                         |
|  "Press 1 for Sales"                    -> Transfer to HG-Mumbai-Sales      |
|  "Press 2 for Customer Support"         -> Transfer to Call Queue (Phase 2) |
|  "Press 3 for Human Resources"          -> Transfer to HG-Mumbai-HR         |
|  "Press 4 for Finance"                  -> Transfer to HG-Mumbai-Finance    |
|  "Press 5 for IT Support"               -> Transfer to HG-Mumbai-IT         |
|  "Press 0 for Reception"                -> Transfer to HG-Mumbai-Reception  |
|  "To dial by extension, press 9"        -> Extension dialing enabled        |
|  No input timeout (10 sec)              -> Transfer to Reception            |
|                                                                             |
|  AFTER HOURS (6 PM - 9 AM IST):                                            |
|  ==============================                                            |
|  "Thank you for calling Abhavtech. Our office is currently closed.         |
|   Office hours are Monday to Friday, 9 AM to 6 PM India Standard Time.    |
|   Please leave a message after the tone, or call back during business      |
|   hours. For emergencies, press 1 to reach our on-call support."          |
|                                                                             |
|  Press 1                                -> After-hours mobile (rotational) |
|  No input                               -> Voicemail (general mailbox)     |
|                                                                             |
|  HOLIDAY SCHEDULE:                                                         |
|  =================                                                         |
|  Indian national holidays               -> After-hours greeting            |
|  Configured in Control Hub schedules                                       |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 2.5.3 Virtual Lines (Shared Line Migration)

**Shared Line to Virtual Line Migration:**

Webex Calling uses **Virtual Lines** to replace CUCM shared lines. Virtual Lines are independently licensed line appearances that can be shared across multiple devices.

| CUCM Shared Line | Users | Virtual Line Name | Extension | DID |
|------------------|-------|-------------------|-----------|-----|
| Reception Mumbai | 4 | VL-Mumbai-Reception | 8900 | +91-22-4960-8900 |
| Reception Chennai | 2 | VL-Chennai-Reception | 8901 | +91-44-4960-8901 |
| Finance Hotline | 3 | VL-Finance-Hotline | 8902 | +91-22-4960-8902 |
| Executive Admin | 2 | VL-Exec-Admin | 8903 | +91-22-4960-8903 |
| CEO Assistant | 2 | VL-CEO-Assistant | 8904 | Internal only |

**Virtual Line Configuration:**

```yaml
# Virtual Line Template
virtual_line:
  name: "VL-Mumbai-Reception"
  location: "ABV-Mumbai-HQ"
  extension: "8900"
  phone_number: "+91-22-4960-8900"
  calling_line_id:
    first_name: "Reception"
    last_name: "Mumbai"
  announcement_language: "en_IN"
  devices:
    - type: "MPP"
      model: "Cisco 8865"
      mac: "AA:BB:CC:DD:EE:01"
      line_key_position: 2
    - type: "MPP"
      model: "Cisco 8865"
      mac: "AA:BB:CC:DD:EE:02"
      line_key_position: 2
    - type: "MPP"
      model: "Cisco 8845"
      mac: "AA:BB:CC:DD:EE:03"
      line_key_position: 2
    - type: "MPP"
      model: "Cisco 8845"
      mac: "AA:BB:CC:DD:EE:04"
      line_key_position: 2
```

### 2.5.4 Call Park & Pickup

**Call Park Configuration:**

| Location | Park Extensions | Range | Timeout | Recall Destination |
|----------|-----------------|-------|---------|-------------------|
| Mumbai HQ | 10 | #7810 - #7819 | 60 sec | Original parker |
| Chennai | 5 | #7820 - #7824 | 60 sec | Original parker |
| Bangalore | 5 | #7825 - #7829 | 60 sec | Original parker |
| London | 5 | #7910 - #7914 | 60 sec | Original parker |
| Frankfurt | 5 | #7920 - #7924 | 60 sec | Original parker |
| New Jersey | 5 | #7930 - #7934 | 60 sec | Original parker |
| Dallas | 3 | #7935 - #7937 | 60 sec | Original parker |

**Call Pickup Groups:**

| Location | Pickup Group | Extensions | Pickup Code |
|----------|--------------|------------|-------------|
| Mumbai - IT | CPG-Mumbai-IT | 1100-1120 | *98 |
| Mumbai - HR | CPG-Mumbai-HR | 1200-1220 | *98 |
| Mumbai - Finance | CPG-Mumbai-Fin | 1300-1330 | *98 |
| Mumbai - Sales | CPG-Mumbai-Sales | 1400-1450 | *98 |
| Chennai - All | CPG-Chennai | 2000-2300 | *98 |
| London - All | CPG-London | 4000-4400 | *98 |

---

