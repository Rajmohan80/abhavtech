# 3.9 Network Admission Control

### 3.9.1 Posture Assessment Policy

**Posture Conditions:**

| Condition | Check | Remediation |
|-----------|-------|-------------|
| **AV-Installed** | AntiVirus agent installed | Install corporate AV |
| **AV-Updated** | AV signatures < 7 days | Auto-update trigger |
| **OS-Patched** | Critical patches installed | WSUS remediation |
| **FW-Enabled** | Host firewall enabled | Enable via GPO |
| **Encryption** | Disk encryption enabled | Redirect to IT portal |
| **USB-Disabled** | USB storage disabled | GPO enforcement |

**Posture Policy Flow:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    POSTURE ASSESSMENT FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                    │
│  │  Endpoint   │     │   Fabric    │     │     ISE     │                    │
│  │             │     │   Edge      │     │             │                    │
│  └──────┬──────┘     └──────┬──────┘     └──────┬──────┘                    │
│         │                   │                   │                           │
│         │ 1. 802.1X Auth    │                   │                           │
│         │──────────────────►│                   │                           │
│         │                   │ 2. RADIUS Request │                           │
│         │                   │──────────────────►│                           │
│         │                   │                   │                           │
│         │                   │ 3. Auth Success + │                           │
│         │                   │    Posture Redirect                           │
│         │                   │◄──────────────────│                           │
│         │                   │                   │                           │
│         │◄──────────────────│                   │                           │
│         │ 4. Redirect to    │                   │                           │
│         │    Client Prov    │                   │                           │
│         │                   │                   │                           │
│         │ 5. AnyConnect Posture Module          │                           │
│         │───────────────────────────────────────►                           │
│         │                   │                   │                           │
│         │ 6. Posture Check  │                   │                           │
│         │   (AV, Patches)   │                   │                           │
│         │                   │                   │                           │
│         │ 7. Posture Report │                   │                           │
│         │───────────────────────────────────────►                           │
│         │                   │                   │                           │
│         │                   │                   │ 8. CoA (if compliant)     │
│         │                   │◄──────────────────│    SGT: Employees (10)    │
│         │                   │                   │                           │
│         │◄──────────────────│ 9. Full Access    │                           │
│         │                   │    Granted        │                           │
│                                                                             │
│  NON-COMPLIANT PATH:                                                        │
│  • Step 8: CoA with SGT: Quarantine (999)                                   │
│  • Step 9: Limited access to remediation portal                             │
│  • User remediates issues                                                   │
│  • Re-posture assessment                                                    │
│  • If compliant → CoA to full access                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---
