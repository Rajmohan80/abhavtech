# Appendix E: Hardware Bill of Materials

### DNA Center Appliances

| Model | Quantity | Location | Purpose |
|-------|----------|----------|---------|
| DN2-HW-APL-XL | 3 | New Jersey | Primary cluster |
| DN2-HW-APL-XL | 3 | London | DR cluster |

### ISE Appliances

| Model | Quantity | Location | Role |
|-------|----------|----------|------|
| SNS-3695-K9 | 1 | New Jersey | Primary PAN |
| SNS-3695-K9 | 1 | London | Secondary PAN |
| SNS-3655-K9 | 2 | Mumbai | PSN pair |
| SNS-3655-K9 | 2 | Chennai | PSN pair |
| SNS-3655-K9 | 2 | London | PSN pair |
| SNS-3655-K9 | 2 | Frankfurt | PSN pair |
| SNS-3655-K9 | 2 | New Jersey | PSN pair |
| SNS-3655-K9 | 2 | Dallas | PSN pair |

### Switching - Hub Sites

| Model | Quantity | Role | Locations |
|-------|----------|------|-----------|
| C9500-48Y4C | 12 | Border Node | 2 per hub (6 hubs) |
| C9500-24Y4C | 12 | Control Plane | 2 per hub (6 hubs) |
| C9300-48U | 238 | Edge Node | Distributed |

### Switching - Branch Sites

| Model | Quantity | Role | Sites |
|-------|----------|------|-------|
| C9300-48UXM | 60 | Fabric-in-a-Box | 30 branches × 2 |
| C9200-24P | 120 | Extended Node | 30 branches × 4 |

### Wireless

| Model | Quantity | Role | Locations |
|-------|----------|------|-----------|
| C9800-80 | 6 | WLC (large) | Hub sites |
| C9800-40 | 6 | WLC (medium) | Hub sites |
| C9130AXI | 350 | AP (high-density) | Hub sites |
| C9120AXI | 240 | AP (standard) | Branches |

### Optics and Cables

| Type | Quantity | Purpose |
|------|----------|---------|
| SFP-10G-SR | 200 | 10G short-reach |
| SFP-25G-SR-S | 100 | 25G short-reach |
| QSFP-100G-SR4-S | 50 | 100G short-reach |
| CAT6A Patch Cables | 5,000 | Endpoint connections |
| OM4 Fiber (2m) | 500 | Intra-rack |
| OM4 Fiber (10m) | 200 | Inter-rack |

---
