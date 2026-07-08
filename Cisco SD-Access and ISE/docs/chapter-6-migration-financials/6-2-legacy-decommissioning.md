# 6.2 Legacy Decommissioning

### 6.2.1 Hardware Retirement Schedule

| Category | Model | Quantity | Retirement Phase | Disposal |
|----------|-------|----------|------------------|----------|
| Core Switches | Catalyst 6500 | 8 | Phase 3 | E-waste vendor |
| Core Switches | Catalyst 6800 | 10 | Phase 3 | E-waste vendor |
| Distribution | Catalyst 4500 | 24 | Phase 3-4 | E-waste vendor |
| Access Switches | Catalyst 3750 | 120 | Phase 3-4 | Resale/E-waste |
| Access Switches | Catalyst 3850 | 60 | Phase 4 | Resale/E-waste |
| Wireless Controllers | WLC 5520 | 6 | Phase 3-4 | E-waste vendor |
| Wireless Controllers | WLC 8540 | 6 | Phase 3-4 | E-waste vendor |
| Access Points | Various legacy | 400 | Phase 3-4 | E-waste vendor |
| Firewalls | ASA 5500-X | 18 | Phase 5 | Trade-in |

### 6.2.2 Legacy License Termination

| License Type | Current Count | Annual Cost | Termination Date | Savings |
|--------------|---------------|-------------|------------------|---------|
| SmartNet (Cat 6500) | 18 | $X,XXX| End of Phase 3 | $X,XXX/yr |
| SmartNet (Cat 3750) | 120 | $X,XXX| End of Phase 4 | $X,XXX/yr |
| SmartNet (Cat 3850) | 60 | $X,XXX| End of Phase 4 | $X,XXX/yr |
| WLC Support | 12 | $X,XXX| End of Phase 4 | $X,XXX/yr |
| Prime Infrastructure | 1 | $X,XXX| End of Phase 5 | $X,XXX/yr |
| **Total Annual** | | **$X,XXX** | | **$X,XXX** |

### 6.2.3 Data Migration Requirements

| Data Type | Source | Destination | Migration Method |
|-----------|--------|-------------|------------------|
| Device inventory | Spreadsheet/Prime | DNAC | Auto-discovery |
| Network diagrams | Visio | DNAC hierarchy | Manual creation |
| IP address allocation | IPAM | DNAC IP pools | API import |
| VLAN database | Switch configs | VN mapping | Manual mapping |
| ACLs | Switch configs | SGACLs | Policy translation |
| User database | AD/LDAP | ISE (linked) | AD integration |
| MAC addresses | Switch tables | ISE profiling | Auto-profiling |

### 6.2.4 Parallel Operation Period

```
+------------------------------------------------------------------+
|                    PARALLEL OPERATION SCHEDULE                    |
+------------------------------------------------------------------+

        Legacy           |        SD-Access
        Operating        |        Operating
-----------------------||-----------------------
                        ||
  Phase 1-2             ||  Foundation + Pilot
  Full Legacy           ||  Limited SD-Access
  Operation             ||  (Pilot only)
                        ||
-----------------------||-----------------------
                        ||
  Phase 3               ||  Hub Sites Migration
  Legacy (non-migrated) ||  SD-Access (migrated)
  Co-exists             ||  Growing
                        ||
-----------------------||-----------------------
                        ||
  Phase 4               ||  Branch Migration
  Legacy (branches)     ||  SD-Access (hubs)
  Shrinking             ||  Expanding
                        ||
-----------------------||-----------------------
                        ||
  Phase 5               ||  Full SD-Access
  Legacy                ||  Complete
  Decommissioned        ||  Operations
                        ||
+------------------------------------------------------------------+
```

---
