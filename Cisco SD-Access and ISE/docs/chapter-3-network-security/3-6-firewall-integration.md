# 3.6 Firewall Integration

### 3.6.1 Firewall Architecture with SGT

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FIREWALL SGT INTEGRATION                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      SD-ACCESS FABRIC                                 │  │
│  │                                                                       │  │
│  │   ┌─────────────┐         ┌─────────────┐         ┌─────────────┐     │  │
│  │   │ Fabric Edge │ ──────► │ Border Node │ ──────► │   FTD/FMC   │     │  │
│  │   │             │  VXLAN  │  (SGT inline)│  SXP   │  (SGT-aware)│     │  │
│  │   │ SGT: 10     │         │             │         │             │     │  │
│  │   └─────────────┘         └─────────────┘         └─────────────┘     │  │
│  │                                                          │            │  │
│  └──────────────────────────────────────────────────────────┼────────────┘  │
│                                                             │               │
│                                                             │ SXP           │
│                                                             │               │
│  ┌──────────────────────────────────────────────────────────┼────────────┐  │
│  │                           ISE (pxGrid)                   │            │  │
│  │                                                          │            │  │
│  │   SGT-IP Mappings ◄─────────────────────────────────────►│            │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  SXP FLOW:                                                                  │
│  ─────────                                                                  │
│  1. Endpoint authenticates → ISE assigns SGT                                │
│  2. ISE publishes SGT-IP mapping to pxGrid                                  │
│  3. Border node learns mapping via SXP                                      │
│  4. FTD learns mapping via SXP (from ISE or Border)                         │
│  5. FTD applies SGT-based policies                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.6.2 FTD SGT-Based Access Policy

**Firewall Policy Rules (FMC):**

| Rule | Source SGT | Destination | Action | Logging |
|------|------------|-------------|--------|---------|
| **Allow-Employee-Internet** | SGT-EMPLOYEES (10) | any-ipv4 | Allow | End |
| **Allow-Guest-Internet** | SGT-GUESTS (40) | any-ipv4 (via proxy) | Allow | End |
| **Deny-Guest-Internal** | SGT-GUESTS (40) | RFC1918 | Block | Start/End |
| **Allow-IoT-Platform** | SGT-IOT-SENSORS (50) | IoT-Platform-IP | Allow | End |
| **Deny-IoT-Internet** | SGT-IOT-SENSORS (50) | any-ipv4 | Block | Start/End |
| **Allow-Camera-NVR** | SGT-CAMERAS (70) | NVR-Servers | Allow | None |
| **Block-Quarantine** | SGT-QUARANTINE (999) | any | Block | Start/End |

### 3.6.3 SXP Configuration

**Border Node SXP Configuration:**

```
! ============================================================
! SXP CONFIGURATION - BORDER NODE
! ============================================================

! Enable CTS
cts credentials id BORDER-01 password 0 <cts-password>
cts role-based enforcement

! SXP Connection to ISE
cts sxp enable
cts sxp default password <sxp-password>
cts sxp default source-ip 10.250.1.1
cts sxp connection peer 10.252.10.10 password default mode local speaker
cts sxp connection peer 10.252.10.11 password default mode local speaker

! SXP Connection to FTD (listener)
cts sxp connection peer 10.100.50.1 password default mode local speaker
cts sxp connection peer 10.100.50.2 password default mode local speaker

! Verify
! show cts sxp connections brief
! show cts role-based sgt-map all
```

**FTD SXP Configuration (via FMC):**

```
Devices > Device Management > [FTD] > Routing > Identity Services

SXP Settings:
├── Enable SXP: Yes
├── Default Password: ********
├── Reconciliation Period: 120 seconds
├── Retry Period: 120 seconds
│
├── SXP Peers:
│   ├── Peer: 10.252.10.10 (ISE PAN)
│   │   Mode: Listener
│   │   Status: On
│   │
│   ├── Peer: 10.252.10.11 (ISE PSN)
│   │   Mode: Listener
│   │   Status: On
│   │
│   └── Peer: 10.250.1.1 (Border Node)
│       Mode: Listener
│       Status: On
```

---
