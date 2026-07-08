# 3.10 Firewall Rules Summary

### 3.10.1 Perimeter Firewall Rules

| Rule # | Source | Destination | Port | Protocol | Action | Description |
|--------|--------|-------------|------|----------|--------|-------------|
| 1 | Any | DNAC Cluster VIP | 443 | TCP | Permit | DNAC GUI access |
| 2 | Any | ISE PSN | 443, 8443 | TCP | Permit | ISE portal access |
| 3 | DNAC | ISE | 9060, 443 | TCP | Permit | DNAC-ISE integration |
| 4 | ISE | AD Servers | 389, 636 | TCP | Permit | LDAP/LDAPS |
| 5 | Fabric Nodes | ISE PSN | 1812, 1813 | UDP | Permit | RADIUS |
| 6 | ISE | Fabric Nodes | Any | TCP/UDP | Permit | CoA, SXP |
| 7 | Employees | Internet | 443, 80 | TCP | Permit | Web access |
| 8 | Guests | Proxy | 8080 | TCP | Permit | Guest internet |
| 9 | Any | CDE VN | Any | Any | Deny | Block direct CDE access |
| 10 | Jump Server | CDE VN | 22, 3389 | TCP | Permit | Admin access only |

### 3.10.2 SD-WAN Transport Security Rules

**Internet Transport Security (Direct Internet Access)**

| Rule # | Source | Destination | Port | Protocol | Action | Description |
|--------|--------|-------------|------|----------|--------|-------------|
| 1 | SD-WAN Edge | vBond | 12346-12446 | UDP | Permit | DTLS control |
| 2 | SD-WAN Edge | vSmart | 12346-12446 | UDP | Permit | OMP control |
| 3 | SD-WAN Edge | vManage | 443, 8443 | TCP | Permit | Management |
| 4 | SD-WAN Edge | SD-WAN Edges | 12346-12446 | UDP | Permit | IPsec data |
| 5 | SD-WAN Edge | NTP Servers | 123 | UDP | Permit | Time sync |
| 6 | SD-WAN Edge | DNS Servers | 53 | UDP/TCP | Permit | Name resolution |
| 7 | Corp Users (DIA) | Internet | 443, 80 | TCP | Permit | Direct web (limited) |
| 8 | Guest Users | Internet | 443, 80 | TCP | Permit | Guest breakout |
| 9 | Any | SD-WAN Edge (WAN) | Any | Any | Deny | Block inbound |

**5G/LTE Transport Security**

| Rule # | Source | Destination | Port | Protocol | Action | Description |
|--------|--------|-------------|------|----------|--------|-------------|
| 1 | SD-WAN Edge | vBond | 12346-12446 | UDP | Permit | DTLS control |
| 2 | SD-WAN Edge | SD-WAN Edges | 12346-12446 | UDP | Permit | IPsec tunnels |
| 3 | Any | SD-WAN Edge (LTE) | Any | Any | Deny | Block all inbound |

**SD-WAN Control Plane Security**

| Component | Security Requirement | Implementation |
|-----------|---------------------|----------------|
| vBond | Certificate authentication | PKI with enterprise CA |
| vSmart | OMP encryption | AES-256 |
| vManage | Admin authentication | RADIUS/TACACS+ to ISE |
| Data Plane | IPsec tunnels | AES-256-GCM, IKEv2 |
| Service VPN | VRF isolation | Per-VPN routing tables |

### 3.10.3 SD-WAN Edge Firewall Zones

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SD-WAN EDGE ZONE-BASED SECURITY                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐                              ┌─────────────┐              │
│  │ VPN 0       │                              │ VPN 10      │              │
│  │ (Transport) │                              │ (Corporate) │              │
│  │ ┌─────────┐ │                              │ ┌─────────┐ │              │
│  │ │ MPLS    │ │◄──── IPsec Tunnels ────────►│ │ Users   │ │              │
│  │ │ Internet│ │      (Encrypted)             │ │ Servers │ │              │
│  │ │ 5G/LTE  │ │                              │ │         │ │              │
│  │ └─────────┘ │                              │ └─────────┘ │              │
│  └──────┬──────┘                              └──────┬──────┘              │
│         │                                            │                     │
│         │         Zone-Based Firewall                │                     │
│         │         (Inter-VPN Filtering)              │                     │
│         │                                            │                     │
│  ┌──────┴──────┐                              ┌──────┴──────┐              │
│  │ VPN 40      │                              │ VPN 50      │              │
│  │ (Guest)     │                              │ (IoT)       │              │
│  │             │                              │             │              │
│  │ DIA Allowed │                              │ No DIA      │              │
│  │ (Filtered)  │                              │ Cloud Only  │              │
│  └─────────────┘                              └─────────────┘              │
│                                                                             │
│  ZONE PAIR POLICIES:                                                        │
│  • VPN10 ↔ VPN10: Permit (same VPN)                                        │
│  • VPN10 → VPN0: Permit (to WAN tunnels)                                   │
│  • VPN40 → Internet: Permit with URL filtering                             │
│  • VPN50 → VPN0: Permit (cloud destinations only)                          │
│  • VPN40 → VPN10: Deny (guest isolation)                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.10.4 Branch Internet Breakout Security

For branches with Direct Internet Access (DIA):

| Security Control | Implementation | Location |
|------------------|----------------|----------|
| URL Filtering | Cisco Umbrella | Cloud |
| DNS Security | Umbrella DNS | Cloud |
| Malware Protection | Umbrella SIG | Cloud |
| IPS | UTD on SD-WAN Edge | Edge |
| SSL Inspection | Umbrella SIG | Cloud |
| DLP | Microsoft Defender | Endpoint |

**Umbrella Integration Configuration**

```yaml
# SD-WAN Edge Umbrella Integration (via vManage template)
Umbrella_Config:
  Registration_Token: <umbrella_token>
  Local_Domain_Bypass:
    - corp.local
    - internal.company.com
  DNS_Redirect: Enabled
  
# Traffic Steering for DIA
DIA_Policy:
  Match:
    - Guest VPN (40)
    - SaaS Applications (O365, Salesforce)
  Action: Local Internet Exit
  Security: Umbrella SIG
```

---
