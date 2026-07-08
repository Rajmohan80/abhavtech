# 4.4 Data Policy Design

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-POL-4.4 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 1. Executive Summary

Data policies in Cisco Catalyst SD-WAN control how traffic flows through the network at the data plane level. This section defines Abhavtech's data policy design for traffic steering, service chaining, NAT operations, and advanced traffic manipulation across all 9 global sites.

### 1.1 Data Policy Architecture

```
+------------------------------------------------------------------+
|                      DATA POLICY FRAMEWORK                        |
+------------------------------------------------------------------+
|                                                                   |
|  Match Criteria                                                   |
|  +----------------------------------------------------------+    |
|  |  Source IP    | Dest IP     | Application  | DSCP        |    |
|  |  Source Port  | Dest Port   | Protocol     | Packet Len  |    |
|  |  Source VPN   | SGT         | DNS          | Prefix      |    |
|  +----------------------------------------------------------+    |
|                            |                                      |
|                            v                                      |
|  Actions                                                          |
|  +----------------------------------------------------------+    |
|  |  Accept/Drop  | NAT         | Service Chain | Redirect   |    |
|  |  Set DSCP     | Set Next-Hop| Mirror        | Count      |    |
|  |  Log          | TLOC Action | Local TLOC    | Strict     |    |
|  +----------------------------------------------------------+    |
|                            |                                      |
|                            v                                      |
|  Policy Application                                               |
|  +----------------------------------------------------------+    |
|  |  From-Service: Ingress VPN   | From-Tunnel: WAN Ingress  |    |
|  |  All: Bidirectional          | Localized: Per-Device     |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 2. Data Policy Types

### 2.1 Centralized vs Localized Data Policies

| Aspect | Centralized Data Policy | Localized Data Policy |
|--------|------------------------|----------------------|
| Configuration | SD-WAN Manager | Device template |
| Distribution | Via SD-WAN Controller (vSmart) | Direct to WAN Edge |
| Processing | vSmart processes policy decisions | WAN Edge processes locally |
| Scale | Suitable for global policies | Suitable for site-specific |
| Use Cases | Traffic steering, service chain | Local NAT, ACL |
| Performance | Slight delay for policy lookup | Faster local processing |

### 2.2 Data Policy Directions

| Direction | Description | Use Case |
|-----------|-------------|----------|
| from-service | Traffic originating from service VPN | LAN to WAN traffic steering |
| from-tunnel | Traffic arriving from WAN tunnels | WAN to LAN traffic handling |
| all | Bidirectional policy application | Comprehensive traffic control |

---

## 3. Traffic Steering Policies

### 3.1 Internet-Bound Traffic Steering

```
! Centralized Data Policy: Direct Internet Access (DIA)
policy
 data-policy _ABHAVTECH-DIA-POLICY_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     destination-data-prefix-list SAAS-PREFIXES
    action accept
     set
      local-tloc-list
       color biz-internet
       encap ipsec
      !
     !
    !
   !
   sequence 20
    match
     app-list SOCIAL-MEDIA-APPS
    action accept
     set
      local-tloc-list
       color biz-internet
       encap ipsec
      !
     !
    !
   !
  !
```

### 3.2 Hub-Based Traffic Steering

```
! Traffic to data center applications
policy
 data-policy _ABHAVTECH-DC-STEERING_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     destination-data-prefix-list DC-PREFIXES
    action accept
     set
      tloc-list
       tloc 10.100.1.1 color mpls encap ipsec preference 100
       tloc 10.100.1.2 color mpls encap ipsec preference 90
      !
     !
    !
   !
```

### 3.3 Branch-to-Branch Direct Steering

```
! Direct branch connectivity for specific traffic
policy
 data-policy _ABHAVTECH-BRANCH-DIRECT_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     source-data-prefix-list BANGALORE-PREFIXES
     destination-data-prefix-list DELHI-PREFIXES
     app-list VOICE-APPS
    action accept
     set
      tloc-list
       tloc 10.100.3.1 color biz-internet encap ipsec  ! Delhi direct
      !
     !
    !
   !
```

---

## 4. Service Chaining Policies

### 4.1 Firewall Service Chain

```
+------------------------------------------------------------------+
|                    SERVICE CHAIN TOPOLOGY                         |
+------------------------------------------------------------------+
|                                                                   |
|  Branch Site          Hub Site (Mumbai)                           |
|  +---------+         +--------------------------------+           |
|  | WAN Edge|-------->| WAN Edge --> Palo Alto FW --> |           |
|  |         |<--------|           <--               DC |           |
|  +---------+         +--------------------------------+           |
|                                                                   |
|  Traffic Flow: Branch -> Hub WAN Edge -> Firewall -> DC          |
|                                                                   |
+------------------------------------------------------------------+
```

```
! Service chain configuration for firewall inspection
policy
 data-policy _ABHAVTECH-FW-SERVICE-CHAIN_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     destination-data-prefix-list PCI-PREFIXES
    action accept
     set
      service FW vpn 10
      local-tloc-list
       color mpls
       encap ipsec
      !
     !
    !
   sequence 20
    match
     destination-data-prefix-list INTERNET
    action accept
     set
      service FW vpn 10
      local-tloc-list
       color biz-internet
       encap ipsec
      !
     !
    !
   !
```

### 4.2 Service Chain Definition

```
! WAN Edge configuration for service chain
sdwan
 service FW vrf 10
  ipv4-address 10.10.100.10
  tracking
  !
 !
!
! Interface configuration for service
interface GigabitEthernet0/0/2
 description To-Palo-Alto-FW
 ip address 10.10.100.1 255.255.255.252
 service-insertion-type firewall
!
```

### 4.3 Service Chain with Fallback

```
! Service chain with fallback when firewall unavailable
policy
 data-policy _ABHAVTECH-FW-FALLBACK_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     destination-data-prefix-list CRITICAL-PREFIXES
    action accept
     set
      service FW vpn 10 fall-back
      local-tloc-list
       color mpls
       encap ipsec
      !
     !
    ! Fallback allows traffic to bypass FW if FW is down
    ! Use only for non-security-critical traffic
   !
```

---

## 5. NAT Policies

### 5.1 NAT Policy Types

| NAT Type | Use Case | Configuration Level |
|----------|----------|-------------------|
| DIA NAT | Internet breakout | Localized policy |
| NAT64 | IPv6-to-IPv4 translation | Centralized policy |
| Service NAT | Service chain return | Localized policy |
| Inter-VPN NAT | Overlapping IP handling | Centralized policy |

### 5.2 DIA NAT Configuration

```
! Localized data policy for DIA NAT
policy
 lists
  data-prefix-list INTERNET
   ip-prefix 0.0.0.0/0
  !
 !
!
policy
 data-policy _DIA-NAT-POLICY_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     destination-data-prefix-list INTERNET
    action accept
     nat pool 1
    !
   !
  !
!
! NAT pool configuration on WAN Edge
ip nat pool NAT-POOL-1 203.0.113.10 203.0.113.20 prefix-length 24
ip nat inside source list NAT-ACL pool NAT-POOL-1 overload
!
interface GigabitEthernet0/0/0
 ip nat outside
!
interface Vlan10
 ip nat inside
```

### 5.3 Inter-VPN NAT for Overlapping Subnets

```
! Handle overlapping IP addresses between VPNs
policy
 data-policy _INTER-VPN-NAT_
  vpn-list VPN-30-IOT
   sequence 10
    match
     source-ip 172.18.10.0/24  ! IoT subnet
     destination-ip 172.20.100.0/24  ! Shared services
    action accept
     nat use-vpn 0
     nat pool 10
    !
   !
  !
```

---

## 6. Traffic Mirroring and Logging

### 6.1 Traffic Mirror Policy

```
! Mirror specific traffic for analysis
policy
 data-policy _TRAFFIC-MIRROR_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     app-list SUSPICIOUS-APPS
    action accept
     mirror
      destination 10.10.200.50  ! Security analysis server
     !
    !
   !
```

### 6.2 Traffic Logging

```
! Enable logging for specific traffic flows
policy
 data-policy _TRAFFIC-LOGGING_
  vpn-list VPN-100-PCI
   sequence 10
    match
     source-ip 0.0.0.0/0
    action accept
     log
     count PCI-TRAFFIC-COUNTER
    !
   !
```

---

## 7. Per-VPN Data Policies

### 7.1 VPN 10 - Employee Network

```
policy
 data-policy _VPN10-DATA-POLICY_
  vpn-list VPN-10-EMPLOYEE
   ! Sequence 10: SaaS Direct Internet
   sequence 10
    match
     app-list SAAS-APPS
    action accept
     set
      local-tloc-list
       color biz-internet
       encap ipsec
      !
     nat use-vpn 0
     nat pool 1
    !
   !
   ! Sequence 20: Business apps to DC
   sequence 20
    match
     app-list BUSINESS-CRITICAL-APPS
    action accept
     set
      tloc-list
       tloc 10.100.1.1 color mpls encap ipsec preference 100
      !
     !
    !
   !
   ! Sequence 30: Inter-site voice direct
   sequence 30
    match
     app-list VOICE-APPS
     destination-data-prefix-list ALL-SITES
    action accept
     set
      tloc-action strict
     !
    !
   !
   default-action accept
  !
```

### 7.2 VPN 20 - Guest Network

```
policy
 data-policy _VPN20-GUEST-DATA-POLICY_
  vpn-list VPN-20-GUEST
   ! Only allow internet access
   sequence 10
    match
     destination-data-prefix-list INTERNET
    action accept
     set
      local-tloc-list
       color biz-internet
       encap ipsec
      !
     nat use-vpn 0
     nat pool 2
    !
   !
   ! Block all internal destinations
   sequence 20
    match
     destination-data-prefix-list RFC1918
    action drop
     count GUEST-BLOCKED-INTERNAL
    !
   !
   default-action drop
  !
```

### 7.3 VPN 30 - IoT Network

```
policy
 data-policy _VPN30-IOT-DATA-POLICY_
  vpn-list VPN-30-IOT
   ! Allow to shared services only
   sequence 10
    match
     destination-data-prefix-list SHARED-SERVICES
    action accept
     set
      tloc-list
       tloc 10.100.1.1 color mpls encap ipsec
      !
     !
    !
   !
   ! Allow to cloud IoT platforms
   sequence 20
    match
     destination-data-prefix-list IOT-CLOUD-PREFIXES
    action accept
     set
      local-tloc-list
       color biz-internet
       encap ipsec
      !
     nat pool 3
    !
   !
   ! Block everything else
   default-action drop
    count IOT-DROPPED
  !
```

### 7.4 VPN 100 - PCI Zone

```
policy
 data-policy _VPN100-PCI-DATA-POLICY_
  vpn-list VPN-100-PCI
   ! Force all traffic through firewall
   sequence 10
    match
     source-ip 0.0.0.0/0
    action accept
     set
      service FW-PCI vpn 100
      tloc-list
       tloc 10.100.1.1 color mpls encap ipsec
      !
     log
     count PCI-TRAFFIC
    !
   !
   default-action drop
  !
```

---

## 8. Prefix Lists and Application Lists

### 8.1 Data Prefix Lists

```
policy
 lists
  data-prefix-list DC-PREFIXES
   ip-prefix 10.10.0.0/16
   ip-prefix 10.11.0.0/16
  !
  data-prefix-list BRANCH-PREFIXES
   ip-prefix 172.16.0.0/12
  !
  data-prefix-list SHARED-SERVICES
   ip-prefix 172.20.0.0/16
  !
  data-prefix-list SAAS-PREFIXES
   ip-prefix 13.107.0.0/16    ! Microsoft
   ip-prefix 52.96.0.0/14     ! Microsoft
   ip-prefix 104.146.0.0/15   ! Salesforce
   ip-prefix 170.114.0.0/16   ! WebEx
  !
  data-prefix-list IOT-CLOUD-PREFIXES
   ip-prefix 52.0.0.0/8       ! AWS IoT
   ip-prefix 104.0.0.0/8      ! Azure IoT
  !
  data-prefix-list RFC1918
   ip-prefix 10.0.0.0/8
   ip-prefix 172.16.0.0/12
   ip-prefix 192.168.0.0/16
  !
  data-prefix-list INTERNET
   ip-prefix 0.0.0.0/0
  !
```

### 8.2 Application Lists for Data Policy

```
policy
 lists
  app-list SAAS-APPS
   app ms-office-365
   app salesforce
   app google-workspace
   app webex
  !
  app-list BUSINESS-CRITICAL-APPS
   app sap
   app oracle-erp
   app citrix
   app ms-sql
  !
  app-list VOICE-APPS
   app rtp
   app sip
   app cisco-phone
  !
  app-list SUSPICIOUS-APPS
   app bittorrent
   app tor
   app ultrasurf
  !
```

---

## 9. Policy Application and Activation

### 9.1 Policy Application Syntax

```
! Apply data policy to sites
apply-policy
 site-list ALL-SITES
  data-policy _ABHAVTECH-MAIN-DATA-POLICY_
   from-service
  !
 !
 site-list BRANCH-SITES
  data-policy _BRANCH-DATA-POLICY_
   all
  !
 !
 site-list HUB-SITES
  data-policy _HUB-DATA-POLICY_
   from-tunnel
  !
 !
```

### 9.2 Policy Activation Steps

```
1. Create policy in SD-WAN Manager
   Configuration > Policies > Centralized Policy > Data Policy

2. Define match criteria and actions

3. Associate with site lists

4. Preview policy impact
   - Click Preview to see affected sites

5. Activate policy
   - Click Activate to push to controllers

6. Verify deployment
   show sdwan policy from-vsmart
   show sdwan policy data-policy
```

---

## 10. Monitoring and Verification

### 10.1 Verification Commands

```
! View active data policies
show sdwan policy from-vsmart
show sdwan policy data-policy

! Check policy counters
show sdwan policy data-policy counters

! View traffic statistics
show sdwan app-route statistics

! Debug data policy (use with caution)
debug sdwan data-policy

! Check NAT translations
show ip nat translations
show sdwan nat-fwd

! Verify service chain
show sdwan service
```

### 10.2 Common Issues and Resolution

| Issue | Symptom | Resolution |
|-------|---------|------------|
| Policy not applied | Traffic not steered | Check site-list membership |
| Sequence ordering | Wrong action taken | Review sequence numbers |
| NAT failures | No internet access | Verify NAT pool config |
| Service chain down | Traffic blackholed | Check service tracking |

---

## 11. Best Practices

### 11.1 Data Policy Design Guidelines

| Guideline | Recommendation |
|-----------|----------------|
| Sequence Numbers | Use increments of 10 for flexibility |
| Default Action | Always define explicit default |
| Logging | Enable for security-critical flows |
| NAT Pools | Size pools for peak concurrent sessions |
| Service Chains | Configure fallback for non-critical traffic |

### 11.2 Performance Considerations

| Consideration | Impact | Mitigation |
|---------------|--------|------------|
| Many Sequences | Increased processing | Consolidate where possible |
| Logging All | High storage/CPU | Log selectively |
| Complex Matches | Slower lookup | Use specific matches |

---

## 12. Summary

| Element | Abhavtech Configuration |
|---------|------------------------|
| Policy Type | Centralized for steering, Localized for NAT |
| DIA | Enabled for SaaS and social media |
| Service Chains | Palo Alto FW for PCI and internet |
| NAT Pools | 3 pools (Employee, Guest, IoT) |
| Logging | PCI zone traffic logged |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Next Review: March 2026*
