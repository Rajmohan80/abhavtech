# 1.3 Gap Analysis

### 1.3.1 Infrastructure Gaps

| Gap ID | Category | Current State | Required State | Remediation |
|--------|----------|---------------|----------------|-------------|
| **GAP-001** | Core Switches | Catalyst 6500/6800 (non-fabric) | Catalyst 9500 (fabric-ready) | Replace 18 devices |
| **GAP-002** | Access Switches | Catalyst 3750/3850 | Catalyst 9300/9200 | Replace 180 devices |
| **GAP-003** | WLC | 5520/8540 (AireOS) | 9800 (IOS-XE) | Migrate 12 controllers |
| **GAP-004** | Firewall | ASA 5500-X | FTD with SGT support | Upgrade/Replace 18 units |
| **GAP-005** | DNAC | None | DN2-HW-APL-XL Cluster | New deployment |
| **GAP-006** | ISE | Standalone ACS | ISE 3.x Distributed | New deployment |
| **GAP-007** | Underlay | Manual config, no automation | IS-IS/OSPF underlay | Redesign routing |
| **GAP-008** | Overlay | VLAN-based | VXLAN/LISP | New overlay fabric |

### 1.3.2 Capability Gaps

| Capability | Current | Target | Gap Impact |
|------------|---------|--------|------------|
| **Zero Trust** | Perimeter firewall only | End-to-end SGT | High - Security posture |
| **Automation** | CLI scripts, manual | Intent-based, API-driven | High - Operational efficiency |
| **Analytics** | SNMP, NetFlow | AI/ML Assurance | Medium - Proactive ops |
| **Profiling** | Static MAC-based | Dynamic ISE profiling | High - IoT security |
| **Guest Access** | Captive portal only | Sponsored, self-reg, BYOD | Medium - User experience |

### 1.3.3 Skills Gap Assessment

| Skill Area | Current Level | Required Level | Training Needed |
|------------|---------------|----------------|-----------------|
| **SD-Access Design** | Low | Expert | Cisco DESDG certification |
| **DNA Center Admin** | None | Advanced | DNAC Administration course |
| **ISE Configuration** | Basic | Expert | ISE for Engineers course |
| **Python/Ansible** | Basic | Intermediate | Network Automation training |
| **LISP/VXLAN** | None | Intermediate | SD-Access Fundamentals |

---
