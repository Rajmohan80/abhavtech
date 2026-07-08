# 4.1 Policy Framework Overview

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-POL-4.1 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 1. Executive Summary

This section provides an overview of the SD-WAN policy framework for Abhavtech's deployment. The policy framework defines how traffic is controlled, routed, and secured across the SD-WAN fabric. Understanding the policy hierarchy, types, and application methods is essential for effective network management.

### 1.1 Policy Framework Architecture

```
+------------------------------------------------------------------+
|                   SD-WAN POLICY FRAMEWORK                         |
+------------------------------------------------------------------+
|                                                                   |
|  Policy Definition (SD-WAN Manager)                               |
|  +----------------------------------------------------------+    |
|  |  +------------+  +------------+  +------------+          |    |
|  |  | Control    |  | Data       |  | App-Route  |          |    |
|  |  | Policy     |  | Policy     |  | Policy     |          |    |
|  |  +------------+  +------------+  +------------+          |    |
|  |  | Route      |  | Traffic    |  | SLA-Based  |          |    |
|  |  | Manipulation|  | Steering   |  | Routing    |          |    |
|  |  +------------+  +------------+  +------------+          |    |
|  +----------------------------------------------------------+    |
|                            |                                      |
|                            v                                      |
|  Policy Distribution (OMP)                                        |
|  +----------------------------------------------------------+    |
|  |              SD-WAN Controllers (vSmart)                  |    |
|  |  - Route Policy Enforcement                               |    |
|  |  - Centralized Policy Processing                          |    |
|  +----------------------------------------------------------+    |
|                            |                                      |
|                            v                                      |
|  Policy Enforcement (WAN Edge)                                    |
|  +----------------------------------------------------------+    |
|  |  +------------+  +------------+  +------------+          |    |
|  |  | Localized  |  | Centralized|  | Hybrid     |          |    |
|  |  | Data Policy|  | Data Policy|  | Policies   |          |    |
|  |  +------------+  +------------+  +------------+          |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 1.2 Policy Types Summary

| Policy Type | Purpose | Processing Location | Scope |
|-------------|---------|---------------------|-------|
| Control Policy | Route manipulation | vSmart Controller | Global/Site |
| Data Policy | Traffic steering | WAN Edge (local/central) | VPN/Site |
| App-Route Policy | SLA-based routing | WAN Edge | VPN/Site |
| Security Policy | Access control | WAN Edge | Interface/VPN |
| cflowd Policy | Flow export | WAN Edge | VPN |

---

## 2. Centralized vs Localized Policies

### 2.1 Policy Processing Models

```
+------------------------------------------------------------------+
|              CENTRALIZED VS LOCALIZED POLICIES                    |
+------------------------------------------------------------------+
|                                                                   |
|  CENTRALIZED (Controller-Based):                                  |
|  +----------------------------------------------------------+    |
|  |                                                          |    |
|  |  Traffic -> WAN Edge -> vSmart Controller -> Decision    |    |
|  |                             |                            |    |
|  |                             v                            |    |
|  |                     Route Modification                   |    |
|  |                             |                            |    |
|  |                             v                            |    |
|  |                      WAN Edge Forwarding                 |    |
|  |                                                          |    |
|  |  Use Cases:                                              |    |
|  |  - Route aggregation                                     |    |
|  |  - Hub-and-spoke topology                                |    |
|  |  - Global route policy                                   |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  LOCALIZED (Edge-Based):                                          |
|  +----------------------------------------------------------+    |
|  |                                                          |    |
|  |  Traffic -> WAN Edge -> Local Decision -> Forwarding     |    |
|  |                                                          |    |
|  |  Use Cases:                                              |    |
|  |  - Real-time traffic steering                            |    |
|  |  - DIA breakout                                          |    |
|  |  - QoS marking                                           |    |
|  |  - NAT                                                   |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 2.2 Policy Processing Comparison

| Aspect | Centralized | Localized |
|--------|-------------|-----------|
| Processing | vSmart Controller | WAN Edge |
| Latency | Higher (controller roundtrip) | Lower (local) |
| Scale | Better for global policies | Better for per-flow |
| Flexibility | Route-level | Packet-level |
| Use Case | Topology control | Traffic engineering |

### 2.3 Policy Selection Guidelines

```
! Use CENTRALIZED Control Policy when:
! - Manipulating OMP routes globally
! - Implementing hub-and-spoke topology
! - Aggregating routes across sites
! - Controlling route advertisement

! Use LOCALIZED Data Policy when:
! - Steering traffic based on application
! - Implementing DIA breakout
! - Applying QoS marking
! - Performing NAT operations
! - Low-latency decisions required
```

---

## 3. Policy Hierarchy

### 3.1 Policy Evaluation Order

```
+------------------------------------------------------------------+
|                   POLICY EVALUATION ORDER                         |
+------------------------------------------------------------------+
|                                                                   |
|  Inbound Traffic (Service VPN → WAN):                             |
|  +----------------------------------------------------------+    |
|  | 1. Access List (Implicit/Explicit)                        |    |
|  | 2. QoS Policy (Classification/Marking)                    |    |
|  | 3. Data Policy (Traffic Steering)                         |    |
|  | 4. App-Route Policy (SLA Selection)                       |    |
|  | 5. NAT (if configured)                                    |    |
|  | 6. Encryption (IPsec)                                     |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Outbound Traffic (WAN → Service VPN):                            |
|  +----------------------------------------------------------+    |
|  | 1. Decryption (IPsec)                                     |    |
|  | 2. Control Policy (Route Selection)                       |    |
|  | 3. Data Policy (if centralized)                           |    |
|  | 4. QoS Policy (Scheduling)                                |    |
|  | 5. Access List                                            |    |
|  | 6. Service VPN Routing                                    |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 3.2 Policy Precedence

| Priority | Policy Type | Scope | Override |
|----------|-------------|-------|----------|
| 1 | Explicit ACL | Interface | Highest |
| 2 | Data Policy | VPN/Site | High |
| 3 | App-Route Policy | VPN | Medium |
| 4 | Control Policy | Global | Medium |
| 5 | Implicit ACL | VPN | Low |
| 6 | Default Routing | Global | Lowest |

---

## 4. Policy Components

### 4.1 Lists and Groups

```
+------------------------------------------------------------------+
|                    POLICY BUILDING BLOCKS                         |
+------------------------------------------------------------------+
|                                                                   |
|  PREFIX LISTS:                                                    |
|  +----------------------------------------------------------+    |
|  | prefix-list CORPORATE-SUBNETS                             |   |
|  |  ip-prefix 172.16.0.0/12                                  |   |
|  |  ip-prefix 10.0.0.0/8                                     |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  SITE LISTS:                                                      |
|  +----------------------------------------------------------+    |
|  | site-list DC-SITES                                        |   |
|  |  site-id 100    ! Mumbai DC                               |   |
|  |  site-id 200    ! Chennai DR                              |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  VPN LISTS:                                                       |
|  +----------------------------------------------------------+    |
|  | vpn-list EMPLOYEE-VPNS                                    |   |
|  |  vpn 10                                                   |   |
|  |  vpn 40                                                   |   |
|  |  vpn 50                                                   |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  APP LISTS:                                                       |
|  +----------------------------------------------------------+    |
|  | app-list BUSINESS-CRITICAL                                |   |
|  |  app ms-office-365                                        |   |
|  |  app salesforce                                           |   |
|  |  app sap                                                  |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  SLA CLASSES:                                                     |
|  +----------------------------------------------------------+    |
|  | sla-class VOICE-SLA                                       |   |
|  |  latency 150                                              |   |
|  |  loss 1                                                   |   |
|  |  jitter 30                                                |   |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 4.2 Policy Configuration Structure

```
! Complete Policy Configuration Example
policy
 ! Lists
 lists
  prefix-list EMPLOYEE-PREFIXES
   ip-prefix 172.16.0.0/14
  !
  site-list ALL-SITES
   site-id 100-999
  !
  vpn-list VPN-10-EMPLOYEE
   vpn 10
  !
  app-list VOICE-APPS
   app cisco-jabber
   app ms-teams
   app webex
  !
  sla-class VOICE-SLA
   latency 150
   loss 1
   jitter 30
  !
  tloc-list MPLS-PREFERRED
   tloc 10.100.1.1 color mpls encap ipsec preference 100
   tloc 10.100.1.1 color biz-internet encap ipsec preference 50
  !
 !
 
 ! Control Policy
 control-policy ROUTE-POLICY
  sequence 10
   match route
    prefix-list EMPLOYEE-PREFIXES
   action accept
    set
     preference 1000
    !
   !
  !
  default-action accept
 !
 
 ! Data Policy  
 data-policy TRAFFIC-STEERING
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     app-list VOICE-APPS
    action accept
     set
      local-tloc-list MPLS-PREFERRED
     !
    !
   !
   default-action accept
  !
 !
 
 ! App-Route Policy
 app-route-policy SLA-ROUTING
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     app-list VOICE-APPS
    action
     sla-class VOICE-SLA strict
    !
   !
  !
 !
!
```

---

## 5. Policy Application

### 5.1 Apply Policy to Sites

```
! Apply policies to specific sites
apply-policy
 site-list DC-SITES
  control-policy ROUTE-POLICY out
 !
 site-list BRANCH-SITES
  data-policy TRAFFIC-STEERING from-service
  app-route-policy SLA-ROUTING
 !
 site-list ALL-SITES
  control-policy DEFAULT-ROUTE-POLICY out
 !
!
```

### 5.2 Policy Application Matrix

| Policy Type | Direction | Application Point |
|-------------|-----------|-------------------|
| Control Policy | in/out | Site (OMP routes) |
| Data Policy | from-service/from-tunnel | VPN (traffic) |
| App-Route Policy | N/A | VPN (SLA decisions) |
| Security Policy | N/A | Interface |

---

## 6. Abhavtech Policy Framework

### 6.1 Policy Design Principles

| Principle | Implementation |
|-----------|----------------|
| Simplicity | Minimize policy count, use inheritance |
| Consistency | Standard naming, templates |
| Scalability | Use site/VPN lists, avoid per-device |
| Maintainability | Document all policies, version control |

### 6.2 Policy Naming Convention

```
+------------------------------------------------------------------+
|                   POLICY NAMING CONVENTION                        |
+------------------------------------------------------------------+
|                                                                   |
|  Format: <TYPE>-<SCOPE>-<FUNCTION>                                |
|                                                                   |
|  Examples:                                                        |
|  +----------------------------------------------------------+    |
|  | CP-GLOBAL-HUBSPOKE     | Control Policy, Global, Hub-Spoke|   |
|  | DP-VPN10-DIA           | Data Policy, VPN 10, DIA breakout|   |
|  | AR-VOICE-MPLS          | App-Route, Voice, MPLS preferred |   |
|  | ACL-GUEST-INTERNET     | ACL, Guest, Internet access      |   |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 7. Best Practices Summary

### 7.1 Policy Design Best Practices

- Start with default-action accept, add specific rules
- Use lists for reusability
- Test policies in lab before production
- Document policy purpose and dependencies

### 7.2 Policy Management Best Practices

- Version control all policy configurations
- Use templates for consistency
- Regular policy audits (quarterly)
- Monitor policy hit counts

---

## References

| Document | Description | Location |
|----------|-------------|----------|
| Cisco SD-WAN Policy Guide | Official policy documentation | cisco.com |
| SD-WAN Design Guide | Policy design best practices | cisco.com |
| Abhavtech Policy Standards | Internal policy guidelines | SharePoint |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use*
*Document ID: SDWAN-POL-4.1*
