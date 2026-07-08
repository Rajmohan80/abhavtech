# 4.2 Pre-Deployment Checklist

### 4.2.1 Infrastructure Prerequisites

| Category | Requirement | Validation Method | Status |
|----------|-------------|-------------------|--------|
| **Data Center - New Jersey** ||||
| Rack Space | 6U for DNAC cluster (3 nodes) | Physical inspection | [ ] |
| Power | 3 × 20A circuits (redundant) | Electrical survey | [ ] |
| Cooling | 15,000 BTU capacity | HVAC assessment | [ ] |
| Network | 2 × 10GbE to core switches | Port availability | [ ] |
| **Data Center - London** ||||
| Rack Space | 6U for DNAC DR cluster | Physical inspection | [ ] |
| Power | 3 × 20A circuits (redundant) | Electrical survey | [ ] |
| Network | 2 × 10GbE to core switches | Port availability | [ ] |
| **ISE Nodes (All Sites)** ||||
| PAN Nodes | 2 × SNS-3695-K9 (NJ, London) | Hardware delivered | [ ] |
| PSN Nodes | 12 × SNS-3655-K9 (2 per region) | Hardware delivered | [ ] |
| Network | 2 × 10GbE per node | Port availability | [ ] |

### 4.2.2 Network Prerequisites

| Requirement | Specification | Validation Command |
|-------------|---------------|-------------------|
| Management VLAN | VLAN 100 (10.252.0.0/24) | `show vlan id 100` |
| OOB Management | Dedicated OOB switches | `ping` from OOB network |
| NTP Servers | 2 × internal NTP (10.252.1.10/11) | `show ntp status` |
| DNS Servers | 2 × internal DNS (10.252.1.20/21) | `nslookup dnac.corp.local` |
| DHCP Servers | ISE-aware DHCP or Windows DHCP | Option 43 configured |
| Syslog Servers | 2 × syslog (10.252.1.30/31) | `logger` test message |
| SNMP Servers | DNA Center as trap destination | Community string configured |

### 4.2.3 Software Prerequisites

```
+------------------------------------------------------------------+
| Component          | Minimum Version      | Target Version        |
+------------------------------------------------------------------+
| DNA Center         | 2.3.5.x              | 2.3.7.3 (latest)      |
| ISE                | 3.1 Patch 7          | 3.2 Patch 2           |
| Catalyst 9500      | IOS-XE 17.9.4        | IOS-XE 17.12.2        |
| Catalyst 9300      | IOS-XE 17.9.4        | IOS-XE 17.12.2        |
| Catalyst 9800 WLC  | IOS-XE 17.9.4        | IOS-XE 17.12.2        |
| AireOS (legacy)    | 8.10.185.0           | N/A (migrating)       |
+------------------------------------------------------------------+
```

### 4.2.4 License Prerequisites

| License Type | Quantity | Duration | Activation |
|--------------|----------|----------|------------|
| DNA Advantage - Switching | 854 devices | 5-year | Smart License |
| DNA Advantage - Wireless | 590 APs | 5-year | Smart License |
| ISE Base | 19,000 endpoints | 5-year | PAK/Smart |
| ISE Plus | 19,000 endpoints | 5-year | PAK/Smart |
| ISE Advantage (optional) | 19,000 endpoints | 5-year | PAK/Smart |

### 4.2.5 Credential Requirements

| System | Username Convention | Password Policy | MFA Required |
|--------|---------------------|-----------------|--------------|
| DNAC Admin | dnac-admin | 16+ chars, complexity | Yes (DUO) |
| DNAC Network | dnac-network | 16+ chars, complexity | No |
| ISE Admin | ise-admin | 16+ chars, complexity | Yes (DUO) |
| ISE ERS API | ise-api | 24+ chars, complexity | Certificate |
| Device CLI | netadmin | 16+ chars, complexity | No |
| Device Enable | (secret) | 16+ chars, complexity | No |

### 4.2.6 Certificate Requirements

| Certificate | Purpose | CA | Validity |
|-------------|---------|-----|----------|
| DNAC Server | Web UI, API | Internal CA | 2 years |
| ISE Admin | Web UI | Internal CA | 2 years |
| ISE EAP | 802.1X authentication | Internal CA | 2 years |
| ISE pxGrid | Context sharing | Internal CA | 2 years |
| Device | MACsec, dot1x supplicant | Internal CA | 2 years |

---
