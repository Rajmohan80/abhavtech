# 2.2 Global Fabric Design

### 2.2.1 Multi-Site Fabric Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    GLOBAL MULTI-SITE SD-ACCESS DESIGN                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                         ┌─────────────────────┐                             │
│                         │    DNA CENTER       │                             │
│                         │    HA CLUSTER       │                             │
│                         │  (New Jersey + DR)  │                             │
│                         └──────────┬──────────┘                             │
│                                    │                                        │
│               ┌────────────────────┼────────────────────┐                   │
│               │                    │                    │                   │
│               ▼                    ▼                    ▼                   │
│  ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐       │
│  │   FABRIC SITE:     │ │   FABRIC SITE:     │ │   FABRIC SITE:     │       │
│  │   APAC-MUMBAI      │ │   EMEA-LONDON      │ │   AMER-NEWJERSEY   │       │
│  │                    │ │                    │ │                    │       │
│  │  ┌──────────────┐  │ │  ┌──────────────┐  │ │  ┌──────────────┐  │       │
│  │  │ Control Plane│  │ │  │ Control Plane│  │ │  │ Control Plane│  │       │
│  │  │   Nodes (2)  │  │ │  │   Nodes (2)  │  │ │  │   Nodes (2)  │  │       │
│  │  └──────────────┘  │ │  └──────────────┘  │ │  └──────────────┘  │       │
│  │  ┌──────────────┐  │ │  ┌──────────────┐  │ │  ┌──────────────┐  │       │
│  │  │ Border Nodes │  │ │  │ Border Nodes │  │ │  │ Border Nodes │  │       │
│  │  │     (2)      │  │ │  │     (2)      │  │ │  │     (2)      │  │       │
│  │  └──────────────┘  │ │  └──────────────┘  │ │  └──────────────┘  │       │
│  │  ┌──────────────┐  │ │  ┌──────────────┐  │ │  ┌──────────────┐  │       │
│  │  │ Fabric Edge  │  │ │  │ Fabric Edge  │  │ │  │ Fabric Edge  │  │       │
│  │  │   Nodes      │  │ │  │   Nodes      │  │ │  │   Nodes      │  │       │
│  │  └──────────────┘  │ │  └──────────────┘  │ │  └──────────────┘  │       │
│  └─────────┬──────────┘ └─────────┬──────────┘ └─────────┬──────────┘       │
│            │                      │                      │                  │
│  ╔═════════╧══════════════════════╧══════════════════════╧═════════════════╗│
│  ║                     SD-ACCESS TRANSIT / SD-WAN                          ║│
│  ║            (Inter-Site Connectivity with SGT Propagation)               ║│
│  ╚═════════════════════════════════════════════════════════════════════════╝│
│            │                      │                      │                  │
│  ┌─────────┴──────────┐ ┌─────────┴──────────┐ ┌─────────┴──────────┐       │
│  │ FABRIC SITE:       │ │ FABRIC SITE:       │ │ FABRIC SITE:       │       │
│  │ APAC-CHENNAI       │ │ EMEA-FRANKFURT     │ │ AMER-DALLAS        │       │
│  └────────────────────┘ └────────────────────┘ └────────────────────┘       │
│            │                      │                      │                  │
│     ┌──────┴──────┐        ┌──────┴──────┐        ┌──────┴──────┐           │
│     ▼      ▼      ▼        ▼      ▼      ▼        ▼      ▼      ▼           │
│  [BLR]  [DEL]  [NOI]    [EMEA Branches]       [US Branches]                 │
│  Branch Branch Branch                                                       │
│  Sites  Sites  Sites                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2.2 Fabric Site Hierarchy

| Fabric Site | Parent | Type | Connected Branches |
|-------------|--------|------|-------------------|
| **APAC-Mumbai** | None (Primary) | Hub Fabric | Chennai, Bangalore, Delhi, Noida |
| **APAC-Chennai** | APAC-Mumbai | Hub Fabric | Local branches |
| **EMEA-London** | None (Primary) | Hub Fabric | Frankfurt, EU branches |
| **EMEA-Frankfurt** | EMEA-London | Hub Fabric | DACH branches |
| **AMER-NewJersey** | None (Primary) | Hub Fabric | Dallas, US branches |
| **AMER-Dallas** | AMER-NewJersey | Hub Fabric | Southwest US branches |

---
