# DNA Center & ISE Capacity Details

<span class="ai-badge">AI-Assisted Documentation</span>

---

| Component | Platform | Location | Role | CPU Cores | RAM (GB) | Storage (TB) | Managed Devices | Managed Endpoints | Max APs | LISP Sessions | RADIUS TPS | Profiling Endpoints | Current Load | Peak Load | Utilization % | Licensing | Annual Cost ($) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| DNAC Node 1 | DN2-HW-APL-XL | New Jersey | Primary Cluster Member | 56 | 512 | 12 | 8000 | 200000 | 16000 | N/A | N/A | N/A | 638 devices | 800 devices | 8% | DNA Advantage | $X,XXX |
| DNAC Node 2 | DN2-HW-APL-XL | New Jersey | Primary Cluster Member | 56 | 512 | 12 | 8000 | 200000 | 16000 | N/A | N/A | N/A | 638 devices | 800 devices | 8% | DNA Advantage | $X,XXX |
| DNAC Node 3 | DN2-HW-APL-XL | New Jersey | Primary Cluster Member | 56 | 512 | 12 | 8000 | 200000 | 16000 | N/A | N/A | N/A | 638 devices | 800 devices | 8% | DNA Advantage | $X,XXX |
| DNAC Node 4 | DN2-HW-APL-XL | London | DR Cluster Member | 56 | 512 | 12 | 8000 | 200000 | 16000 | N/A | N/A | N/A | 0 (standby) | 638 devices | 0% | DNA Advantage | $X,XXX |
| DNAC Node 5 | DN2-HW-APL-XL | London | DR Cluster Member | 56 | 512 | 12 | 8000 | 200000 | 16000 | N/A | N/A | N/A | 0 (standby) | 638 devices | 0% | DNA Advantage | $X,XXX |
| DNAC Node 6 | DN2-HW-APL-XL | London | DR Cluster Member | 56 | 512 | 12 | 8000 | 200000 | 16000 | N/A | N/A | N/A | 0 (standby) | 638 devices | 0% | DNA Advantage | $X,XXX |
| DNAC VIP | Virtual IP | New Jersey | Management Access | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | $X,XXX |
| DNAC Backup | NetBackup Appliance | New Jersey | Backup Target | N/A | N/A | 50 | N/A | N/A | N/A | N/A | N/A | N/A | Daily backup | Weekly full | N/A | N/A | 15000 |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ISE PAN Primary | SNS-3695 | Mumbai | Policy Admin Node | 32 | 256 | 2.4 | Unlimited | Unlimited | N/A | N/A | N/A | Unlimited | 12000 endpoints | 15000 endpoints | N/A | ISE Plus | 40000 |
| ISE PAN Secondary | SNS-3695 | Chennai | Secondary PAN | 32 | 256 | 2.4 | Unlimited | Unlimited | N/A | N/A | N/A | Unlimited | 0 (standby) | 12000 endpoints | N/A | ISE Plus | 40000 |
| ISE PSN Mumbai-1 | SNS-3655 | Mumbai | Policy Service | 24 | 128 | 600GB | N/A | 100000 | N/A | 50000 | 5000 | 50000 | 4000 sessions | 6000 sessions | 8% | ISE Plus | 20000 |
| ISE PSN Mumbai-2 | SNS-3655 | Mumbai | Policy Service | 24 | 128 | 600GB | N/A | 100000 | N/A | 50000 | 5000 | 50000 | 4000 sessions | 6000 sessions | 8% | ISE Plus | 20000 |
| ISE PSN Chennai-1 | SNS-3655 | Chennai | Policy Service | 24 | 128 | 600GB | N/A | 100000 | N/A | 50000 | 5000 | 50000 | 2000 sessions | 3000 sessions | 4% | ISE Plus | 20000 |
| ISE PSN Chennai-2 | SNS-3655 | Chennai | Policy Service | 24 | 128 | 600GB | N/A | 100000 | N/A | 50000 | 5000 | 50000 | 2000 sessions | 3000 sessions | 4% | ISE Plus | 20000 |
| ISE MnT Primary | SNS-3655 | Mumbai | Monitoring & Logging | 24 | 128 | 2.4 | N/A | N/A | N/A | N/A | N/A | N/A | 500GB logs/day | 800GB logs/day | 30% | ISE Plus | 20000 |
| ISE MnT Secondary | SNS-3655 | Chennai | Monitoring & Logging | 24 | 128 | 2.4 | N/A | N/A | N/A | N/A | N/A | N/A | 300GB logs/day | 500GB logs/day | 20% | ISE Plus | 20000 |
| ISE Backup | ISE Backup Server | Mumbai | Backup Repository | 8 | 32 | 10 | N/A | N/A | N/A | N/A | N/A | N/A | Daily config | Weekly DB | N/A | N/A | 5000 |
| ISE Load Balancer | F5 BIG-IP VE | Mumbai | PSN Load Balancing | 8 | 16 | 200GB | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | 25000 |
| ISE pxGrid | Integrated | Mumbai | Context Sharing | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Real-time | Real-time | N/A | Included | 0 |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Total DNAC CapEx |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 600000 |
| Total DNAC Annual OpEx |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 360000 |
| Total ISE CapEx |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 440000 |
| Total ISE Annual OpEx |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 180000 |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| DNAC Cluster Details |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Network Interfaces | Enterprise (VLAN 100) | Management (VLAN 101) | Cluster (VLAN 102) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Enterprise IP Range | 10.252.1.11-13 | 10.252.1.21-23 | 10.252.1.31-33 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| VIP Address | 10.252.1.10 | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Subnet Mask | 255.255.255.0 | 255.255.255.0 | 255.255.255.0 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Default Gateway | 10.252.1.1 | 10.252.1.1 | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| DNS Servers | 10.252.11.100 | 10.252.11.101 | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| NTP Servers | 10.252.11.130 | 10.252.11.131 | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ISE Deployment Details |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Node Groups | APAC-MUMBAI-PSN | APAC-CHENNAI-PSN | EMEA-PSN | AMERICAS-PSN |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Personas per Node | PAN (Admin + Monitoring) | PSN (Policy + Profiling) | MnT (Monitoring only) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RADIUS Shared Secret | Unique per site | Unique per device group |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| pxGrid Certificates | Mutual TLS | Signed by Enterprise CA |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Profiling | Enabled on all PSNs | CoA enabled |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Posture | Enabled | AnyConnect required |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Guest Portal | Sponsored Guest | Self-Registration |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

---

*This data table was converted from CSV format for better readability.*
