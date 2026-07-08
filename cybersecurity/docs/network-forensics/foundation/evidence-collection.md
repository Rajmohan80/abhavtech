# Evidence Collection

## Evidence Collection Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ABHAVTECH FORENSICS ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  EVIDENCE SOURCES (Layer 1)                                            │
│  ───────────────────────────────────────                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Network │  │ Security │  │   App    │  │   User   │              │
│  │Telemetry │  │  Events  │  │  Traces  │  │ Activity │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
│       │             │             │             │                      │
│       └─────────────┴─────────────┴─────────────┘                      │
│                     │                                                  │
│  COLLECTION LAYER (Layer 2)                                           │
│  ───────────────────────────────                                       │
│       ┌─────────────┴─────────────┐                                   │
│       │                           │                                   │
│  ┌────▼─────┐  ┌──────────┐  ┌───▼──────┐                           │
│  │  Packet  │  │  Splunk  │  │   API    │                           │
│  │ Capture  │  │Universal │  │Collectors│                           │
│  │  (SPAN)  │  │Forwarder │  │ (Python) │                           │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                           │
│       │             │             │                                   │
│  PROCESSING LAYER (Layer 3)                                           │
│  ───────────────────────────────                                       │
│       └─────────────┬─────────────┘                                   │
│                     │                                                  │
│       ┌─────────────▼─────────────┐                                   │
│       │   FORENSICS WORKSTATION   │                                   │
│       │  ─────────────────────────│                                   │
│       │  • Wireshark              │                                   │
│       │  • Splunk Search Head     │                                   │
│       │  • Python Analysis Tools  │                                   │
│       │  • AMP Orbital (Endpoint) │                                   │
│       │  • PCAP Reassembly        │                                   │
│       └─────────────┬─────────────┘                                   │
│                     │                                                  │
│  HASH & BLOCKCHAIN (Layer 4)                                          │
│  ───────────────────────────────────                                   │
│                     │                                                  │
│       ┌─────────────▼─────────────┐                                   │
│       │  SHA-256 HASH GENERATION  │                                   │
│       │  ─────────────────────────│                                   │
│       │  • Evidence files hashed  │                                   │
│       │  • Timestamps recorded    │                                   │
│       │  • Chain of custody init  │                                   │
│       └─────────────┬─────────────┘                                   │
│                     │                                                  │
│                     ▼                                                  │
│       ┌─────────────────────────────────┐                             │
│       │  BLOCKCHAIN EVIDENCE LEDGER     │                             │
│       │  ───────────────────────────────│                             │
│       │  • Immutable evidence registry  │                             │
│       │  • Hash anchoring              │                             │
│       │  • Timestamp authority         │                             │
│       │  • Custodian tracking          │                             │
│       │  • Access audit trail          │                             │
│       └─────────────┬─────────────────┘                               │
│                     │                                                  │
│  STORAGE & LEGAL (Layer 5)                                            │
│  ─────────────────────────────────                                     │
│                     │                                                  │
│       ┌─────────────┴─────────────┐                                   │
│       │                           │                                   │
│  ┌────▼─────────┐  ┌──────────────▼───┐                              │
│  │   Evidence   │  │  Legal Hold      │                              │
│  │   Vault      │  │  Repository      │                              │
│  │ (Encrypted)  │  │ (Write-Once)     │                              │
│  └──────────────┘  └──────────────────┘                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```
