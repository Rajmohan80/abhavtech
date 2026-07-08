# 3.7 URL Filtering & DNS Security

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-SEC-3.7 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 1. Executive Summary

This section documents the URL filtering and DNS security implementation for Abhavtech's SD-WAN deployment. The solution leverages Cisco Umbrella integration for cloud-delivered DNS security and on-box URL filtering capabilities to provide comprehensive web security across all sites without backhauling traffic.

### 1.1 Web Security Architecture

```
+------------------------------------------------------------------+
|                   WEB SECURITY ARCHITECTURE                       |
+------------------------------------------------------------------+
|                                                                   |
|  Layer 1: DNS Security (Umbrella)                                 |
|  +----------------------------------------------------------+    |
|  | - Block malicious domains at DNS resolution               |    |
|  | - Category-based filtering                                |    |
|  | - Threat intelligence integration                         |    |
|  +----------------------------------------------------------+    |
|                            |                                      |
|                            v                                      |
|  Layer 2: URL Filtering (On-Box)                                  |
|  +----------------------------------------------------------+    |
|  | - Full URL path inspection                                |    |
|  | - Reputation-based blocking                               |    |
|  | - Custom allow/block lists                                |    |
|  +----------------------------------------------------------+    |
|                            |                                      |
|                            v                                      |
|  Layer 3: SSL Inspection (Optional)                               |
|  +----------------------------------------------------------+    |
|  | - Decrypt HTTPS for deep inspection                       |    |
|  | - Bypass for sensitive categories                         |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 1.2 Deployment Summary

| Site | DNS Security | URL Filter | SSL Inspect | Method |
|------|--------------|------------|-------------|--------|
| Mumbai DC | Umbrella | Full | Yes | SIG Tunnel |
| Chennai DR | Umbrella | Full | Yes | SIG Tunnel |
| London | Umbrella | Full | Yes | SIG Tunnel |
| New Jersey | Umbrella | Full | Yes | SIG Tunnel |
| Bangalore | Umbrella | Standard | No | DNS Redirect |
| Delhi | Umbrella | Standard | No | DNS Redirect |
| Frankfurt | Umbrella | Standard | No | DNS Redirect |
| Dallas | Umbrella | Standard | No | DNS Redirect |
| Noida | Umbrella | Basic | No | DNS Only |

---

## 2. Cisco Umbrella Integration

### 2.1 Umbrella Architecture

```
+------------------------------------------------------------------+
|                   UMBRELLA INTEGRATION                            |
+------------------------------------------------------------------+
|                                                                   |
|  Branch Site                      Umbrella Cloud                  |
|  +----------------+              +----------------+               |
|  | WAN Edge       |              | Umbrella       |               |
|  | Router         |   DNS/HTTPS  | Resolvers      |               |
|  |                |------------->| 208.67.222.222 |               |
|  | DNS Redirect   |              | 208.67.220.220 |               |
|  +-------+--------+              +-------+--------+               |
|          |                               |                        |
|          |                               v                        |
|          |                       +----------------+               |
|          |                       | Threat Intel   |               |
|          |                       | - Malware      |               |
|          |                       | - Phishing     |               |
|          |                       | - C2           |               |
|          |                       +----------------+               |
|          |                                                        |
|          |    Hub Site (SIG Tunnel)                              |
|          |    +----------------+              +----------------+  |
|          +--->| WAN Edge       |   IPsec      | Umbrella SIG   |  |
|               | DC/Hub         |------------->| (Full Proxy)   |  |
|               | SIG Tunnel     |              +----------------+  |
|               +----------------+                                  |
|                                                                   |
+------------------------------------------------------------------+
```

### 2.2 Umbrella Configuration

```
! Umbrella DNS Configuration (Branch Sites)
umbrella
 token <UMBRELLA_REGISTRATION_TOKEN>
 dnscrypt
 !
 resolver 208.67.222.222
 resolver 208.67.220.220
 !
 vrf Employee
  dns-resolver umbrella
 !
 vrf Guest
  dns-resolver umbrella
 !
!

! DNS Redirect to Umbrella
ip name-server 208.67.222.222
ip name-server 208.67.220.220

! Prevent DNS bypass
ip access-list extended BLOCK-EXTERNAL-DNS
 permit udp any host 208.67.222.222 eq 53
 permit udp any host 208.67.220.220 eq 53
 deny udp any any eq 53 log
 permit ip any any

interface GigabitEthernet0/0/2.10
 ip access-group BLOCK-EXTERNAL-DNS in
!
```

### 2.3 Umbrella SIG Tunnel (DC/Hub Sites)

```
! Secure Internet Gateway (SIG) Tunnel
crypto ikev2 profile UMBRELLA-SIG
 match identity remote fqdn domain cisco.com
 authentication remote rsa-sig
 authentication local rsa-sig
 pki trustpoint UMBRELLA-CA
!

interface Tunnel100
 description "Umbrella SIG Tunnel"
 ip address negotiated
 ip mtu 1400
 tunnel source GigabitEthernet0/0/1
 tunnel mode ipsec ipv4
 tunnel destination dynamic
 tunnel protection ipsec profile UMBRELLA-IPSEC
!

! Route traffic through SIG
ip route 0.0.0.0 0.0.0.0 Tunnel100 vpn 10
ip route 0.0.0.0 0.0.0.0 Tunnel100 vpn 20
```

---

## 3. URL Filtering Categories

### 3.1 Category Definitions

```
+------------------------------------------------------------------+
|                   URL FILTERING CATEGORIES                        |
+------------------------------------------------------------------+
|                                                                   |
|  BLOCKED CATEGORIES (All Users):                                  |
|  +----------------------------------------------------------+    |
|  | Category              | Reason                            |   |
|  +----------------------------------------------------------+    |
|  | Adult Content         | Policy violation                  |   |
|  | Gambling              | Policy violation                  |   |
|  | Malware               | Security threat                   |   |
|  | Phishing              | Security threat                   |   |
|  | Hacking               | Security threat                   |   |
|  | Proxy/Anonymizer      | Policy bypass attempt             |   |
|  | Illegal Activities    | Legal compliance                  |   |
|  | Weapons               | Policy violation                  |   |
|  | Hate/Violence         | Policy violation                  |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  RESTRICTED CATEGORIES (Employees - Limited):                     |
|  +----------------------------------------------------------+    |
|  | Social Networking     | Limited during work hours         |   |
|  | Streaming Media       | Bandwidth limited                 |   |
|  | Personal Storage      | Data loss prevention              |   |
|  | Gaming                | Limited during work hours         |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  ALLOWED CATEGORIES:                                              |
|  +----------------------------------------------------------+    |
|  | Business              | Always permitted                  |   |
|  | Technology            | Always permitted                  |   |
|  | Education             | Always permitted                  |   |
|  | News                  | Always permitted                  |   |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 3.2 Per-VPN URL Policy

| VPN | Block | Restrict | Allow | Custom |
|-----|-------|----------|-------|--------|
| 10 (Employee) | Security, Adult, Gambling | Social, Streaming | Business, Tech | whitelist.txt |
| 20 (Guest) | Security, Adult, All Risky | Social, Streaming | News, Weather | None |
| 30 (IoT) | All except whitelisted | N/A | Cloud IoT platforms | iot-whitelist.txt |
| 40 (Voice) | All | N/A | Voice services only | voice-whitelist.txt |

### 3.3 URL Filtering Configuration

```
! UTD URL Filtering Configuration
utd engine standard
 web-filter
  url-filtering
   sourcedb external
   cloud-lookup
  !
  block-page-interface vpn 10 FastEthernet0
  block-page-interface vpn 20 FastEthernet0
  
  ! Block Categories
  block-category adult-and-pornography
  block-category gambling
  block-category malware
  block-category phishing-and-other-frauds
  block-category hacking
  block-category proxy-avoidance-and-anonymizers
  block-category weapons
  block-category hate-and-racism
  
  ! Alert Categories (monitor only)
  alert-category social-networking
  alert-category streaming-media
  alert-category peer-to-peer
  
  ! Allow Categories
  allow-category business-and-economy
  allow-category computer-and-internet-info
  allow-category educational-institutions
 !
!
```

---

## 4. Custom Allow/Block Lists

### 4.1 Whitelist Configuration

```
! Custom Whitelist for Business Applications
url-whitelist ABHAVTECH-WHITELIST
 url *.abhavtech.com
 url *.microsoft.com
 url *.office365.com
 url *.salesforce.com
 url *.sap.com
 url *.servicenow.com
 url *.workday.com
 url *.okta.com
 url *.zoom.us
 url *.webex.com
 url *.cisco.com
 url *.aws.amazon.com
 url *.azure.com
!

! IoT Whitelist
url-whitelist IOT-WHITELIST
 url *.amazonaws.com
 url *.azure-devices.net
 url *.iot.us-east-1.amazonaws.com
 url *.honeywell.com
 url *.schneider-electric.com
!
```

### 4.2 Blacklist Configuration

```
! Custom Blacklist for Blocked Domains
url-blacklist ABHAVTECH-BLACKLIST
 url *.torproject.org
 url *.1337x.to
 url *.thepiratebay.org
 url *.mega.nz
 url *.dropbox.com      ! Personal cloud storage
 url *.wetransfer.com   ! File sharing
 url *.sendspace.com    ! File sharing
!

! Competitor Blacklist (Prevent data leakage)
url-blacklist COMPETITOR-BLACKLIST
 url *.competitor1.com
 url *.competitor2.com
!
```

---

## 5. DNS Security Features

### 5.1 DNS-Layer Protection

```
+------------------------------------------------------------------+
|                   DNS-LAYER PROTECTION                            |
+------------------------------------------------------------------+
|                                                                   |
|  DNS Query Process with Umbrella:                                 |
|                                                                   |
|  1. User requests: www.malicious-site.com                        |
|     +-------+     DNS Query     +-----------+                     |
|     | User  |------------------>| WAN Edge  |                     |
|     +-------+                   +-----+-----+                     |
|                                       |                           |
|  2. WAN Edge forwards to Umbrella    |                           |
|     +-----+-----+     DNS Query     +-----------+                 |
|     | WAN Edge  |------------------>| Umbrella  |                 |
|     +-----+-----+                   +-----+-----+                 |
|                                           |                       |
|  3. Umbrella checks threat intelligence  |                       |
|     +-----------+     BLOCKED     +-------+-------+               |
|     | Umbrella  |---------------->| Threat Intel  |               |
|     +-----------+                 | - Known malware|              |
|                                   | - Phishing DB  |              |
|                                   | - C2 servers   |              |
|                                   +---------------+               |
|                                                                   |
|  4. Block page returned instead of malicious IP                   |
|     +-------+     Block Page     +-----------+                    |
|     | User  |<-------------------| WAN Edge  |                    |
|     +-------+                    +-----------+                    |
|                                                                   |
+------------------------------------------------------------------+
```

### 5.2 DNSCrypt Configuration

```
! Enable DNSCrypt for encrypted DNS
umbrella
 dnscrypt
 !
 local-domain abhavtech.com
 local-domain internal.abhavtech.com
 !
 resolver 208.67.222.222
 resolver 208.67.220.220
!

! DNSCrypt ensures:
! - DNS queries encrypted in transit
! - Prevents DNS spoofing
! - Protects against MITM attacks
```

### 5.3 DNS Sinkhole for Malware

```
! DNS Sinkhole Configuration
ip host sinkhole.abhavtech.com 10.254.99.99

! Redirect known bad domains to sinkhole
ip dns spoofing
 ip host malware-domain1.com 10.254.99.99
 ip host malware-domain2.com 10.254.99.99
!

! Sinkhole server configuration
! Captures connection attempts for forensics
! Returns HTTP 403 with warning page
```

---

## 6. Time-Based Policies

### 6.1 Work Hours Restrictions

```
+------------------------------------------------------------------+
|                   TIME-BASED URL POLICIES                         |
+------------------------------------------------------------------+
|                                                                   |
|  Policy Schedule:                                                 |
|  +----------------------------------------------------------+    |
|  | Time Period        | Social Media | Streaming | Gaming   |    |
|  +----------------------------------------------------------+    |
|  | Work Hours         | Rate Limited | Blocked   | Blocked  |    |
|  | (9 AM - 6 PM)      | 5 Mbps       |           |          |    |
|  +----------------------------------------------------------+    |
|  | Lunch Break        | Allowed      | Limited   | Limited  |    |
|  | (12 PM - 1 PM)     |              | 10 Mbps   | 10 Mbps  |    |
|  +----------------------------------------------------------+    |
|  | After Hours        | Allowed      | Allowed   | Allowed  |    |
|  | (6 PM - 9 AM)      |              |           |          |    |
|  +----------------------------------------------------------+    |
|  | Weekends           | Allowed      | Allowed   | Allowed  |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 6.2 Time-Based Configuration

```
! Time Range Definitions
time-range WORK-HOURS
 periodic weekdays 9:00 to 18:00

time-range LUNCH-BREAK
 periodic weekdays 12:00 to 13:00

time-range AFTER-HOURS
 periodic weekdays 18:00 to 23:59
 periodic weekdays 0:00 to 9:00

time-range WEEKENDS
 periodic weekend 0:00 to 23:59

! URL Policy with Time Ranges
policy
 data-policy URL-TIME-POLICY
  vpn-list VPN-10-EMPLOYEE
   ! Block streaming during work hours
   sequence 10
    match
     app-list STREAMING
     time-range WORK-HOURS
    action drop
     count STREAMING-BLOCKED-WORK
    !
   !
   
   ! Allow streaming during lunch
   sequence 20
    match
     app-list STREAMING
     time-range LUNCH-BREAK
    action accept
     policer rate 10000000
     count STREAMING-LUNCH
    !
   !
   
   ! Rate limit social media during work
   sequence 30
    match
     app-list SOCIAL-MEDIA
     time-range WORK-HOURS
    action accept
     policer rate 5000000
     count SOCIAL-RATE-LIMITED
    !
   !
  !
 !
!
```

---

## 7. Reporting and Analytics

### 7.1 Umbrella Dashboard Integration

```
+------------------------------------------------------------------+
|                   UMBRELLA REPORTING                              |
+------------------------------------------------------------------+
|                                                                   |
|  Dashboard Widgets:                                               |
|  +----------------------------------------------------------+    |
|  | Top Blocked Categories (Last 24 Hours)                    |   |
|  | 1. Malware           | 1,234 blocks                      |   |
|  | 2. Adult Content     | 567 blocks                        |   |
|  | 3. Gambling          | 234 blocks                        |   |
|  | 4. Phishing          | 189 blocks                        |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Security Events:                                                 |
|  +----------------------------------------------------------+    |
|  | - Malware callbacks blocked: 45                           |   |
|  | - Phishing attempts blocked: 23                           |   |
|  | - C2 connections prevented: 12                            |   |
|  | - Cryptomining blocked: 8                                 |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Top Users (Blocked Requests):                                    |
|  +----------------------------------------------------------+    |
|  | 1. user1@abhavtech.com | 234 blocks                       |   |
|  | 2. user2@abhavtech.com | 156 blocks                       |   |
|  | 3. user3@abhavtech.com | 98 blocks                        |   |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 7.2 Local Logging Configuration

```
! URL Filter Logging
logging host 10.254.1.50 transport udp port 514
logging trap informational

! Log URL filter events
utd engine standard
 logging
  level informational
  syslog host 10.254.1.50
 !
!

! Log Format
! <timestamp> <device> UTD: URL blocked category=<cat> url=<url> user=<ip>
```

---

## 8. Best Practices Summary

### 8.1 DNS Security Best Practices

- Use Umbrella or equivalent cloud DNS security for all sites
- Enable DNSCrypt to protect DNS queries in transit
- Block direct DNS to external servers (prevent bypass)
- Configure local domain exceptions for internal resolution

### 8.2 URL Filtering Best Practices

- Implement defense in depth (DNS + URL + content)
- Use cloud-based reputation for real-time updates
- Create organization-specific whitelist for business apps
- Monitor and tune policies based on user feedback

### 8.3 Policy Management Best Practices

- Document all URL policy decisions with business justification
- Review and update policies quarterly
- Communicate acceptable use policy to users
- Provide feedback mechanism for false positives

### 8.4 Operational Best Practices

- Monitor block page hits for policy effectiveness
- Alert on sudden spikes in security blocks (potential incident)
- Regular review of top blocked categories and users
- Integration with SIEM for correlation

---

## References

| Document | Description | Location |
|----------|-------------|----------|
| Cisco Umbrella Admin Guide | Official Umbrella documentation | docs.umbrella.com |
| SD-WAN URL Filtering Guide | On-box URL filtering | cisco.com |
| Abhavtech Acceptable Use Policy | Corporate web usage policy | SharePoint |
| CIPA Compliance Guide | Content filtering requirements | Internal |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use*
*Document ID: SDWAN-SEC-3.7*
