# SGT Policy Matrix

<span class="ai-badge">AI-Assisted Documentation</span>

---

| Source SGT | Source Name | Destination SGT | Destination Name | Policy Action | Protocol | Ports | Logging | Priority | Use Case | Enforcement Point | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 5 | Network-Admin | ANY | ANY | PERMIT | ANY | ANY | YES | Critical | Admin full access | Edge + Border | Admins can access everything |
| 10 | Employee-Full | 70 | Servers | PERMIT | TCP | 80,443,445,3389,22 | YES | Normal | Business apps access | Border | Corporate users to internal servers |
| 10 | Employee-Full | 60 | Printers | PERMIT | TCP | 9100,631 | NO | Normal | Print services | Edge | Direct printing |
| 10 | Employee-Full | 20 | Voice | DENY | ANY | ANY | YES | Normal | Prevent voice tampering | Edge | Users cannot access voice infra |
| 10 | Employee-Full | 100 | Internet | PERMIT | TCP | 80,443 | NO | Normal | Web browsing | Border + FW | Via firewall inspection |
| 10 | Employee-Full | 10 | Employee-Full | PERMIT | ANY | ANY | NO | Normal | Peer-to-peer | Edge | File sharing between employees |
| 10 | Employee-Full | 40 | Guest | DENY | ANY | ANY | YES | Normal | Isolation | Border | Employees cannot access guest network |
| 20 | Voice | 20 | Voice | PERMIT | UDP | 5060-5061,16384-32767 | NO | Critical | VoIP signaling + RTP | Edge | Phone to phone / call manager |
| 20 | Voice | 70 | Servers | PERMIT | TCP | 5060,8443 | YES | Normal | Phone registration | Border | Phones to call manager |
| 20 | Voice | 100 | Internet | DENY | ANY | ANY | YES | Critical | Security | Border | Phones should not reach Internet |
| 20 | Voice | 10 | Employee-Full | PERMIT | UDP | 16384-32767 | NO | Normal | Voice to PC (softphone) | Edge | Allow IP phones to talk to PCs |
| 30 | IoT-Camera | 30 | IoT-Camera | PERMIT | ANY | ANY | NO | Normal | Camera-to-NVR | Edge | Surveillance system internal |
| 30 | IoT-Camera | 70 | Servers | DENY | ANY | ANY | YES | High | Prevent lateral movement | Border | Cameras isolated from servers |
| 30 | IoT-Camera | 100 | Internet | PERMIT | TCP | 443 | YES | Normal | Cloud upload (restricted) | Border + FW | Only HTTPS to specific cloud NVR |
| 30 | IoT-Camera | 10 | Employee-Full | DENY | ANY | ANY | YES | Normal | Isolation | Border | Cameras cannot initiate to users |
| 40 | Guest | 100 | Internet | PERMIT | TCP | 80,443 | YES | Normal | Guest web access | Border + FW | Captive portal + URL filtering |
| 40 | Guest | 10 | Employee-Full | DENY | ANY | ANY | YES | High | Isolation | Border | Guests isolated from corporate |
| 40 | Guest | 70 | Servers | DENY | ANY | ANY | YES | Critical | Security | Border | No server access for guests |
| 40 | Guest | 60 | Printers | PERMIT | TCP | 9100,631 | YES | Normal | Guest printing | Border | Limited print access |
| 40 | Guest | 40 | Guest | PERMIT | ANY | ANY | NO | Normal | Guest-to-guest | Edge | Allow collaboration |
| 50 | IoT-Sensor | 70 | Servers | DENY | ANY | ANY | YES | Critical | Security isolation | Border | Compromised IoT cannot reach servers |
| 50 | IoT-Sensor | 50 | IoT-Sensor | PERMIT | ANY | ANY | NO | Normal | Sensor-to-gateway | Edge | IoT mesh network |
| 50 | IoT-Sensor | 100 | Internet | PERMIT | TCP | 443 | YES | Normal | Cloud telemetry | Border + FW | HTTPS only to approved clouds |
| 50 | IoT-Sensor | 10 | Employee-Full | DENY | ANY | ANY | YES | High | Isolation | Border | IoT cannot initiate to users |
| 60 | Printers | 10 | Employee-Full | PERMIT | TCP | 9100 | NO | Normal | Print response | Edge | Allow printer to respond to users |
| 60 | Printers | 70 | Servers | PERMIT | TCP | 443 | YES | Normal | Print server connection | Border | Managed printing |
| 60 | Printers | 100 | Internet | DENY | ANY | ANY | YES | High | Security | Border | Printers should not reach Internet |
| 60 | Printers | 60 | Printers | PERMIT | TCP | 9100 | NO | Normal | Printer-to-printer | Edge | Print queue redistribution |
| 70 | Servers | 10 | Employee-Full | PERMIT | TCP | 80,443,445 | NO | Normal | Server response to users | Border | Stateful return traffic |
| 70 | Servers | 70 | Servers | PERMIT | ANY | ANY | YES | Normal | Server-to-server | Edge | DB replication / app tier |
| 70 | Servers | 100 | Internet | PERMIT | TCP | 80,443 | YES | Normal | OS updates / cloud sync | Border + FW | Via proxy for security |
| 70 | Servers | 30 | IoT-Camera | DENY | ANY | ANY | YES | High | Prevent compromise | Border | Servers should not initiate to IoT |
| 80 | Contractor | 10 | Employee-Full | DENY | ANY | ANY | YES | Normal | Isolation | Border | Contractors separated from employees |
| 80 | Contractor | 70 | Servers | PERMIT | TCP | 80,443 | YES | Normal | Limited app access | Border | Only specific web apps |
| 80 | Contractor | 100 | Internet | PERMIT | TCP | 80,443 | YES | Normal | Contractor web access | Border + FW | Via firewall |
| 80 | Contractor | 60 | Printers | PERMIT | TCP | 9100 | NO | Normal | Print services | Edge | Basic printing |
| 90 | Quarantine | ANY | ANY | DENY | ANY | ANY | YES | Critical | Security | Border | Isolated for remediation |
| 99 | Network-Device | 99 | Network-Device | PERMIT | ANY | ANY | NO | Critical | Infrastructure | N/A | Switch-to-switch / DNAC |
| 100 | Internet | 10 | Employee-Full | PERMIT | TCP | 80,443 | NO | Normal | Return traffic | FW + Border | Stateful firewall allows return |
| 100 | Internet | 70 | Servers | PERMIT | TCP | 80,443 | YES | Normal | Inbound to web servers | FW + Border | Published services (DMZ) |
| 100 | Internet | 40 | Guest | PERMIT | TCP | 80,443 | NO | Normal | Guest return traffic | FW + Border | Stateful return |
|  |  |  |  |  |  |  |  |  |  |  |  |
| POLICY SUMMARY |  |  |  |  |  |  |  |  |  |  |  |
| Total SGTs Defined | 15 |  |  |  |  |  |  |  |  |  | Network segmentation |
| Default Policy | Implicit DENY |  |  |  |  |  |  |  |  |  | Zero-trust model |
| Logging Enabled | High + Critical |  |  |  |  |  |  |  |  |  | SIEM integration |
| Enforcement Points | Edge (inline tagging) | Border (inter-VN) | Firewall (external) |  |  |  |  |  |  |  |  |
| SGT Propagation | Inline (CMD header) |  |  |  |  |  |  |  |  |  | Preserves SGT through VXLAN |
| Policy Database | ISE Policy Server |  |  |  |  |  |  |  |  |  | Centralized in ISE |
| Dynamic Updates | Via pxGrid |  |  |  |  |  |  |  |  |  | Real-time policy changes |

---

*This data table was converted from CSV format for better readability.*
