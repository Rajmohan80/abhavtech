# 4.6 Access Control Lists

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-POL-4.6 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 1. Executive Summary

Access Control Lists (ACLs) in Cisco Catalyst SD-WAN provide packet filtering at multiple levels including implicit, explicit, and zone-based controls. This section defines Abhavtech's ACL strategy for traffic filtering, security enforcement, and compliance requirements.

### 1.1 ACL Architecture Overview

```
+------------------------------------------------------------------+
|                       ACL FRAMEWORK                               |
+------------------------------------------------------------------+
|                                                                   |
|  Implicit ACLs (Built-in)                                         |
|  +----------------------------------------------------------+    |
|  |  Allow: OMP, DTLS, IPsec                                  |    |
|  |  Allow: BFD, STUN, NAT-T                                  |    |
|  |  Deny: All other WAN traffic (default)                    |    |
|  +----------------------------------------------------------+    |
|                            |                                      |
|  Explicit ACLs (Configurable)                                     |
|  +----------------------------------------------------------+    |
|  |  VPN-based      | Interface-based   | Zone-based         |    |
|  |  ACLs           | ACLs              | Firewall           |    |
|  +----------------------------------------------------------+    |
|                            |                                      |
|  Policy-Based ACLs                                                |
|  +----------------------------------------------------------+    |
|  |  Data Policy    | Control Policy    | App-Route Policy   |    |
|  |  (Centralized)  | (Route Filter)    | (SLA-based)        |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 2. Implicit ACL Behavior

### 2.1 Default Implicit ACL Rules

| Direction | Traffic Type | Action | Notes |
|-----------|-------------|--------|-------|
| WAN Inbound | DTLS (control) | Permit | Controller connections |
| WAN Inbound | IPsec (data) | Permit | Tunnel traffic |
| WAN Inbound | BFD | Permit | Liveness detection |
| WAN Inbound | STUN | Permit | NAT traversal |
| WAN Inbound | All other | Deny | Security default |
| LAN Inbound | All | Permit | Service VPN default |

### 2.2 Implicit ACL Verification

```
! View implicit ACL behavior
show sdwan security-info
show platform hardware qfp active feature acl

! Output shows built-in permit rules for:
! - UDP 12346-13156 (DTLS)
! - ESP/UDP 4500 (IPsec)
! - UDP 3784 (BFD)
```

---

## 3. Explicit ACL Configuration

### 3.1 Standard ACL

```
! Standard ACL for source-based filtering
policy
 access-list ACL-PERMIT-INTERNAL
  sequence 10
   match
    source-ip 10.0.0.0/8
   !
   action accept
  !
  sequence 20
   match
    source-ip 172.16.0.0/12
   !
   action accept
  !
  sequence 30
   match
    source-ip 192.168.0.0/16
   !
   action accept
  !
  default-action drop
 !
```

### 3.2 Extended ACL

```
! Extended ACL for granular control
policy
 access-list ACL-BUSINESS-APPS
  sequence 10
   match
    source-ip 172.16.0.0/12
    destination-ip 10.10.0.0/16
    destination-port 443
    protocol 6
   !
   action accept
    count HTTPS-TO-DC
   !
  !
  sequence 20
   match
    source-ip 172.16.0.0/12
    destination-ip 10.10.0.0/16
    destination-port 1433
    protocol 6
   !
   action accept
    count MSSQL-TO-DC
   !
  !
  sequence 30
   match
    source-ip 172.16.0.0/12
    destination-ip 10.10.0.0/16
    destination-port 3389
    protocol 6
   !
   action accept
    count RDP-TO-DC
   !
  !
  default-action drop
 !
```

### 3.3 ACL with DSCP Matching

```
! ACL for QoS-based filtering
policy
 access-list ACL-VOICE-TRAFFIC
  sequence 10
   match
    dscp 46  ! EF
    protocol 17
   !
   action accept
    count VOICE-PACKETS
   !
  !
  sequence 20
   match
    dscp 34  ! AF41
    protocol 17
   !
   action accept
    count VIDEO-PACKETS
   !
  !
  default-action accept
 !
```

---

## 4. VPN-Based ACLs

### 4.1 VPN 10 - Employee ACL

```
policy
 access-list ACL-VPN10-EMPLOYEE
  ! Allow all internal communications
  sequence 10
   match
    source-ip 172.16.0.0/14
    destination-ip 172.16.0.0/14
   !
   action accept
  !
  ! Allow to shared services
  sequence 20
   match
    source-ip 172.16.0.0/14
    destination-ip 172.20.0.0/16
   !
   action accept
  !
  ! Allow to DC
  sequence 30
   match
    source-ip 172.16.0.0/14
    destination-ip 10.10.0.0/16
   !
   action accept
  !
  ! Allow DNS
  sequence 40
   match
    destination-port 53
   !
   action accept
  !
  ! Allow HTTPS outbound
  sequence 50
   match
    destination-port 443
    protocol 6
   !
   action accept
  !
  default-action drop
 !
```

### 4.2 VPN 20 - Guest ACL

```
policy
 access-list ACL-VPN20-GUEST
  ! Allow DNS only to designated servers
  sequence 10
   match
    destination-ip 172.20.53.0/24  ! DNS servers
    destination-port 53
   !
   action accept
    count GUEST-DNS
  !
  ! Allow DHCP
  sequence 20
   match
    destination-port 67 68
    protocol 17
   !
   action accept
  !
  ! Allow HTTP/HTTPS to internet
  sequence 30
   match
    destination-port 80 443
    protocol 6
   !
   action accept
    count GUEST-WEB
  !
  ! Block all RFC1918 destinations
  sequence 100
   match
    destination-ip 10.0.0.0/8
   !
   action drop
    count GUEST-BLOCKED-10
  !
  sequence 110
   match
    destination-ip 172.16.0.0/12
   !
   action drop
    count GUEST-BLOCKED-172
  !
  sequence 120
   match
    destination-ip 192.168.0.0/16
   !
   action drop
    count GUEST-BLOCKED-192
  !
  default-action drop
 !
```

### 4.3 VPN 30 - IoT ACL

```
policy
 access-list ACL-VPN30-IOT
  ! Allow to IoT cloud platforms only
  sequence 10
   match
    destination-ip 52.0.0.0/8    ! AWS IoT
    destination-port 443 8883
   !
   action accept
    count IOT-AWS
  !
  sequence 20
   match
    destination-ip 104.0.0.0/8   ! Azure IoT
    destination-port 443 8883
   !
   action accept
    count IOT-AZURE
  !
  ! Allow to shared services (limited)
  sequence 30
   match
    destination-ip 172.20.53.0/24  ! DNS
    destination-port 53
   !
   action accept
  !
  sequence 40
   match
    destination-ip 172.20.123.0/24  ! NTP
    destination-port 123
   !
   action accept
  !
  ! Block all other
  default-action drop
 !
```

### 4.4 VPN 100 - PCI ACL

```
policy
 access-list ACL-VPN100-PCI
  ! Allow PCI application traffic only
  sequence 10
   match
    destination-ip 10.10.100.0/24  ! PCI servers
    destination-port 443
    protocol 6
   !
   action accept
    log
    count PCI-HTTPS
  !
  sequence 20
   match
    destination-ip 10.10.100.0/24
    destination-port 1433
    protocol 6
   !
   action accept
    log
    count PCI-MSSQL
  !
  ! Allow management from specific hosts
  sequence 30
   match
    source-ip 10.10.200.0/24  ! Management VLAN
    destination-ip 172.30.0.0/16
    destination-port 22 3389
   !
   action accept
    log
    count PCI-MGMT
  !
  default-action drop
   log
   count PCI-DROPPED
 !
```

---

## 5. Interface-Level ACLs

### 5.1 WAN Interface ACL

```
! Applied to transport interface
policy
 access-list ACL-WAN-INTERFACE
  ! Allow established connections
  sequence 10
   match
    tcp-flags established
   !
   action accept
  !
  ! Allow SD-WAN control plane
  sequence 20
   match
    destination-port 12346-13156
    protocol 17
   !
   action accept
  !
  ! Allow IPsec
  sequence 30
   match
    protocol 50  ! ESP
   !
   action accept
  !
  sequence 40
   match
    destination-port 4500
    protocol 17
   !
   action accept
  !
  ! Allow BFD
  sequence 50
   match
    destination-port 3784
    protocol 17
   !
   action accept
  !
  default-action drop
 !
!
! Apply to interface
interface GigabitEthernet0/0/0
 description WAN-MPLS
 ip access-group ACL-WAN-INTERFACE in
```

### 5.2 LAN Interface ACL

```
! Applied to service VPN interface
interface GigabitEthernet0/0/2
 description LAN-Employee
 ip access-group ACL-VPN10-EMPLOYEE in
```

---

## 6. ACL Logging and Counters

### 6.1 ACL Logging Configuration

```
policy
 access-list ACL-SECURITY-LOG
  sequence 10
   match
    source-ip 0.0.0.0/0
    destination-port 22
   !
   action accept
    log  ! Enable logging for SSH
    count SSH-ACCESS
  !
  sequence 20
   match
    source-ip 0.0.0.0/0
    destination-port 3389
   !
   action accept
    log  ! Enable logging for RDP
    count RDP-ACCESS
  !
 !
```

### 6.2 Viewing ACL Counters

```
! View ACL hit counts
show sdwan policy access-list-counters

! Sample output:
! ACCESS-LIST                  COUNTER              PACKETS
! ACL-VPN10-EMPLOYEE          HTTPS-TO-DC          1,234,567
! ACL-VPN20-GUEST             GUEST-WEB            456,789
! ACL-VPN20-GUEST             GUEST-BLOCKED-10     12,345
! ACL-VPN100-PCI              PCI-DROPPED          123

! Clear counters
clear sdwan policy access-list-counters
```

---

## 7. ACL Application Methods

### 7.1 Template-Based Application

```
! Feature template: ACL assignment
"vpn-interface-ethernet"
  "access-list": [
    {
      "direction": "in",
      "acl-name": "ACL-VPN10-EMPLOYEE"
    },
    {
      "direction": "out",
      "acl-name": "ACL-OUTBOUND-FILTER"
    }
  ]
```

### 7.2 CLI-Based Application

```
! Direct CLI configuration
interface GigabitEthernet0/0/2
 ip access-group ACL-VPN10-EMPLOYEE in
 ip access-group ACL-OUTBOUND-FILTER out
```

---

## 8. ACL Order of Operations

### 8.1 Processing Order

```
1. Implicit ACLs (highest priority)
   - Built-in SD-WAN control plane rules
   
2. Zone-Based Firewall (if configured)
   - Zone-pair policies evaluated
   
3. Explicit Interface ACLs
   - Applied ACLs on interface
   
4. Data Policy ACLs
   - Centralized data policy actions
   
5. Default Action
   - Accept or drop based on configuration
```

### 8.2 ACL Precedence Matrix

| ACL Type | Priority | Scope | Override |
|----------|----------|-------|----------|
| Implicit | 1 (Highest) | System-wide | No |
| ZBFW | 2 | Zone-based | By policy |
| Interface ACL | 3 | Per-interface | Yes |
| Data Policy | 4 | Per-VPN | Yes |
| Default | 5 (Lowest) | Catch-all | N/A |

---

## 9. Monitoring and Verification

### 9.1 Verification Commands

```
! View configured ACLs
show sdwan policy access-list-names
show sdwan policy access-list-entries

! View ACL counters
show sdwan policy access-list-counters

! Check interface ACL application
show ip interface brief
show access-lists

! Debug ACL processing
debug ip packet detail
```

### 9.2 Troubleshooting

| Issue | Symptom | Resolution |
|-------|---------|------------|
| Traffic blocked | No connectivity | Check sequence order |
| Wrong traffic matched | Unexpected behavior | Verify match criteria |
| Counters not incrementing | ACL not applied | Check interface binding |
| Logging not working | No syslog entries | Verify log action |

---

## 10. Best Practices

### 10.1 ACL Design Guidelines

| Guideline | Recommendation |
|-----------|----------------|
| Sequence Numbers | Use increments of 10 |
| Specific First | Place specific rules before general |
| Default Action | Always define explicit default |
| Documentation | Comment each sequence purpose |
| Testing | Test in lab before production |

### 10.2 Security Best Practices

| Practice | Implementation |
|----------|----------------|
| Least Privilege | Deny by default, permit specific |
| Logging | Log denied traffic for analysis |
| Counters | Monitor for anomalies |
| Review | Quarterly ACL audit |

---

## 11. Summary

| Element | Abhavtech Configuration |
|---------|------------------------|
| VPN ACLs | 4 (Employee, Guest, IoT, PCI) |
| Default Action | Drop for Guest/IoT/PCI |
| Logging | Enabled for PCI and management |
| Counters | All critical ACLs |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Next Review: March 2026*
