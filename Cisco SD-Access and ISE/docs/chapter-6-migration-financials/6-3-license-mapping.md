# 6.3 License Mapping

### 6.3.1 Cisco DNA Licensing Model

```
+------------------------------------------------------------------+
|                    DNA LICENSE TIERS                              |
+------------------------------------------------------------------+

                    ESSENTIALS  |  ADVANTAGE  |  PREMIER
                    ------------|-------------|------------
Automation              ✓       |      ✓      |     ✓
Basic Monitoring        ✓       |      ✓      |     ✓
Assurance               -       |      ✓      |     ✓
SD-Access               -       |      ✓      |     ✓
Group Policy            -       |      ✓      |     ✓
Security Analytics      -       |      -      |     ✓
Stealthwatch            -       |      -      |     ✓
Encrypted Traffic       -       |      -      |     ✓

SELECTED: DNA ADVANTAGE (Required for SD-Access)
```

### 6.3.2 License Quantity Calculation

**Switching Licenses**

| Device Type | Quantity | License Term | Unit Price | Total |
|-------------|----------|--------------|------------|-------|
| Catalyst 9500-48Y4C | 24 | 5-year DNA-A | $X,XXX| $X,XXX|
| Catalyst 9500-24Y4C | 12 | 5-year DNA-A | $X,XXX| $X,XXX|
| Catalyst 9300-48U | 238 | 5-year DNA-A | $X,XXX| $X,XXX|
| Catalyst 9300-24U | 48 | 5-year DNA-A | $X,XXX| $X,XXX|
| Catalyst 9200-48P | 120 | 5-year DNA-A | $X,XXX| $X,XXX|
| **Subtotal Switching** | | | | **$X,XXX** |

**Wireless Licenses**

| Device Type | Quantity | License Term | Unit Price | Total |
|-------------|----------|--------------|------------|-------|
| Catalyst 9800-40 WLC | 6 | Included | - | - |
| Catalyst 9800-80 WLC | 6 | Included | - | - |
| C9130AXI AP | 350 | 5-year DNA-A | $X,XXX| $X,XXX|
| C9120AXI AP | 240 | 5-year DNA-A | $X,XXX| $X,XXX|
| **Subtotal Wireless** | | | | **$X,XXX** |

**ISE Licenses**

| License Type | Endpoints | Term | Unit Price | Total |
|--------------|-----------|------|------------|-------|
| ISE Base | 19,000 | 5-year | $X,XXX/endpoint | $X,XXX|
| ISE Plus | 19,000 | 5-year | $X,XXX/endpoint | $X,XXX|
| **Subtotal ISE** | | | | **$X,XXX** |

**Total Licensing (5-Year)**: $X,XXX
### 6.3.3 Legacy to DNA License Mapping

| Legacy License | Annual Cost | DNA Equivalent | 5-Year Cost | Savings |
|----------------|-------------|----------------|-------------|---------|
| LAN Base | $X,XXX| DNA Advantage | Included | $X,XXX|
| Prime Infrastructure | $X,XXX| DNAC (appliance) | Included | $X,XXX|
| WLC License | $X,XXX| DNA Wireless | Included | $X,XXX|
| SmartNet (various) | $X,XXX| DNA Support | $X,XXX/yr | $X,XXX|
| **Total 5-Year Legacy** | **$X,XXX** | | **$X,XXX** | **$X,XXX** |

---
