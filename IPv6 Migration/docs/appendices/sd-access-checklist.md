# SD-Access IPv6 Deployment Checklist

**AbhavTech Networks — Site Deployment Template**

**Site Name:** ________________  
**Site ID:** ________________  
**Engineer:** ________________  
**Date:** ________________  

---

## Pre-deployment verification

### Infrastructure Readiness
- [ ] Phase 1 complete (SD-WAN underlay dual-stack operational)
- [ ] All switches running IOS-XE 17.15.1 or higher
- [ ] IPv6 addressing plan documented for this site
- [ ] ARIN IPv6 allocation active and routable
- [ ] Network diagrams updated with IPv6 addresses

### DNAC Readiness
- [ ] DNAC accessible via IPv4 and IPv6
- [ ] Site hierarchy created in DNAC
- [ ] IPv6 pools created (from DNAC-IPv6-Pools-Import.csv)
- [ ] Templates imported:
  - [ ] Edge-Switch-Dual-Stack-IPv6
  - [ ] SVI-Anycast-Gateway-IPv6
  - [ ] LISP-IPv6-Instance
- [ ] DNS servers configured (IPv6)
- [ ] NTP servers configured (IPv6)

### ISE Readiness
- [ ] ISE PSN nodes accessible via IPv6
- [ ] Network devices added with IPv6 addresses (from ISE-Network-Devices-IPv6-Import.csv)
- [ ] IPv6 profiling policies imported:
  - [ ] Windows-Workstation-IPv6
  - [ ] iPhone-iOS-IPv6
  - [ ] Android-Device-IPv6
  - [ ] IoT-Camera-IPv6
  - [ ] Cisco-IP-Phone-IPv6
- [ ] Authorization policies configured for IPv6
- [ ] IPv6 ACLs created (CORPORATE-IN-v6-ACL, GUEST-IN-v6-ACL, IOT-IN-v6-ACL)

### Change Management
- [ ] Change request submitted and approved
- [ ] Maintenance window scheduled: ________________
- [ ] Rollback plan documented
- [ ] Stakeholder notifications sent
- [ ] Backup of current configs taken

---

## DEPLOYMENT PHASE 1: LISP DUAL-STACK

### Map-Server Configuration (Control Plane Nodes)
- [ ] IPv6 unicast-routing enabled
- [ ] Loopback0 has IPv6 address (2001:db8:abcX:0::Y/128)
- [ ] LISP site configured for this location
- [ ] Instance-id 8001 service ipv6 enabled
- [ ] Map-server role configured for IPv6
- [ ] Map-notify-group configured (ff02::fb for IPv6)
- [ ] Verify: `show lisp site` displays IPv6 EID prefixes

**Validation Command:**
```
show lisp site | include 2001
```
**Expected:** Site registered with IPv6 EID prefix

---

### Border Node Configuration
- [ ] Loopback0 dual-stack (IPv4 + IPv6)
- [ ] Locator-set includes ipv6-interface Loopback0
- [ ] Instance-id 8001 service ipv6 configured
- [ ] IPv6 database-mapping for site prefix (2001:db8:abcX:2000::/52)
- [ ] IPv6 map-cache configured
- [ ] Map-server IPv6 addresses configured
- [ ] Map-resolver IPv6 addresses configured
- [ ] Use-petr configured for IPv6
- [ ] VRF definition includes ipv6 address-family

**Validation Commands:**
```
show lisp instance-id 8001 ipv6 database
show lisp instance-id 8001 ipv6 server
```
**Expected:** IPv6 EID registered, map-server reachable

---

### Edge Node Configuration (Per Switch)
- [ ] Loopback0 dual-stack configured
- [ ] LISP locator-set includes IPv6
- [ ] Instance-id 8001 service ipv6 configured
- [ ] IPv6 database-mapping for local subnet (/64)
- [ ] Map-server and map-resolver configured
- [ ] VXLAN NVE interface configured (supports IPv6 payload)

**Validation Commands:**
```
show lisp instance-id 8001 ipv6 database
show interface nve1 | include line
```
**Expected:** EID registered, NVE interface up

---

## DEPLOYMENT PHASE 2: OVERLAY CONFIGURATION

### VRF Configuration
- [ ] VRF definition includes address-family ipv6
- [ ] Route-target export configured for IPv6
- [ ] Route-target import configured for IPv6

### SVI (Anycast Gateway) Configuration (Per VLAN)
VLAN ID: ______  VLAN Name: ______________________

- [ ] VLAN created
- [ ] SVI interface created
- [ ] VRF forwarding applied
- [ ] IPv4 gateway configured (existing)
- [ ] IPv6 gateway configured (2001:db8:abcX:200Y::1/64)
- [ ] ipv6 enable
- [ ] IPv6 RA configuration:
  - [ ] ipv6 nd managed-config-flag (set appropriately)
  - [ ] ipv6 nd other-config-flag (enabled)
  - [ ] ipv6 nd ra interval 200
  - [ ] ipv6 nd ra lifetime 1800
- [ ] DNS server advertisement via RA:
  - [ ] ipv6 nd ra dns server 2001:db8:abcX:1000::53 lifetime 1800
  - [ ] ipv6 nd ra dns search-list abhavtech.com lifetime 1800
- [ ] Anycast MAC configured (0000.0c9f.f001)
- [ ] LISP mobility configured for IPv6
- [ ] ipv6 redirects disabled
- [ ] VLAN-to-VNI mapping configured

**Validation Commands:**
```
show ipv6 interface vlan [VLAN_ID] | include address
show run interface vlan [VLAN_ID]
```
**Expected:** IPv6 address configured, RA enabled

**Repeat for all VLANs:**
- [ ] Corporate VLANs (Floor 1-6)
- [ ] Guest VLAN
- [ ] IoT VLAN
- [ ] Voice VLAN

---

## DEPLOYMENT PHASE 3: SECURITY POLICIES

### IPv6 First-Hop Security
- [ ] IPv6 device tracking policy created (IPDT-POLICY-v6)
  - [ ] tracking enable
  - [ ] security-level glean
  - [ ] prefix-list for valid EID range
  - [ ] protocol ndp
  - [ ] protocol dhcp
  - [ ] limit address-count 10
- [ ] RA Guard policy created (RA-GUARD-POLICY)
  - [ ] device-role host
- [ ] IPv6 snooping policy created (ND-SNOOPING)
  - [ ] security-level guard
  - [ ] device-role node

### Access Port Configuration (Per Port)
Sample Port Range: ______________________

- [ ] switchport mode access
- [ ] switchport access vlan [VLAN_ID]
- [ ] 802.1X authentication configured
- [ ] TrustSec (cts role-based enforcement)
- [ ] IPv4 source guard (ip verify source)
- [ ] IPv6 source guard (ipv6 verify source)
- [ ] IPv6 device tracking attached (ipv6 device-tracking attach-policy IPDT-POLICY-v6)
- [ ] RA Guard attached (ipv6 nd raguard attach-policy RA-GUARD-POLICY)
- [ ] DHCP snooping rate limit
- [ ] Spanning tree portfast
- [ ] Spanning tree bpduguard enable

**Validation Commands:**
```
show ipv6 device-tracking policy
show ipv6 nd raguard policy
show authentication sessions interface [interface]
```

---

## Validation & testing

### Control Plane Validation
- [ ] LISP site registration: `show lisp site`
  - Expected: Site shows IPv4 + IPv6 EID prefixes
- [ ] Border LISP database: `show lisp instance-id 8001 ipv6 database`
  - Expected: Site aggregate prefix registered
- [ ] Edge LISP registration: `show lisp instance-id 8001 ipv6 database` (on edge)
  - Expected: Local /64 subnet registered
- [ ] Map-cache populated: `show lisp instance-id 8001 ipv6 map-cache`
  - Expected: Remote site prefixes present

### Data Plane Validation
- [ ] VXLAN tunnel status: `show interface nve1`
  - Expected: line protocol is up
- [ ] Anycast gateway reachable: `ping vrf [VRF] ipv6 [gateway_ipv6]`
  - Expected: Replies from gateway
- [ ] Cross-site reachability: `ping vrf [VRF] ipv6 [remote_site_ipv6]`
  - Expected: Replies from remote site via LISP

### Client Testing

#### Windows 11 Client
- [ ] Connect client to access port
- [ ] Verify 802.1X authentication successful
- [ ] Check IPv6 address assigned via SLAAC:
  ```
  ipconfig /all
  ```
  - Expected: IPv6 Address from correct prefix (2001:db8:abcX:200Y::/64)
  - Expected: Default Gateway is anycast gateway
  - Expected: DNS Servers include IPv6 DNS
- [ ] Test local connectivity:
  ```
  ping [anycast_gateway_ipv6]
  ```
  - Expected: Replies
- [ ] Test remote connectivity:
  ```
  ping [remote_site_ipv6]
  ```
  - Expected: Replies
- [ ] Test internet via IPv6:
  ```
  ping 2001:4860:4860::8888
  ```
  - Expected: Replies (Google DNS IPv6)
- [ ] Verify IPv6 preference:
  ```
  nslookup www.google.com
  ```
  - Expected: Returns both A (IPv4) and AAAA (IPv6) records
  - Expected: Client uses IPv6 by default

#### iPhone/Android Client
- [ ] Connect to WiFi (Corp-Secure SSID)
- [ ] Verify IPv6 address in Wi-Fi settings
- [ ] Browse to https://test-ipv6.com
  - Expected: "You have IPv6!" message, 10/10 score
- [ ] Test application (Safari/Chrome)
  - Expected: All apps work normally over IPv6

#### IoT Device (if applicable)
- [ ] Device gets IPv6 via DHCPv6 (for IoT VLAN)
- [ ] Device reachable via IPv6
- [ ] ISE correctly profiles device

### ISE Validation
- [ ] Check endpoint profiling: ISE → Context Visibility → Endpoints
  - [ ] Windows endpoints show "Windows-Workstation-IPv6" profile
  - [ ] iPhones show "iPhone-iOS-IPv6" profile
  - [ ] IoT devices show correct profile
- [ ] Verify SGT assignment
- [ ] Check RADIUS logs for IPv6 authentication

### Performance Validation
- [ ] Latency to anycast gateway: < 5ms
- [ ] Latency to remote site: [document baseline]
- [ ] Throughput test via IPv6: [document baseline]
- [ ] No IPv6 neighbor table exhaustion: `show ipv6 neighbors count`

---

## Post-deployment

### Documentation
- [ ] Update network diagrams with IPv6 addresses
- [ ] Document lessons learned
- [ ] Update runbooks with IPv6 troubleshooting
- [ ] Take post-deployment config backups

### Monitoring
- [ ] Add IPv6 monitoring to DNAC Assurance
- [ ] Configure IPv6 NetFlow collection
- [ ] Set up IPv6 SNMP traps
- [ ] Add IPv6 endpoints to ThousandEyes monitoring

### Handoff
- [ ] Brief NOC team on IPv6 troubleshooting
- [ ] Provide NOC with validation commands
- [ ] Schedule follow-up review (1 week)

---

## ROLLBACK PROCEDURE (IF NEEDED)

### Trigger Conditions for Rollback
- [ ] IPv4 services impacted
- [ ] LISP registration failures
- [ ] Client connectivity issues not resolvable in 30 minutes
- [ ] Security policy violations

### Rollback Steps
1. [ ] Disable IPv6 on SVIs:
   ```
   interface vlan [VLAN_ID]
     no ipv6 address
     no ipv6 enable
   ```
2. [ ] Remove IPv6 from LISP:
   ```
   router lisp
     instance-id 8001
       no service ipv6
   ```
3. [ ] Verify IPv4-only operation restored
4. [ ] Document root cause for retry

---

## Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Network Engineer | | | |
| Security Team | | | |
| NOC Manager | | | |
| Change Manager | | | |

---

**Deployment Status:** ☐ SUCCESS  ☐ PARTIAL  ☐ ROLLBACK

**Notes:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
