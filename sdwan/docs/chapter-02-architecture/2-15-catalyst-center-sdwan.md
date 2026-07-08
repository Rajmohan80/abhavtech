# 2.15 Catalyst Center for SD-WAN

## Document Information
| Field | Value |
|-------|-------|
| Document Title | Catalyst Center for SD-WAN Integration |
| Version | 1.0 |
| Author | Network Architecture Team |
| Organization | Abhavtech.com |
| Last Updated | December 2025 |
| Status | Production |

---

## Table of Contents
1. [Integration Overview](#integration-overview)
2. [Architecture Design](#architecture-design)
3. [Unified Dashboard](#unified-dashboard)
4. [Cross-Domain Analytics](#cross-domain-analytics)
5. [Policy Synchronization](#policy-synchronization)
6. [Assurance Integration](#assurance-integration)
7. [Automation Workflows](#automation-workflows)
8. [Implementation Guide](#implementation-guide)

---

## 1. Integration Overview

### 1.1 Catalyst Center + SD-WAN Manager Integration

Catalyst Center (DNA Center) provides unified management for campus (SD-Access) and WAN (SD-WAN) networks, enabling end-to-end visibility and policy orchestration.

**Integration Benefits:**
- Single pane of glass for campus + WAN
- Cross-domain policy consistency
- Unified troubleshooting workflows
- End-to-end assurance
- Correlated analytics

### 1.2 Integration Architecture

```
+--------------------------------------------------------------------+
|                CATALYST CENTER + SD-WAN INTEGRATION                 |
+--------------------------------------------------------------------+
|                                                                     |
|  +---------------------------+    +---------------------------+     |
|  |    Catalyst Center        |    |    SD-WAN Manager         |     |
|  |    (DNA Center 2.3.7.x)   |    |    (vManage 20.15.x)      |     |
|  |                           |    |                           |     |
|  | +-----------------------+ |    | +-----------------------+ |     |
|  | | SD-Access Fabric      | |    | | SD-WAN Overlay        | |     |
|  | | - Campus Switches     | |    | | - WAN Edges           | |     |
|  | | - Wireless Controllers| |    | | - Controllers         | |     |
|  | | - Fabric Borders      | |    | | - Validators          | |     |
|  | +-----------------------+ |    | +-----------------------+ |     |
|  |            |              |    |            |              |     |
|  +------------|--REST API----|----+------------|REST API------+     |
|               |              |                 |                    |
|               v              v                 v                    |
|  +---------------------------------------------------------------+  |
|  |                   INTEGRATION LAYER                            |  |
|  |  +-------------------+  +-------------------+  +-------------+ |  |
|  |  | Unified Dashboard |  | Cross-Domain      |  | Workflow    | |  |
|  |  |                   |  | Analytics         |  | Automation  | |  |
|  |  +-------------------+  +-------------------+  +-------------+ |  |
|  +---------------------------------------------------------------+  |
|                                                                     |
+--------------------------------------------------------------------+
```

### 1.3 Integration Modes

| Mode | Description | Abhavtech Selection |
|------|-------------|---------------------|
| Federated | Separate consoles with API integration | **Selected** |
| Unified | Single Catalyst Center manages both | Future consideration |
| Hybrid | Catalyst Center primary with SD-WAN Manager embedded | Evaluation |

---

## 2. Architecture Design

### 2.1 Deployment Topology

```
+--------------------------------------------------------------------+
|                    MANAGEMENT ARCHITECTURE                          |
+--------------------------------------------------------------------+
|                                                                     |
|  Mumbai DC                                                          |
|  +------------------------------------------------------+          |
|  |                                                      |          |
|  |  Catalyst Center Cluster          SD-WAN Manager     |          |
|  |  +------------------+             +---------------+  |          |
|  |  | DNAC-1 (Primary) |             | vManage-1    |  |          |
|  |  | DNAC-2           |<---REST---->| vManage-2    |  |          |
|  |  | DNAC-3           |    API      | vManage-3    |  |          |
|  |  +------------------+             +---------------+  |          |
|  |         |                               |            |          |
|  |         |                               |            |          |
|  |  +------v------+                 +------v------+    |          |
|  |  | SD-Access   |                 | SD-WAN      |    |          |
|  |  | Fabric      |                 | Overlay     |    |          |
|  |  +-------------+                 +-------------+    |          |
|  |                                                      |          |
|  +------------------------------------------------------+          |
|                                                                     |
|  Chennai DR (Standby)                                              |
|  +------------------------------------------------------+          |
|  |  DNAC DR Cluster                  vManage DR Cluster |          |
|  +------------------------------------------------------+          |
|                                                                     |
+--------------------------------------------------------------------+
```

### 2.2 API Integration Architecture

**REST API Connectivity:**

| Source | Destination | Port | Protocol | Purpose |
|--------|-------------|------|----------|---------|
| Catalyst Center | SD-WAN Manager | 443 | HTTPS | Device sync |
| SD-WAN Manager | Catalyst Center | 443 | HTTPS | Analytics export |
| Both | ISE | 443 | pxGrid | Policy sync |

### 2.3 Integration Prerequisites

| Prerequisite | Catalyst Center | SD-WAN Manager |
|--------------|-----------------|----------------|
| Version | 2.3.7.x+ | 20.15.x+ |
| Licensing | DNA Advantage | DNA Advantage |
| Certificate | CA-signed or mutual trust | CA-signed |
| Network | Reachable via management VPN | Reachable |
| Authentication | RBAC configured | RBAC configured |

---

## 3. Unified Dashboard

### 3.1 Dashboard Components

```
+--------------------------------------------------------------------+
|                    UNIFIED NETWORK DASHBOARD                        |
+--------------------------------------------------------------------+
|                                                                     |
|  Enterprise Health Score: 94/100                                   |
|  +---------------------------------------------------------------+ |
|  |                                                               | |
|  |  [Campus: 96]  [WAN: 91]  [Cloud: 95]  [Security: 93]        | |
|  |                                                               | |
|  +---------------------------------------------------------------+ |
|                                                                     |
|  Site Overview                                                     |
|  +-------------------+-------------------+-------------------+      |
|  | Mumbai DC         | Chennai DR        | Bangalore         |      |
|  | Campus: ✓         | Campus: ✓         | Campus: ✓         |      |
|  | WAN: ✓            | WAN: ✓            | WAN: ✓            |      |
|  | Edges: 2          | Edges: 2          | Edges: 2          |      |
|  | Health: 98%       | Health: 95%       | Health: 92%       |      |
|  +-------------------+-------------------+-------------------+      |
|                                                                     |
|  Cross-Domain Issues (3)                                           |
|  +---------------------------------------------------------------+ |
|  | 1. Mumbai: High latency on WAN affecting Teams calls          | |
|  | 2. Delhi: Fabric border BGP flapping impacting WAN routes     | |
|  | 3. London: DNS resolution slow - campus + WAN affected        | |
|  +---------------------------------------------------------------+ |
|                                                                     |
+--------------------------------------------------------------------+
```

### 3.2 Dashboard Widgets

| Widget | Data Source | Update Interval |
|--------|-------------|-----------------|
| Site Health | Both platforms | 5 minutes |
| Application Experience | Cross-domain | 1 minute |
| Security Posture | ISE + Both | 15 minutes |
| Topology View | Merged | Real-time |
| Issue List | Correlated | 1 minute |
| Traffic Analytics | Both platforms | 5 minutes |

### 3.3 Custom Dashboard Configuration

```python
# Dashboard API Configuration
dashboard_config = {
    "name": "Abhavtech Enterprise Dashboard",
    "layout": "grid",
    "widgets": [
        {
            "type": "health_score",
            "sources": ["catalyst_center", "sdwan_manager"],
            "position": {"row": 1, "col": 1, "width": 4}
        },
        {
            "type": "site_map",
            "data_sources": ["both"],
            "show_wan_links": True,
            "show_fabric_status": True,
            "position": {"row": 2, "col": 1, "width": 6}
        },
        {
            "type": "application_health",
            "apps": ["m365", "salesforce", "zoom"],
            "cross_domain": True,
            "position": {"row": 3, "col": 1, "width": 3}
        }
    ]
}
```

---

## 4. Cross-Domain Analytics

### 4.1 Analytics Architecture

```
+--------------------------------------------------------------------+
|                    CROSS-DOMAIN ANALYTICS                           |
+--------------------------------------------------------------------+
|                                                                     |
|  Data Collection                                                   |
|  +-------------------+    +-------------------+                     |
|  | Catalyst Center   |    | SD-WAN Manager    |                     |
|  | Telemetry         |    | Statistics        |                     |
|  | - NetFlow         |    | - App statistics  |                     |
|  | - Device health   |    | - Tunnel metrics  |                     |
|  | - Client data     |    | - SLA data        |                     |
|  +-------------------+    +-------------------+                     |
|           |                        |                               |
|           v                        v                               |
|  +-------------------------------------------------------+         |
|  |              Analytics Correlation Engine              |         |
|  |                                                       |         |
|  |  Input: Campus metrics + WAN metrics                  |         |
|  |  Processing: ML-based correlation                     |         |
|  |  Output: Unified insights                             |         |
|  +-------------------------------------------------------+         |
|                          |                                         |
|                          v                                         |
|  +-------------------------------------------------------+         |
|  |              Unified Insights                          |         |
|  |  - End-to-end application path analysis               |         |
|  |  - Root cause spanning campus + WAN                   |         |
|  |  - Predictive analytics across domains                |         |
|  +-------------------------------------------------------+         |
|                                                                     |
+--------------------------------------------------------------------+
```

### 4.2 Cross-Domain Metrics

| Metric | Campus Source | WAN Source | Correlation |
|--------|---------------|------------|-------------|
| Application Latency | DNAC Assurance | vAnalytics | End-to-end path |
| User Experience | Client 360 | vQoE | Session tracking |
| Network Health | Device health | Edge health | Site rollup |
| Security Posture | ISE compliance | Edge security | Unified score |

### 4.3 Analytics Queries

**End-to-End Path Analysis:**

```python
# Cross-domain path analysis query
def analyze_e2e_path(client_mac, app_name, time_range):
    """
    Analyze end-to-end path from client through campus and WAN
    """
    # Campus segment (Catalyst Center)
    campus_data = catalyst_center.get_client_path(
        mac=client_mac,
        time=time_range
    )
    
    # Identify egress point (fabric border)
    border_ip = campus_data['egress_device']
    
    # WAN segment (SD-WAN Manager)
    wan_data = sdwan_manager.get_app_route(
        source_ip=border_ip,
        app=app_name,
        time=time_range
    )
    
    # Correlate metrics
    e2e_latency = campus_data['latency'] + wan_data['latency']
    e2e_loss = 1 - ((1 - campus_data['loss']) * (1 - wan_data['loss']))
    
    return {
        'client': client_mac,
        'app': app_name,
        'campus_latency_ms': campus_data['latency'],
        'wan_latency_ms': wan_data['latency'],
        'total_latency_ms': e2e_latency,
        'total_loss_pct': e2e_loss,
        'path': campus_data['path'] + wan_data['path']
    }
```

---

## 5. Policy Synchronization

### 5.1 Policy Integration Model

```
+--------------------------------------------------------------------+
|                    POLICY SYNCHRONIZATION                           |
+--------------------------------------------------------------------+
|                                                                     |
|  ISE (Policy Authority)                                            |
|  +---------------------------------------------------------------+ |
|  |  - SGT Definitions (12 tags)                                  | |
|  |  - SGACL Policies                                             | |
|  |  - Authorization Profiles                                      | |
|  +---------------------------------------------------------------+ |
|              |                              |                       |
|              | pxGrid                       | pxGrid                |
|              v                              v                       |
|  +---------------------------+  +---------------------------+      |
|  | Catalyst Center           |  | SD-WAN Manager            |      |
|  |                           |  |                           |      |
|  | - Apply SGT to fabric     |  | - Apply SGT to WAN        |      |
|  | - Campus segmentation     |  | - WAN segmentation        |      |
|  | - VN policies             |  | - VPN policies            |      |
|  +---------------------------+  +---------------------------+      |
|                                                                     |
|  Synchronized Elements:                                            |
|  ✓ SGT definitions and numbering                                   |
|  ✓ User-to-SGT mappings                                            |
|  ✓ VN/VPN segmentation boundaries                                  |
|  ✓ QoS marking policies                                            |
|                                                                     |
+--------------------------------------------------------------------+
```

### 5.2 SGT Synchronization

**Shared SGT Configuration:**

| SGT | Name | Campus Policy | WAN Policy |
|-----|------|---------------|------------|
| 3 | Employees | Full access to Employee_VN | VPN 10 access |
| 4 | Guests | Guest_VN only, Internet | VPN 20, DIA only |
| 5 | Contractors | Limited Employee_VN | VPN 10 restricted |
| 7 | IoT_Sensors | IoT_VN only | VPN 30, cloud only |
| 9 | Voice_Devices | Voice_VN priority | VPN 40, QoS EF |
| 10 | Executives | Full access, priority | All VPNs, priority |
| 11 | IT_Admins | Management access | VPN 512, all access |

### 5.3 QoS Policy Mapping

| Campus QoS | DSCP | WAN Forwarding Class | Priority |
|------------|------|----------------------|----------|
| Voice | EF (46) | Real-Time | Strict |
| Video | AF41 (34) | Interactive Video | High |
| Business | AF31 (26) | Business Critical | Medium |
| Default | BE (0) | Best Effort | Low |

---

## 6. Assurance Integration

### 6.1 Unified Assurance Model

```
+--------------------------------------------------------------------+
|                    ASSURANCE INTEGRATION                            |
+--------------------------------------------------------------------+
|                                                                     |
|  Issue Detection                                                   |
|  +---------------------------+  +---------------------------+      |
|  | Catalyst Center Assurance |  | SD-WAN vAnalytics         |      |
|  |                           |  |                           |      |
|  | Issues:                   |  | Issues:                   |      |
|  | - Client onboarding       |  | - Tunnel flaps            |      |
|  | - AP coverage             |  | - SLA violations          |      |
|  | - Switch health           |  | - Path degradation        |      |
|  | - Fabric issues           |  | - Controller issues       |      |
|  +---------------------------+  +---------------------------+      |
|              |                              |                       |
|              v                              v                       |
|  +-------------------------------------------------------+         |
|  |              Issue Correlation Engine                  |         |
|  |                                                       |         |
|  |  Correlate: Campus issue + WAN impact                 |         |
|  |  Example: "Fabric border flap caused WAN route churn" |         |
|  +-------------------------------------------------------+         |
|                          |                                         |
|                          v                                         |
|  +-------------------------------------------------------+         |
|  |              Unified Issue Dashboard                   |         |
|  |                                                       |         |
|  |  Issue: E2E application degradation                   |         |
|  |  Root Cause: Campus switch CPU spike                  |         |
|  |  Impact: WAN tunnel latency increased                 |         |
|  |  Remediation: CPU optimization applied                |         |
|  +-------------------------------------------------------+         |
|                                                                     |
+--------------------------------------------------------------------+
```

### 6.2 Correlated Issue Examples

| Issue | Campus Indicator | WAN Indicator | Root Cause |
|-------|------------------|---------------|------------|
| Voice quality | Client latency spike | Tunnel jitter increase | Switch buffer overflow |
| App slow | Fabric BGP flap | Route reconvergence | Border CPU issue |
| Users offline | ISE auth failure | No SGT mapping | RADIUS timeout |
| Site down | No campus heartbeat | All tunnels down | Power failure |

### 6.3 Assurance API Integration

```python
# Unified Assurance Query
def get_site_health(site_name):
    """
    Get unified health score combining campus and WAN
    """
    # Campus health from Catalyst Center
    campus = catalyst_center_api.get(
        f"/dna/intent/api/v1/site-health?siteId={site_name}"
    ).json()
    
    # WAN health from SD-WAN Manager
    wan = sdwan_manager_api.get(
        f"/dataservice/device/health?siteName={site_name}"
    ).json()
    
    # Calculate unified health
    unified_health = {
        'site': site_name,
        'campus_health': campus['healthScore'],
        'wan_health': wan['healthScore'],
        'unified_score': (campus['healthScore'] + wan['healthScore']) / 2,
        'issues': campus['issues'] + wan['issues'],
        'timestamp': datetime.utcnow().isoformat()
    }
    
    return unified_health
```

---

## 7. Automation Workflows

### 7.1 Cross-Domain Workflows

| Workflow | Trigger | Actions | Platforms |
|----------|---------|---------|-----------|
| New Site Deploy | Request | Provision campus + WAN | Both |
| VN/VPN Addition | Policy change | Update fabric + overlay | Both |
| SGT Propagation | ISE update | Push to campus + WAN | Both via ISE |
| Troubleshoot Path | User request | Trace campus + WAN | Both |

### 7.2 Ansible Playbook for Cross-Domain

```yaml
---
# Cross-domain site provisioning playbook
- name: Provision New Site - Campus + WAN
  hosts: localhost
  vars:
    site_name: "{{ site }}"
    
  tasks:
    - name: Create site in Catalyst Center
      cisco.dnac.site:
        dnac_host: "{{ dnac_host }}"
        site_name: "{{ site_name }}"
        site_type: "branch"
        parent: "Global/India"
      register: dnac_site
      
    - name: Provision SD-Access fabric
      cisco.dnac.sda_fabric:
        dnac_host: "{{ dnac_host }}"
        fabric_name: "{{ site_name }}_fabric"
        fabric_type: "fabric-site"
        control_plane_node: "{{ site_name }}-cp"
      when: dnac_site.changed
      
    - name: Configure site in SD-WAN Manager
      cisco.sdwan.site:
        vmanage_host: "{{ vmanage_host }}"
        site_id: "{{ site_id }}"
        site_name: "{{ site_name }}"
        region: "india"
      register: sdwan_site
      
    - name: Deploy WAN edge template
      cisco.sdwan.device_template:
        vmanage_host: "{{ vmanage_host }}"
        template_name: "india-branch-template"
        device_ip: "{{ wan_edge_ip }}"
        variables:
          site_id: "{{ site_id }}"
          system_ip: "{{ system_ip }}"
      when: sdwan_site.changed
      
    - name: Verify cross-domain connectivity
      uri:
        url: "{{ integration_api }}/verify/{{ site_name }}"
        method: GET
      register: verification
      
    - name: Report deployment status
      debug:
        msg: "Site {{ site_name }} deployed. Campus: {{ dnac_site.status }}, WAN: {{ sdwan_site.status }}"
```

### 7.3 Event-Driven Automation

```
+--------------------------------------------------------------------+
|                    EVENT-DRIVEN WORKFLOW                            |
+--------------------------------------------------------------------+
|                                                                     |
|  Event: New employee onboards                                      |
|                                                                     |
|  1. ISE authenticates user                                         |
|     └── SGT assigned: Employees (3)                                |
|                                                                     |
|  2. Catalyst Center receives pxGrid update                         |
|     └── Campus policies applied to user session                    |
|                                                                     |
|  3. SD-WAN Manager receives SXP binding                            |
|     └── WAN edge applies SGT-based policy                          |
|                                                                     |
|  4. User accesses cloud application                                |
|     └── Traffic routed: Campus → Fabric Border → WAN Edge → Cloud  |
|     └── SGT preserved end-to-end                                   |
|     └── QoS applied consistently                                   |
|                                                                     |
+--------------------------------------------------------------------+
```

---

## 8. Implementation Guide

### 8.1 Integration Steps

| Phase | Step | Action | Duration |
|-------|------|--------|----------|
| 1 | Prerequisites | Verify versions, licensing, connectivity | 1 day |
| 2 | API Access | Configure API credentials, certificates | 1 day |
| 3 | ISE Integration | Enable pxGrid on both platforms | 2 days |
| 4 | Dashboard Setup | Configure unified dashboard | 1 day |
| 5 | Analytics Config | Enable cross-domain analytics | 2 days |
| 6 | Workflow Testing | Test automation playbooks | 2 days |
| 7 | Production | Enable in production | 1 day |

### 8.2 API Configuration

**Catalyst Center API Setup:**

```bash
# Enable API access
curl -X POST "https://dnac.abhavtech.com/api/system/v1/auth/token" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "********"}' 
  
# Create integration user
curl -X POST "https://dnac.abhavtech.com/api/v1/user" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "username": "sdwan_integration",
    "role": "NETWORK-ADMIN-ROLE",
    "description": "SD-WAN Manager integration"
  }'
```

**SD-WAN Manager API Setup:**

```bash
# Get session token
curl -X POST "https://vmanage.abhavtech.com/j_security_check" \
  -d "j_username=admin&j_password=********" \
  -c cookies.txt

# Create integration user
curl -X POST "https://vmanage.abhavtech.com/dataservice/admin/user" \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "dnac_integration",
    "password": "********",
    "group": ["netadmin"],
    "description": "Catalyst Center integration"
  }'
```

### 8.3 Verification Commands

**Verify Integration Status:**

```bash
# Catalyst Center - Check SD-WAN integration
GET /dna/intent/api/v1/integration/sdwan/status

# SD-WAN Manager - Check DNAC integration
GET /dataservice/integration/dnac/status

# Expected response
{
  "status": "connected",
  "last_sync": "2025-12-30T10:00:00Z",
  "devices_synced": 854,
  "policies_synced": 47,
  "health": "healthy"
}
```

### 8.4 Troubleshooting Integration

| Issue | Check | Resolution |
|-------|-------|------------|
| API timeout | Network connectivity | Verify firewall rules |
| Auth failure | Credentials | Reset integration user |
| Sync delay | Queue size | Increase sync frequency |
| Data mismatch | Version compatibility | Upgrade to supported versions |

---

## Summary

Catalyst Center integration with SD-WAN Manager provides unified management for Abhavtech's enterprise network.

**Key Integration Points:**
- Federated management with REST API integration
- Cross-domain analytics for end-to-end visibility
- Shared SGT/policy definitions via ISE
- Unified assurance with correlated issues
- Automated workflows for site provisioning

**Benefits Achieved:**
- Single operational view across campus and WAN
- 60% reduction in troubleshooting time
- Consistent policy enforcement
- Automated site deployment
- Proactive issue detection

**Chapter 2 Complete** - All 15 sections covering SD-WAN architecture design are now documented.

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use*
