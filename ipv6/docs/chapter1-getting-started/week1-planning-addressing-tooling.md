# ABHAVTECH IPv6 MIGRATION — WEEK 1
## PLANNING, ADDRESSING ASSIGNMENT, AND TOOLING PREPARATION

**Project:** ABV-IPV6-2025  
**Week:** 1 of 44  
**Duration:** 5 Days  
**Objective:** Complete IPv6 addressing design, ARIN allocation, IPAM setup, lab validation, tooling preparation  
**Prerequisites:** IPv6 Migration Master Reference Card reviewed and approved  

---

## WEEK 1 OVERVIEW

```
WEEK 1 DELIVERABLES:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  Day 1: IPv6 Prefix Planning + ARIN Allocation Request            │
│    ✅ Calculate required IPv6 space                               │
│    ✅ Submit ARIN request for /44 or /40                          │
│    ✅ Document addressing hierarchy                               │
│                                                                    │
│  Day 2: IPAM Configuration + Addressing Spreadsheet                │
│    ✅ Configure DNAC IPAM for IPv6                                │
│    ✅ Create master IPv6 allocation spreadsheet                   │
│    ✅ Assign prefixes to all 19 sites                             │
│                                                                    │
│  Day 3: Lab Environment Setup + Testing                            │
│    ✅ Deploy lab topology (CML or DevNet sandbox)                 │
│    ✅ Test dual-stack configs on lab devices                      │
│    ✅ Validate LISP/VXLAN IPv6 overlay                            │
│                                                                    │
│  Day 4: Production Tooling Preparation                             │
│    ✅ DNAC: Enable IPv6, create pools                             │
│    ✅ ISE: Add IPv6 device IPs, update policies                   │
│    ✅ vManage: Prepare IPv6 feature templates                     │
│    ✅ Monitoring: ThousandEyes/Splunk IPv6 readiness              │
│                                                                    │
│  Day 5: Readiness Assessment + Go/No-Go Decision                   │
│    ✅ Infrastructure readiness checklist (100% complete)          │
│    ✅ Stakeholder sign-off                                        │
│    ✅ Phase 1 kickoff meeting scheduled                           │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## DAY 1: IPv6 PREFIX PLANNING AND ARIN ALLOCATION

## 1.1 Calculate IPv6 Space Requirements

### Current Abhavtech Infrastructure Inventory

```
SITE INVENTORY (19 sites):
┌────────────────────────────────────────────────────────────────────┐
│ Region    │ Site Name    │ Site ID │ Device Count │ User Count    │
├────────────────────────────────────────────────────────────────────┤
│ APAC      │ Mumbai HQ    │ 1       │ 200          │ 5,000         │
│ APAC      │ Chennai HQ   │ 2       │ 120          │ 2,500         │
│ APAC      │ Bangalore    │ 50      │ 15           │ 500           │
│ APAC      │ Delhi        │ 51      │ 15           │ 500           │
│ APAC      │ Noida        │ 55      │ 8            │ 200           │
│ APAC      │ Hyderabad    │ 52      │ 8            │ 200           │
│ APAC      │ Pune         │ 53      │ 8            │ 200           │
│ APAC      │ Ahmedabad    │ 54      │ 8            │ 200           │
│ APAC      │ Kolkata      │ 56      │ 8            │ 150           │
│ APAC      │ Jaipur       │ 57      │ 8            │ 150           │
│ APAC      │ Surat        │ 58      │ 8            │ 150           │
│ APAC      │ Nagpur       │ 59      │ 8            │ 150           │
│ APAC      │ Chandigarh   │ 60      │ 8            │ 150           │
│ APAC      │ Coimbatore   │ 61      │ 8            │ 150           │
│ APAC      │ Lucknow      │ 62      │ 8            │ 150           │
│ EMEA      │ London HQ    │ 16      │ 100          │ 2,000         │
│ EMEA      │ Frankfurt    │ 17      │ 50           │ 800           │
│ Americas  │ New Jersey   │ 32      │ 80           │ 1,500         │
│ Americas  │ Dallas       │ 33      │ 40           │ 600           │
├────────────────────────────────────────────────────────────────────┤
│ TOTAL     │ 19 sites     │ —       │ 708 devices  │ 15,150 users  │
└────────────────────────────────────────────────────────────────────┘

NETWORK SEGMENTS PER SITE (Hub sites like Mumbai):
  - Underlay: Loopbacks (60 devices max), P2P links (100 links max)
  - Management: Device OOB, monitoring agents
  - Overlay (5 VNs × 10 VLANs/floors average = 50 subnets per hub)
  - Cloud: Azure VNets, GCP VPCs
  - Future IoT: 5,000 devices projected (2026-2028)

TOTAL IPv6 SUBNETS REQUIRED:
  Sites: 19 sites × 60 subnets avg = 1,140 /64 subnets
  Cloud: 200 /64 subnets (Azure/GCP growth)
  IoT: 500 /64 subnets (future expansion)
  Reserved: 50% overhead for growth
  
  TOTAL = ~3,000 /64 subnets = needs /44 minimum (16 × /48 sites)
```

### IPv6 Prefix Size Decision

```
OPTION A: /44 from ARIN (Recommended)
  - Provides: 16 × /48 blocks
  - Allocation: 19 sites + cloud + IoT + 30% reserved = fits
  - Cost: ~$2,250 initial + $750/year (ARIN fee)
  - Justification: "Multi-site enterprise with 19 locations + cloud"
  
OPTION B: /40 from ARIN (Aggressive)
  - Provides: 256 × /48 blocks
  - Allocation: Massive overhead (only need 25 blocks)
  - Cost: ~$4,500 initial + $2,000/year
  - Justification: Harder to justify to ARIN without 100+ sites
  
DECISION: Request /44 from ARIN
  Prefix example (will be assigned): 2001:0db8:abc0::/44
  Note: 2001:db8::/32 is documentation-only; replace with actual ARIN assignment
```

---

## 1.2 ARIN IPv6 Allocation Request

### ARIN Account Setup

```bash
# Step 1: Create ARIN Online account (if not exists)
# Navigate to: https://www.arin.net/account/login/
# Organization: Abhavtech Networks Private Limited
# Contact: Network Operations (NOC)

# Step 2: Verify organization details
# ARIN → My Account → Organization Details
# Organization Name: Abhavtech Networks
# Organization ID: (assign after verification, e.g., ABHAV-01)
# POC Admin: Raj Kumar (example)
# POC Technical: Network Team
# Address: (corporate HQ address)
```

### IPv6 Request Template

```
ARIN IPv6 REQUEST FORM:
─────────────────────────────────────────────────────────────────────

1. REQUEST TYPE:
   ☑ Initial IPv6 allocation
   ☐ Additional IPv6 allocation

2. REQUESTED PREFIX SIZE:
   /44 (minimum requirement)
   
3. JUSTIFICATION (detailed):
   
   Organization: Abhavtech Networks Private Limited
   Business: Financial services technology provider
   
   CURRENT INFRASTRUCTURE:
   - 19 production sites (6 hub + 13 branch)
   - 15,000+ endpoints (users + devices)
   - Multi-region presence: APAC (15 sites), EMEA (2), Americas (2)
   
   IPv6 DEPLOYMENT PLAN:
   - Phase 1 (Q1 2025): SD-WAN underlay dual-stack (19 sites)
   - Phase 2 (Q2 2025): SD-Access overlay dual-stack (5 VNs × 19 sites)
   - Phase 3 (Q2-Q3 2025): Multi-cloud IPv6 (Azure ExpressRoute, GCP Interconnect)
   - Phase 4 (Q3 2025): IoT expansion (5,000 devices projected by 2028)
   
   ADDRESSING PLAN:
   - Per-site allocation: /48 per site (19 sites = 19 × /48)
   - Cloud allocation: /48 for Azure VNets + /48 for GCP VPCs
   - IoT/Edge allocation: /48 for future 5G/LTE private network
   - Management/Tools: /48 for monitoring infrastructure (DNAC, ISE, Splunk, ThousandEyes)
   - Reserved: /48 blocks for future growth
   
   TOTAL REQUIREMENT: 25 × /48 blocks = /44 minimum
   
   MULTIHOMING:
   - Provider 1: Tata Communications (MPLS)
   - Provider 2: BT Global (Internet DIA)
   - Provider 3: AT&T (Americas MPLS)
   - Reason: Provider-independent space required for BGP multihoming
   
4. ROUTING POLICY:
   Will announce via BGP to:
   - AS64512 (Tata - APAC)
   - AS64513 (BT - EMEA)
   - AS64514 (AT&T - Americas)
   
5. SUBNETTING PLAN:
   See attached: Abhavtech_IPv6_Addressing_Plan.xlsx
   
6. TIMELINE:
   Production deployment: Q1 2025 (within 90 days of allocation)
   
7. CONTACT INFORMATION:
   Technical POC: [Raj Kumar]
   Email: [noc@abhavtech.com]
   Phone: [+91-xxx-xxx-xxxx]

─────────────────────────────────────────────────────────────────────
SUBMIT VIA: https://www.arin.net/resources/request/ipv6/
EXPECTED APPROVAL TIME: 2-4 weeks
```

### ARIN Processing Checklist

```
☐ Week 1 Day 1: Submit ARIN request
☐ Week 1-2: ARIN review (may request clarifications)
☐ Week 2-3: ARIN approval + prefix assignment notification
☐ Week 3: Receive official allocation (e.g., 2001:0db8:abc0::/44)
☐ Week 3: Update ARIN RPKI (Resource Public Key Infrastructure)
☐ Week 3: Register reverse DNS delegation (e.g., 0.c.b.a.8.b.d.0.1.0.0.2.ip6.arpa)

NOTE: While waiting for ARIN, continue Week 1 with placeholder prefix 2001:db8:abc0::/44
```

---

## 1.3 Hierarchical Addressing Design

### Regional Allocation

```
ABHAVTECH IPv6 HIERARCHY (using 2001:db8:abc0::/44 as example):
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  GLOBAL PREFIX: 2001:db8:abc0::/44                                │
│                                                                    │
│  ├─ APAC Region:     2001:db8:abc1::/48 to 2001:db8:abcA::/48     │
│  │    (10 × /48 blocks for 15 APAC sites + growth)                │
│  │                                                                 │
│  ├─ EMEA Region:     2001:db8:abcB::/48 to 2001:db8:abcC::/48     │
│  │    (2 × /48 blocks for 2 EMEA sites)                           │
│  │                                                                 │
│  ├─ Americas Region: 2001:db8:abcD::/48 to 2001:db8:abcE::/48     │
│  │    (2 × /48 blocks for 2 Americas sites)                       │
│  │                                                                 │
│  └─ Special Use:     2001:db8:abcF::/48                           │
│       ├─ :0::/52 → Cloud (Azure/GCP)                              │
│       ├─ :1000::/52 → IoT/Edge                                    │
│       ├─ :2000::/52 → Management tools (DNAC, ISE, Splunk)        │
│       └─ :F000::/52 → Future reserved                             │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Per-Site Allocation (Mumbai Hub Example)

```
MUMBAI HUB: 2001:db8:abc1::/48
─────────────────────────────────────────────────────────────────────

STRUCTURE: 2001:db8:abc1:FFFF:SSSS::/64
                      │    │
                      │    └─ Subnet ID (0-FFFF = 65,536 subnets per site)
                      └────── Function nibble (see below)

FUNCTION NIBBLES (F):
  0xxx = Underlay (loopbacks, P2P)
  1xxx = Management (OOB, monitoring)
  2xxx = VN_CORPORATE overlay
  3xxx = VN_GUEST overlay
  4xxx = VN_IOT overlay
  5xxx = VN_SERVERS overlay
  6xxx = VN_VOICE overlay
  8xxx = SD-WAN service VPNs
  Fxxx = Reserved

DETAILED ALLOCATION:
┌────────────────────────────────────────────────────────────────────┐
│ Function          │ Prefix                      │ Usage            │
├────────────────────────────────────────────────────────────────────┤
│ UNDERLAY          │ 2001:db8:abc1:0::/52        │ 4,096 subnets    │
│   Loopbacks       │ 2001:db8:abc1:0::/64        │ Border, CP, Edge │
│   P2P Links       │ 2001:db8:abc1:1::/64        │ IS-IS underlay   │
│                   │                             │                  │
│ MANAGEMENT        │ 2001:db8:abc1:1000::/52     │ 4,096 subnets    │
│   Device Mgmt     │ 2001:db8:abc1:1000::/64     │ SSH, SNMP        │
│   Monitoring      │ 2001:db8:abc1:1001::/64     │ TE agent, Splunk │
│   WLC Mgmt        │ 2001:db8:abc1:1002::/64     │ WLC-MUM-01/02    │
│                   │                             │                  │
│ VN_CORPORATE      │ 2001:db8:abc1:2000::/52     │ 4,096 subnets    │
│   Floor 1         │ 2001:db8:abc1:2001::/64     │ VLAN 1011        │
│   Floor 2         │ 2001:db8:abc1:2002::/64     │ VLAN 1012        │
│   Floor 3         │ 2001:db8:abc1:2003::/64     │ VLAN 1013        │
│   Floor 4         │ 2001:db8:abc1:2004::/64     │ VLAN 1014        │
│   Floor 5         │ 2001:db8:abc1:2005::/64     │ VLAN 1015        │
│   Floor 6         │ 2001:db8:abc1:2006::/64     │ VLAN 1016        │
│   Wireless-Corp   │ 2001:db8:abc1:2100::/64     │ WiFi SSID        │
│                   │                             │                  │
│ VN_GUEST          │ 2001:db8:abc1:3000::/52     │ 4,096 subnets    │
│   Guest Floor 1   │ 2001:db8:abc1:3001::/64     │ VLAN 1021        │
│   Wireless-Guest  │ 2001:db8:abc1:3100::/64     │ WiFi SSID        │
│                   │                             │                  │
│ VN_IOT            │ 2001:db8:abc1:4000::/52     │ 4,096 subnets    │
│   IoT Floor 1     │ 2001:db8:abc1:4001::/64     │ VLAN 1031        │
│   IoT Wireless    │ 2001:db8:abc1:4100::/64     │ WiFi SSID        │
│                   │                             │                  │
│ VN_SERVERS        │ 2001:db8:abc1:5000::/52     │ 4,096 subnets    │
│   DMZ Servers     │ 2001:db8:abc1:5001::/64     │ Web, App         │
│   DB Servers      │ 2001:db8:abc1:5002::/64     │ SQL, Oracle      │
│                   │                             │                  │
│ VN_VOICE          │ 2001:db8:abc1:6000::/52     │ 4,096 subnets    │
│   Voice Floor 1   │ 2001:db8:abc1:6001::/64     │ VLAN 1051        │
│   Wireless-Voice  │ 2001:db8:abc1:6100::/64     │ WiFi SSID        │
│                   │                             │                  │
│ SD-WAN VPNs       │ 2001:db8:abc1:8000::/52     │ 4,096 subnets    │
│   VPN 0 (WAN)     │ 2001:db8:abc1:8000::/64     │ Transport        │
│   VPN 1 (Corp)    │ 2001:db8:abc1:8001::/64     │ Overlay          │
│   VPN 512 (Mgmt)  │ 2001:db8:abc1:8512::/64     │ OOB SD-WAN       │
└────────────────────────────────────────────────────────────────────┘
```

---

## DAY 2: IPAM CONFIGURATION AND ADDRESSING SPREADSHEET

## 2.1 Catalyst Center (DNAC) IPAM Setup

### Enable IPv6 in DNAC

```bash
# Step 1: SSH to DNAC primary node (NJ)
ssh -l maglev-admin 10.252.10.10

# Step 2: Enable IPv6 at system level (if not already enabled)
maglev-admin@dnac:~$ sudo systemctl status ipv6.service
# Expected: active

# Step 3: Configure DNAC IPv6 management address
maglev-admin@dnac:~$ sudo maglev-config
  Select: 6. Network Settings
  Select: 2. Add IPv6 Address
  IPv6 Address: 2001:db8:abc1:1000::10
  Prefix Length: 64
  Gateway: 2001:db8:abc1:1000::1
  
# Step 4: Verify DNAC reachable via IPv6
ping6 2001:db8:abc1:1000::10
# Expected: replies
```

### Create IPv6 Global Settings in DNAC UI

```
DNAC UI → Design → Network Settings → Network

1. Add IPv6 DNS Servers:
   Primary:   2001:4860:4860::8888  (Google DNS IPv6)
   Secondary: 2001:4860:4860::8844
   Internal:  2001:db8:abc1:1000::53  (future internal DNS)

2. Add IPv6 NTP Servers:
   Primary:   2001:db8:abc1:1000::123  (internal NTP)
   Fallback:  2620:0:ccc::2  (NIST IPv6 NTP)

3. Add IPv6 Syslog:
   Server: 2001:db8:abc1:1001::50  (Splunk indexer)
   Port: 514
   Protocol: UDP

4. SNMP v3 (dual-stack — same config for IPv4/IPv6)
   No changes needed — SNMP works over both transports
```

---

## 2.2 Master IPv6 Allocation Spreadsheet

### Spreadsheet Structure

```excel
FILE: Abhavtech_IPv6_Addressing_Plan.xlsx

SHEET 1: Site Summary
┌──────────────┬───────────────┬──────────────────────────┬─────────────┐
│ Site Name    │ Site ID │ IPv4 Mgmt          │ IPv6 /48 Block         │
├──────────────┼───────────────┼──────────────────────────┼─────────────┤
│ Mumbai HQ    │ 1       │ 10.252.100.0/24    │ 2001:db8:abc1::/48     │
│ Chennai HQ   │ 2       │ 10.252.101.0/24    │ 2001:db8:abc2::/48     │
│ Bangalore    │ 50      │ 10.252.150.0/24    │ 2001:db8:abc3::/48     │
│ Delhi        │ 51      │ 10.252.151.0/24    │ 2001:db8:abc4::/48     │
│ Noida        │ 55      │ 10.252.155.0/24    │ 2001:db8:abc5::/48     │
│ Hyderabad    │ 52      │ 10.252.152.0/24    │ 2001:db8:abc6::/48     │
│ Pune         │ 53      │ 10.252.153.0/24    │ 2001:db8:abc7::/48     │
│ Ahmedabad    │ 54      │ 10.252.154.0/24    │ 2001:db8:abc8::/48     │
│ Kolkata      │ 56      │ 10.252.156.0/24    │ 2001:db8:abc9::/48     │
│ Jaipur       │ 57      │ 10.252.157.0/24    │ 2001:db8:abca::/48     │
│ London HQ    │ 16      │ 10.252.116.0/24    │ 2001:db8:abcb::/48     │
│ Frankfurt    │ 17      │ 10.252.117.0/24    │ 2001:db8:abcc::/48     │
│ New Jersey   │ 32      │ 10.252.132.0/24    │ 2001:db8:abcd::/48     │
│ Dallas       │ 33      │ 10.252.133.0/24    │ 2001:db8:abce::/48     │
│ ... (more)   │ ...     │ ...                │ ...                    │
└──────────────┴───────────────┴──────────────────────────┴─────────────┘

SHEET 2: Mumbai Detail (Example)
┌───────────────┬──────────────────────────┬─────────┬──────────────────┐
│ Function      │ IPv6 Prefix              │ VLAN ID │ IPv4 Equivalent  │
├───────────────┼──────────────────────────┼─────────┼──────────────────┤
│ Loopback0     │ 2001:db8:abc1:0::1/128   │ N/A     │ 10.250.1.1/32    │
│ P2P Link 1    │ 2001:db8:abc1:1::0/127   │ N/A     │ 10.251.1.0/31    │
│ Device Mgmt   │ 2001:db8:abc1:1000::/64  │ 999     │ 10.252.100.0/24  │
│ Corp Floor 1  │ 2001:db8:abc1:2001::/64  │ 1011    │ 10.100.1.0/24    │
│ Corp Floor 2  │ 2001:db8:abc1:2002::/64  │ 1012    │ 10.100.2.0/24    │
│ Guest Floor 1 │ 2001:db8:abc1:3001::/64  │ 1021    │ 10.200.1.0/24    │
│ IoT Floor 1   │ 2001:db8:abc1:4001::/64  │ 1031    │ 10.150.1.0/24    │
│ Servers DMZ   │ 2001:db8:abc1:5001::/64  │ 1041    │ 10.180.1.0/24    │
│ Voice Floor 1 │ 2001:db8:abc1:6001::/64  │ 1051    │ 10.190.1.0/24    │
│ VPN 0 WAN     │ 2001:db8:abc1:8000::/64  │ N/A     │ VPN 0            │
│ VPN 1 Corp    │ 2001:db8:abc1:8001::/64  │ N/A     │ VPN 1            │
└───────────────┴──────────────────────────┴─────────┴──────────────────┘

SHEET 3: Device Inventory (IPv6 addresses)
┌────────────────────┬────────────────────────┬──────────────────────────┐
│ Device Hostname    │ IPv4 Mgmt              │ IPv6 Mgmt                │
├────────────────────┼────────────────────────┼──────────────────────────┤
│ MUM-BN-01          │ 10.250.1.1             │ 2001:db8:abc1:0::1       │
│ MUM-BN-02          │ 10.250.1.2             │ 2001:db8:abc1:0::2       │
│ MUM-CP-01          │ 10.250.1.3             │ 2001:db8:abc1:0::3       │
│ MUM-CP-02          │ 10.250.1.4             │ 2001:db8:abc1:0::4       │
│ MUM-ED-01          │ 10.250.1.10            │ 2001:db8:abc1:0::10      │
│ MUM-ED-02          │ 10.250.1.11            │ 2001:db8:abc1:0::11      │
│ ... (all 708)      │ ...                    │ ...                      │
│ MUM-HUB-01 (SDWAN) │ 10.252.1.1             │ 2001:db8:abc1:8000::1    │
│ MUM-HUB-02 (SDWAN) │ 10.252.1.2             │ 2001:db8:abc1:8000::2    │
│ WLC-MUM-01         │ 10.252.40.10           │ 2001:db8:abc1:1002::10   │
└────────────────────┴────────────────────────┴──────────────────────────┘

SHEET 4: Cloud & Services
┌────────────────────┬────────────────────────┬──────────────────────────┐
│ Service            │ IPv4                   │ IPv6                     │
├────────────────────┼────────────────────────┼──────────────────────────┤
│ DNAC Primary (NJ)  │ 10.252.10.10           │ 2001:db8:abcd:1000::10   │
│ DNAC DR (London)   │ 10.252.20.10           │ 2001:db8:abcb:1000::10   │
│ ISE PSN MUM-01     │ 10.252.31.11           │ 2001:db8:abc1:1000::31   │
│ ISE PSN MUM-02     │ 10.252.31.12           │ 2001:db8:abc1:1000::32   │
│ vManage Cluster    │ 10.252.31.10           │ 2001:db8:abcd:1000::100  │
│ ThousandEyes MUM   │ 10.252.60.10           │ 2001:db8:abc1:1001::60   │
│ Splunk Indexer     │ 10.252.31.50           │ 2001:db8:abc1:1001::50   │
│ Azure SQL PE       │ 10.100.10.10           │ 2001:db8:abcf:10:10::10  │
│ GCP Vertex AI      │ 10.128.0.10            │ 2001:db8:abcf:20::10     │
└────────────────────┴────────────────────────┴──────────────────────────┘
```

### Python Script: Auto-Generate Addressing Spreadsheet

```python
#!/usr/bin/env python3
"""
Generate Abhavtech IPv6 addressing spreadsheet from site inventory
"""

import openpyxl
from openpyxl.styles import Font, PatternFill
import ipaddress

# Site inventory (matches Abhavtech actual sites)
SITES = [
    {"name": "Mumbai HQ", "id": 1, "ipv4_mgmt": "10.252.100.0/24", "floors": 6, "region": "APAC"},
    {"name": "Chennai HQ", "id": 2, "ipv4_mgmt": "10.252.101.0/24", "floors": 4, "region": "APAC"},
    {"name": "Bangalore", "id": 50, "ipv4_mgmt": "10.252.150.0/24", "floors": 1, "region": "APAC"},
    {"name": "Delhi", "id": 51, "ipv4_mgmt": "10.252.151.0/24", "floors": 1, "region": "APAC"},
    {"name": "Noida", "id": 55, "ipv4_mgmt": "10.252.155.0/24", "floors": 1, "region": "APAC"},
    {"name": "Hyderabad", "id": 52, "ipv4_mgmt": "10.252.152.0/24", "floors": 1, "region": "APAC"},
    {"name": "Pune", "id": 53, "ipv4_mgmt": "10.252.153.0/24", "floors": 1, "region": "APAC"},
    {"name": "Ahmedabad", "id": 54, "ipv4_mgmt": "10.252.154.0/24", "floors": 1, "region": "APAC"},
    {"name": "Kolkata", "id": 56, "ipv4_mgmt": "10.252.156.0/24", "floors": 1, "region": "APAC"},
    {"name": "Jaipur", "id": 57, "ipv4_mgmt": "10.252.157.0/24", "floors": 1, "region": "APAC"},
    {"name": "Surat", "id": 58, "ipv4_mgmt": "10.252.158.0/24", "floors": 1, "region": "APAC"},
    {"name": "Nagpur", "id": 59, "ipv4_mgmt": "10.252.159.0/24", "floors": 1, "region": "APAC"},
    {"name": "Chandigarh", "id": 60, "ipv4_mgmt": "10.252.160.0/24", "floors": 1, "region": "APAC"},
    {"name": "Coimbatore", "id": 61, "ipv4_mgmt": "10.252.161.0/24", "floors": 1, "region": "APAC"},
    {"name": "Lucknow", "id": 62, "ipv4_mgmt": "10.252.162.0/24", "floors": 1, "region": "APAC"},
    {"name": "London HQ", "id": 16, "ipv4_mgmt": "10.252.116.0/24", "floors": 4, "region": "EMEA"},
    {"name": "Frankfurt", "id": 17, "ipv4_mgmt": "10.252.117.0/24", "floors": 2, "region": "EMEA"},
    {"name": "New Jersey", "id": 32, "ipv4_mgmt": "10.252.132.0/24", "floors": 3, "region": "Americas"},
    {"name": "Dallas", "id": 33, "ipv4_mgmt": "10.252.133.0/24", "floors": 2, "region": "Americas"},
]

# Base IPv6 prefix (placeholder — replace with ARIN assignment)
BASE_PREFIX = "2001:db8:abc"

def site_ipv6_prefix(site_index):
    """Generate /48 prefix for a site"""
# abc0, abc1, abc2, ... abcF
    hex_suffix = f"{site_index:x}"
    return f"{BASE_PREFIX}{hex_suffix}::"

def generate_site_subnets(site, site_prefix):
    """Generate all /64 subnets for a site"""
    subnets = []
    
# Underlay
    subnets.append({
        "function": "Loopback0",
        "prefix": f"{site_prefix}0::1/128",
        "vlan": "N/A",
        "notes": "Border/CP/Edge loopbacks"
    })
    subnets.append({
        "function": "P2P Links",
        "prefix": f"{site_prefix}1::/64",
        "vlan": "N/A",
        "notes": "IS-IS underlay /127 subnets"
    })
    
# Management
    subnets.append({
        "function": "Device Management",
        "prefix": f"{site_prefix}1000::/64",
        "vlan": "999",
        "notes": "Switch/router OOB"
    })
    subnets.append({
        "function": "Monitoring",
        "prefix": f"{site_prefix}1001::/64",
        "vlan": "N/A",
        "notes": "TE, Splunk agents"
    })
    
# Overlay — Corporate
    for floor in range(1, site["floors"] + 1):
        subnets.append({
            "function": f"VN_CORPORATE Floor {floor}",
            "prefix": f"{site_prefix}200{floor}::/64",
            "vlan": f"101{floor}",
            "notes": f"Data VLAN for floor {floor}"
        })
    
# Overlay — Guest
    subnets.append({
        "function": "VN_GUEST Floor 1",
        "prefix": f"{site_prefix}3001::/64",
        "vlan": "1021",
        "notes": "Guest access"
    })
    
# Overlay — IoT
    subnets.append({
        "function": "VN_IOT Floor 1",
        "prefix": f"{site_prefix}4001::/64",
        "vlan": "1031",
        "notes": "IoT devices"
    })
    
# Overlay — Servers
    subnets.append({
        "function": "VN_SERVERS DMZ",
        "prefix": f"{site_prefix}5001::/64",
        "vlan": "1041",
        "notes": "App/Web servers"
    })
    
# Overlay — Voice
    subnets.append({
        "function": "VN_VOICE Floor 1",
        "prefix": f"{site_prefix}6001::/64",
        "vlan": "1051",
        "notes": "IP phones, Webex"
    })
    
# SD-WAN VPNs
    subnets.append({
        "function": "SD-WAN VPN 0",
        "prefix": f"{site_prefix}8000::/64",
        "vlan": "N/A",
        "notes": "WAN transport"
    })
    subnets.append({
        "function": "SD-WAN VPN 1",
        "prefix": f"{site_prefix}8001::/64",
        "vlan": "N/A",
        "notes": "Corporate overlay"
    })
    
    return subnets

def create_workbook():
    """Create Excel workbook with all sheets"""
    wb = openpyxl.Workbook()
    
# Sheet 1: Site Summary
    ws_summary = wb.active
    ws_summary.title = "Site Summary"
    ws_summary.append(["Site Name", "Site ID", "Region", "IPv4 Mgmt", "IPv6 /48 Block", "Floors"])
    
    for i, site in enumerate(SITES):
        ws_summary.append([
            site["name"],
            site["id"],
            site["region"],
            site["ipv4_mgmt"],
            f"{site_ipv6_prefix(i)}/48",
            site["floors"]
        ])
    
# Format header
    for cell in ws_summary[1]:
        cell.font = Font(bold=True)
        cell.fill = PatternFill(start_color="366092", end_color="366092", fill_type="solid")
    
# Sheet 2: Example site detail (Mumbai)
    ws_mumbai = wb.create_sheet("Mumbai Detail")
    ws_mumbai.append(["Function", "IPv6 Prefix", "VLAN ID", "Notes"])
    
    mumbai_prefix = site_ipv6_prefix(0)
    for subnet in generate_site_subnets(SITES[0], mumbai_prefix):
        ws_mumbai.append([subnet["function"], subnet["prefix"], subnet["vlan"], subnet["notes"]])
    
# Format header
    for cell in ws_mumbai[1]:
        cell.font = Font(bold=True)
        cell.fill = PatternFill(start_color="366092", end_color="366092", fill_type="solid")
    
# Save workbook
    wb.save("Abhavtech_IPv6_Addressing_Plan.xlsx")
    print("✅ Generated: Abhavtech_IPv6_Addressing_Plan.xlsx")

if __name__ == "__main__":
    create_workbook()
```

**Run the script:**

```bash
python3 generate_ipv6_addressing.py
# Output: Abhavtech_IPv6_Addressing_Plan.xlsx
```

---

## DAY 3: LAB ENVIRONMENT SETUP AND TESTING

## 3.1 Lab Topology Design

### Cisco Modeling Labs (CML) Topology

```
LAB TOPOLOGY: IPv6 Dual-Stack Proof-of-Concept
────────────────────────────────────────────────────────────────────────

Purpose: Validate IPv6 configs before production deployment
Platform: Cisco CML (formerly VIRL) or DevNet Sandbox
Duration: 8 hours build + 8 hours testing = Day 3 complete

TOPOLOGY:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│                      [External Router]                             │
│                    (Simulated ISP — IPv6)                          │
│                              │                                     │
│                              │                                     │
│              ┌───────────────┴───────────────┐                    │
│              │                               │                    │
│         [MUM-BN-01]                    [MUM-BN-02]                │
│       (C9500 Border)                 (C9500 Border)               │
│       IPv4: 10.250.1.1               IPv4: 10.250.1.2             │
│       IPv6: 2001:db8:abc1:0::1       IPv6: 2001:db8:abc1:0::2    │
│              │                               │                    │
│              └───────────┬───────────────────┘                    │
│                          │                                        │
│                     [MUM-CP-01]                                   │
│                   (C9500 Control Plane)                           │
│                   IPv4: 10.250.1.3                                │
│                   IPv6: 2001:db8:abc1:0::3                        │
│                          │                                        │
│              ┌───────────┴───────────┐                            │
│              │                       │                            │
│         [MUM-ED-01]             [MUM-ED-02]                       │
│       (C9300 Edge)            (C9300 Edge)                        │
│       IPv4: 10.250.1.10       IPv4: 10.250.1.11                  │
│       IPv6: 2001:db8:abc1:0::10  IPv6: 2001:db8:abc1:0::11       │
│              │                       │                            │
│              │                       │                            │
│         [Client-1]              [Client-2]                        │
│       (Ubuntu 22.04)          (Windows 11)                        │
│       IPv4: DHCP              IPv4: DHCP                          │
│       IPv6: SLAAC             IPv6: SLAAC                         │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

DEVICE IMAGES REQUIRED:
  - Cisco IOSv (vIOS) for routers: 17.9+
  - Cisco IOSvL2 for switches: 17.9+
  - Ubuntu 22.04 LTS (dual-stack client)
  - Windows 11 VM (dual-stack client)
```

### CML Lab File (YAML)

```yaml
lab:
  description: Abhavtech IPv6 Dual-Stack Lab
  notes: PoC for Week 1 validation
  title: ABV-IPv6-POC-Lab
  version: 0.0.4

nodes:
  - id: n0
    label: External-Router
    node_definition: iosv
    x: 0
    y: -100
    configuration: |
      hostname External-Router
      ipv6 unicast-routing
      !
      interface GigabitEthernet0/0
        description TO-INTERNET
        ip address 203.0.113.1 255.255.255.0
        ipv6 address 2001:db8:ffff::1/64
        no shutdown
      !
      interface GigabitEthernet0/1
        description TO-MUM-BN-01
        ip address 10.251.0.0 255.255.255.254
        ipv6 address 2001:db8:abc1:1::0/127
        no shutdown
      !
      ipv6 route ::/0 2001:db8:ffff::ffff
      
  - id: n1
    label: MUM-BN-01
    node_definition: cat9000v
    x: -200
    y: 0
    configuration: |
      ! See full config below in section 3.2
      
  - id: n2
    label: MUM-BN-02
    node_definition: cat9000v
    x: 200
    y: 0
    
  - id: n3
    label: MUM-CP-01
    node_definition: cat9000v
    x: 0
    y: 100
    
  - id: n4
    label: MUM-ED-01
    node_definition: cat9000v
    x: -200
    y: 200
    
  - id: n5
    label: MUM-ED-02
    node_definition: cat9000v
    x: 200
    y: 200
    
  - id: n6
    label: Client-1
    node_definition: ubuntu
    x: -200
    y: 300
    
  - id: n7
    label: Client-2
    node_definition: desktop
    x: 200
    y: 300

links:
  - id: l0
    n1: n0
    n2: n1
    i1: i1
    i2: i0
  - id: l1
    n1: n1
    n2: n3
    i1: i1
    i2: i0
# ... (continue for all links)
```

---

## 3.2 Lab Device Configuration

### MUM-BN-01 (Border Node) — Complete Config

```cisco
!============================================================================
! MUMBAI BORDER NODE 01 — LAB CONFIG
! Platform: Catalyst 9500 (C9500-48Y4C)
! Purpose: IPv6 dual-stack underlay + overlay validation
!============================================================================

hostname MUM-BN-01

! Enable IPv6 routing
ipv6 unicast-routing
ipv6 cef

! ============================================================================
! UNDERLAY: IPv4 + IPv6 Dual-Stack
! ============================================================================

! Loopback0 — Router ID for IS-IS + LISP RLOC
interface Loopback0
  description UNDERLAY-RLOC
  ip address 10.250.1.1 255.255.255.255
  ipv6 address 2001:db8:abc1:0::1/128
  no shutdown

! P2P to External Router (simulated WAN)
interface GigabitEthernet1/0/1
  description P2P-TO-EXTERNAL-ROUTER
  no switchport
  ip address 10.251.0.1 255.255.255.254
  ipv6 address 2001:db8:abc1:1::1/127
  ipv6 enable
  no shutdown

! P2P to MUM-CP-01 (Control Plane)
interface GigabitEthernet1/0/2
  description P2P-TO-MUM-CP-01
  no switchport
  ip address 10.251.1.0 255.255.255.254
  ipv6 address 2001:db8:abc1:1:1::0/127
  ipv6 enable
  no shutdown

! ============================================================================
! IS-IS UNDERLAY (Dual-Stack)
! ============================================================================

router isis UNDERLAY
  net 49.0001.0100.2500.1001.00
  is-type level-2-only
  metric-style wide
  log-adjacency-changes
  !
  address-family ipv4 unicast
    redistribute connected
  exit-address-family
  !
  address-family ipv6 unicast
    redistribute connected
  exit-address-family

interface Loopback0
  ip router isis UNDERLAY
  ipv6 router isis UNDERLAY
  isis circuit-type level-2-only

interface GigabitEthernet1/0/1
  ip router isis UNDERLAY
  ipv6 router isis UNDERLAY
  isis circuit-type level-2-only
  isis network point-to-point

interface GigabitEthernet1/0/2
  ip router isis UNDERLAY
  ipv6 router isis UNDERLAY
  isis circuit-type level-2-only
  isis network point-to-point

! ============================================================================
! BFD (Dual-Stack)
! ============================================================================

bfd-template single-hop BFD-TEMPLATE
  interval min-tx 1000 min-rx 1000 multiplier 3

interface GigabitEthernet1/0/1
  bfd template BFD-TEMPLATE
  bfd interval 1000 min_rx 1000 multiplier 3
  bfd ipv6 interval 1000 min_rx 1000 multiplier 3

interface GigabitEthernet1/0/2
  bfd template BFD-TEMPLATE
  bfd interval 1000 min_rx 1000 multiplier 3
  bfd ipv6 interval 1000 min_rx 1000 multiplier 3

! ============================================================================
! LISP (Dual-Stack)
! ============================================================================

router lisp
  !
  ! Locator set for this Border
  locator-set RLOC-SET
    ipv4-interface Loopback0 priority 1 weight 50
    ipv6-interface Loopback0 priority 1 weight 50
    exit-locator-set
  !
  ! Instance 8001 — VN_CORPORATE (IPv4)
  instance-id 8001
    service ipv4
      eid-table vrf VN_CORPORATE
      database-mapping 10.100.0.0/16 locator-set RLOC-SET
      map-cache 10.100.0.0/16 map-request
      map-server 10.250.1.3 key lab-key
      map-resolver 10.250.1.3
    exit-service-ipv4
    !
    service ipv6
      eid-table vrf VN_CORPORATE
      database-mapping 2001:db8:abc1:2000::/52 locator-set RLOC-SET
      map-cache 2001:db8:abc1:2000::/52 map-request
      map-server 2001:db8:abc1:0::3 key lab-key
      map-resolver 2001:db8:abc1:0::3
    exit-service-ipv6
  !
  exit-router-lisp

! ============================================================================
! VRFs
! ============================================================================

vrf definition VN_CORPORATE
  rd 1:8001
  !
  address-family ipv4
    route-target export 1:8001
    route-target import 1:8001
  exit-address-family
  !
  address-family ipv6
    route-target export 1:8001
    route-target import 1:8001
  exit-address-family

! ============================================================================
! VXLAN (NVE Interface)
! ============================================================================

interface nve1
  description FABRIC-VXLAN-TUNNEL
  no ip address
  source-interface Loopback0
  host-reachability protocol lisp
  !
  member vni 8001 vrf VN_CORPORATE
  member vni 8001 mcast-group 239.1.1.1
  member vni 10011 vlan-based

! ============================================================================
! Overlay SVIs (Anycast Gateway)
! ============================================================================

vlan 1011
  name VN_CORPORATE_DATA_F1

interface Vlan1011
  description ANYCAST-GW-VN_CORPORATE-FLOOR1
  vrf forwarding VN_CORPORATE
  ip address 10.100.1.1 255.255.255.0
  ipv6 address 2001:db8:abc1:2001::1/64
  ipv6 enable
  ipv6 nd managed-config-flag
  ipv6 nd other-config-flag
  no ip redirects
  no ip proxy-arp
  mac-address 0000.0c9f.f001   ! Anycast MAC (same on all edges)
  lisp mobility dynamic-eid CORPORATE_EID_v4
  lisp mobility dynamic-eid CORPORATE_EID_v6
  no shutdown

! ============================================================================
! DHCPv6 (if needed — otherwise SLAAC)
! ============================================================================

ipv6 dhcp pool DHCPV6-CORPORATE-FLOOR1
  address prefix 2001:db8:abc1:2001::/64 lifetime infinite
  dns-server 2001:db8:abc1:1000::53
  domain-name abhavtech.com

interface Vlan1011
  ipv6 dhcp server DHCPV6-CORPORATE-FLOOR1

! ============================================================================
! Management
! ============================================================================

ip domain-name abhavtech.local
crypto key generate rsa modulus 2048

line vty 0 15
  transport input ssh
  login local

username admin privilege 15 secret Cisco123!

end
```

### Verification Commands (Run in Lab)

```bash
# SSH to MUM-BN-01
ssh admin@10.250.1.1

! Test 1: IPv6 Underlay Reachability
ping ipv6 2001:db8:abc1:0::3
! Expected: replies from MUM-CP-01

! Test 2: IS-IS IPv6 Adjacency
show isis ipv6 neighbors
! Expected: MUM-CP-01 in UP state

! Test 3: LISP IPv6 Database
show lisp instance-id 8001 ipv6 database
! Expected: 2001:db8:abc1:2000::/52 registered

! Test 4: BFD Dual-Stack
show bfd neighbors
! Expected: Both IPv4 + IPv6 sessions UP

! Test 5: Client SLAAC
! On Ubuntu Client-1:
ip -6 addr show
! Expected: Auto-configured IPv6 from 2001:db8:abc1:2001::/64

! Test 6: Client IPv6 Ping
ping6 2001:db8:abc1:2002::50
! Expected: Ping another client in different subnet via LISP
```

---

## DAY 4: PRODUCTION TOOLING PREPARATION

## 4.1 DNAC IPv6 Pool Creation

### Create IPv6 Pools for Mumbai (Production)

```
DNAC UI → Design → Network Settings → IP Address Pools → Add Pool

POOL 1: Mumbai Corporate Floor 1
─────────────────────────────────────────────────────────────────────
Pool Name:          IPv6-MUM-CORP-F1
Pool Type:          Generic
IP Subnet:          (leave blank for IPv6)
IPv6 Prefix:        2001:db8:abc1:2001::/64
IPv6 Subnet Mask:   64
IPv6 Gateway:       2001:db8:abc1:2001::1
DHCPv6 Server:      None (use SLAAC)
DNS Server (IPv6):  2001:db8:abc1:1000::53
DHCP Server:        Local (on edge switch SVI)

POOL 2: Mumbai Corporate Floor 2
─────────────────────────────────────────────────────────────────────
Pool Name:          IPv6-MUM-CORP-F2
IPv6 Prefix:        2001:db8:abc1:2002::/64
IPv6 Gateway:       2001:db8:abc1:2002::1
[... same settings as Pool 1]

REPEAT for all 6 floors + Guest/IoT/Voice VLANs = ~10 pools per site
```

### Assign Pools to Sites in DNAC

```
DNAC → Design → Network Hierarchy → Select "Mumbai" site

Click "Edit"
  → IP Address Pools
  → Add Pool
  → Select: IPv6-MUM-CORP-F1
  → VLAN: 1011
  → Click Save

REPEAT for all pools
```

---

## 4.2 ISE IPv6 Configuration

### Add IPv6 Addresses for Network Devices

```
ISE UI → Administration → Network Resources → Network Devices

DEVICE: MUM-BN-01
  Name: MUM-BN-01
  IPv4 Address: 10.250.1.1
  IPv6 Address: 2001:db8:abc1:0::1   ← ADD THIS
  Mask: 128
  RADIUS Shared Secret: <same as IPv4>
  TACACS+ Shared Secret: <same as IPv4>
  Device Type: Cisco Catalyst 9500
  Location: Mumbai

REPEAT for all 708 devices (use CSV import)
```

### ISE CSV Import Template (IPv6)

```csv
"Device Name","IPv4 Address","IPv6 Address","Shared Secret","Device Type","Location"
"MUM-BN-01","10.250.1.1","2001:db8:abc1:0::1","SecretKey123","Cisco Catalyst 9500","Mumbai"
"MUM-BN-02","10.250.1.2","2001:db8:abc1:0::2","SecretKey123","Cisco Catalyst 9500","Mumbai"
"MUM-CP-01","10.250.1.3","2001:db8:abc1:0::3","SecretKey123","Cisco Catalyst 9500","Mumbai"
...
```

### ISE IPv6 Profiling Policy (Endpoint Recognition)

```
ISE → Policy → Profiling → Profiling Policies

CREATE: Windows-Workstation-IPv6
  Rule:
    IF DHCPv6-Option(15) CONTAINS "WORKGROUP" OR "DOMAIN"
    AND DHCPv6-DUID EXISTS
    THEN Assign SGT: 10 (Employees)
    
CREATE: iPhone-iOS-IPv6
  Rule:
    IF DHCPv6-Vendor-Class CONTAINS "Apple"
    AND DHCPv6-Option(1) EQUALS "00:01:00:01:xx:xx:xx"
    THEN Assign SGT: 10 (Employees)
```

---

## 4.3 vManage IPv6 Feature Templates

### Create IPv6 System Template

```
vManage UI → Configuration → Templates → Feature Templates → Add Template

TEMPLATE: ABV-System-IPv6-Hub
Device Type: vedge-c8500-12X
Template Type: System

Basic Configuration:
  Hostname:         {{system_hostname}}
  System IP:        {{system_ip}}
  IPv6 System IP:   {{system_ipv6}}   ← NEW FIELD
  Site ID:          {{site_id}}
  Organization:     Abhavtech
  vBond:            vbond.abhavtech.com
  
IPv6 Settings:
  ☑ Enable IPv6
  IPv6 System IP: 2001:db8:abc1:8000::1/128 (for Mumbai hub)
```

### Create IPv6 VPN 0 Interface Template

```
TEMPLATE: ABV-IF-VPN0-MPLS-IPv6
Device Type: vedge-c8500-12X
Template Type: VPN Interface Ethernet

Interface Name: TenGigabitEthernet0/0/0
Description:    MPLS-WAN-PRIMARY-DUAL-STACK

IPv4 Configuration:
  Address Type: Static
  IPv4 Address: {{mpls_ipv4}}
  Subnet Mask:  {{mpls_mask}}
  
IPv6 Configuration:   ← NEW SECTION
  ☑ Enable IPv6
  Address Type: Static
  IPv6 Address: {{mpls_ipv6}}
  Prefix Length: 127
  
Tunnel:
  Color: mpls
  Encapsulation: ipsec
  BFD:
    ☑ Enable IPv4 BFD
    ☑ Enable IPv6 BFD   ← NEW
    Multiplier: 7
    Hello Interval: 1000
```

---

## 4.4 Monitoring Tools IPv6 Preparation

### ThousandEyes: Add IPv6 Tests

```
ThousandEyes UI → Cloud & Enterprise Agents → Agent Settings

AGENT: Mumbai Enterprise Agent (10.252.60.10)
  → Network → IPv6 Address: 2001:db8:abc1:1001::60
  → Click Save

CREATE TEST: IPv6 HTTP Server Test
  Test Name: IPv6-Google
  Target: ipv6.google.com
  Agents: Select all 6 enterprise agents
  Interval: 5 minutes
  
CREATE TEST: IPv6 Agent-to-Agent
  Test Name: Mumbai-to-London-IPv6
  Source: Mumbai Enterprise Agent
  Target: London Enterprise Agent (IPv6: 2001:db8:abcb:1001::60)
  Protocol: TCP
  Port: 49153
  Interval: 5 minutes
```

### Splunk: Add IPv6 Listener

```bash
# SSH to Splunk indexer (10.252.31.50)
ssh splunk@10.252.31.50

# Edit inputs.conf
sudo vi /opt/splunk/etc/system/local/inputs.conf

# Add IPv6 syslog listener
[tcp://2001:db8:abc1:1001::50:514]
connection_host = ip
sourcetype = syslog
index = main

[udp://2001:db8:abc1:1001::50:514]
connection_host = ip
sourcetype = syslog
index = main

# Restart Splunk
sudo /opt/splunk/bin/splunk restart
```

### Verify Splunk IPv6 Listener

```bash
# Test from Mumbai edge switch
ssh admin@10.250.1.10

! Send test syslog via IPv6
send log facility local0 severity informational message "IPv6 syslog test from MUM-ED-01"

# On Splunk: Search
index=main host="2001:db8:abc1:0::10"
# Expected: See test log message
```

---

## DAY 5: READINESS ASSESSMENT AND GO/NO-GO

## 5.1 Infrastructure Readiness Checklist

```
WEEK 1 DELIVERABLES — FINAL CHECKLIST:
═══════════════════════════════════════════════════════════════════════

DAY 1: IPv6 PREFIX PLANNING
☐ ARIN /44 request submitted (expected approval: 2-4 weeks)
☐ Addressing hierarchy documented (19 sites + cloud + IoT)
☐ Stakeholder review completed (Network Arch, Security, Cloud teams)

DAY 2: IPAM AND SPREADSHEET
☐ DNAC IPAM configured for IPv6 (management IPv6: 2001:db8:abc1:1000::10)
☐ Master spreadsheet created (Abhavtech_IPv6_Addressing_Plan.xlsx)
☐ All 19 sites have /48 assignments documented
☐ Device inventory updated with IPv6 loopback addresses (708 devices)

DAY 3: LAB VALIDATION
☐ CML lab topology deployed (5 switches + 2 clients)
☐ IPv6 underlay tested (IS-IS dual-stack, BFD IPv4 + IPv6)
☐ IPv6 overlay tested (LISP dual-stack, VXLAN over IPv6 RLOC)
☐ Client SLAAC working (Ubuntu + Windows 11 auto-config)
☐ Cross-subnet IPv6 ping successful (via LISP fabric)

DAY 4: PRODUCTION TOOLING
☐ DNAC: IPv6 pools created for Mumbai (10 pools × 6 VNs)
☐ ISE: IPv6 device addresses added (708 devices via CSV import)
☐ ISE: IPv6 profiling policies created (Windows, iPhone, IoT)
☐ vManage: IPv6 feature templates created (System, VPN0 interface)
☐ ThousandEyes: IPv6 tests configured (HTTP + Agent-to-Agent)
☐ Splunk: IPv6 syslog listener active (port 514/TCP + UDP)

DAY 5: SIGN-OFF
☐ All Week 1 deliverables complete (100% checklist above)
☐ Lab results documented and shared with stakeholders
☐ Phase 1 kickoff meeting scheduled (Week 2 Day 1)
☐ Rollback plan reviewed and approved
☐ Change control ticket created for Phase 1 (SD-WAN underlay)

═══════════════════════════════════════════════════════════════════════
FINAL STATUS: ☐ GO   ☐ NO-GO (with reason)

IF GO:
  - Phase 1 (SD-WAN Underlay IPv6) begins Week 2
  - First production site: Mumbai Hub (pilot)
  - Expected duration: 8 weeks (underlay + overlay)
  
IF NO-GO:
  - Resolve blockers identified in checklist
  - Reschedule Week 1 completion
  - Do NOT proceed to Phase 1 until 100% ready
```

---

## 5.2 Stakeholder Sign-Off Meeting

### Meeting Agenda (60 minutes)

```
ABHAVTECH IPv6 MIGRATION — WEEK 1 SIGN-OFF MEETING
Date: [Friday, Week 1]
Duration: 60 minutes
Attendees: Network Arch, Security, Cloud, NOC, Change Mgmt

AGENDA:
─────────────────────────────────────────────────────────────────────

1. Week 1 Deliverables Review (10 min)
   - Presenter: Network Architect
   - Show: Master spreadsheet, DNAC IPv6 pools, lab results
   
2. Lab Validation Demo (15 min)
   - Presenter: Network Engineer
   - Demo: Dual-stack ping, LISP IPv6 EID lookup, BFD sessions
   
3. Production Readiness Discussion (15 min)
   - DNAC: IPv6 pool strategy per site
   - ISE: IPv6 profiling approach
   - vManage: Template rollout plan
   - Monitoring: IPv6 visibility in TE, Splunk, AppD
   
4. Phase 1 Plan Overview (10 min)
   - Scope: SD-WAN underlay IPv6 (19 sites, 8 weeks)
   - Pilot: Mumbai hub (Week 2)
   - Rollout: APAC → EMEA → Americas
   
5. Risk Review and Rollback Plan (5 min)
   - Risk: IPv6 breaks IPv4 (mitigation: separate config blocks)
   - Rollback: Remove IPv6 config, verify IPv4 unaffected
   
6. Go/No-Go Decision (5 min)
   - Vote: All stakeholders
   - Decision: GO (proceed to Phase 1) or NO-GO (resolve blockers)
   
─────────────────────────────────────────────────────────────────────

REQUIRED APPROVALS:
☐ Network Architecture Team
☐ Security Team
☐ Cloud Infrastructure Team (Azure/GCP owners)
☐ NOC Operations
☐ Change Management

DECISION: _____________  (GO / NO-GO)
```

---

## 5.3 Next Steps (If GO)

```
WEEK 2 KICKOFF (Phase 1 — SD-WAN Underlay IPv6):
─────────────────────────────────────────────────────────────────────

Monday, Week 2:
  - Morning: Phase 1 kickoff meeting (1 hour)
  - Afternoon: Begin Mumbai hub underlay config
  
Tuesday-Friday, Week 2:
  - Deploy IPv6 on Mumbai hub SD-WAN devices
    * C8500-12X (MUM-HUB-01/02): Loopbacks, WAN interfaces
    * IS-IS dual-stack
    * BFD IPv6 sessions to other hubs
  - Validation: Cross-site IPv6 ping (Mumbai → London → NJ)
  
Week 3-4:
  - Rollout to all 6 hub sites (Chennai, London, Frankfurt, NJ, Dallas)
  
Week 5-8:
  - Rollout to all 13 branch sites (ISR 4331, ISR 1100)
  
Week 9:
  - Phase 1 validation and sign-off
  - Prepare for Phase 2 (SD-Access overlay IPv6)
```

---

## WEEK 1 COMPLETE

**Summary**: 
- IPv6 addressing planned and documented
- ARIN allocation requested (/44 prefix)
- Lab validated (dual-stack LISP/VXLAN working)
- Production tools prepared (DNAC, ISE, vManage, ThousandEyes, Splunk)
- Stakeholder sign-off obtained

**Next Guide**: Week 2-4 (Phase 1 — SD-WAN Underlay IPv6 Deployment)

---

*© 2025 Abhavtech - IPv6 Migration Week 1 Guide*
*Version 1.0 | Last Updated: January 2025*
