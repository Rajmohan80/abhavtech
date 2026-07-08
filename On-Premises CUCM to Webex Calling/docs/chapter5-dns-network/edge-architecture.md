# Edge Architecture

## 5.7 Network Connectivity Options

### 5.7.1 Webex Calling Connectivity Architecture

```
+-----------------------------------------------------------------+
|  CONNECTIVITY OPTIONS - ABHAVTECH                                |
+-----------------------------------------------------------------+
|                                                                 |
|  OPTION 1: INTERNET (Current - All Sites)                      |
|  -----------------------------------------                      |
|  Path: Client -> SD-WAN -> Internet -> Webex Cloud                |
|  Pros: Simple, no additional cost                              |
|  Cons: Best-effort, dependent on ISP                           |
|  Status: SELECTED for Abhavtech                                |
|                                                                 |
|  OPTION 2: WEBEX EDGE CONNECT (Future Consideration)           |
|  -----------------------------------------------                |
|  Path: Client -> SD-WAN -> Equinix Fabric -> Webex Cloud          |
|  Pros: Private connectivity, SLA-backed                        |
|  Cons: Additional cost, Equinix presence required              |
|  Status: Not deployed (evaluate post-migration)                |
|                                                                 |
|  OPTION 3: CLOUD ONRAMP (Cisco SD-WAN Integration)             |
|  -------------------------------------------------              |
|  Path: Client -> SD-WAN -> Cisco Cloud OnRamp -> Webex            |
|  Pros: Integrated with existing SD-WAN                         |
|  Cons: Requires Cisco Cloud OnRamp license                     |
|  Status: Available (ABV-SDWAN-2024 compatible)                 |
|                                                                 |
+-----------------------------------------------------------------+
```

### 5.7.2 Bandwidth Requirements

| Site | Users | Concurrent Calls | Voice BW | Video BW | Total Required |
|------|-------|------------------|----------|----------|----------------|
| Mumbai HQ | 1,200 | 120 | 15 Mbps | 60 Mbps | 75 Mbps |
| Chennai | 450 | 45 | 6 Mbps | 22 Mbps | 28 Mbps |
| Bangalore | 180 | 18 | 2 Mbps | 9 Mbps | 11 Mbps |
| Delhi | 150 | 15 | 2 Mbps | 8 Mbps | 10 Mbps |
| Noida | 120 | 12 | 2 Mbps | 6 Mbps | 8 Mbps |
| Pune | 100 | 10 | 1 Mbps | 5 Mbps | 6 Mbps |
| Hyderabad | 200 | 20 | 3 Mbps | 10 Mbps | 13 Mbps |
| London | 520 | 52 | 7 Mbps | 26 Mbps | 33 Mbps |
| Frankfurt | 280 | 28 | 4 Mbps | 14 Mbps | 18 Mbps |
| New Jersey | 480 | 48 | 6 Mbps | 24 Mbps | 30 Mbps |
| Dallas | 270 | 27 | 3 Mbps | 14 Mbps | 17 Mbps |

**Calculation Basis:**
- 10% concurrent call ratio
- Voice: 128 kbps/call
- Video: 2 Mbps/call (50% video usage)

### 5.7.3 Current WAN Capacity (ABV-SDWAN-2024)

| Site | Primary Link | Backup Link | Headroom |
|------|--------------|-------------|----------|
| Mumbai HQ | 1 Gbps MPLS | 500 Mbps Internet | OK Sufficient |
| Chennai | 500 Mbps MPLS | 200 Mbps Internet | OK Sufficient |
| Bangalore | 200 Mbps MPLS | 100 Mbps Internet | OK Sufficient |
| Delhi | 200 Mbps MPLS | 100 Mbps Internet | OK Sufficient |
| Noida | 100 Mbps MPLS | 50 Mbps Internet | OK Sufficient |
| Pune | 100 Mbps MPLS | 50 Mbps Internet | OK Sufficient |
| Hyderabad | 200 Mbps MPLS | 100 Mbps Internet | OK Sufficient |
| London | 500 Mbps MPLS | 200 Mbps Internet | OK Sufficient |
| Frankfurt | 200 Mbps MPLS | 100 Mbps Internet | OK Sufficient |
| New Jersey | 500 Mbps MPLS | 200 Mbps Internet | OK Sufficient |
| Dallas | 200 Mbps MPLS | 100 Mbps Internet | OK Sufficient |

---

