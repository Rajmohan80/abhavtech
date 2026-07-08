# Site Infrastructure Inventory

<span class="ai-badge">AI-Assisted Documentation</span>

---

| Site | Device Type | Model | Quantity | Role | Port Count | Throughput (Gbps) | PoE Budget (W) | Cost per Unit ($) | Total Cost ($) | Capacity (Users/APs/Endpoints) | Utilization (%) | Headroom (%) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Mumbai | Border Node | C9500-24Y4C | 2 | Border + Fusion | 24x25G + 4x100G | 440 | N/A | $X,XXX | $X,XXX | N/A | 12.7% | 87.3% |
| Mumbai | Control Plane | C9500-24Y4C | 2 | LISP MS/MR | 24x25G + 4x100G | 440 | N/A | $X,XXX | $X,XXX | 48 edge nodes | 100% | 0% |
| Mumbai | Intermediate | C9500-24Y4C | 2 | Aggregation | 24x25G + 4x100G | 440 | N/A | $X,XXX | $X,XXX | 24 edge stacks | 50% | 50% |
| Mumbai | Edge Stack | C9300-48U | 48 | Access | 48x1G per switch | 96 per stack | 1440W per switch | $X,XXX | $X,XXX | 144 ports per stack | 78% | 22% |
| Mumbai | WLC | C9800-40 | 2 | Wireless Controller | N/A | 40 | N/A | $X,XXX | $X,XXX | 2000 APs / 64000 clients | 20% | 80% |
| Mumbai | Indoor AP | C9130AXI | 342 | Wi-Fi 6E Access | N/A | 5.4 | 30W PoE+ | $X,XXX | $X,XXX | 200 clients per AP | 50% | 50% |
| Mumbai | Outdoor AP | C9164I-E | 58 | Outdoor Wi-Fi 6E | N/A | 5.4 | 60W PoE++ | $X,XXX | $X,XXX | 100 clients per AP | 40% | 60% |
| Mumbai | ISE PAN | SNS-3695 | 1 | Policy Admin | N/A | N/A | N/A | $X,XXX | $X,XXX | Unlimited | N/A | N/A |
| Mumbai | ISE PSN | SNS-3655 | 2 | RADIUS/Policy | N/A | N/A | N/A | $X,XXX | $X,XXX | 100000 sessions | 8% | 92% |
| Mumbai | DNS/DHCP/IPAM | Infoblox IB-1420 | 2 | DDI Appliance | N/A | N/A | N/A | $X,XXX | $X,XXX | 20000 QPS / 200K leases | 3% | 97% |
| Mumbai | NTP Server | Meinberg M1000 | 2 | Stratum 2 NTP | N/A | N/A | N/A | $X,XXX | $X,XXX | 100000 clients | 21% | 79% |
| Mumbai | Firewall | Cisco FTD 4150 | 2 | Security | 8x10G + 2x40G | 70 | N/A | $X,XXX | $X,XXX | 70 Gbps | 40% | 60% |
| Mumbai | Total Site Cost |  |  |  |  |  |  |  |  | 1937000 |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |
| Chennai | Border Node | C9500-24Y4C | 2 | Border + Fusion | 24x25G + 4x100G | 440 | N/A | 35000 | 70000 | N/A | 6.4% | 93.6% |
| Chennai | Control Plane | C9500-24Y4C | 2 | LISP MS/MR | 24x25G + 4x100G | 440 | N/A | 35000 | 70000 | 18 edge stacks | 75% | 25% |
| Chennai | Intermediate | C9500-24Y4C | 2 | Aggregation | 24x25G + 4x100G | 440 | N/A | 35000 | 70000 | 18 edge stacks | 50% | 50% |
| Chennai | Edge Stack | C9300-48U | 54 | Access | 48x1G per switch | 96 per stack | 1440W per switch | 14000 | 756000 | 144 ports per stack | 62% | 38% |
| Chennai | WLC | C9800-40 | 2 | Wireless Controller | N/A | 40 | N/A | 50000 | 100000 | 2000 APs | 10% | 90% |
| Chennai | Indoor AP | C9130AXI | 170 | Wi-Fi 6E Access | N/A | 5.4 | 30W PoE+ | 1500 | 255000 | 200 clients per AP | 40% | 60% |
| Chennai | Outdoor AP | C9164I-E | 30 | Outdoor Wi-Fi 6E | N/A | 5.4 | 60W PoE++ | 2000 | 60000 | 100 clients per AP | 30% | 70% |
| Chennai | ISE PAN | SNS-3695 | 1 | Secondary PAN | N/A | N/A | N/A | 60000 | 60000 | Unlimited | N/A | N/A |
| Chennai | ISE PSN | SNS-3655 | 2 | RADIUS/Policy | N/A | N/A | N/A | 40000 | 80000 | 100000 sessions | 5% | 95% |
| Chennai | DNS/DHCP/IPAM | Infoblox IB-1420 | 2 | DDI Appliance | N/A | N/A | N/A | 25000 | 50000 | 20000 QPS | 2% | 98% |
| Chennai | NTP Server | Meinberg M300 | 1 | Stratum 3 NTP | N/A | N/A | N/A | 4000 | 4000 | 50000 clients | 15% | 85% |
| Chennai | Firewall | Cisco FTD 2130 | 2 | Security | 6x10G | 15 | N/A | 25000 | 50000 | 15 Gbps | 47% | 53% |
| Chennai | Total Site Cost |  |  |  |  |  |  |  |  | 1625000 |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |
| Noida | FIAB Core | C9300-48UXM | 2 | Border+CP+Edge | 48xmGig + 8x10G | 176 per stack | 1440W per switch | 18000 | 36000 | 100 APs / 192 ports | 40% | 60% |
| Noida | Fabric Edge | C9300-48U | 2 | Edge Access | 48x1G | 96 per stack | 1440W per switch | 14000 | 28000 | 96 ports per stack | 48% | 52% |
| Noida | Access Switch | C9200-48P | 4 | Traditional L2 | 48x1G | 48 | 740W | 8000 | 32000 | 48 ports | 60% | 40% |
| Noida | Embedded WLC | EWC License | 2 | Wireless (on FIAB) | N/A | N/A | N/A | 0 | 0 | 100 APs | 20% | 80% |
| Noida | Indoor AP | C9130AXI | 20 | Wi-Fi 6E Access | N/A | 5.4 | 30W PoE+ | 1500 | 30000 | 200 clients | 35% | 65% |
| Noida | Firewall | Cisco FTD 1150 | 2 | Security | 4x1G + 2x10G | 3 | N/A | 8000 | 16000 | 3 Gbps | 67% | 33% |
| Noida | Total Site Cost |  |  |  |  |  |  |  |  | 142000 |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |
| GLOBAL | DNAC Primary | DN2-HW-APL-XL | 3 | DNA Center (NJ) | 6x10G per node | N/A | N/A | 100000 | 300000 | 8000 devices / 200K endpoints | 8% | 92% |
| GLOBAL | DNAC DR | DN2-HW-APL-XL | 3 | DNA Center (London) | 6x10G per node | N/A | N/A | 100000 | 300000 | 8000 devices (standby) | N/A | N/A |
| GLOBAL | ISE MnT | SNS-3655 | 2 | Monitoring/Logging | N/A | N/A | N/A | 40000 | 80000 | 500GB logs/day | 30% | 70% |
|  |  |  |  |  |  |  |  |  |  |  |  |  |
| TOTALS |  |  |  |  |  |  |  |  |  | 4704000 |  |  |

---

*This data table was converted from CSV format for better readability.*
