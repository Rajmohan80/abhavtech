# 7.3 ZTP Flow Per Device Type

Different device types use different ZTP methods.

## Catalyst 9k (PnP via DNAC)

1. DHCP option 43 points to DNAC
2. Device contacts DNAC PnP server
3. DNAC pushes day-0 template
4. Device joins fabric

## cEdge (ZTP via vManage)

1. DHCP option 67 provides bootstrap config
2. Device contacts vBond orchestrator
3. vBond redirects to vManage
4. vManage attaches device template

## Wireless (WLC Discovery)

1. DHCP option 43 provides WLC IP
2. AP joins WLC
3. WLC pushes RF profile

---

**Related Sections**:
- [7.4 Simulating ZTP in CML](cml-simulation.md)
