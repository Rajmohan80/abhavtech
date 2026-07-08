# 2.6 Overlay Network Design

## 2.6.1 Overlay Architecture Overview

### SD-Access Overlay Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      SD-ACCESS OVERLAY ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         CONTROL PLANE                                │   │
│  │                                                                      │   │
│  │   LISP (Locator/ID Separation Protocol)                             │   │
│  │   ┌────────────────────────────────────────────────────────────┐    │   │
│  │   │                                                            │    │   │
│  │   │  ┌─────────────┐              ┌─────────────┐             │    │   │
│  │   │  │ Map-Server  │◄────────────►│ Map-Resolver│             │    │   │
│  │   │  │    (MS)     │   EID-RLOC   │    (MR)     │             │    │   │
│  │   │  └──────┬──────┘   Database   └──────┬──────┘             │    │   │
│  │   │         │                            │                     │    │   │
│  │   │         │      Control Plane         │                     │    │   │
│  │   │         │         Nodes              │                     │    │   │
│  │   │         │                            │                     │    │   │
│  │   └─────────┼────────────────────────────┼─────────────────────┘    │   │
│  │             │                            │                          │   │
│  │   ┌─────────▼────────────────────────────▼─────────────────────┐    │   │
│  │   │                                                            │    │   │
│  │   │  ┌─────────────┐              ┌─────────────┐             │    │   │
│  │   │  │     ETR     │              │     ITR     │             │    │   │
│  │   │  │  (Egress)   │              │  (Ingress)  │             │    │   │
│  │   │  └─────────────┘              └─────────────┘             │    │   │
│  │   │                                                            │    │   │
│  │   │              Edge & Border Nodes                           │    │   │
│  │   │                                                            │    │   │
│  │   └────────────────────────────────────────────────────────────┘    │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                          DATA PLANE                                  │   │
│  │                                                                      │   │
│  │   VXLAN (Virtual Extensible LAN)                                    │   │
│  │   ┌────────────────────────────────────────────────────────────┐    │   │
│  │   │                                                            │    │   │
│  │   │   ┌─────────────────────────────────────────────────┐     │    │   │
│  │   │   │            VXLAN Header (8 bytes)                │     │    │   │
│  │   │   │  ┌───────┬───────┬───────────────────────────┐  │     │    │   │
│  │   │   │  │Flags  │Resv   │  VNI (24-bit)             │  │     │    │   │
│  │   │   │  │(8)    │(24)   │  Network Identifier       │  │     │    │   │
│  │   │   │  └───────┴───────┴───────────────────────────┘  │     │    │   │
│  │   │   └─────────────────────────────────────────────────┘     │    │   │
│  │   │                                                            │    │   │
│  │   │   Outer IP Header: RLOC (Underlay) Addresses              │    │   │
│  │   │   Inner Frame: Original Ethernet + SGT (CMD)              │    │   │
│  │   │                                                            │    │   │
│  │   └────────────────────────────────────────────────────────────┘    │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### LISP Functions by Node Type

| Node Type | LISP Role | Function |
|-----------|-----------|----------|
| **Control Plane Node** | MS/MR | Map-Server: Stores EID-to-RLOC mappings |
| | | Map-Resolver: Resolves EID queries |
| **Border Node** | Proxy-ETR/ITR | Handles inter-VN and external traffic |
| | | Performs route leaking between VNs |
| **Edge Node** | ETR/ITR | ETR: Registers host EIDs with MS |
| | | ITR: Queries MR for destination RLOCs |
| | | VXLAN encap/decap for host traffic |

### Overlay Packet Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        OVERLAY PACKET FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. HOST ONBOARDING (Registration)                                          │
│     ─────────────────────────────                                           │
│     Host connects → Edge authenticates → ISE assigns SGT                    │
│     Edge (ETR) registers EID+SGT with Map-Server                           │
│                                                                             │
│     ┌────────┐        ┌────────┐        ┌────────┐                         │
│     │  Host  │───────►│  Edge  │───────►│  CP    │                         │
│     │        │ Auth   │ (ETR)  │ Reg    │ (MS)   │                         │
│     └────────┘        └────────┘        └────────┘                         │
│                                                                             │
│  2. INTRA-FABRIC TRAFFIC (Same Site)                                        │
│     ────────────────────────────────                                        │
│     Host A → Edge A (ITR) → queries MS → gets RLOC of Edge B               │
│     Edge A encapsulates in VXLAN → forwards to Edge B (ETR)                │
│     Edge B decapsulates → delivers to Host B                               │
│                                                                             │
│     ┌────────┐   VXLAN    ┌────────┐   Original   ┌────────┐              │
│     │ Edge A │═══════════►│ Edge B │─────────────►│ Host B │              │
│     │ (ITR)  │  Tunnel    │ (ETR)  │   Frame      │        │              │
│     └────────┘            └────────┘              └────────┘              │
│                                                                             │
│  3. INTER-VN TRAFFIC (Requires Policy)                                      │
│     ──────────────────────────────────                                      │
│     Traffic between VNs routes through Border                               │
│     Border applies SGT policy (SGACL) before routing                       │
│                                                                             │
│     ┌────────┐        ┌────────┐        ┌────────┐                         │
│     │ VN_A   │───────►│ Border │───────►│ VN_B   │                         │
│     │ Host   │        │ (FW)   │        │ Server │                         │
│     └────────┘        └────────┘        └────────┘                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2.6.2 Virtual Network (VN) Design

### VN Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VIRTUAL NETWORK ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                         ┌─────────────────┐                                │
│                         │   INFRA_VN      │                                │
│                         │ (Infrastructure)│                                │
│                         │   VNI: 8000     │                                │
│                         └────────┬────────┘                                │
│                                  │                                          │
│         ┌────────────────────────┼────────────────────────┐                │
│         │                        │                        │                │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐      │
│  │VN_CORPORATE │  │  VN_GUEST   │  │   VN_IOT    │  │ VN_SERVERS  │      │
│  │  VNI: 8001  │  │  VNI: 8002  │  │  VNI: 8003  │  │  VNI: 8004  │      │
│  │             │  │             │  │             │  │             │      │
│  │ Employees   │  │ Visitors    │  │ Sensors     │  │ Prod/Dev    │      │
│  │ Executives  │  │ Contractors │  │ Cameras     │  │ Servers     │      │
│  │ Printers    │  │             │  │ OT Devices  │  │             │      │
│  │ Voice       │  │             │  │             │  │             │      │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘      │
│                                                                             │
│  GATEWAY TYPES:                                                             │
│  • Distributed (Anycast): VN_CORPORATE, VN_IOT, VN_VOICE                   │
│  • Centralized (Border):  VN_GUEST, VN_SERVERS                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Complete VN Definition

| VN Name | VNI | L2 VNI | Purpose | Gateway Type | Multicast Group |
|---------|-----|--------|---------|--------------|-----------------|
| **INFRA_VN** | 8000 | 8000 | Infrastructure (AP, WLC) | Distributed | 239.1.1.0 |
| **VN_CORPORATE** | 8001 | 8001 | Employee access | Distributed | 239.1.1.1 |
| **VN_GUEST** | 8002 | 8002 | Guest/Visitor access | Centralized | 239.1.1.2 |
| **VN_IOT** | 8003 | 8003 | IoT/OT devices | Distributed | 239.1.1.3 |
| **VN_SERVERS** | 8004 | 8004 | Data Center servers | Centralized | 239.1.1.4 |
| **VN_VOICE** | 8005 | 8005 | Voice/UC endpoints | Distributed | 239.1.1.5 |

### VN-to-VRF Mapping

| VN Name | VRF Name | Route Distinguisher | Route Target Import | Route Target Export |
|---------|----------|---------------------|---------------------|---------------------|
| INFRA_VN | INFRA_VN | 1:8000 | 1:8000 | 1:8000 |
| VN_CORPORATE | VN_CORPORATE | 1:8001 | 1:8001 | 1:8001 |
| VN_GUEST | VN_GUEST | 1:8002 | 1:8002 | 1:8002 |
| VN_IOT | VN_IOT | 1:8003 | 1:8003 | 1:8003 |
| VN_SERVERS | VN_SERVERS | 1:8004 | 1:8004 | 1:8004 |
| VN_VOICE | VN_VOICE | 1:8005 | 1:8005 | 1:8005 |

---

## 2.6.3 Complete IP Pool Allocation

### IP Pool Addressing Scheme

**Format**: `10.{VN-block}.{site-id}.0/24`

| VN | VN Block | Address Range | Total Capacity |
|----|----------|---------------|----------------|
| VN_CORPORATE | 100-109 | 10.100.0.0/16 - 10.109.0.0/16 | 655,360 hosts |
| VN_GUEST | 200-209 | 10.200.0.0/16 - 10.209.0.0/16 | 655,360 hosts |
| VN_IOT | 150-159 | 10.150.0.0/16 - 10.159.0.0/16 | 655,360 hosts |
| VN_SERVERS | 180-189 | 10.180.0.0/16 - 10.189.0.0/16 | 655,360 hosts |
| VN_VOICE | 190-199 | 10.190.0.0/16 - 10.199.0.0/16 | 655,360 hosts |

### Complete IP Pool Table - VN_CORPORATE (10.100.0.0/16)

| Site | Site ID | Pool Name | Subnet | Gateway | DHCP Scope | Capacity |
|------|---------|-----------|--------|---------|------------|----------|
| **APAC Hub Sites** |
| Mumbai HQ F1 | 1.1 | CORP-MUM-F1 | 10.100.1.0/24 | 10.100.1.1 | .10-.250 | 240 |
| Mumbai HQ F2 | 1.2 | CORP-MUM-F2 | 10.100.2.0/24 | 10.100.2.1 | .10-.250 | 240 |
| Mumbai HQ F3 | 1.3 | CORP-MUM-F3 | 10.100.3.0/24 | 10.100.3.1 | .10-.250 | 240 |
| Mumbai HQ F4 | 1.4 | CORP-MUM-F4 | 10.100.4.0/24 | 10.100.4.1 | .10-.250 | 240 |
| Mumbai HQ F5 | 1.5 | CORP-MUM-F5 | 10.100.5.0/24 | 10.100.5.1 | .10-.250 | 240 |
| Mumbai HQ F6 | 1.6 | CORP-MUM-F6 | 10.100.6.0/24 | 10.100.6.1 | .10-.250 | 240 |
| Chennai HQ F1 | 2.1 | CORP-CHN-F1 | 10.100.17.0/24 | 10.100.17.1 | .10-.250 | 240 |
| Chennai HQ F2 | 2.2 | CORP-CHN-F2 | 10.100.18.0/24 | 10.100.18.1 | .10-.250 | 240 |
| Chennai HQ F3 | 2.3 | CORP-CHN-F3 | 10.100.19.0/24 | 10.100.19.1 | .10-.250 | 240 |
| Chennai HQ F4 | 2.4 | CORP-CHN-F4 | 10.100.20.0/24 | 10.100.20.1 | .10-.250 | 240 |
| **APAC Branch Sites** |
| Bangalore | 3 | CORP-BLR | 10.100.33.0/24 | 10.100.33.1 | .10-.250 | 240 |
| Delhi | 4 | CORP-DEL | 10.100.49.0/24 | 10.100.49.1 | .10-.250 | 240 |
| Noida | 5 | CORP-NOI | 10.100.65.0/24 | 10.100.65.1 | .10-.200 | 190 |
| **EMEA Hub Sites** |
| London HQ F1 | 16.1 | CORP-LON-F1 | 10.101.1.0/24 | 10.101.1.1 | .10-.250 | 240 |
| London HQ F2 | 16.2 | CORP-LON-F2 | 10.101.2.0/24 | 10.101.2.1 | .10-.250 | 240 |
| London HQ F3 | 16.3 | CORP-LON-F3 | 10.101.3.0/24 | 10.101.3.1 | .10-.250 | 240 |
| London HQ F4 | 16.4 | CORP-LON-F4 | 10.101.4.0/24 | 10.101.4.1 | .10-.250 | 240 |
| Frankfurt HQ F1 | 17.1 | CORP-FRA-F1 | 10.101.17.0/24 | 10.101.17.1 | .10-.250 | 240 |
| Frankfurt HQ F2 | 17.2 | CORP-FRA-F2 | 10.101.18.0/24 | 10.101.18.1 | .10-.250 | 240 |
| Frankfurt HQ F3 | 17.3 | CORP-FRA-F3 | 10.101.19.0/24 | 10.101.19.1 | .10-.250 | 240 |
| **EMEA Branch Sites** |
| Paris | 18 | CORP-PAR | 10.101.33.0/24 | 10.101.33.1 | .10-.200 | 190 |
| Amsterdam | 19 | CORP-AMS | 10.101.49.0/24 | 10.101.49.1 | .10-.200 | 190 |
| Dublin | 20 | CORP-DUB | 10.101.65.0/24 | 10.101.65.1 | .10-.200 | 190 |
| Madrid | 21 | CORP-MAD | 10.101.81.0/24 | 10.101.81.1 | .10-.150 | 140 |
| Milan | 22 | CORP-MIL | 10.101.97.0/24 | 10.101.97.1 | .10-.150 | 140 |
| **Americas Hub Sites** |
| New Jersey HQ F1 | 32.1 | CORP-NJ-F1 | 10.102.1.0/24 | 10.102.1.1 | .10-.250 | 240 |
| New Jersey HQ F2 | 32.2 | CORP-NJ-F2 | 10.102.2.0/24 | 10.102.2.1 | .10-.250 | 240 |
| New Jersey HQ F3 | 32.3 | CORP-NJ-F3 | 10.102.3.0/24 | 10.102.3.1 | .10-.250 | 240 |
| New Jersey HQ F4 | 32.4 | CORP-NJ-F4 | 10.102.4.0/24 | 10.102.4.1 | .10-.250 | 240 |
| New Jersey HQ F5 | 32.5 | CORP-NJ-F5 | 10.102.5.0/24 | 10.102.5.1 | .10-.250 | 240 |
| Dallas HQ F1 | 33.1 | CORP-DAL-F1 | 10.102.17.0/24 | 10.102.17.1 | .10-.250 | 240 |
| Dallas HQ F2 | 33.2 | CORP-DAL-F2 | 10.102.18.0/24 | 10.102.18.1 | .10-.250 | 240 |
| Dallas HQ F3 | 33.3 | CORP-DAL-F3 | 10.102.19.0/24 | 10.102.19.1 | .10-.250 | 240 |
| **Americas Branch Sites** |
| Chicago | 34 | CORP-CHI | 10.102.33.0/24 | 10.102.33.1 | .10-.200 | 190 |
| Seattle | 35 | CORP-SEA | 10.102.49.0/24 | 10.102.49.1 | .10-.200 | 190 |
| Los Angeles | 36 | CORP-LAX | 10.102.65.0/24 | 10.102.65.1 | .10-.200 | 190 |
| Atlanta | 37 | CORP-ATL | 10.102.81.0/24 | 10.102.81.1 | .10-.150 | 140 |
| Denver | 38 | CORP-DEN | 10.102.97.0/24 | 10.102.97.1 | .10-.150 | 140 |

### Complete IP Pool Table - VN_GUEST (10.200.0.0/16)

| Site | Pool Name | Subnet | Gateway | DHCP Scope | Capacity |
|------|-----------|--------|---------|------------|----------|
| **Hub Sites** |
| Mumbai | GUEST-MUM | 10.200.1.0/24 | 10.200.1.1 | .10-.250 | 240 |
| Chennai | GUEST-CHN | 10.200.17.0/24 | 10.200.17.1 | .10-.250 | 240 |
| London | GUEST-LON | 10.201.1.0/24 | 10.201.1.1 | .10-.250 | 240 |
| Frankfurt | GUEST-FRA | 10.201.17.0/24 | 10.201.17.1 | .10-.250 | 240 |
| New Jersey | GUEST-NJ | 10.202.1.0/24 | 10.202.1.1 | .10-.250 | 240 |
| Dallas | GUEST-DAL | 10.202.17.0/24 | 10.202.17.1 | .10-.250 | 240 |
| **Branch Sites** |
| Bangalore | GUEST-BLR | 10.200.33.0/25 | 10.200.33.1 | .10-.120 | 110 |
| Delhi | GUEST-DEL | 10.200.49.0/25 | 10.200.49.1 | .10-.120 | 110 |
| Chicago | GUEST-CHI | 10.202.33.0/25 | 10.202.33.1 | .10-.120 | 110 |

### Complete IP Pool Table - VN_IOT (10.150.0.0/16)

| Site | Pool Name | Subnet | Gateway | DHCP Scope | Device Type |
|------|-----------|--------|---------|------------|-------------|
| **Hub Sites** |
| Mumbai - Sensors | IOT-MUM-SENS | 10.150.1.0/25 | 10.150.1.1 | .10-.120 | BMS Sensors |
| Mumbai - Cameras | IOT-MUM-CAM | 10.150.1.128/25 | 10.150.1.129 | .130-.250 | IP Cameras |
| Mumbai - OT | IOT-MUM-OT | 10.150.2.0/24 | 10.150.2.1 | .10-.200 | OT Devices |
| Chennai - Sensors | IOT-CHN-SENS | 10.150.17.0/25 | 10.150.17.1 | .10-.120 | BMS Sensors |
| Chennai - Cameras | IOT-CHN-CAM | 10.150.17.128/25 | 10.150.17.129 | .130-.250 | IP Cameras |
| London - Sensors | IOT-LON-SENS | 10.151.1.0/25 | 10.151.1.1 | .10-.120 | BMS Sensors |
| London - Cameras | IOT-LON-CAM | 10.151.1.128/25 | 10.151.1.129 | .130-.250 | IP Cameras |
| New Jersey - Sensors | IOT-NJ-SENS | 10.152.1.0/25 | 10.152.1.1 | .10-.120 | BMS Sensors |
| New Jersey - Cameras | IOT-NJ-CAM | 10.152.1.128/25 | 10.152.1.129 | .130-.250 | IP Cameras |
| New Jersey - OT | IOT-NJ-OT | 10.152.2.0/24 | 10.152.2.1 | .10-.200 | OT Devices |

### Complete IP Pool Table - VN_SERVERS (10.180.0.0/16)

| Site | Pool Name | Subnet | Gateway | Reserved | Purpose |
|------|-----------|--------|---------|----------|---------|
| **Data Centers** |
| Mumbai DC - Prod | SRV-MUM-PROD | 10.180.1.0/24 | 10.180.1.1 | .1-.9 | Production |
| Mumbai DC - Dev | SRV-MUM-DEV | 10.180.2.0/24 | 10.180.2.1 | .1-.9 | Development |
| Mumbai DC - DMZ | SRV-MUM-DMZ | 10.180.3.0/24 | 10.180.3.1 | .1-.9 | DMZ/Edge |
| Chennai DC - Prod | SRV-CHN-PROD | 10.180.17.0/24 | 10.180.17.1 | .1-.9 | Production |
| Chennai DC - Dev | SRV-CHN-DEV | 10.180.18.0/24 | 10.180.18.1 | .1-.9 | Development |
| London DC - Prod | SRV-LON-PROD | 10.181.1.0/24 | 10.181.1.1 | .1-.9 | Production |
| London DC - Dev | SRV-LON-DEV | 10.181.2.0/24 | 10.181.2.1 | .1-.9 | Development |
| Frankfurt DC - Prod | SRV-FRA-PROD | 10.181.17.0/24 | 10.181.17.1 | .1-.9 | Production |
| New Jersey DC - Prod | SRV-NJ-PROD | 10.182.1.0/24 | 10.182.1.1 | .1-.9 | Production |
| New Jersey DC - Dev | SRV-NJ-DEV | 10.182.2.0/24 | 10.182.2.1 | .1-.9 | Development |
| New Jersey DC - DMZ | SRV-NJ-DMZ | 10.182.3.0/24 | 10.182.3.1 | .1-.9 | DMZ/Edge |
| Dallas DC - Prod | SRV-DAL-PROD | 10.182.17.0/24 | 10.182.17.1 | .1-.9 | Production |

### Complete IP Pool Table - VN_VOICE (10.190.0.0/16)

| Site | Pool Name | Subnet | Gateway | DHCP Scope | Capacity |
|------|-----------|--------|---------|------------|----------|
| **Hub Sites** |
| Mumbai | VOICE-MUM | 10.190.1.0/24 | 10.190.1.1 | .10-.250 | 240 |
| Chennai | VOICE-CHN | 10.190.17.0/24 | 10.190.17.1 | .10-.250 | 240 |
| London | VOICE-LON | 10.191.1.0/24 | 10.191.1.1 | .10-.250 | 240 |
| Frankfurt | VOICE-FRA | 10.191.17.0/24 | 10.191.17.1 | .10-.200 | 190 |
| New Jersey | VOICE-NJ | 10.192.1.0/24 | 10.192.1.1 | .10-.250 | 240 |
| Dallas | VOICE-DAL | 10.192.17.0/24 | 10.192.17.1 | .10-.200 | 190 |
| **Branch Sites** |
| Bangalore | VOICE-BLR | 10.190.33.0/25 | 10.190.33.1 | .10-.100 | 90 |
| Delhi | VOICE-DEL | 10.190.49.0/25 | 10.190.49.1 | .10-.100 | 90 |
| Chicago | VOICE-CHI | 10.192.33.0/25 | 10.192.33.1 | .10-.100 | 90 |

---

## 2.6.4 Anycast Gateway Design

### Anycast Gateway Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ANYCAST GATEWAY ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CONCEPT: Same IP + Same MAC on all fabric edges within a VN               │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │   VN_CORPORATE (VNI 8001) - Anycast Gateway Example                 │   │
│  │                                                                      │   │
│  │   Gateway IP:  10.100.1.1                                           │   │
│  │   Gateway MAC: 0000.0C9F.F001 (Virtual MAC)                         │   │
│  │                                                                      │   │
│  │   ┌──────────┐     ┌──────────┐     ┌──────────┐                   │   │
│  │   │  Edge-1  │     │  Edge-2  │     │  Edge-3  │                   │   │
│  │   │          │     │          │     │          │                   │   │
│  │   │ SVI:     │     │ SVI:     │     │ SVI:     │                   │   │
│  │   │ 10.100.1.1│    │ 10.100.1.1│    │ 10.100.1.1│                  │   │
│  │   │ MAC: same│     │ MAC: same│     │ MAC: same│                   │   │
│  │   └────┬─────┘     └────┬─────┘     └────┬─────┘                   │   │
│  │        │                │                │                          │   │
│  │   ┌────┴────┐     ┌────┴────┐     ┌────┴────┐                      │   │
│  │   │ Host A  │     │ Host B  │     │ Host C  │                      │   │
│  │   │10.100.1.10│   │10.100.1.20│   │10.100.1.30│                    │   │
│  │   └─────────┘     └─────────┘     └─────────┘                      │   │
│  │                                                                      │   │
│  │   BENEFIT: Hosts see consistent gateway, seamless mobility          │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Anycast Gateway Configuration per VN

| VN | Gateway IP (per pool) | Virtual MAC | SVI VLAN Range |
|----|----------------------|-------------|----------------|
| VN_CORPORATE | 10.100.x.1 | 0000.0C9F.F001 | 1001-1099 |
| VN_GUEST | 10.200.x.1 | 0000.0C9F.F002 | 2001-2099 |
| VN_IOT | 10.150.x.1 | 0000.0C9F.F003 | 1501-1599 |
| VN_SERVERS | 10.180.x.1 | 0000.0C9F.F004 | 1801-1899 |
| VN_VOICE | 10.190.x.1 | 0000.0C9F.F005 | 1901-1999 |

---

## 2.6.5 Scalable Group Tag (SGT) Design

### Complete SGT Allocation

| SGT Value | SGT Name | Description | VN | Auto-Assign |
|-----------|----------|-------------|----|----|
| **Corporate Users** |
| 10 | SGT-EMPLOYEES | Full-time employees | VN_CORPORATE | ISE Policy |
| 11 | SGT-EXECUTIVES | Executive/VIP users | VN_CORPORATE | ISE Policy |
| 12 | SGT-HR | Human Resources | VN_CORPORATE | ISE Policy |
| 13 | SGT-FINANCE | Finance department | VN_CORPORATE | ISE Policy |
| 14 | SGT-IT-ADMINS | IT Administrators | VN_CORPORATE | ISE Policy |
| 15 | SGT-CONTRACTORS | External contractors | VN_CORPORATE | ISE Policy |
| **Voice/UC** |
| 20 | SGT-VOICE | IP Phones | VN_VOICE | Profiling |
| 21 | SGT-VIDEO | Video endpoints | VN_VOICE | Profiling |
| **Devices** |
| 30 | SGT-PRINTERS | Network printers | VN_CORPORATE | Profiling |
| 31 | SGT-SCANNERS | Scanners/MFPs | VN_CORPORATE | Profiling |
| **Guest** |
| 40 | SGT-GUESTS | Guest users | VN_GUEST | ISE Policy |
| 41 | SGT-GUEST-PREMIUM | Premium guests | VN_GUEST | ISE Policy |
| **IoT** |
| 50 | SGT-IOT-SENSORS | Building sensors | VN_IOT | Profiling |
| 51 | SGT-IOT-HVAC | HVAC controllers | VN_IOT | Profiling |
| 52 | SGT-IOT-LIGHTING | Lighting systems | VN_IOT | Profiling |
| 60 | SGT-OT-DEVICES | OT/SCADA devices | VN_IOT | Profiling |
| 70 | SGT-CAMERAS | IP surveillance | VN_IOT | Profiling |
| 71 | SGT-BADGE-READERS | Badge/Access control | VN_IOT | Profiling |
| **Servers** |
| 80 | SGT-SERVERS-PROD | Production servers | VN_SERVERS | Static |
| 81 | SGT-SERVERS-DB | Database servers | VN_SERVERS | Static |
| 82 | SGT-SERVERS-WEB | Web servers | VN_SERVERS | Static |
| 83 | SGT-SERVERS-APP | Application servers | VN_SERVERS | Static |
| 90 | SGT-SERVERS-DEV | Development servers | VN_SERVERS | Static |
| 91 | SGT-SERVERS-TEST | Test servers | VN_SERVERS | Static |
| **Security** |
| 999 | SGT-QUARANTINE | Non-compliant | Any | ISE Posture |
| 998 | SGT-UNKNOWN | Unknown devices | Any | Default |

### SGT Propagation Methods

| Method | Use Case | Configuration |
|--------|----------|---------------|
| **Inline Tagging** | Fabric internal | Enabled on all fabric ports |
| **SXP** | Non-fabric devices | ISE → Firewall, WLC |
| **Static Mapping** | Legacy systems | IP-to-SGT on Border nodes |
| **ISE Policy** | Dynamic users | Authorization profile |
| **Profiling** | IoT/Devices | ISE profiling policy |

---

## 2.6.6 SGACL Policy Design

### Complete SGACL Policy Matrix

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              SGACL POLICY MATRIX (Detailed)                                     │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│  SOURCE ↓  DEST →  │ EMP │EXEC │ HR  │ FIN │ IT  │CONT │VOICE│PRNT │GUEST│ IOT │SRV-P│SRV-D│QUA │
│                    │ 10  │ 11  │ 12  │ 13  │ 14  │ 15  │ 20  │ 30  │ 40  │ 50  │ 80  │ 90  │999 │
├────────────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼────┤
│ EMPLOYEES (10)     │  P  │  -  │  -  │  -  │  -  │  -  │  P  │  P  │  -  │  -  │ L1  │  P  │ -  │
│ EXECUTIVES (11)    │  P  │  P  │  P  │  P  │  -  │  -  │  P  │  P  │  -  │  -  │  P  │  P  │ -  │
│ HR (12)            │  -  │  -  │  P  │  -  │  -  │  -  │  P  │  P  │  -  │  -  │ L2  │  -  │ -  │
│ FINANCE (13)       │  -  │  -  │  -  │  P  │  -  │  -  │  P  │  P  │  -  │  -  │ L3  │  -  │ -  │
│ IT-ADMINS (14)     │  P  │  P  │  P  │  P  │  P  │  P  │  P  │  P  │  P  │  P  │  P  │  P  │ P  │
│ CONTRACTORS (15)   │  -  │  -  │  -  │  -  │  -  │  P  │  P  │  P  │  -  │  -  │  -  │ L4  │ -  │
│ VOICE (20)         │  P  │  P  │  P  │  P  │  P  │  P  │  P  │  -  │  -  │  -  │ V1  │  -  │ -  │
│ PRINTERS (30)      │  -  │  -  │  -  │  -  │  -  │  -  │  -  │  -  │  -  │  -  │ P1  │  -  │ -  │
│ GUESTS (40)        │  -  │  -  │  -  │  -  │  -  │  -  │  -  │  -  │  P  │  -  │  -  │  -  │ -  │
│ IOT-SENSORS (50)   │  -  │  -  │  -  │  -  │  -  │  -  │  -  │  -  │  -  │  P  │ I1  │  -  │ -  │
│ CAMERAS (70)       │  -  │  -  │  -  │  -  │  -  │  -  │  -  │  -  │  -  │  -  │ C1  │  -  │ -  │
│ SERVERS-PROD (80)  │  P  │  P  │ L2  │ L3  │  P  │  -  │ V1  │ P1  │  -  │ I1  │  P  │  -  │ -  │
│ SERVERS-DEV (90)   │  P  │  P  │  -  │  -  │  P  │ L4  │  -  │  -  │  -  │  -  │  -  │  P  │ -  │
│ QUARANTINE (999)   │  -  │  -  │  -  │  -  │  -  │  -  │  -  │  -  │  -  │  -  │  -  │  -  │ Q1 │
└────────────────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴────┘

LEGEND:
  P  = Permit All
  -  = Deny All (implicit)
  L1 = Limited (HTTP/HTTPS/SSH/RDP to specific servers)
  L2 = Limited (HR systems only - ports 443, 8443)
  L3 = Limited (Finance systems only - ports 443, 1433)
  L4 = Limited (Dev servers only - ports 22, 443, 3389)
  V1 = Voice protocols (SIP 5060-5061, RTP 16384-32767)
  P1 = Print protocols (9100, 631 IPP)
  I1 = IoT protocols (MQTT 1883/8883, CoAP 5683)
  C1 = Video streaming (RTSP 554, HTTP 80/443)
  Q1 = Quarantine (DNS 53, HTTP 80 to remediation only)
```

### SGACL Policy Definitions

**L1: Employee to Production Server Access**
```
permit tcp dst eq 22
permit tcp dst eq 443
permit tcp dst eq 3389
permit tcp dst eq 80
deny ip
```

**L2: HR to HR Systems**
```
permit tcp dst eq 443
permit tcp dst eq 8443
permit tcp dst range 1433 1434
deny ip
```

**L3: Finance to Finance Systems**
```
permit tcp dst eq 443
permit tcp dst eq 1433
permit tcp dst eq 1521
deny ip
```

**V1: Voice Traffic**
```
permit udp dst eq 5060
permit tcp dst eq 5061
permit udp dst range 16384 32767
deny ip
```

**I1: IoT to Server**
```
permit tcp dst eq 1883
permit tcp dst eq 8883
permit udp dst eq 5683
permit tcp dst eq 443
deny ip
```

**Q1: Quarantine Access**
```
permit udp dst eq 53
permit tcp dst eq 80 host 10.252.30.50
permit tcp dst eq 443 host 10.252.30.50
deny ip
```

---

## 2.6.7 Inter-VN Routing Design

### Inter-VN Traffic Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       INTER-VN ROUTING DESIGN                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  RULE: All inter-VN traffic MUST transit through Border Node               │
│        Border Node applies SGACL policy before routing                     │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │   VN_CORPORATE                    VN_SERVERS                        │   │
│  │   ┌──────────┐                    ┌──────────┐                      │   │
│  │   │ Employee │                    │  Server  │                      │   │
│  │   │ SGT: 10  │                    │ SGT: 80  │                      │   │
│  │   └────┬─────┘                    └────┬─────┘                      │   │
│  │        │                               │                            │   │
│  │        │ 1. Traffic to                 │                            │   │
│  │        │    different VN               │                            │   │
│  │        ▼                               │                            │   │
│  │   ┌──────────┐                         │                            │   │
│  │   │  Edge    │                         │                            │   │
│  │   │  Node    │                         │                            │   │
│  │   └────┬─────┘                         │                            │   │
│  │        │                               │                            │   │
│  │        │ 2. VXLAN to Border            │                            │   │
│  │        ▼                               │                            │   │
│  │   ┌────────────────────────────────────┴─────┐                      │   │
│  │   │            BORDER NODE                    │                      │   │
│  │   │                                           │                      │   │
│  │   │  3. Decap VN_CORPORATE                   │                      │   │
│  │   │  4. Apply SGACL (SGT 10 → SGT 80)        │                      │   │
│  │   │  5. Route to VN_SERVERS VRF              │                      │   │
│  │   │  6. Encap to destination Edge            │                      │   │
│  │   │                                           │                      │   │
│  │   └────────────────────────────────────┬─────┘                      │   │
│  │                                        │                            │   │
│  │                                        │ 7. VXLAN to Edge           │   │
│  │                                        ▼                            │   │
│  │                                   ┌──────────┐                      │   │
│  │                                   │  Edge    │                      │   │
│  │                                   │  Node    │                      │   │
│  │                                   └────┬─────┘                      │   │
│  │                                        │                            │   │
│  │                                        │ 8. Deliver to server       │   │
│  │                                        ▼                            │   │
│  │                                   ┌──────────┐                      │   │
│  │                                   │  Server  │                      │   │
│  │                                   └──────────┘                      │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### VN Interconnection Policy

| Source VN | Destination VN | Allowed | Policy Applied |
|-----------|----------------|---------|----------------|
| VN_CORPORATE | VN_SERVERS | Yes | SGACL per user group |
| VN_CORPORATE | VN_VOICE | Yes | Permit (same user context) |
| VN_CORPORATE | VN_GUEST | No | Deny |
| VN_CORPORATE | VN_IOT | No | Deny (except IT-ADMINS) |
| VN_GUEST | VN_CORPORATE | No | Deny |
| VN_GUEST | VN_SERVERS | No | Deny |
| VN_GUEST | VN_IOT | No | Deny |
| VN_GUEST | Internet | Yes | Via Border (filtered) |
| VN_IOT | VN_SERVERS | Yes | Limited (MQTT, CoAP only) |
| VN_IOT | VN_CORPORATE | No | Deny |
| VN_IOT | Cloud | Yes | Via SD-WAN (specific apps) |
| VN_VOICE | VN_SERVERS | Yes | Voice protocols only |
| VN_SERVERS | Any | Yes | Per SGACL policy |

---

## 2.6.8 Summary

### Overlay Design Summary Table

| Component | Design Decision | Justification |
|-----------|-----------------|---------------|
| **VNs** | 5 VNs + INFRA_VN | Logical segmentation by function |
| **Gateway** | Anycast (distributed) for Corp/Voice/IoT | Optimal local routing |
| | Centralized for Guest/Servers | Policy enforcement |
| **IP Scheme** | 10.x.0.0/16 per VN | Scalable, easy management |
| **SGTs** | ~25 SGTs defined | Granular policy control |
| **SGACL** | Whitelist model | Default deny, explicit permit |
| **Inter-VN** | Via Border only | Centralized policy enforcement |

### Key Design Parameters

| Parameter | Value |
|-----------|-------|
| Total VNIs | 6 (including INFRA_VN) |
| Total IP Pools | ~75 pools across all sites |
| Total SGTs | 25+ |
| SGACL Policies | ~150 rules |
| Anycast MAC Base | 0000.0C9F.Fxxx |
| LISP Instance IDs | 8000-8005 |
| Multicast Range | 239.1.1.0-239.1.1.5 |

---
