# Project Executive Summary

<span class="ai-badge">AI-Assisted Documentation</span>

---

**ABHAVTECH SD-ACCESS PROJECT - EXECUTIVE SUMMARY**

## Cost Breakdown by Category

| Category | Item | Mumbai | Chennai | Noida | Global | Total Quantity | Unit Cost ($) | Total Cost ($) | Annual OpEx ($) | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| **Fabric Infrastructure** |  |  |  |  |  |  |  |  |  |  |
| Border Nodes | C9500-24Y4C | 2 | 2 | Integrated in FIAB | 0 | 4 | $X,XXX | $X,XXX | $X,XXX | External connectivity + VRF routing |
| Control Plane Nodes | C9500-24Y4C | 2 | 2 | Integrated in FIAB | 0 | 4 | $X,XXX | $X,XXX | $X,XXX | LISP Map-Server/Map-Resolver |
| Intermediate Nodes | C9500-24Y4C | 2 | 2 | 0 | 0 | 4 | $X,XXX | $X,XXX | $X,XXX | Aggregation layer (only Mumbai/Chennai) |
| Edge Switches | C9300-48U | 48 | 54 | 4 | 0 | 106 | $X,XXX | $X,XXX | $X,XXX | Access layer for users |
| FIAB Core | C9300-48UXM | 0 | 0 | 2 | 0 | 2 | $X,XXX | $X,XXX | $X,XXX | Noida branch collapsed design |
| Access Switches | C9200-48P | 0 | 0 | 4 | 0 | 4 | $X,XXX | $X,XXX | $X,XXX | Noida traditional access |
| **Wireless Infrastructure** |  |  |  |  |  |  |  |  |  |  |
| Wireless LAN Controllers | C9800-40 | 2 | 2 | 0 | 0 | 4 | $X,XXX | $X,XXX | $X,XXX | Centralized wireless management |
| Embedded WLC | EWC License | 0 | 0 | 2 | 0 | 2 | $X,XXX | $X,XXX | $X,XXX | Included in C9300-48UXM DNA license |
| Indoor Access Points | C9130AXI | 342 | 170 | 20 | 0 | 532 | $X,XXX | $X,XXX | $X,XXX | Wi-Fi 6E enterprise APs |
| Outdoor Access Points | C9164I-E | 58 | 30 | 0 | 0 | 88 | $X,XXX | $X,XXX | $X,XXX | Outdoor hardened APs |
| **Security Infrastructure** |  |  |  |  |  |  |  |  |  |  |
| Firewalls | FTD 4150 | 3 | 0 | 0 | 0 | 3 | $X,XXX | $X,XXX | $X,XXX | Mumbai DIA (2) + MPLS (1) |
| Firewalls | FTD 2130 | 0 | 2 | 0 | 0 | 2 | $X,XXX | $X,XXX | $X,XXX | Chennai HA pair |
| Firewalls | FTD 1150 | 0 | 0 | 2 | 0 | 2 | $X,XXX | $X,XXX | $X,XXX | Noida branch HA pair |
| Firewall Management | FMC Virtual | 1 | 1 | 0 | 0 | 2 | $X,XXX | $X,XXX | $X,XXX | Centralized firewall management |
| ISE Primary PAN | SNS-3695 | 1 | 0 | 0 | 0 | 1 | $X,XXX | $X,XXX | $X,XXX | Policy Admin Node (Mumbai) |
| ISE Secondary PAN | SNS-3695 | 0 | 1 | 0 | 0 | 1 | $X,XXX | $X,XXX | $X,XXX | Secondary PAN (Chennai) |
| ISE PSN Nodes | SNS-3655 | 2 | 2 | 0 | 0 | 4 | $X,XXX | $X,XXX | $X,XXX | Policy Service Nodes (RADIUS) |
| ISE MnT Nodes | SNS-3655 | 1 | 1 | 0 | 0 | 2 | $X,XXX | $X,XXX | $X,XXX | Monitoring & Logging |
| **DDI Infrastructure** |  |  |  |  |  |  |  |  |  |  |
| DNS/DHCP/IPAM | Infoblox IB-1420 | 2 | 2 | 0 | 0 | 4 | $X,XXX | $X,XXX | $X,XXX | Integrated DDI appliances |
| NTP Servers | Meinberg M1000 | 2 | 0 | 0 | 0 | 2 | $X,XXX | $X,XXX | $X,XXX | GPS-disciplined Stratum 2 |
| NTP Servers | Meinberg M300 | 0 | 1 | 0 | 0 | 1 | $X,XXX | $X,XXX | $X,XXX | Chennai Stratum 3 |
| **Management & Orchestration** |  |  |  |  |  |  |  |  |  |  |
| DNAC Cluster Primary | DN2-HW-APL-XL | 0 | 0 | 0 | 3 | 3 | $X,XXX | $X,XXX | $X,XXX | New Jersey primary cluster |
| DNAC Cluster DR | DN2-HW-APL-XL | 0 | 0 | 0 | 3 | 3 | $X,XXX | $X,XXX | $X,XXX | London DR cluster |
| **Monitoring & Backup** |  |  |  |  |  |  |  |  |  |  |
| Syslog Server | Linux VM | 1 | 1 | 0 | 0 | 2 | $X,XXX | $X,XXX | $X,XXX | Centralized logging |
| NetFlow Collector | Cisco Stealthwatch | 1 | 0 | 0 | 0 | 1 | $X,XXX | $X,XXX | $X,XXX | Traffic analytics |
| SNMP Monitoring | PRTG Network Monitor | 1 | 0 | 0 | 0 | 1 | $X,XXX | $X,XXX | $X,XXX | Device health monitoring |
| Backup Appliance | NetBackup | 1 | 0 | 0 | 0 | 1 | $X,XXX | $X,XXX | $X,XXX | DNAC/ISE backup target |
| RANCID Config Backup | Open Source | 1 | 0 | 0 | 0 | 1 | $X,XXX | $X,XXX | $X,XXX | Redundant config backup |
| ISE Backup SFTP | Linux VM | 1 | 0 | 0 | 0 | 1 | $X,XXX | $X,XXX | $X,XXX | ISE backup repository |
| **Load Balancing** |  |  |  |  |  |  |  |  |  |  |
| ISE PSN Load Balancer | F5 BIG-IP VE | 1 | 1 | 0 | 0 | 2 | $X,XXX | $X,XXX | $X,XXX | RADIUS load balancing |
| **Automation** |  |  |  |  |  |  |  |  |  |  |
| Ansible Tower | Software License | 0 | 0 | 0 | 1 | 1 | $X,XXX | $X,XXX | $X,XXX | Network automation platform |
| **Licensing** |  |  |  |  |  |  |  |  |  |  |
| DNA Advantage (3-year) | Per Device | 638 | 0 | 0 | 0 | 638 | $X,XXX | $X,XXX | $X,XXX | SD-Access + Assurance features |
| ISE Plus (3-year) | Per Endpoint | 18000 | 0 | 0 | 0 | 18000 | $X,XXX | $X,XXX | $X,XXX | TrustSec + Profiling + Posture |
| Firewall Subscriptions | Per Appliance | 3 | 2 | 2 | 0 | 7 | $X,XXX | $X,XXX | $X,XXX | IPS + URL + Malware (annual) |
| **Professional Services** |  |  |  |  |  |  |  |  |  |  |
| Design & Planning |  |  |  |  |  | 1 | $X,XXX | $X,XXX | $X,XXX | Architecture design (2 weeks) |
| Implementation | Mumbai |  |  |  |  | 1 | $X,XXX | $X,XXX | $X,XXX | Deployment + integration (6 weeks) |
| Implementation | Chennai |  |  |  |  | 1 | $X,XXX | $X,XXX | $X,XXX | Deployment (4 weeks) |
| Implementation | Noida |  |  |  |  | 1 | $X,XXX | $X,XXX | $X,XXX | Branch deployment (1 week) |
| Training | Admin Training |  |  |  |  | 1 | $X,XXX | $X,XXX | $X,XXX | DNAC + ISE training (1 week) |
| Support Contract | TAC 24x7 |  |  |  |  | 1 | $X,XXX | $X,XXX | $X,XXX | Cisco TAC support (annual) |
| **Contingency** |  |  |  |  |  |  |  |  |  |  |
| Contingency | 10% Buffer |  |  |  |  | 1 | $X,XXX | $X,XXX | $X,XXX | Unforeseen costs & changes |
| **Totals** |  |  |  |  |  |  |  |  |  |  |
| Total Infrastructure CapEx |  |  |  |  |  |  | $X,XXX |  | Hardware + appliances |  |
| Total Licensing (3-year) |  |  |  |  |  |  | $X,XXX |  | Amortized over $X,XXX years |  |
| Total Services (One-time) |  |  |  |  |  |  | $X,XXX |  | Design + implementation + training |  |
| Total Contingency |  |  |  |  |  |  | $X,XXX |  | $X,XXX% buffer |  |
| GRAND TOTAL CapEx |  |  |  |  |  |  | $X,XXX |  | One-time investment |  |
| GRAND TOTAL Annual OpEx |  |  |  |  |  |  | $X,XXX |  | Recurring per year |  |
| 3-Year TCO |  |  |  |  |  |  | $X,XXX |  | Total Cost of Ownership |  |

## Project Timeline

| Phase | Activity | Duration (Weeks) | Start | End | Dependencies | Milestones | Resources Required | Risk Level |
|---|---|---|---|---|---|---|---|---|
| Phase 0 | Design & Planning | 4 | Week 1 | Week 4 | None | Design approval + BoM finalized | 2 architects + 1 PM | Low |
| Phase 1 | Hardware Procurement | 8 | Week 5 | Week 12 | Phase 0 complete | All equipment received | Procurement team | Medium (supply chain) |
| Phase 2 | DNAC Deployment | 3 | Week 13 | Week 15 | Hardware received | DNAC cluster operational | 2 engineers | Low |
| Phase 3 | ISE Deployment | 3 | Week 16 | Week 18 | DNAC ready | ISE PAN + PSN operational | 2 engineers | Medium |
| Phase 4 | Mumbai Fabric Build | 6 | Week 19 | Week 24 | ISE ready | Mumbai fabric live | 4 engineers | High |
| Phase 5 | Chennai Fabric Build | 4 | Week 25 | Week 28 | Mumbai complete | Chennai fabric live | 3 engineers | Medium |
| Phase 6 | Noida Branch Deployment | 2 | Week 29 | Week 30 | Chennai complete | Noida FIAB live | 2 engineers | Low |
| Phase 7 | Firewall Integration | 2 | Week 31 | Week 32 | All sites live | Security policies active | 2 security engineers | Medium |
| Phase 8 | Monitoring & Automation | 2 | Week 33 | Week 34 | Firewall done | Full visibility achieved | 2 engineers | Low |
| Phase 9 | User Acceptance Testing | 2 | Week 35 | Week 36 | All systems integrated | UAT sign-off | 4 engineers + users | Medium |
| Phase 10 | Training & Handover | 2 | Week 37 | Week 38 | UAT complete | Project closure | 2 trainers | Low |
| Total Project Duration | 38 weeks |  |  | Week 1 | Week 38 | Go-live: Week 36 | 10-15 engineers peak |  |

## Risk Assessment

| Risk ID | Risk Description | Probability | Impact | Mitigation Strategy | Owner | Status |
|---|---|---|---|---|---|---|
| R001 | Hardware delivery delays | Medium | High | Order 4 weeks early + backup vendors | Procurement | Open |
| R002 | DNAC cluster sizing insufficient | Low | Critical | Validate with Cisco TAC pre-purchase | Architect | Closed |
| R003 | ISE integration issues | Medium | High | Engage Cisco PSS for ISE deployment | Project Manager | Open |
| R004 | Fabric underlay misconfiguration | High | Critical | Deploy test lab first + peer review configs | Lead Engineer | Open |
| R005 | WAN latency to DNAC (APAC) | Medium | Medium | Implement regional DNAC in Year 2 if needed | Architect | Accepted |
| R006 | Firewall throughput bottleneck | Low | High | Size FTD 4150 with 2.5× headroom | Security Engineer | Closed |
| R007 | Budget overrun | Medium | High | 10% contingency buffer + monthly tracking | PM + Finance | Open |
| R008 | Skill gap (SD-Access expertise) | High | Medium | External consultants + Cisco training | HR + PM | Mitigated |
| R009 | Change management resistance | Medium | Medium | User training + phased rollout | Change Manager | Open |
| R010 | Vendor lock-in (Cisco) | Low | Medium | Document open APIs + automation via Ansible | Architect | Accepted |

## Resource Requirements

| Role | Quantity | Duration (Weeks) | Hourly Rate ($) | Total Cost ($) | Responsibility | Required Skills | Notes |
|---|---|---|---|---|---|---|---|
| Network Architect | 2 | 38 | $X,XXX | $X,XXX | Overall design + validation | CCIE/CCDE + SD-Access | Lead technical decisions |
| Project Manager | 1 | 38 | $X,XXX | $X,XXX | Timeline + budget + risk | PMP + IT experience | Single point of contact |
| Network Engineer | 4 | 30 | $X,XXX | $X,XXX | Implementation + config | CCNP + SD-Access training | Hands-on deployment |
| Security Engineer | 2 | 10 | $X,XXX | $X,XXX | Firewall + ISE policies | CCNP Security | Firewall + TrustSec focus |
| Wireless Engineer | 2 | 8 | $X,XXX | $X,XXX | WLC + AP deployment | CCNP Wireless | Wi-Fi 6E expertise |
| QA/Test Engineer | 2 | 6 | $X,XXX | $X,XXX | UAT + validation | CCNA + test scripts | Pre-production testing |
| Trainer | 1 | 2 | $X,XXX | $X,XXX | Admin training | CCNA + teaching exp | Knowledge transfer |
| Total Professional Services |  |  |  |  | $X,XXX |  | External consultants if needed |

## Capacity Headroom Analysis

| Component | Current Load | Platform Capacity | Utilization % | 3-Year Projected | 3-Year Utilization % | Headroom Remaining | Upgrade Trigger | Notes |
|---|---|---|---|---|---|---|---|---|
| DNAC Devices | 638 | 8000 | 8% | 1500 | 19% | 81% | >60% utilization | Well-sized for growth |
| ISE Endpoints | 18000 | 25000 | 72% | 30000 | 120% | OVER CAPACITY | Upgrade to 50K license at Year 2 | Action required |
| Border Throughput | 28 Gbps | 440 Gbps | 6.4% | 45 Gbps | 10.2% | 89.8% | >50% utilization | Excellent headroom |
| WLC APs | 532 | 2000 | 27% | 750 | 38% | 62% | >70% utilization | Good capacity |
| Firewall (Mumbai) | 18 Gbps | 70 Gbps | 26% | 28 Gbps | 40% | 60% | >60% utilization | Well-sized |
| Edge Ports | 5400 | 6912 | 78% | 6500 | 94% | 6% | Add edge stacks at Year 1 | Monitor growth closely |

## Key Design Decisions

| Decision | Options Considered | Selected Option | Rationale | Trade-offs | Approval Date | Approver |
|---|---|---|---|---|---|---|
| Centralized vs Distributed DNAC | Centralized (NJ) vs Regional (3 sites) | Centralized | Cost savings ($X,XXX over 5 years) + adequate for stable ops | 200ms latency to APAC tolerable | 2026-01-15 | CTO |
| Collapse Border+CP? | Separate vs Collapsed | Keep Separate | Security + scalability + standard design | Cost $X,XXX more per site | 2026-01-18 | Network Architect |
| Intermediate Nodes Needed? | Yes vs No | YES (Mumbai/Chennai) | 48 edges > CP port capacity | Add $X,XXX cost | 2026-01-20 | Network Architect |
| Firewall Platform | FTD vs ASA vs Palo Alto | Cisco FTD | SD-Access SGT integration + Cisco ecosystem | Vendor lock-in | 2026-01-22 | Security Architect |
| WLC Placement | Centralized vs Embedded | Centralized (hubs) + EWC (branches) | Performance + features vs cost optimization | Hubs get full features | 2026-01-25 | Wireless Architect |
| ISE PSN Load Balancer? | F5 vs HAProxy vs ISE Node Groups | F5 BIG-IP VE | Enterprise support + proven | Cost $X,XXX | 2026-01-28 | Security Architect |
| QoS Strategy | Trust DSCP vs Re-mark All | Trust DSCP from endpoints | Simpler + faster | Requires endpoint compliance | 2026-01-30 | Network Architect |
