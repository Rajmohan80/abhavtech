# 2.7 DNA Center Design

### 2.7.1 DNAC Cluster Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DNA CENTER CLUSTER DESIGN                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PRIMARY CLUSTER (New Jersey Data Center):                                  │
│  ──────────────────────────────────────────                                 │
│                                                                             │
│      ┌──────────────────────────────────────────────────────────┐           │
│      │              DNAC 3-NODE HA CLUSTER                      │           │
│      │                                                          │           │
│      │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │           │
│      │  │   NODE 1     │ │   NODE 2     │ │   NODE 3     │      │           │
│      │  │  DN2-HW-APL  │ │  DN2-HW-APL  │ │  DN2-HW-APL  │      │           │
│      │  │     -XL      │ │     -XL      │ │     -XL      │      │           │
│      │  │              │ │              │ │              │      │           │
│      │  │ IP: .11      │ │ IP: .12      │ │ IP: .13      │      │           │
│      │  └──────────────┘ └──────────────┘ └──────────────┘      │           │
│      │           │              │              │                │           │
│      │           └──────────────┼──────────────┘                │           │
│      │                          │                               │           │
│      │              Cluster VIP: 10.252.1.10                    │           │
│      │              FQDN: dnac.company.local                    │           │
│      │                                                          │           │
│      └──────────────────────────────────────────────────────────┘           │
│                                                                             │
│  DISASTER RECOVERY (London Data Center):                                    │
│  ─────────────────────────────────────────                                  │
│                                                                             │
│      ┌──────────────────────────────────────────────────────────┐           │
│      │              DNAC DR CLUSTER (Standby)                   │           │
│      │                                                          │           │
│      │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │           │
│      │  │   NODE 1     │ │   NODE 2     │ │   NODE 3     │      │           │
│      │  │  DN2-HW-APL  │ │  DN2-HW-APL  │ │  DN2-HW-APL  │      │           │
│      │  │     -XL      │ │     -XL      │ │     -XL      │      │           │
│      │  │              │ │              │ │              │      │           │
│      │  │ IP: .21      │ │ IP: .22      │ │ IP: .23      │      │           │
│      │  └──────────────┘ └──────────────┘ └──────────────┘      │           │
│      │                                                          │           │
│      │              Cluster VIP: 10.252.2.10                    │           │
│      │              FQDN: dnac-dr.company.local                 │           │
│      │                                                          │           │
│      └──────────────────────────────────────────────────────────┘           │
│                                                                             │
│  REPLICATION:                                                               │
│  ────────────                                                               │
│  • Active/Passive configuration                                             │
│  • Configuration backup: Daily to DR                                        │
│  • RTO: 4 hours | RPO: 24 hours                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Global Management Topology**

At a glance, a single centralised DNA Center cluster in New Jersey manages the entire global fabric, with a standby DR cluster in London. All regions — including India — are managed centrally; regional resilience for identity services is provided by ISE PSNs in Mumbai and Chennai. (Click the diagram to open full size.)

```mermaid
flowchart TB
    subgraph PRIMARY["New Jersey Data Center - Primary"]
        DNAC["DNA Center<br/>3-node HA cluster<br/>VIP 10.252.1.10"]
    end

    subgraph DR["London Data Center - Disaster Recovery"]
        DNACDR["DNA Center DR<br/>3-node standby cluster<br/>VIP 10.252.2.10"]
    end

    DNAC -.daily config backup<br/>RTO 4h - RPO 24h.-> DNACDR

    subgraph REGIONS["Managed Fabric Regions"]
        direction LR
        IN["India<br/>Mumbai - Chennai<br/>+ regional sites"]
        EMEA["EMEA<br/>London - Frankfurt"]
        AMER["Americas<br/>New Jersey - Dallas"]
    end

    subgraph ISE["Regional ISE PSNs"]
        direction LR
        PSN1["Mumbai PSN"]
        PSN2["Chennai PSN"]
    end

    DNAC --> REGIONS
    IN -.identity services.-> ISE

    classDef existing fill:#eef2f7,stroke:#7a8ba0,color:#1a2b3c;
    classDef newc fill:#d7ebf8,stroke:#1B6CA0,color:#0d3c5c,font-weight:bold;
    class DNACDR,IN,EMEA,AMER,PSN1,PSN2 existing;
    class DNAC newc;
```

### 2.7.2 DNAC Appliance Specifications

| Specification | DN2-HW-APL-XL (Selected) |
|---------------|--------------------------|
| **Network Devices** | Up to 8,000 |
| **Endpoints** | Up to 200,000 |
| **Access Points** | Up to 16,000 |
| **Cores** | 56 cores |
| **Memory** | 512 GB RAM |
| **Storage** | 12 TB SSD (RAID) |
| **Network Interfaces** | 4 × 10 GbE, 2 × 1 GbE |
| **High Availability** | 3-node cluster |

### 2.7.3 DNAC Network Requirements

| Interface | Purpose | VLAN | IP Range |
|-----------|---------|------|----------|
| **Enterprise** | Device management, southbound | 100 | 10.252.1.0/24 |
| **Management** | GUI access, northbound | 101 | 10.252.2.0/24 |
| **Cluster** | Inter-node communication | 102 | 10.252.3.0/24 |
| **Services** | ISE, AAA, NTP, DNS | 100 | Same as Enterprise |

---
