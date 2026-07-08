# Firewall Configuration Templates

## 5.5 Firewall Requirements by Region

### 5.5.1 Webex Calling - Required Destinations

**Reference:** https://help.webex.com/article/b2exve

| Destination | Port | Protocol | Purpose |
|-------------|------|----------|---------|
| `*.webex.com` | 443 | TCP/TLS | Signaling, API |
| `*.wbx2.com` | 443 | TCP/TLS | Media services |
| `*.ciscospark.com` | 443 | TCP/TLS | Messaging |
| `*.webexcontent.com` | 443 | TCP/TLS | Content sharing |
| Webex Media | 19560-65535 | UDP | RTP/SRTP media |
| Webex Media | 5004 | UDP | Alternate media |

### 5.5.2 India Firewall Rules (LGW Sites)

```
+-----------------------------------------------------------------+
|  INDIA FIREWALL RULES - LOCAL GATEWAY                           |
+-----------------------------------------------------------------+
|                                                                 |
|  OUTBOUND (LGW -> Webex Cloud)                                  |
|  ----------------------------                                   |
|  Source: LGW IPs (10.x.50.10)                                  |
|  Destination: *.webex.com, *.ciscowebex.com                    |
|  Ports: 443/TCP (TLS), 8443/TCP (registration)                 |
|  Action: ALLOW                                                  |
|                                                                 |
|  OUTBOUND (LGW -> PSTN Provider)                                |
|  ------------------------------                                 |
|  Source: LGW IPs                                               |
|  Destination: Provider SBC IPs (per contract)                  |
|  Ports: 5060/TCP (SIP), 5061/TCP (SIPS)                        |
|  Ports: 10000-20000/UDP (RTP)                                  |
|  Action: ALLOW                                                  |
|                                                                 |
|  INBOUND (PSTN Provider -> LGW)                                 |
|  -----------------------------                                  |
|  Source: Provider SBC IPs                                      |
|  Destination: LGW Public/NAT IPs                               |
|  Ports: 5060-5061/TCP, 10000-20000/UDP                         |
|  Action: ALLOW                                                  |
|                                                                 |
+-----------------------------------------------------------------+
```

### 5.5.3 Firewall Rule Template (Palo Alto)

```
# Webex Calling - Outbound
set rulebase security rules Webex-Calling-Out from trust to untrust
set rulebase security rules Webex-Calling-Out source any
set rulebase security rules Webex-Calling-Out destination Webex-Cloud-FQDN
set rulebase security rules Webex-Calling-Out application ssl web-browsing webex
set rulebase security rules Webex-Calling-Out service application-default
set rulebase security rules Webex-Calling-Out action allow

# Webex Media - Outbound
set rulebase security rules Webex-Media-Out from trust to untrust
set rulebase security rules Webex-Media-Out source Voice-VLAN
set rulebase security rules Webex-Media-Out destination any
set rulebase security rules Webex-Media-Out application rtp
set rulebase security rules Webex-Media-Out service service-udp-19560-65535
set rulebase security rules Webex-Media-Out action allow

# SSL Decryption Bypass
set rulebase decryption rules No-Decrypt-Webex from trust to untrust
set rulebase decryption rules No-Decrypt-Webex destination Webex-Cloud-FQDN
set rulebase decryption rules No-Decrypt-Webex action no-decrypt
```

### 5.5.4 Firewall Rule Template (Cisco FTD)

```
# Object Groups
object-group network Webex-Cloud
 network-object object webex.com
 network-object object wbx2.com
 network-object object ciscospark.com

object-group service Webex-Ports
 service-object tcp destination eq 443
 service-object tcp destination eq 8443
 service-object udp destination range 19560 65535

# Access Rules
access-list Outside_In extended permit object-group Webex-Ports any object-group Webex-Cloud
access-list Inside_Out extended permit object-group Webex-Ports object-group Voice-Networks object-group Webex-Cloud

# SSL Inspection Bypass
ssl-policy-config
 match Webex-Cloud action do-not-decrypt
```

### 5.5.5 Regional Firewall Summary

| Region | LGW Rules | CCPP Rules | Media Ports |
|--------|-----------|------------|-------------|
| India (7 sites) | Required | N/A | UDP 19560-65535 |
| UK | N/A | Provider IPs | UDP 19560-65535 |
| EU | N/A | Provider IPs | UDP 19560-65535 |
| Americas | N/A | Provider IPs | UDP 19560-65535 |

---

