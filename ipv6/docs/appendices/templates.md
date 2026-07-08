# Deployment Templates & Automation

This page provides all downloadable templates, automation scripts, and the SD-Access deployment checklist used in the IPv6 migration. These are production-ready files validated against DNAC 2.3.7.x and ISE 3.3+.

---

## Template Files

### 1. Edge Switch Dual-Stack Template (DNAC CLI Template)

**File:** `Edge-Switch-Dual-Stack-IPv6.json` — 14 KB  
**Type:** DNAC CLI Template (JSON import)  
**Devices:** Cisco Catalyst 9300 Series

Import path in Catalyst Center:
```
Design → Network Profiles → Templates → Import
```

**What it configures (28 variables):**

- LISP dual-stack: IPv4 + IPv6 service, instance-id 8001
- VXLAN NVE interface with IPv6 payload
- Anycast Gateway SVI with SLAAC (M=0, O=1) and DNS via RA (RFC 8106)
- IPv6 First-Hop Security: RA Guard, DHCPv6 Guard, device tracking
- 802.1X with dual-stack source guard
- Access port configuration (data + voice VLAN dual-stack)

Key variables: `hostname`, `loopback_ipv4`, `loopback_ipv6`, `lisp_instance_id`, `vrf_name`, `eid_prefix_v4`, `eid_prefix_v6`, `map_server_v4`, `map_server_v6`, `anycast_gw_v4`, `anycast_gw_v6`

---

### 2. ISE IPv6 Profiling Policies (XML Export)

**File:** `ISE-IPv6-Profiling-Policies.xml` — 11 KB  
**Type:** ISE Policy Export (XML)

Import path in ISE:
```
Administration → System → Maintenance → Import → Profiling Policies
```

**Profiling policies included:**

| Policy | Detection Method | SGT | VLAN |
|--------|-----------------|-----|------|
| Windows-Workstation-IPv6 | DHCPv6 DUID + vendor class | 10 (Corporate) | 1011 |
| iPhone-iOS-IPv6 | Apple DHCPv6 vendor class + User-Agent | 10 (Corporate) | 1011 |
| Android-Device-IPv6 | dhcpcd + User-Agent | 10 (Corporate) | 1011 |
| IoT-Camera-IPv6 | Axis DHCPv6 stateful + OUI | 25 (IoT) | 1031 |
| Cisco-IP-Phone-IPv6 | Cisco 8800 DHCPv6 + CDP | 15 (Voice) | 1041 |

**IPv6 ACLs included:**

- `CORPORATE-IN-v6-ACL` — permit all, block rogue RAs
- `GUEST-IN-v6-ACL` — HTTP/HTTPS only, block server traffic
- `IOT-IN-v6-ACL` — limited access to designated servers only

**Post-import:** Review policies under ISE → Policy → Profiling. Customize SGT values and VLAN assignments to match your TrustSec design before enabling.

---

### 3. DNAC IPv6 Pools Bulk Import (CSV)

**File:** `DNAC-IPv6-Pools-Import.csv` — 3.8 KB  
**Type:** IPv6 address pool definitions for Catalyst Center

**18 pools pre-configured across 3 sites:**

| Site | Pool Name | Prefix | Type |
|------|-----------|--------|------|
| Mumbai HQ | MUM-Corp-F1 through F6 | `2001:db8:abc1:2001-2006::/64` | SLAAC |
| Mumbai HQ | MUM-Guest, MUM-IoT, MUM-Servers, MUM-Voice | `2001:db8:abc1:2011-2014::/64` | SLAAC/Stateful |
| Chennai HQ | CHN-Corp-F1 through F4 | `2001:db8:abc2:2001-2004::/64` | SLAAC |
| Chennai HQ | CHN-Guest, CHN-IoT | `2001:db8:abc2:2011-2012::/64` | SLAAC |
| Hyderabad | HYD-Corp, HYD-Guest | `2001:db8:abc3:2001-2002::/64` | SLAAC |

All pools configured with: SLAAC (M=0, O=1), DNS via RA (RFC 8106), dual DNS servers (internal + `2001:4860:4860::8888` backup), site hierarchy association, VLAN mapping.

!!! warning "Replace documentation prefixes"
    Replace `2001:db8::/32` with your actual ARIN-allocated prefix before importing.

---

### 4. ISE Network Devices Bulk Import (CSV)

**File:** `ISE-Network-Devices-IPv6-Import.csv` — 3.6 KB  
**Type:** ISE Network Device bulk import

**24 devices pre-configured:**

| Site | Devices | Count |
|------|---------|-------|
| Mumbai | Edge switches (F1–F6), Border (BN-01/02), Control Plane (CP-01/02), WLC (01/02) | 13 |
| Chennai | Edge switches (F1–F4), Border, CP, WLC | 6 |
| Hyderabad | Fabric-in-a-Box (HYD-FIAB-01) | 1 |

All devices include: dual-stack addressing, RADIUS/TACACS shared secret placeholders (`$RADIUS_SECRET$`, `$TACACS_SECRET$`), CoA port 1700, SNMP v2c, device profiles (Cisco-Switch or Cisco-WLC).

!!! warning "Before importing"
    Replace `$RADIUS_SECRET$` and `$TACACS_SECRET$` with your actual shared secrets globally before importing.

---

### 5. Automated Deployment Script (Python)

**File:** `deploy_ipv6_templates.py` — 12 KB  
**Requirements:** `pip install requests urllib3`

```bash
# Deploy DNAC templates + ISE policies in one run
python3 deploy_ipv6_templates.py \
  --dnac dnac.abhavtech.com \
  --ise ise.abhavtech.com

# DNAC only
python3 deploy_ipv6_templates.py --dnac dnac.abhavtech.com

# Specify custom templates directory
python3 deploy_ipv6_templates.py \
  --dnac dnac.abhavtech.com \
  --templates-dir /path/to/your/templates
```

**What the script does:**

1. Authenticates to DNAC via REST API (interactive password prompt — never in CLI args)
2. Creates project `SD-Access-IPv6-Templates` in DNAC
3. Imports `Edge-Switch-Dual-Stack-IPv6.json` CLI template
4. Creates 18 IPv6 pools from `DNAC-IPv6-Pools-Import.csv`
5. Authenticates to ISE
6. Imports 24 network devices from `ISE-Network-Devices-IPv6-Import.csv`
7. Prints success/failure statistics per operation

---

## SD-Access Deployment Checklist

The [SD-Access IPv6 Deployment Checklist](sd-access-checklist.md) is a site-by-site validation template covering:

- **Pre-deployment** (35 items): Infrastructure, DNAC, ISE, and change management readiness
- **Phase 1:** LISP dual-stack (Map-Server, Border Node, Edge Node)
- **Phase 2:** Overlay configuration (VRF, SVI, Anycast Gateway per VLAN)
- **Phase 3:** Security (IPv6 First-Hop Security, RA Guard, access ports)
- **Validation** (40+ items): Control plane, data plane, client testing (Windows 11, iPhone, IoT)
- **Post-deployment:** Documentation, monitoring setup, NOC handoff
- **Rollback procedure:** Trigger conditions and step-by-step rollback
- **Sign-off:** Stakeholder approval matrix

---

## Deployment Workflow

```
Option A — Manual:
  1. Import Edge-Switch-Dual-Stack-IPv6.json into DNAC
  2. Import ISE-IPv6-Profiling-Policies.xml into ISE
  3. Create pools in DNAC using CSV as reference
  4. Add network devices to ISE using CSV as reference
  5. Follow SD-Access deployment checklist for validation

Option B — Automated (recommended for multi-site rollouts):
  1. python3 deploy_ipv6_templates.py --dnac <host> --ise <host>
  2. Verify in DNAC: Design → Network Profiles → Templates
  3. Verify in ISE: Policy → Profiling → IPv6 policies
  4. Deploy templates to switches via DNAC provisioning
  5. Follow SD-Access deployment checklist per site
```

---

## Validation Reference

After deployment, verify with these commands on each edge switch:

```
# LISP IPv6 registrations
show lisp site | include 2001

# Border LISP IPv6 database
show lisp instance-id 8001 ipv6 database

# Anycast Gateway IPv6 interface
show ipv6 interface vlan <VLAN_ID>

# 802.1X sessions (dual-stack)
show authentication sessions

# Client validation (Windows)
ipconfig /all
ping 2001:db8:abc1:2001::1

# IPv6 routing table
show ipv6 route
```

---

!!! note "Template Versions"
    All templates validated against Cisco Catalyst 9300-48UXM (IOS-XE 17.15.1), Catalyst 9500-48Y4C (IOS-XE 17.15.1), DNAC 2.3.7.x, and ISE 3.3+. For earlier versions, review the LISP instance-id configuration and anycast MAC address commands.
