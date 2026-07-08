# 7.1 How ZTP Works End to End

Zero Touch Provisioning (ZTP) automates device onboarding without manual console configuration.

## ZTP Flow

```
1. Device powers on with factory default
2. DHCP assigns IP + option 67 (bootstrap server)
3. Device downloads Python/script from TFTP
4. Script configures management IP, DNS, NTP
5. Device registers with the controller (vBond/vManage)
6. Controller pushes day-0 configuration
7. Device joins fabric/SD-WAN overlay
```

## DHCP Configuration

```
option 67 = "http://10.252.100.10/ztp/bootstrap.py"
```

## Bootstrap Script

```python
#!/usr/bin/env python3
import cli

# Configure management interface
cli.configurep(["interface GigabitEthernet0/0",
                "ip address dhcp",
                "no shutdown"])

# Set DNS/NTP
cli.configurep(["ip name-server 10.252.100.1",
                "ntp server 10.252.100.2"])
```

!!! note "ZTP vs. PnP"
    This page describes **IOS-XE script-based ZTP** (DHCP option 67 →
    download and run a Python script). Catalyst 9k switches onboard via
    **Cisco Network PnP** instead (DHCP option 43 → Catalyst Center), and
    cEdge routers register with vBond/vManage. See
    [7.3 ZTP Flow Per Device Type](device-types.md) for the per-platform
    method.

---

**Related Sections**:
- [7.2 Pre-Staging Requirements](prestaging.md)
- [7.4 Simulating ZTP in CML](cml-simulation.md)
