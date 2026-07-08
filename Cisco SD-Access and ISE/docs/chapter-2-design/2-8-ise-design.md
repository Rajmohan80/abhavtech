# 2.8 ISE Design

### 2.8.1 ISE Distributed Deployment

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ISE DISTRIBUTED DEPLOYMENT                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     PRIMARY ADMIN NODE (PAN)                          │  │
│  │                                                                       │  │
│  │  Location: New Jersey                                                 │  │
│  │  Appliance: SNS-3695-K9                                               │  │
│  │  Roles: Primary PAN, Primary MnT, pxGrid Publisher                    │  │
│  │  IP: 10.252.10.10                                                     │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                               │                                             │
│                               │ Sync                                        │
│                               ▼                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                   SECONDARY ADMIN NODE (PAN)                          │  │
│  │                                                                       │  │
│  │  Location: London                                                     │  │
│  │  Appliance: SNS-3695-K9                                               │  │
│  │  Roles: Secondary PAN, Secondary MnT, pxGrid Subscriber               │  │
│  │  IP: 10.252.20.10                                                     │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    POLICY SERVICE NODES (PSN)                         │  │
│  │                                                                       │  │
│  │  ┌─────────────────────┐  ┌─────────────────────┐                     │  │
│  │  │ APAC PSN Pair       │  │ APAC PSN Pair       │                     │  │
│  │  │ Location: Mumbai    │  │ Location: Chennai   │                     │  │
│  │  │ Model: SNS-3655-K9  │  │ Model: SNS-3655-K9  │                     │  │
│  │  │ IP: 10.252.11.10-11 │  │ IP: 10.252.12.10-11 │                     │  │
│  │  └─────────────────────┘  └─────────────────────┘                     │  │
│  │                                                                       │  │
│  │  ┌─────────────────────┐  ┌─────────────────────┐                     │  │
│  │  │ EMEA PSN Pair       │  │ EMEA PSN Pair       │                     │  │
│  │  │ Location: London    │  │ Location: Frankfurt │                     │  │
│  │  │ Model: SNS-3655-K9  │  │ Model: SNS-3655-K9  │                     │  │
│  │  │ IP: 10.252.21.10-11 │  │ IP: 10.252.22.10-11 │                     │  │
│  │  └─────────────────────┘  └─────────────────────┘                     │  │
│  │                                                                       │  │
│  │  ┌─────────────────────┐  ┌─────────────────────┐                     │  │
│  │  │ Americas PSN Pair   │  │ Americas PSN Pair   │                     │  │
│  │  │ Location: NJ        │  │ Location: Dallas    │                     │  │
│  │  │ Model: SNS-3655-K9  │  │ Model: SNS-3655-K9  │                     │  │
│  │  │ IP: 10.252.31.10-11 │  │ IP: 10.252.32.10-11 │                     │  │
│  │  └─────────────────────┘  └─────────────────────┘                     │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  NODE GROUPS:                                                               │
│  ────────────                                                               │
│  • APAC-PSN-GROUP: Mumbai PSN, Chennai PSN                                  │
│  • EMEA-PSN-GROUP: London PSN, Frankfurt PSN                                │
│  • AMER-PSN-GROUP: NJ PSN, Dallas PSN                                       │
│                                                                             │
│  LOAD BALANCING:                                                            │
│  ───────────────                                                            │
│  • NAD configuration points to PSN Node Group                               │
│  • RADIUS load balancing via node group                                     │
│  • Failover: Automatic within node group                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.8.2 ISE Integration with DNAC

| Integration Point | Protocol | Purpose |
|-------------------|----------|---------|
| **pxGrid** | TLS 1.2 | Real-time context sharing |
| **REST API** | HTTPS | Policy push, status updates |
| **ERS API** | HTTPS | Endpoint management |
| **SGT Mapping** | pxGrid | Dynamic SGT-IP binding |

---
