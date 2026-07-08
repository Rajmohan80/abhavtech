# 2.6.6 Extranet Virtual Network Design

## Document Information
| Item | Details |
|------|---------|
| Organization | Abhavtech.com |
| Domain | abhavtech.com |
| Version | 2.0 |
| Last Updated | December 2025 |

---

## 1. Extranet VN Overview

### 1.1 Extranet Concept

Extranet Virtual Networks enable controlled communication between different VNs (typically for partner, vendor, or shared services access) while maintaining security segmentation.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Extranet VN Architecture                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   VN_CORPORATE          VN_EXTRANET          VN_PARTNER            │
│   ┌───────────┐        ┌───────────┐        ┌───────────┐          │
│   │           │        │           │        │           │          │
│   │ Employee  │◄──────►│  Shared   │◄──────►│ Partner   │          │
│   │ Resources │  SGT   │  Services │  SGT   │ Access    │          │
│   │           │ Policy │           │ Policy │           │          │
│   │ SGT: 10   │        │ SGT: 60   │        │ SGT: 80   │          │
│   │           │        │           │        │           │          │
│   └───────────┘        └───────────┘        └───────────┘          │
│        │                     │                    │                 │
│        │    ┌────────────────┼────────────────┐  │                 │
│        │    │                │                │  │                 │
│        ▼    ▼                ▼                ▼  ▼                 │
│   ┌─────────────────────────────────────────────────────────┐      │
│   │                    Border Node                           │      │
│   │          (Extranet Fusion Router Function)              │      │
│   │                                                          │      │
│   │   VRF Leaking with SGT Policy Enforcement               │      │
│   └─────────────────────────────────────────────────────────┘      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Extranet Use Cases for Abhavtech

| Use Case | Source VN | Destination VN | Purpose |
|----------|-----------|----------------|---------|
| Partner Portal Access | VN_PARTNER | VN_EXTRANET | Access to collaboration portal |
| Shared Print Services | VN_CORPORATE | VN_EXTRANET | Shared printers across VNs |
| Guest Internet via Corp | VN_GUEST | VN_EXTRANET | Captive portal, DNS |
| Vendor Support Access | VN_VENDOR | VN_EXTRANET | Access to monitoring tools |
| IoT Management | VN_IOT | VN_EXTRANET | IoT platform access |

---

## 2. Extranet Design for Abhavtech

### 2.1 Virtual Network Inventory

| VN Name | L3 VNI | VRF | Purpose | Extranet Enabled |
|---------|--------|-----|---------|------------------|
| VN_CORPORATE | 4097 | CORP | Employee access | Yes (consumer) |
| VN_VOICE | 4098 | VOICE | IP Telephony | No |
| VN_IOT | 4099 | IOT | IoT devices | Yes (consumer) |
| VN_GUEST | 4100 | GUEST | Guest WiFi | Yes (consumer) |
| VN_PARTNER | 4101 | PARTNER | Partner access | Yes (consumer) |
| VN_EXTRANET | 4102 | EXTRANET | Shared services | Yes (provider) |

### 2.2 Shared Services in VN_EXTRANET

| Service | IP Address | Purpose | Accessible From |
|---------|------------|---------|-----------------|
| Partner Portal | 10.200.10.10 | Collaboration | VN_PARTNER, VN_CORPORATE |
| Shared Printers | 10.200.10.20-29 | Printing | All VNs |
| Captive Portal | 10.200.10.50 | Guest auth | VN_GUEST |
| IoT Platform | 10.200.10.60 | IoT management | VN_IOT |
| DNS Relay | 10.200.10.100 | Name resolution | All VNs |

---

## 3. Catalyst Center Configuration

### 3.1 Creating Extranet VN

**Step 1: Create Extranet Virtual Network**
```
Design → Network Settings → Virtual Networks

Add Virtual Network:
  Name: VN_EXTRANET
  Description: Shared services extranet
  Traffic Type: Data
  
  ☑ Enable as Extranet (Provider)
  
Click "Save"
```

**Step 2: Configure Extranet Policies**
```
Provision → Fabric Sites → Mumbai → Host Onboarding → Virtual Networks

Select: VN_EXTRANET
Edit → Extranet Settings:

  Extranet Type: Provider (offers services)
  
  Consumer VNs (can access VN_EXTRANET):
    ☑ VN_CORPORATE
    ☑ VN_IOT
    ☑ VN_GUEST
    ☑ VN_PARTNER
    
  Shared Prefixes:
    10.200.10.0/24 (Shared services subnet)
    
Click "Save" → "Deploy"
```

### 3.2 Enabling Consumer VNs

**For each Consumer VN:**
```
Select VN: VN_CORPORATE
Edit → Extranet Settings:

  Extranet Type: Consumer
  
  Provider VNs to Access:
    ☑ VN_EXTRANET
    
  Allowed Services:
    ☑ 10.200.10.0/24
    
Click "Save" → "Deploy"
```

---

## 4. Border Node Configuration

### 4.1 VRF Leaking Configuration

Catalyst Center automatically configures VRF leaking on border nodes for extranet connectivity.

```
! Auto-generated Border Node Configuration
! MUM-BN-01

! Extranet VRF Configuration
vrf definition EXTRANET
 rd 65001:4102
 !
 address-family ipv4
  route-target export 65001:4102
  route-target import 65001:4102
  ! Import from consumer VRFs for extranet
  route-target import 65001:4097  ! VN_CORPORATE
  route-target import 65001:4099  ! VN_IOT
  route-target import 65001:4100  ! VN_GUEST
  route-target import 65001:4101  ! VN_PARTNER
 exit-address-family
!

! Corporate VRF with Extranet Import
vrf definition CORP
 rd 65001:4097
 !
 address-family ipv4
  route-target export 65001:4097
  route-target import 65001:4097
  ! Import extranet shared services
  route-target import 65001:4102
 exit-address-family
!

! Route-map for selective import
route-map EXTRANET-IMPORT permit 10
 match ip address prefix-list EXTRANET-SERVICES
 set extcommunity rt 65001:4102
!

ip prefix-list EXTRANET-SERVICES permit 10.200.10.0/24
```

### 4.2 LISP Extranet Configuration

```
! LISP Configuration for Extranet EID Advertisement
!
router lisp
 instance-id 4102
  service ipv4
   eid-table vrf EXTRANET
   ! Advertise extranet services to fabric
   database-mapping 10.200.10.0/24 locator-set BORDER-RLOCS
   ! Enable extranet route sharing
   extranet ABHAVTECH-EXTRANET
   exit-service-ipv4
  !
 exit-instance-id
!

! Extranet Definition
router lisp
 extranet ABHAVTECH-EXTRANET
  ! Provider instance (VN_EXTRANET)
  instance-id 4102 provider
  ! Consumer instances
  instance-id 4097 consumer  ! VN_CORPORATE
  instance-id 4099 consumer  ! VN_IOT
  instance-id 4100 consumer  ! VN_GUEST
  instance-id 4101 consumer  ! VN_PARTNER
 !
!
```

---

## 5. SGT Policy for Extranet

### 5.1 Extranet SGT Matrix

| Source SGT | Destination SGT | Service | Policy |
|------------|-----------------|---------|--------|
| Employee (10) | Extranet-Shared (60) | All | Permit |
| Partner (80) | Extranet-Portal (61) | HTTPS | Permit |
| Partner (80) | Extranet-Shared (60) | - | Deny |
| Guest (40) | Extranet-DNS (62) | DNS | Permit |
| Guest (40) | Extranet-Shared (60) | - | Deny |
| IoT (50) | Extranet-IoT (63) | MQTT | Permit |

### 5.2 SGACL Definitions

```
! ISE SGACL Configuration

! Employee to Shared Services - Full Access
ip access-list role-based EMPLOYEE-TO-EXTRANET
 permit ip

! Partner to Portal - HTTPS Only
ip access-list role-based PARTNER-TO-PORTAL
 permit tcp dst eq 443
 permit tcp dst eq 80
 deny ip log

! Guest to DNS - DNS Only
ip access-list role-based GUEST-TO-DNS
 permit udp dst eq 53
 deny ip log

! IoT to Platform - MQTT Only
ip access-list role-based IOT-TO-PLATFORM
 permit tcp dst eq 1883
 permit tcp dst eq 8883
 deny ip log

! Default Deny between VNs
ip access-list role-based DENY-INTER-VN
 deny ip log
```

### 5.3 ISE Policy Configuration

```
Work Centers → TrustSec → Policy → Egress Policy → Matrix

TrustSec Matrix Configuration:

Source: Employee-Full (10)
  Destination: Extranet-Shared (60) → EMPLOYEE-TO-EXTRANET (Permit)
  Destination: Extranet-Portal (61) → EMPLOYEE-TO-EXTRANET (Permit)

Source: Partner (80)
  Destination: Extranet-Portal (61) → PARTNER-TO-PORTAL (Limited)
  Destination: Extranet-Shared (60) → DENY-INTER-VN (Deny)

Source: Guest (40)
  Destination: Extranet-DNS (62) → GUEST-TO-DNS (Limited)
  Destination: Extranet-Shared (60) → DENY-INTER-VN (Deny)

Source: IoT-Sensor (50)
  Destination: Extranet-IoT (63) → IOT-TO-PLATFORM (Limited)
  Destination: Extranet-Shared (60) → DENY-INTER-VN (Deny)
```

---

## 6. Verification

### 6.1 Catalyst Center Verification

```
Provision → Fabric Sites → Mumbai → Virtual Networks

VN_EXTRANET Status:
  Type: Provider
  Consumers: VN_CORPORATE, VN_IOT, VN_GUEST, VN_PARTNER
  Status: Deployed ✓
  
  Shared Prefixes:
    10.200.10.0/24 - Active ✓
```

### 6.2 Border Node Verification

```
! Verify VRF route import
MUM-BN-01# show ip route vrf CORP 10.200.10.0

Routing entry for 10.200.10.0/24
  Known via "bgp 65001", distance 200, metric 0
  Tag 4102, type internal
  Redistributing via lisp instance-id 4097
  Route imported from VRF EXTRANET

! Verify LISP extranet
MUM-BN-01# show lisp extranet ABHAVTECH-EXTRANET

LISP Extranet ABHAVTECH-EXTRANET
  Provider EID-prefix: 10.200.10.0/24, instance-id 4102
  Consumer instances: 4097, 4099, 4100, 4101
```

### 6.3 Connectivity Test

```
! From Corporate endpoint
C:\> ping 10.200.10.10
Reply from 10.200.10.10: bytes=32 time=2ms TTL=254

! From Partner endpoint (HTTPS only)
Partner-PC$ curl -I https://10.200.10.10
HTTP/1.1 200 OK

Partner-PC$ ping 10.200.10.10
Request timed out.  # ICMP blocked by SGACL
```

---

## 7. Extranet Traffic Flow

### 7.1 Packet Path Analysis

```
┌─────────────────────────────────────────────────────────────────────┐
│          Extranet Traffic Flow: Partner to Portal                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   1. Partner Endpoint (10.201.10.50)                               │
│      VN: VN_PARTNER, SGT: 80                                       │
│      ↓                                                              │
│   2. Edge Node (Partner fabric)                                    │
│      VXLAN encapsulation with SGT 80                               │
│      Destination: 10.200.10.10 (Portal)                            │
│      ↓                                                              │
│   3. Border Node                                                    │
│      Extranet route lookup                                          │
│      VRF PARTNER → VRF EXTRANET (route-target import)             │
│      SGT preserved: 80                                              │
│      ↓                                                              │
│   4. Edge Node (Extranet)                                          │
│      SGACL evaluation: SGT 80 → SGT 61                             │
│      Policy: PARTNER-TO-PORTAL (permit tcp 443)                    │
│      ↓                                                              │
│   5. Portal Server (10.200.10.10)                                  │
│      Receives HTTPS traffic                                         │
│      Response follows reverse path                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 8. Best Practices

### 8.1 Extranet Design Guidelines

1. **Minimize Shared Services**: Only expose necessary services
2. **SGT Granularity**: Create specific SGTs for extranet services
3. **Principle of Least Privilege**: Default deny between VNs
4. **Logging**: Enable logging on deny rules
5. **Regular Review**: Audit extranet policies quarterly

### 8.2 Security Considerations

```yaml
Extranet_Security_Checklist:
  
  Network_Segmentation:
    - [ ] Consumer VNs cannot reach each other
    - [ ] Provider services are explicitly defined
    - [ ] No catch-all permit rules
    
  Access_Control:
    - [ ] SGACLs enforce application-level filtering
    - [ ] Only required ports permitted
    - [ ] Logging enabled on all policies
    
  Monitoring:
    - [ ] NetFlow captures inter-VN traffic
    - [ ] SGACL deny events alerted
    - [ ] Regular traffic analysis
    
  Compliance:
    - [ ] Extranet access documented
    - [ ] Business justification recorded
    - [ ] Annual access review scheduled
```

---

## 9. Troubleshooting

### 9.1 Common Issues

| Issue | Cause | Resolution |
|-------|-------|------------|
| No connectivity | Route not imported | Check RT configuration |
| Partial connectivity | SGACL blocking | Verify matrix policy |
| Asymmetric routing | VRF leak misconfiguration | Check import/export RT |
| SGT not preserved | Border node issue | Verify CTS enforcement |

### 9.2 Debug Commands

```
! Debug VRF route import
debug ip routing vrf EXTRANET

! Debug LISP extranet
debug lisp control-plane extranet

! Check SGACL enforcement
show cts role-based permissions
show cts role-based counters
```

---

*Document Version: 2.0*
*Abhavtech.com - SD-Access Implementation*
