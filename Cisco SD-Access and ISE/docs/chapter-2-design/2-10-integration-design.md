# 2.10 Integration Design

### 2.10.1 SD-WAN Integration (High-Level)

> **Note**: Detailed SD-WAN design is covered in a separate project. This section covers integration points only.

| Integration Point | Description | Configuration |
|-------------------|-------------|---------------|
| **Transit** | SD-Access to SD-WAN handoff | Border Node L3 handoff |
| **Policy** | SGT propagation to SD-WAN | VRF-aware SGT |
| **Control** | vManage-DNAC integration | API-based |
| **Data Plane** | VXLAN-to-IPsec handoff | Border encapsulation |

**SD-WAN Transit Architecture (Conceptual):**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SD-ACCESS TO SD-WAN TRANSIT                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SD-ACCESS FABRIC                        SD-WAN OVERLAY                     │
│  ┌───────────────┐                       ┌───────────────┐                  │
│  │               │                       │               │                  │
│  │  VXLAN/LISP   │    L3 Handoff         │   IPsec/DTLS  │                  │
│  │   Overlay     │ ──────────────────►   │    Overlay    │                  │
│  │               │   (VRF Routing)       │               │                  │
│  │               │                       │               │                  │
│  │  ┌─────────┐  │                       │  ┌─────────┐  │                  │
│  │  │ Border  │  │    10.100.0.0/16      │  │ vEdge   │  │                  │
│  │  │  Node   │◄─┼──────────────────────►│  │ Router  │  │                  │
│  │  └─────────┘  │   (Corporate VN)      │  └─────────┘  │                  │
│  │               │                       │               │                  │
│  │  ┌─────────┐  │    10.200.0.0/16      │  ┌─────────┐  │                  │
│  │  │ Border  │  │   (Guest VN)          │  │ vEdge   │  │                  │
│  │  │  Node   │◄─┼──────────────────────►│  │ Router  │  │                  │
│  │  └─────────┘  │                       │  └─────────┘  │                  │
│  │               │                       │               │                  │
│  └───────────────┘                       └───────────────┘                  │
│                                                                             │
│  SGT PROPAGATION:                                                           │
│  • SGT inline tagging within SD-Access                                      │
│  • SGT-to-VRF mapping at border                                             │
│  • VPN label carries context in SD-WAN                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---
