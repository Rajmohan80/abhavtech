# Traffic Flow Matrix

<span class="ai-badge">AI-Assisted Documentation</span>

---

| Flow ID | Source | Destination | Traffic Type | VN Source | VN Destination | Path | Bandwidth (Gbps) | Latency (ms) | Hops | Transit Nodes | Border Traversal | SGT Source | SGT Destination | Policy Action | Priority | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| F001 | Employee PC (Mumbai) | File Server (Mumbai) | Intra-VN | VN_CORPORATE | VN_CORPORATE | Edge-3 → Intm-1 → CP-1 → Edge-20 | 2.5 | 0.5 | 3 | Intermediate-1 → CP-1 | NO | 10 (Employee) | 70 (Servers) | PERMIT | Normal | Optimized VXLAN path |
| F002 | Guest Laptop (Mumbai) | Internet (Google) | Inter-VN + WAN | VN_GUEST | Internet | Edge-8 → Intm-2 → CP-2 → Border-1 → FW → ISP | 0.8 | 40 | 5 | Intm-2 → CP-2 → Border-1 → FW | YES | 40 (Guest) | 100 (Internet) | PERMIT | Low | NAT at Border + FW inspection |
| F003 | IoT Sensor (Mumbai) | DB Server (Mumbai) | Inter-VN | VN_IOT | VN_CORPORATE | Edge-12 → Intm-2 → Border-1 → DENY | 0 | 2 | 0 | Intm-2 → Border-1 | YES (denied) | 50 (IoT) | 70 (Servers) | DENY | N/A | Blocked by SGACL at Border |
| F004 | Employee PC (Mumbai) | SaaS App (Office365) | Intra-VN + WAN | VN_CORPORATE | Internet | Edge-5 → CP-1 → Border-1 → FW → DIA | 3.2 | 25 | 4 | CP-1 → Border-1 → FW | YES | 10 (Employee) | 100 (Internet) | PERMIT | High | QoS for O365 traffic |
| F005 | VoIP Phone (Mumbai) | Call Manager (Mumbai) | Intra-VN | VN_VOICE | VN_VOICE | Edge-2 → Intm-1 → Edge-10 | 0.1 | 0.3 | 2 | Intermediate-1 | NO | 20 (Voice) | 20 (Voice) | PERMIT | Critical | QoS EF marking |
| F006 | Employee PC (Chennai) | DB Server (Mumbai) | Inter-Site | VN_CORPORATE | VN_CORPORATE | CHN-Edge-5 → CHN-Border → WAN → MUM-Border → Edge-20 | 1.5 | 45 | 8 | Site-to-Site WAN | YES (both sites) | 10 (Employee) | 70 (Servers) | PERMIT | Normal | MPLS transit |
| F007 | Camera (Mumbai) | NVR (Mumbai) | Intra-VN | VN_IOT | VN_IOT | Edge-7 → Intm-1 → Edge-15 | 1.8 | 0.4 | 2 | Intermediate-1 | NO | 30 (Camera) | 30 (Camera) | PERMIT | Normal | High bandwidth for video |
| F008 | Wireless Client (Mumbai) | Printer (Mumbai) | Intra-VN | VN_CORPORATE | VN_CORPORATE | WLC-1 → CP-1 → Edge-18 | 0.05 | 1.2 | 2 | WLC-1 → CP-1 | NO | 10 (Employee) | 60 (Printers) | PERMIT | Normal | CAPWAP tunnel to WLC |
| F009 | Contractor Laptop (Mumbai) | Internal Wiki (Mumbai) | Inter-VN | VN_CONTRACTOR | VN_CORPORATE | Edge-9 → Border-1 → Edge-22 | 0.2 | 2.5 | 2 | Border-1 | YES | 50 (Contractor) | 70 (Servers) | PERMIT | Low | Limited access via SGACL |
| F010 | Branch User (Noida) | Email Server (Mumbai) | Inter-Site | VN_CORPORATE | VN_CORPORATE | NOIDA-FIAB → WAN → MUM-Border → Edge-21 | 0.3 | 35 | 6 | SD-WAN | YES | 10 (Employee) | 70 (Servers) | PERMIT | Normal | SD-WAN optimized path |
| F011 | Admin PC (Mumbai) | ISE Admin (Mumbai) | Management | MGMT_VLAN | MGMT_VLAN | Edge-1 → CP-1 (OOB) | 0.01 | 0.5 | 1 | CP-1 | NO | 5 (Admin) | 5 (Admin) | PERMIT | Critical | Out-of-band management |
| F012 | DNAC (New Jersey) | Switch (Mumbai) | Management | MGMT_VLAN | MGMT_VLAN | DNAC → WAN → MUM-Border → Edge-4 | 0.5 | 180 | 12 | Transatlantic WAN | YES | 5 (Admin) | 99 (Network) | PERMIT | Critical | High latency but acceptable |
| F013 | Backup Server (Mumbai) | Storage (Mumbai DC) | Intra-VN | VN_CORPORATE | VN_CORPORATE | Edge-25 → Edge-26 (DC) | 8.5 | 0.2 | 1 | Direct | NO | 70 (Servers) | 70 (Servers) | PERMIT | Bulk | Nightly backup window |
| F014 | User PC (Mumbai) | External Partner VPN | Inter-VN + WAN | VN_CORPORATE | Internet | Edge-3 → Border-1 → FW → VPN Concentrator | 0.4 | 50 | 4 | Border-1 → FW | YES | 10 (Employee) | 100 (Internet) | PERMIT | Normal | IPSec tunnel via FW |
| F015 | IoT Gateway (Mumbai) | Cloud MQTT Broker | Intra-VN + WAN | VN_IOT | Internet | Edge-14 → Border-2 → FW → DIA | 0.6 | 30 | 4 | Border-2 → FW | YES | 30 (IoT-Cloud) | 100 (Internet) | PERMIT | Normal | Allow IoT cloud only |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| TRAFFIC AGGREGATION BY SITE |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Mumbai Total Internal | Edge-to-Edge Same VN |  |  |  |  | 10.0 | 0.5 |  | Average 2 hops | NO |  |  |  |  | Bypasses Border |  |
| Mumbai Total Inter-VN | Cross-VN within site |  |  |  |  | 3.0 | 2.0 |  | Average 2 hops | YES |  |  |  |  | Via Border for routing |  |
| Mumbai Total to DC | Internal DC access |  |  |  |  | 15.0 | 1.5 |  | Average 3 hops | YES |  |  |  |  | Via Border + DC Core |  |
| Mumbai Total to WAN | Internet + MPLS |  |  |  |  | 10.0 | 35 |  | Average 5 hops | YES |  |  |  |  | Via Border + Firewall |  |
| Mumbai Total Control Plane | LISP + BFD + ISIS |  |  |  |  | 2.0 | 0.3 |  | Continuous | NO |  |  |  |  | Low bandwidth critical |  |
| Mumbai TOTAL | All traffic types |  |  |  |  | 40.0 | N/A |  |  |  |  |  |  | Peak hour aggregate |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Chennai Total Internal | Edge-to-Edge Same VN |  |  |  |  | 5.0 | 0.5 |  | Average 2 hops | NO |  |  |  |  | Optimized path |  |
| Chennai Total Inter-VN | Cross-VN within site |  |  |  |  | 1.5 | 2.0 |  | Average 2 hops | YES |  |  |  |  | Via Border |  |
| Chennai Total to DC | Chennai DC + Mumbai DC |  |  |  |  | 8.0 | 25 |  |  | YES |  |  |  |  | Some via WAN to Mumbai |  |
| Chennai Total to WAN | Internet + MPLS |  |  |  |  | 5.0 | 30 |  | Average 5 hops | YES |  |  |  |  | Via Border + FW |  |
| Chennai TOTAL | All traffic types |  |  |  |  | 20.0 | N/A |  |  |  |  |  |  | Peak hour aggregate |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Noida Total Internal | Local edge-to-edge |  |  |  |  | 0.5 | 1.0 |  | FIAB internal | NO |  |  |  |  | FIAB optimized |  |
| Noida Total to WAN | Internet + MPLS to HQ |  |  |  |  | 2.0 | 35 |  | Via SD-WAN | YES |  |  |  |  | Branch WAN link |  |
| Noida TOTAL | All traffic types |  |  |  |  | 3.0 | N/A |  |  |  |  |  |  | Small branch load |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| INTER-SITE FLOWS |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Mumbai ↔ Chennai | MPLS Primary |  |  |  |  | 5.0 | 12 |  | Dedicated 10G | N/A |  |  |  |  | Active-active sites |  |
| Mumbai ↔ Noida | SD-WAN Primary |  |  |  |  | 1.5 | 25 |  | SD-WAN overlay | N/A |  |  |  |  | Branch to HQ |  |
| Chennai ↔ Noida | Via Mumbai (Hub) |  |  |  |  | 0.3 | 40 |  | Transit via Mumbai | N/A |  |  |  |  | Hub-spoke topology |  |
| Mumbai ↔ New Jersey | Transatlantic MPLS |  |  |  |  | 2.0 | 180 |  | DNAC management | N/A |  |  |  |  | High latency tolerable |  |

---

*This data table was converted from CSV format for better readability.*
