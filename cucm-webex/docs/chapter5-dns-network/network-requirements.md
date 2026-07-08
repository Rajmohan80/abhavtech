# Network Requirements

## 5.1 DNS Architecture Overview

### 5.1.1 Webex DNS Requirements Summary

| Service | FQDN Pattern | Resolution | Purpose |
|---------|--------------|------------|---------|
| Webex Calling | `*.webex.com` | Public DNS | Core calling services |
| Webex Edge | `*.ucmgmt.cisco.com` | Public DNS | Device management |
| Local Gateway | `*.ciscowebex.com` | Public DNS | LGW registration |
| Media Nodes | `*.wbx2.com` | Public DNS | Voice/video media |
| Control Hub | `admin.webex.com` | Public DNS | Administration |

### 5.1.2 DNS Resolution Architecture

```
+-----------------------------------------------------------------+
|              DNS RESOLUTION - ABHAVTECH                          |
+-----------------------------------------------------------------+
|                                                                 |
|  INTERNAL CLIENTS              EXTERNAL RESOLUTION              |
|                                                                 |
|  +----------+    +----------+    +----------+    +----------+ |
|  | Webex App|--->| Internal |--->| Forwarder|--->| Public   | |
|  | / Phone  |    | DNS      |    | (SD-WAN) |    | DNS      | |
|  +----------+    +----------+    +----------+    +----------+ |
|                       |                               |        |
|                       | Split DNS                     |        |
|                       v                               v        |
|                  +----------+                   +----------+  |
|                  | Internal |                   | Webex    |  |
|                  | Zones    |                   | Cloud    |  |
|                  +----------+                   +----------+  |
|                                                                 |
|  KEY REQUIREMENT: No DNS interception for *.webex.com          |
|                                                                 |
+-----------------------------------------------------------------+
```

### 5.1.3 Critical DNS Rules

| Rule | Requirement | Validation |
|------|-------------|------------|
| No proxy | Webex domains must bypass web proxy | `nslookup webex.com` returns public IP |
| No interception | SSL inspection disabled for Webex | Certificate = DigiCert (not internal CA) |
| Low TTL respect | Honor TTL values (failover) | DNS cache TTL <= 300s |
| IPv4 preferred | Dual-stack: prefer A over AAAA | Client config or DNS policy |

---

