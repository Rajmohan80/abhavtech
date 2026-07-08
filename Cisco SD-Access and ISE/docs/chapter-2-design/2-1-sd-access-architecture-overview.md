# 2.1 SD-Access Architecture Overview

### 2.1.1 Cisco SD-Access Building Blocks

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     SD-ACCESS ARCHITECTURE LAYERS                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ╔═══════════════════════════════════════════════════════════════════════╗  │
│  ║                        MANAGEMENT PLANE                               ║  │
│  ║  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        ║  │
│  ║  │   DNA Center    │  │      ISE        │  │   Stealthwatch  │        ║  │
│  ║  │                 │  │                 │  │                 │        ║  │
│  ║  │ • Automation    │  │ • Identity      │  │ • Analytics     │        ║  │
│  ║  │ • Assurance     │  │ • Policy        │  │ • Threat        │        ║  │
│  ║  │ • Provisioning  │  │ • Profiling     │  │ • Visibility    │        ║  │
│  ║  │ • Policies      │  │ • SGT           │  │                 │        ║  │
│  ║  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘        ║  │
│  ╚═══════════╪════════════════════╪════════════════════╪═════════════════╝  │
│              │                    │                    │                    │
│              │              pxGrid Integration         │                    │
│              │                    │                    │                    │
│  ╔═══════════╧════════════════════╧════════════════════╧═════════════════╗  │
│  ║                         CONTROL PLANE                                 ║  │
│  ║                                                                       ║  │
│  ║     LISP (Locator/ID Separation Protocol)                             ║  │
│  ║     ┌──────────────────────────────────────────────────────────┐      ║  │
│  ║     │  • Map-Server / Map-Resolver (MS/MR)                     │      ║  │
│  ║     │  • EID-to-RLOC Mapping Database                          │      ║  │
│  ║     │  • Host Mobility Tracking                                │      ║  │
│  ║     │  • xTR Registration                                      │      ║  │
│  ║     └──────────────────────────────────────────────────────────┘      ║  │
│  ╚═══════════════════════════════════════════════════════════════════════╝  │
│                                                                             │
│  ╔═══════════════════════════════════════════════════════════════════════╗  │
│  ║                          DATA PLANE                                   ║  │
│  ║                                                                       ║  │
│  ║     VXLAN (Virtual Extensible LAN)                                    ║  │
│  ║     ┌──────────────────────────────────────────────────────────┐      ║  │
│  ║     │  • Overlay Tunnels (VNI per Virtual Network)             │      ║  │
│  ║     │  • SGT Inline Tagging (CMD Header)                       │      ║  │
│  ║     │  • Anycast Gateway (Distributed Default Gateway)         │      ║  │
│  ║     │  • 50-byte Overhead (Encapsulation)                      │      ║  │
│  ║     └──────────────────────────────────────────────────────────┘      ║  │
│  ╚═══════════════════════════════════════════════════════════════════════╝  │
│                                                                             │
│  ╔═══════════════════════════════════════════════════════════════════════╗  │
│  ║                        PHYSICAL PLANE (UNDERLAY)                      ║  │
│  ║                                                                       ║  │
│  ║     IS-IS Underlay Routing                                            ║  │
│  ║     ┌──────────────────────────────────────────────────────────┐      ║  │
│  ║     │  • Loopback Reachability (RLOC addresses)                │      ║  │
│  ║     │  • L3 Routed Access (no STP)                             │      ║  │
│  ║     │  • Point-to-Point Links                                  │      ║  │
│  ║     │  • Fast Convergence (< 1 second)                         │      ║  │
│  ║     └──────────────────────────────────────────────────────────┘      ║  │
│  ╚═══════════════════════════════════════════════════════════════════════╝  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.1.2 Fabric Node Roles

| Node Role | Function | Redundancy | Hardware Platform |
|-----------|----------|------------|-------------------|
| **Fabric Edge** | Host onboarding, SGT assignment, VXLAN encap/decap | Per switch (StackWise) | Catalyst 9300/9400 |
| **Control Plane** | LISP MS/MR, EID-RLOC mapping, mobility | 2 per fabric site | Catalyst 9500 |
| **Border Node** | Inter-fabric, WAN, DC connectivity | 2 per hub site | Catalyst 9500 High |
| **Intermediate** | L3 underlay routing only | Per design | Catalyst 9500 |
| **Extended Node** | Extended fabric to IDF | Per requirement | Catalyst IE3x00 |
| **Wireless Controller** | AP management, fabric integration | HA pair | Catalyst 9800-40 |

---
