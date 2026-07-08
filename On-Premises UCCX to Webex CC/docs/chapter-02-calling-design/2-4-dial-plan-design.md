# Chapter 2: Webex Calling Design -- 2.4 Dial Plan Design

## 2.4 Dial Plan Design

!!! note "Inherited from Phase 1"
    The enterprise numbering plan (4-digit extensions, site codes, inter-site ESN dialling, E.164 normalisation) was established in the CUCM→Webex Calling project and is unchanged here. The extension ranges below are a reference. Authoritative design: [CUCM project Ch. 2.4 Dial Plan Design](https://webex-calling.abhavtech.com/chapter2-calling-design/dial-plan-design/).

    Contact centre agents use the same extension range as their site (e.g., Mumbai CC agents: 1000–1174 within site code 81). WxCC does not use a separate extension numbering scheme.

### 2.4.1 Extension Numbering

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH EXTENSION NUMBERING PLAN                              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  EXTENSION FORMAT: 4 Digits                                                |
|  ==========================                                                |
|                                                                             |
|  +--------------------------------------------------------------------+    |
|  |  Site Code | Location        | Extension Range | Users Capacity    |    |
|  +------------+-----------------+-----------------+-------------------+    |
|  |     81     | Mumbai HQ       | 1000-2199       | 1,200 extensions |    |
|  |     82     | Chennai         | 2200-2649       |   450 extensions |    |
|  |     83     | Bangalore       | 2650-2829       |   180 extensions |    |
|  |     84     | Delhi           | 2830-2979       |   150 extensions |    |
|  |     85     | Noida           | 2980-3099       |   120 extensions |    |
|  |     86     | Pune            | 3100-3199       |   100 extensions |    |
|  |     87     | Hyderabad       | 3200-3399       |   200 extensions |    |
|  |     91     | London          | 4000-4519       |   520 extensions |    |
|  |     92     | Frankfurt       | 4520-4799       |   280 extensions |    |
|  |     93     | New Jersey      | 5000-5479       |   480 extensions |    |
|  |     94     | Dallas          | 5480-5749       |   270 extensions |    |
|  +------------+-----------------+-----------------+-------------------+    |
|                                                                             |
|  RESERVED RANGES:                                                          |
|  ================                                                          |
|  0XXX     - Reserved for future                                            |
|  6XXX     - Reserved for system features                                   |
|  7XXX     - Auto Attendants and Call Park                                  |
|  8XXX     - Hunt Groups and Queues                                         |
|  9XXX     - Reserved (avoid OAC conflict)                                  |
|                                                                             |
|  CONFLICT AVOIDANCE:                                                       |
|  ==================                                                        |
|  * First digit of extensions (1-5) ≠ Steering digit (8) ≠ OAC (9)         |
|  * No extension starts with 8 or 9                                        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 2.4.2 ESN (Enterprise Significant Number) Format

```
+-----------------------------------------------------------------------------+
|              ESN DIAL PLAN - INTER-SITE DIALING                              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  ESN FORMAT:   8 - XX - XXXX                                               |
|                |   |     |                                                  |
|                |   |     +-- Extension (4 digits)                          |
|                |   +-------- Site Code (2 digits)                          |
|                +------------ Steering Digit                                |
|                                                                             |
|  EXAMPLES:                                                                 |
|  =========                                                                 |
|  Mumbai user calling Chennai extension 2100:                              |
|    Dial: 8-82-2100  ->  Routes to Chennai ext 2100                         |
|                                                                             |
|  London user calling Mumbai extension 1500:                               |
|    Dial: 8-81-1500  ->  Routes to Mumbai ext 1500                          |
|                                                                             |
|  Dallas user calling Frankfurt extension 4600:                            |
|    Dial: 8-92-4600  ->  Routes to Frankfurt ext 4600                       |
|                                                                             |
|  ESN ROUTING TABLE:                                                        |
|  ==================                                                        |
|  +----------------+----------------+---------------------------------=     |
|  | ESN Prefix     | Location       | Route                           |     |
|  +----------------+----------------+---------------------------------+     |
|  | 881XXXX        | Mumbai HQ      | ABV-Mumbai-HQ                   |     |
|  | 882XXXX        | Chennai        | ABV-Chennai                     |     |
|  | 883XXXX        | Bangalore      | ABV-Bangalore                   |     |
|  | 884XXXX        | Delhi          | ABV-Delhi                       |     |
|  | 885XXXX        | Noida          | ABV-Noida                       |     |
|  | 886XXXX        | Pune           | ABV-Pune                        |     |
|  | 887XXXX        | Hyderabad      | ABV-Hyderabad                   |     |
|  | 891XXXX        | London         | ABV-London                      |     |
|  | 892XXXX        | Frankfurt      | ABV-Frankfurt                   |     |
|  | 893XXXX        | New Jersey     | ABV-NewJersey                   |     |
|  | 894XXXX        | Dallas         | ABV-Dallas                      |     |
|  +----------------+----------------+---------------------------------+     |
|                                                                             |
|  CONFIGURATION:                                                            |
|  Control Hub -> Calling -> Dial Plan -> Location Routing Prefix              |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 2.4.3 PSTN Routing by Region

**India PSTN Dial Plan:**

| Pattern | Description | Route |
|---------|-------------|-------|
| 9[2-9]XXXXXXXXX | India local/STD | Zone LGW |
| 9011[1-9]X. | International | Zone LGW |
| 100 | Police | Emergency |
| 101 | Fire | Emergency |
| 102 | Ambulance | Emergency |
| 1800XXXXXXX | Toll-Free | Zone LGW |

**UK PSTN Dial Plan:**

| Pattern | Description | Route |
|---------|-------------|-------|
| 901[0-9]XXXXXXXX | UK geographic | CCPP |
| 90800XXXXXXX | UK toll-free | CCPP |
| 9+[1-9]X. | International | CCPP |
| 999 | Emergency | Emergency |
| 112 | EU Emergency | Emergency |

**Germany PSTN Dial Plan:**

| Pattern | Description | Route |
|---------|-------------|-------|
| 0[1-9]X. | German national | CCPP |
| 00[1-9]X. | International | CCPP |
| 112 | EU Emergency | Emergency |

**US PSTN Dial Plan:**

| Pattern | Description | Route |
|---------|-------------|-------|
| 91[2-9]XXXXXXXXX | US domestic | CCPP |
| 9011[1-9]X. | International | CCPP |
| 911 | Emergency | E911 |
| 91800XXXXXXX | Toll-Free | CCPP |

### 2.4.4 Emergency Calling Configuration

```
+-----------------------------------------------------------------------------+
|              EMERGENCY CALLING CONFIGURATION BY REGION                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  INDIA:                                                                    |
|  ======                                                                    |
|  Emergency Numbers: 100 (Police), 101 (Fire), 102 (Ambulance), 112        |
|  Callback Number:   Per-location main number                              |
|  Address Format:    Manual entry (no automated E-CNAM in India)           |
|  Routing:           Via Local Gateway to local PSTN                       |
|                                                                             |
|  UK:                                                                       |
|  ===                                                                       |
|  Emergency Numbers: 999, 112                                               |
|  Callback Number:   User's DID                                            |
|  Address Format:    BT Openreach validated                                |
|  Routing:           Via CCPP                                              |
|                                                                             |
|  GERMANY (EU):                                                             |
|  =============                                                             |
|  Emergency Number:  112 (EU standard)                                      |
|  Callback Number:   User's DID                                            |
|  Address Format:    German address format (Straße, PLZ, Stadt)           |
|  Routing:           Via CCPP                                              |
|                                                                             |
|  USA:                                                                      |
|  ====                                                                      |
|  Emergency Number:  911                                                    |
|  Service Type:      E911 (Enhanced 911)                                   |
|  Callback Number:   User's DID                                            |
|  ELIN:             Assigned per location                                  |
|  Address:          Validated dispatchable address per user               |
|  Routing:          Via CCPP with E911 lookup                             |
|                                                                             |
|  REMOTE/WFH USERS:                                                         |
|  =================                                                         |
|  * Users prompted to update emergency address in Webex App               |
|  * Nomadic E911: Address follows user, not device                        |
|  * India WFH: 112 routes to Webex-provided emergency service             |
|  * US WFH: E911 with user-declared address                               |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---
