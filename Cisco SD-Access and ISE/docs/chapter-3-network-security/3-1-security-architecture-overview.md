# 3.1 Security Architecture Overview

### 3.1.1 Zero Trust Security Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ZERO TRUST SECURITY ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ╔═══════════════════════════════════════════════════════════════════════╗  │
│  ║                    IDENTITY-BASED ACCESS                              ║  │
│  ║                                                                       ║  │
│  ║  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   ║  │
│  ║  │   WHO?      │  │   WHAT?     │  │   WHERE?    │  │   WHEN?     │   ║  │
│  ║  │             │  │             │  │             │  │             │   ║  │
│  ║  │ User ID     │  │ Device Type │  │ Location    │  │ Time of Day │   ║  │
│  ║  │ AD Group    │  │ Posture     │  │ Network     │  │ Duration    │   ║  │
│  ║  │ Role        │  │ Compliance  │  │ Zone        │  │ Session     │   ║  │
│  ║  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘   ║  │
│  ║         │                │                │                │          ║  │
│  ║         └────────────────┴────────────────┴────────────────┘          ║  │
│  ║                                  │                                    ║  │
│  ║                                  ▼                                    ║  │
│  ║  ┌───────────────────────────────────────────────────────────────┐    ║  │
│  ║  │                     CISCO ISE                                 │    ║  │
│  ║  │                                                               │    ║  │
│  ║  │   Policy Decision Point (PDP)                                 │    ║  │
│  ║  │   • Authentication                                            │    ║  │
│  ║  │   • Authorization                                             │    ║  │
│  ║  │   • Posture Assessment                                        │    ║  │
│  ║  │   • Profiling                                                 │    ║  │
│  ║  │   • SGT Assignment                                            │    ║  │
│  ║  │                                                               │    ║  │
│  ║  └───────────────────────────────────────────────────────────────┘    ║  │
│  ║                                  │                                    ║  │
│  ║                                  ▼                                    ║  │
│  ║  ┌───────────────────────────────────────────────────────────────┐    ║  │
│  ║  │                  ACCESS DECISION                              │    ║  │
│  ║  │                                                               │    ║  │
│  ║  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │    ║  │
│  ║  │   │   PERMIT    │  │   DENY      │  │  QUARANTINE │           │    ║  │
│  ║  │   │   + SGT     │  │             │  │   + Remediate│           │    ║  │
│  ║  │   └─────────────┘  └─────────────┘  └─────────────┘           │    ║  │
│  ║  │                                                               │    ║  │
│  ║  └───────────────────────────────────────────────────────────────┘    ║  │
│  ╚═══════════════════════════════════════════════════════════════════════╝  │
│                                                                             │
│  ENFORCEMENT POINTS:                                                        │
│  ────────────────────                                                       │
│  • Fabric Edge Nodes (SGT inline tagging)                                   │
│  • Border Nodes (SGT-to-SGACL enforcement)                                  │
│  • Firewalls (SGT-aware policies)                                           │
│  • Wireless Controllers (SGT assignment)                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.1.2 Defense-in-Depth Layers

| Layer | Component | Security Function |
|-------|-----------|-------------------|
| **Layer 1** | Endpoint | AMP, DUO MFA, Posture Agent |
| **Layer 2** | Access Network | 802.1X, MAB, Profiling |
| **Layer 3** | Fabric | SGT, VXLAN encryption, micro-segmentation |
| **Layer 4** | Transit | IPsec, MACsec, encrypted WAN |
| **Layer 5** | Perimeter | Firewall, IPS, Web Proxy |
| **Layer 6** | Data Center | Segmentation, workload protection |
| **Layer 7** | Application | WAF, API security |
| **Layer 8** | Visibility | SIEM, Stealthwatch, threat detection |

---
