# Appendix D: IP Address Allocation

### Management Networks

| Network | Subnet | Purpose |
|---------|--------|---------|
| 10.252.0.0/16 | Management supernet | All management |
| 10.252.10.0/24 | DNAC Primary (NJ) | DNAC cluster |
| 10.252.11.0/24 | DNAC Cluster (NJ) | Inter-node |
| 10.252.12.0/24 | Device Management (NJ) | Switch OOB |
| 10.252.20.0/24 | DNAC DR (London) | DR cluster |
| 10.252.30.0/24 | ISE PAN | Administration |
| 10.252.31.0/24 | ISE PSN | Policy nodes |
| 10.252.40.0/24 | WLC Management | Controllers |
| 10.252.50.0/24 | Stealthwatch | Security analytics |
| 10.252.60.0/24 | ThousandEyes | Path analytics |

### Underlay Networks

| Network | Subnet | Purpose |
|---------|--------|---------|
| 10.250.0.0/16 | Loopback supernet | All RLOCs |
| 10.250.1.0/24 | Mumbai loopbacks | MUM fabric nodes |
| 10.250.2.0/24 | Chennai loopbacks | CHN fabric nodes |
| 10.250.16.0/24 | London loopbacks | LON fabric nodes |
| 10.250.17.0/24 | Frankfurt loopbacks | FRA fabric nodes |
| 10.250.32.0/24 | New Jersey loopbacks | NJ fabric nodes |
| 10.250.33.0/24 | Dallas loopbacks | DAL fabric nodes |
| 10.251.0.0/16 | P2P links supernet | All P2P links |

### Overlay Networks (VNs)

| VN Name | VNI | IP Range | SGTs |
|---------|-----|----------|------|
| VN_CORPORATE | 8001 | 10.100.0.0/16 | 10, 11, 15, 20, 30 |
| VN_GUEST | 8002 | 10.200.0.0/16 | 40 |
| VN_IOT | 8003 | 10.150.0.0/16 | 50, 60, 70 |
| VN_SERVERS | 8004 | 10.180.0.0/16 | 80, 90 |
| VN_VOICE | 8005 | 10.190.0.0/16 | 25 |

### Per-Site IP Pools

| Site | Corporate Pool | Guest Pool | IoT Pool | Voice Pool |
|------|----------------|------------|----------|------------|
| Mumbai | 10.100.1.0/24 | 10.200.1.0/24 | 10.150.1.0/24 | 10.190.1.0/24 |
| Chennai | 10.100.2.0/24 | 10.200.2.0/24 | 10.150.2.0/24 | 10.190.2.0/24 |
| London | 10.100.16.0/24 | 10.200.16.0/24 | 10.150.16.0/24 | 10.190.16.0/24 |
| Frankfurt | 10.100.17.0/24 | 10.200.17.0/24 | 10.150.17.0/24 | 10.190.17.0/24 |
| New Jersey | 10.100.32.0/24 | 10.200.32.0/24 | 10.150.32.0/24 | 10.190.32.0/24 |
| Dallas | 10.100.33.0/24 | 10.200.33.0/24 | 10.150.33.0/24 | 10.190.33.0/24 |

---
