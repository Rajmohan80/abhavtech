# 3.5 Profiling Design

### 3.5.1 Profiling Policy Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ISE PROFILING HIERARCHY                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     CISCO SYSTEMS                                   │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │                 CISCO IP PHONES                             │    │    │
│  │  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │    │    │
│  │  │  │ Cisco 8800  │ │ Cisco 7800  │ │ Webex Desk  │            │    │    │
│  │  │  │ Series      │ │ Series      │ │ Pro         │            │    │    │
│  │  │  └─────────────┘ └─────────────┘ └─────────────┘            │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │                 CISCO ACCESS POINTS                         │    │    │
│  │  │  ┌─────────────┐ ┌─────────────┐                            │    │    │
│  │  │  │ Cisco 9130  │ │ Cisco 9120  │                            │    │    │
│  │  │  │ APs         │ │ APs         │                            │    │    │
│  │  │  └─────────────┘ └─────────────┘                            │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     PRINTERS                                        │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                    │    │
│  │  │ HP Printers │ │ Canon       │ │ Xerox       │                    │    │
│  │  │             │ │ Printers    │ │ Printers    │                    │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     IOT DEVICES                                     │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                    │    │
│  │  │ IP Cameras  │ │ Building    │ │ HVAC        │                    │    │
│  │  │ (Axis, Hikvision)│ │ Sensors│ │ Controllers │                   │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  PROFILING PROBES:                                                          │
│  ─────────────────                                                          │
│  • RADIUS (CoA, accounting)                                                 │
│  • DHCP (options 55, 60)                                                    │
│  • HTTP (User-Agent)                                                        │
│  • DNS (reverse lookup)                                                     │
│  • SNMP (OID query)                                                         │
│  • NetFlow (traffic patterns)                                               │
│  • NMAP (active scan - limited)                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.5.2 Custom Profiling Rules

**IP Phone Profiling (Enhanced):**

```
Profiling Policy: Cisco-IP-Phone-Enhanced
├── Condition Group (AND):
│   ├── DHCP:dhcp-class-identifier CONTAINS "Cisco Systems"
│   ├── OR
│   │   ├── MAC:OUI = 00:00:0C (Cisco)
│   │   ├── MAC:OUI = B4:14:89 (Cisco)
│   │   └── MAC:OUI = 58:BC:27 (Cisco)
│   └── AND
│       └── DHCP:host-name CONTAINS "SEP"
│
├── Certainty Factor: 70
├── Minimum Certainty: 20
└── Parent Profile: Cisco-Device
```

**IoT Sensor Profiling:**

```
Profiling Policy: IoT-Building-Sensor
├── Condition Group (AND):
│   ├── DHCP:dhcp-class-identifier CONTAINS "sensor"
│   │   OR DHCP:vendor-class-identifier CONTAINS "BACnet"
│   ├── AND
│   │   ├── HTTP:User-Agent CONTAINS "Sensor"
│   │   │   OR DNS:hostname MATCHES "sensor*"
│   └── AND
│       └── NetFlow:protocol = UDP:47808 (BACnet)
│
├── Certainty Factor: 30
├── Minimum Certainty: 50
└── Parent Profile: IoT-Device
```

---
