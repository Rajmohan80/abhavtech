# DNS Configuration Templates

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

## 5.2 India DNS Configuration

### 5.2.1 India Internal DNS Servers

| Site | DNS Server | IP Address | Forwarder |
|------|------------|------------|-----------|
| Mumbai HQ | dc-mum-01.abhavtech.com | 10.1.10.5 | 8.8.8.8, 8.8.4.4 |
| Mumbai HQ | dc-mum-02.abhavtech.com | 10.1.10.6 | 8.8.8.8, 8.8.4.4 |
| Chennai | dc-che-01.abhavtech.com | 10.2.10.5 | 10.1.10.5 (via SD-WAN) |
| Bangalore | dc-blr-01.abhavtech.com | 10.3.10.5 | 10.1.10.5 (via SD-WAN) |

### 5.2.2 India LGW DNS Records

**Internal DNS Zone: abhavtech.com**

```dns
; Local Gateway A Records
lgw-mum-01.abhavtech.com.    IN  A  10.1.50.10
lgw-mum-02.abhavtech.com.    IN  A  10.1.50.11
lgw-che-01.abhavtech.com.    IN  A  10.2.50.10
lgw-blr-01.abhavtech.com.    IN  A  10.3.50.10
lgw-del-01.abhavtech.com.    IN  A  10.4.50.10
lgw-noi-01.abhavtech.com.    IN  A  10.5.50.10
lgw-hyd-01.abhavtech.com.    IN  A  10.7.50.10

; SRV Records (if using SRV-based routing)
_sips._tcp.lgw-mum.abhavtech.com.  IN  SRV  10 10 5061 lgw-mum-01.abhavtech.com.
_sips._tcp.lgw-mum.abhavtech.com.  IN  SRV  20 10 5061 lgw-mum-02.abhavtech.com.
```

### 5.2.3 Windows DNS Configuration (Mumbai)

```powershell
# Add Conditional Forwarder for Webex (bypass internal resolution)
Add-DnsServerConditionalForwarderZone -Name "webex.com" -MasterServers 8.8.8.8,8.8.4.4
Add-DnsServerConditionalForwarderZone -Name "wbx2.com" -MasterServers 8.8.8.8,8.8.4.4
Add-DnsServerConditionalForwarderZone -Name "ciscospark.com" -MasterServers 8.8.8.8,8.8.4.4

# Verify
Get-DnsServerZone | Where-Object {$_.ZoneType -eq 'Forwarder'}
```

---

## 5.3 EMEA DNS Configuration

### 5.3.1 EMEA DNS Servers

| Site | DNS Server | IP Address | Forwarder |
|------|------------|------------|-----------|
| London | dc-lon-01.abhavtech.com | 10.20.10.5 | 8.8.8.8, 1.1.1.1 |
| Frankfurt | dc-fra-01.abhavtech.com | 10.21.10.5 | 8.8.8.8, 1.1.1.1 |

### 5.3.2 EMEA-Specific DNS Considerations

| Requirement | Configuration |
|-------------|---------------|
| GDPR-compliant DNS | Use EU-based public DNS or internal only |
| UK data path | London clients resolve via UK DNS first |
| No LGW records | CCPP used - no internal gateway DNS needed |

---

## 5.4 Americas DNS Configuration

### 5.4.1 Americas DNS Servers

| Site | DNS Server | IP Address | Forwarder |
|------|------------|------------|-----------|
| New Jersey | dc-nj-01.abhavtech.com | 10.30.10.5 | 8.8.8.8, 8.8.4.4 |
| Dallas | dc-dal-01.abhavtech.com | 10.31.10.5 | 10.30.10.5 |

### 5.4.2 E911 Location Service DNS

```dns
; RedSky/Intrado E911 service endpoints (if self-hosted LIS)
e911-lis.abhavtech.com.    IN  A  10.30.50.20
```

---

