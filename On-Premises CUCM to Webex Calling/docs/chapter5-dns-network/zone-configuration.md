# Zone Configuration

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

