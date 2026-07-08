# AI Observability Implementation Guide

**Phase:** Phase 2 (20 Weeks) | **Companion to:** Document 2  
**Purpose:** Detailed implementation procedures, sizing, ordering, deployment, and real-world examples

---


## 1. SPLUNK PLATFORM - DETAILED IMPLEMENTATION

### 1.1 Sizing Methodology & Design Criteria

#### 1.1.1 Daily Ingestion Calculation

**Step 1: Calculate per-source data volume**

| Data Source | Event Rate | Avg Event Size | Daily Volume Calculation | Daily Volume |
|-------------|-----------|----------------|-------------------------|--------------|
| **DNAC (2 nodes)** | 100 events/sec | 800 bytes | 2 nodes × 100 eps × 800 bytes × 86,400 sec | 13.8 GB |
| **ISE (14 nodes)** | 200 events/sec | 600 bytes | 14 nodes × 200 eps × 600 bytes × 86,400 sec | 145 GB  to  sampled to 25 GB |
| **vManage (3 nodes)** | 50 events/sec | 700 bytes | 3 nodes × 50 eps × 700 bytes × 86,400 sec | 9.1 GB |
| **FTD (18 firewalls)** | 150 events/sec | 900 bytes | 18 FW × 150 eps × 900 bytes × 86,400 sec | 210 GB  to  sampled to 20 GB |
| **NetFlow** | N/A | 200 bytes/flow | 500K flows/day × 200 bytes | 30 GB |
| **AppDynamics** | 1000 transactions/min | 2 KB/txn | 1000 tpm × 2 KB × 1440 min | 2.8 GB |
| **ThousandEyes** | 25 tests × 1/min | 5 KB/result | 25 × 60 × 24 × 5 KB | 0.2 GB |
| **XDR Events** | 500 events/hour | 3 KB/event | 500 × 24 × 3 KB | 0.04 GB |

**Total Raw Volume:** ~400 GB/day  
**With Sampling/Filtering:** ~100 GB/day (average), 150 GB/day (peak)

**Conclusion:** License 150 GB/day with 50 GB/day buffer for growth

---

#### 1.1.2 Indexer Sizing Calculation

**Formula:** 
```
Indexer Count = (Daily Ingestion × Safety Factor) / (Indexer Capacity)
Where:
  Indexer Capacity = 200 GB/day (Splunk recommendation for 16-core indexer)
  Safety Factor = 1.5 (for headroom, failures, maintenance)
```

**Calculation:**
```
Required Indexers = (100 GB/day × 1.5) / 200 GB/day = 0.75  to  round up to 1
For HA (Replication Factor 3): 1 × 3 = 3 indexers minimum
```

**Final Design:** 3 indexers (meets RF=3, provides 600 GB/day capacity)

---

#### 1.1.3 Indexer Hardware Specification

**CPU Sizing:**

| Workload | CPU Requirement | Reason |
|----------|----------------|---------|
| Data Parsing | 4 cores | Real-time parsing of 100 GB/day |
| Indexing | 4 cores | Writing to disk, compression |
| Searching | 6 cores | Concurrent searches, MLTK models |
| OS/Overhead | 2 cores | System processes, monitoring |
| **Total** | **16 vCPU** | Industry best practice for 100-200 GB/day |

**Memory Sizing:**

| Component | Memory Requirement | Reason |
|-----------|-------------------|---------|
| Index Buckets (Hot) | 32 GB | In-memory bucket management |
| Search Memory | 16 GB | Concurrent search jobs |
| MLTK Models | 8 GB | ML model training/scoring |
| OS/Cache | 8 GB | Operating system, disk cache |
| **Total** | **64 GB RAM** | Standard for enterprise indexer |

**Storage Sizing:**

```
Storage Calculation per Indexer:
  Daily Ingestion per Indexer = 100 GB / 3 = 33 GB/day
  Hot Retention = 90 days
  Replication Factor = 3
  Compression Ratio = 0.5 (Splunk compresses ~50%)
  
  Raw Storage Needed = 33 GB/day × 90 days × 3 (RF) × 0.5 (compression) = 4,455 GB
  With 20% overhead = 4,455 × 1.2 = 5,346 GB ≈ 5.5 TB per indexer
  
  Total Storage (Hot Tier) = 5.5 TB × 3 indexers = 16.5 TB
```


#### 1.1.4 Cisco UCS Hardware Specifications

**Why Cisco UCS?**
- **Consistency:** Abhavtech is a Cisco shop (SD-Access, ISE, DNAC, vManage, ThousandEyes, AppDynamics, Webex)
- **Support:** Single vendor support for network + compute infrastructure
- **Integration:** Native integration with Cisco network fabric
- **Management:** Cisco IMC (Integrated Management Controller) for lights-out management

---

**Indexer Server Specification (Cisco UCS C240 M6):**

| Component | Specification | Part Number | Justification |
|-----------|--------------|-------------|---------------|
| **Model** | Cisco UCS C240 M6 | UCSC-C240-M6SX | 2U rack server, storage-optimized (24× 2.5" drive bays) |
| **CPU** | 2× Intel Xeon Silver 4316 | UCS-CPU-I6326 | 16 cores @ 2.3GHz per CPU = 32 cores total (16 vCPU with HT) |
| **Memory** | 64 GB DDR4-3200 | UCS-MR-X64G2RS-H | 8× 8GB modules, ECC, optimized for MLTK models |
| **Storage (Hot)** | 2× 1.9TB NVMe (RAID-1) | UCS-SD19T6KS4-E | NVMe for fast write performance (90-day hot data) |
| **Network** | Cisco VIC 1457 (Dual 25GbE) | UCSC-PCIE-C25Q-04 | Can run at 10GbE or 25GbE, PCIe adapter |
| **Management** | Cisco IMC | Built-in | Out-of-band management (IPMI, HTML5 KVM, remote power) |
| **Form Factor** | 2U | - | Allows for maximum drive density |
| **Power Supply** | Dual 1200W (redundant) | UCSC-PSU2V2-1200W | N+1 redundancy |

**Total per Indexer:** 2U height, ~500W power consumption

---

**Search Head Specification (Cisco UCS C220 M6):**

| Component | Specification | Part Number | Justification |
|-----------|--------------|-------------|---------------|
| **Model** | Cisco UCS C220 M6 | UCSC-C220-M6S | 1U rack server, compute-optimized |
| **CPU** | 2× Intel Xeon Silver 4316 | UCS-CPU-I6326 | 16 cores @ 2.3GHz per CPU = 32 cores total |
| **Memory** | 64 GB DDR4-3200 | UCS-MR-X64G2RS-H | 8× 8GB modules, ECC |
| **Storage** | 1× 480GB SSD | UCS-SD480GBKS4-E | Sufficient for apps, dashboards, lookup files |
| **Network** | Cisco VIC 1457 (Dual 25GbE) | UCSC-PCIE-C25Q-04 | Dual ports for management + search traffic |
| **Management** | Cisco IMC | Built-in | Remote management |
| **Form Factor** | 1U | - | Compact, efficient |
| **Power Supply** | Dual 770W (redundant) | UCSC-PSU1-770W | N+1 redundancy |

**Total per Search Head:** 1U height, ~400W power consumption

---

**Cluster Master Specification (Cisco UCS C220 M6):**

| Component | Specification | Part Number | Justification |
|-----------|--------------|-------------|---------------|
| **Model** | Cisco UCS C220 M6 | UCSC-C220-M6S | 1U rack server |
| **CPU** | 2× Intel Xeon Silver 4310 | UCS-CPU-I4310 | 8 cores @ 2.1GHz per CPU = 16 cores total (lighter workload) |
| **Memory** | 32 GB DDR4-3200 | UCS-MR-X32G2RS-H | 4× 8GB modules |
| **Storage** | 1× 240GB SSD | UCS-SD240GBKS4-E | Configuration management only |
| **Network** | Cisco VIC 1455 (Dual 10GbE) | UCSC-PCIE-C10Q-04 | 10GbE sufficient for cluster master |
| **Management** | Cisco IMC | Built-in | Remote management |
| **Form Factor** | 1U | - | Compact |
| **Power Supply** | Dual 770W (redundant) | UCSC-PSU1-770W | N+1 redundancy |

**Total:** 1U height, ~300W power consumption

---

**Cisco IMC Management:**

Each UCS server includes Cisco IMC (Integrated Management Controller) providing:
- **Remote Access:** HTML5 KVM-over-IP console
- **Power Management:** Remote power on/off/cycle
- **Monitoring:** Hardware health, temperature, fan speed, power consumption
- **Virtual Media:** Mount ISO images remotely for OS installation
- **IPMI Support:** Industry-standard IPMI 2.0 for automation
- **API Access:** RESTful API for automation and integration

**IMC Network Configuration:**

| Server | IMC IP | IMC Gateway | VLAN |
|--------|--------|-------------|------|
| splunk-idx-01 | 10.252.99.11/24 | 10.252.99.1 | VLAN 99 (OOB Mgmt) |
| splunk-idx-02 | 10.252.99.12/24 | 10.252.99.1 | VLAN 99 |
| splunk-idx-03 | 10.252.99.13/24 | 10.252.99.1 | VLAN 99 |
| splunk-sh-01 | 10.252.99.21/24 | 10.252.99.1 | VLAN 99 |
| splunk-sh-02 | 10.252.99.22/24 | 10.252.99.1 | VLAN 99 |
| splunk-sh-03 | 10.252.99.23/24 | 10.252.99.1 | VLAN 99 |
| splunk-cm-01 | 10.252.99.30/24 | 10.252.99.1 | VLAN 99 |

---

**Cisco VIC Configuration:**

Cisco VIC (Virtual Interface Card) provides flexible network connectivity:

- **VIC 1457 (25GbE):** Used for indexers and search heads
  - Port 0 (eth0): Management VLAN 100 (10.252.100.x)
  - Port 1 (eth1): Replication/Search VLAN 101/102 (10.252.101.x / 10.252.102.x)
  - Can operate at 10GbE or 25GbE (auto-negotiation)
  
- **VIC 1455 (10GbE):** Used for cluster master
  - Port 0 (eth0): Management VLAN 100
  - Port 1 (eth1): Backup/Admin access

**VIC Advantages:**
- No separate NIC required (integrated or PCIe)
- Cisco Fabric Extender (FEX) compatible
- QoS support (DSCP marking for Splunk replication traffic)
- Link aggregation (LACP) support

---


**Final Specification per Indexer:**

| Component | Specification | Justification |
|-----------|--------------|---------------|
| **CPU** | 16 vCPU (2.4 GHz or higher) | Parallel processing for parsing/indexing |
| **RAM** | 64 GB DDR4 ECC | MLTK models, concurrent searches |
| **Hot Storage** | 2 TB NVMe SSD (×2 RAID-1) | Fast write performance, 90-day hot data |
| **Network** | Dual 10 GbE (bonded) | Replication traffic, search results |
| **OS** | RHEL 8.x or Ubuntu 20.04 LTS | Splunk certified OS |

---

#### 1.1.4 Search Head Sizing

**Search Head Cluster (SHC) Requirements:**

| Factor | Requirement | Reason |
|--------|------------|---------|
| **Concurrent Users** | 50 users | NOC (15) + Engineering (20) + Security (10) + Exec (5) |
| **Concurrent Searches** | 25 searches | User searches + scheduled searches + dashboards |
| **Dashboard Complexity** | 10 panels avg | Real-time stats, charts, tables per dashboard |

**CPU Calculation:**
```
CPU per Search = 0.5 cores (light) to 2 cores (MLTK)
Average = 1 core per search
Required CPU = 25 searches × 1 core = 25 cores
Per SH (3-member cluster) = 25 / 3 ≈ 9 cores  to  spec 16 vCPU for headroom
```

**Memory Calculation:**
```
Memory per Search = 512 MB (light) to 2 GB (MLTK)
Average = 1 GB per search
Required Memory = 25 searches × 1 GB = 25 GB
Per SH = 25 GB / 3 ≈ 9 GB  to  spec 64 GB for headroom (same as indexer)
```

**Final SH Specification:**

| Component | Specification |
|-----------|--------------|
| CPU | 16 vCPU |
| RAM | 64 GB |
| Storage | 500 GB SSD (apps, dashboards, lookup files) |
| Network | Dual 10 GbE |

---

### 1.2 Procurement & Ordering Process

---

**HARDWARE PLATFORM DECISION: Cisco UCS**

**Rationale for Cisco UCS Selection:**

Abhavtech has selected **Cisco UCS (Unified Computing System)** as the hardware platform for Splunk deployment for the following strategic reasons:

1. **Cisco Ecosystem Alignment**
   - Existing infrastructure: SD-Access, ISE (14 nodes), DNAC (2 nodes), vManage, FTD, switches
   - Observability platforms: ThousandEyes (Cisco), AppDynamics (Cisco)
   - Collaboration: Webex Calling, WxCC
   - **Result:** Single vendor support, unified TAC case management

2. **Cisco HCL Compatibility**
   - Cisco UCS is on Splunk's Hardware Compatibility List (HCL)
   - Validated configurations for Splunk Enterprise
   - **Models Used:**
     - **UCS C240 M6** (2U) - Indexers (storage-optimized, 24× drive bays)
     - **UCS C220 M6** (1U) - Search Heads & Cluster Master (compute-optimized)

3. **Network Integration**
   - **Cisco VIC (Virtual Interface Card):** Tight integration with Cisco fabric
   - **FEX compatibility:** Can extend to Cisco Nexus fabric if needed
   - **QoS support:** Native DSCP marking for Splunk replication traffic

4. **Management Consistency**
   - **Cisco IMC:** Same management paradigm as other Cisco infrastructure
   - **API-driven:** Automation via Ansible, Python (same as network automation)
   - **Monitoring:** Integration with DNAC Assurance, ThousandEyes agents on same platform

5. **Support & Procurement**
   - **Single Cisco SmartNet contract** covering network + compute
   - **Unified support:** Network and server issues handled by same Cisco TAC
   - **Volume licensing:** Better pricing through consolidated Cisco EA (Enterprise Agreement)

**Alternative Considered:** Dell PowerEdge (EMC/Dell)
- **Pros:** Industry-standard, competitive pricing, broad Splunk HCL support
- **Cons:** Multi-vendor support complexity, separate Dell/Cisco contracts, different management tools
- **Decision:** Cisco UCS chosen for ecosystem consistency

---


---

## PRICING DISCLAIMER

**IMPORTANT:** All pricing information in this document is for **ILLUSTRATIVE PURPOSES ONLY** and should not be used for budget planning or procurement decisions. 

**Key Points:**
- Prices shown are example values to demonstrate cost structure and procurement methodology
- Actual pricing varies based on:
  - Vendor negotiations and enterprise agreements
  - Regional pricing differences
  - Volume discounts and multi-year commitments
  - Current market conditions and supply chain factors
  - Licensing model changes (subscription vs perpetual)
  - Currency exchange rates (for international purchases)
- **Action Required:** Contact vendors directly for current pricing quotes before procurement
- **Vendors:**
  - Splunk: Contact your Splunk account executive or visit splunk.com/pricing
  - Cisco (ThousandEyes, AppDynamics): Contact Cisco partner or cisco.com
  - Hardware (Cisco, etc.): Contact reseller or manufacturer for current pricing

**Recommendation:** Use this document's sizing methodology and technical specifications to create RFP/RFQ documents, then obtain current pricing from vendors.

---


#### 1.2.1 Bill of Materials (BOM)

**Splunk Software Licensing:**

| Item | Quantity | Unit Price | Total | Notes |
|------|----------|-----------|-------|-------|
| Splunk Enterprise License | 150 GB/day | [VENDOR_QUOTE]/GB/year | [VENDOR_QUOTE] | 3-year commit for discount |
| Splunk MLTK Add-on | 1 license | [VENDOR_QUOTE] | [VENDOR_QUOTE] | AI/ML capabilities |
| Splunk Professional Services | 80 hours | [VENDOR_QUOTE]/hour | [VENDOR_QUOTE] | Implementation support |
| **Subtotal Software** | | | **[VENDOR_QUOTE]** | |

**Hardware (New Jersey Primary Site):**

| Component | Quantity | Unit Price | Total | Vendor |
|-----------|----------|-----------|-------|--------|
| **Indexer Servers** | | | | |
| Cisco UCS C240 M6 (16 vCPU, 64GB RAM) | 3 | [VENDOR_QUOTE] | [VENDOR_QUOTE] | Cisco |
| Cisco NVMe 1.9TB (UCS-SD19T6KS4-E) (×2 per server for RAID-1) | 6 | [VENDOR_QUOTE] | [VENDOR_QUOTE] | Cisco UCS-SD19T6KS4-E (1.9TB NVMe) |
| Cisco VIC (Dual 10/25GbE) | 3 | [VENDOR_QUOTE] | [VENDOR_QUOTE] | Cisco VIC 1457 |
| **Search Head Servers** | | | | |
| Cisco UCS C220 M6 (16 vCPU, 64GB RAM) | 3 | [VENDOR_QUOTE] | [VENDOR_QUOTE] | Cisco |
| Cisco SSD 480GB (UCS-SD480GBKS4-E) | 3 | [VENDOR_QUOTE] | [VENDOR_QUOTE] | Cisco UCS-SD480GBKS4-E (480GB SSD) |
| Cisco VIC (Dual 10/25GbE) | 3 | [VENDOR_QUOTE] | [VENDOR_QUOTE] | Cisco VIC 1457 |
| **Cluster Master** | | | | |
| Cisco UCS C220 M6 (8 vCPU, 32GB RAM) | 1 | [VENDOR_QUOTE] | [VENDOR_QUOTE] | Cisco |
| Cisco SSD 240GB (UCS-SD240GBKS4-E) | 1 | [VENDOR_QUOTE] | [VENDOR_QUOTE] | Cisco UCS-SD480GBKS4-E (480GB SSD) |
| Cisco VIC (Dual 10/25GbE) | 1 | [VENDOR_QUOTE] | [VENDOR_QUOTE] | Cisco VIC 1457 |
| **Rack & Power** | | | | |
| 42U Server Rack | 1 | [VENDOR_QUOTE] | [VENDOR_QUOTE] | APC NetShelter |
| PDU (20A, 208V) | 2 | [VENDOR_QUOTE] | [VENDOR_QUOTE] | APC Metered Rack PDU |
| **Subtotal Hardware (NJ)** | | | **[VENDOR_QUOTE]** | |

**Hardware (London DR Site):**

| Component | Quantity | Total | Notes |
|-----------|----------|-------|-------|
| Indexer Servers (same spec as NJ) | 3 | [VENDOR_QUOTE] | Mirror of NJ |
| Cisco NVMe 1.9TB (UCS-SD19T6KS4-E) (×2 per server) | 6 | [VENDOR_QUOTE] | |
| Cisco VIC (Dual 10/25GbE) | 3 | [VENDOR_QUOTE] | |
| **Subtotal Hardware (London)** | | **[VENDOR_QUOTE]** | |

**Total Infrastructure Cost:**

| Category | Amount |
|----------|--------|
| Software (Year 1) | $96,500 |
| Hardware (NJ) | [VENDOR_QUOTE] |
| Hardware (London) | [VENDOR_QUOTE] |
| **Total Initial Investment** | **[TOTAL_CAPEX - Contact Vendors]** |
| **Recurring Annual (Software)** | **[ANNUAL_OPEX - Contact Vendors]** |

---

#### 1.2.2 Procurement Timeline

**Week -8 to Week 0 (Pre-Implementation):**

| Week | Activity | Owner | Deliverable |
|------|----------|-------|-------------|
| -8 | Create RFP for Splunk licensing | Procurement | RFP document |
| -7 | Review Splunk proposals | IT Director | Vendor shortlist |
| -6 | **Award Splunk license contract** | CFO | Signed PO |
| -5 | Order hardware (Cisco servers, NICs, storage) | IT Ops | POs submitted |
| -4 | Splunk license key delivery | Splunk Rep | License file (.lic) |
| -3 | Hardware delivery to NJ datacenter | Cisco | Servers on-site |
| -2 | Hardware delivery to London datacenter | Cisco | Servers on-site |
| -1 | Rack hardware, cable, power on | Datacenter Team | Racked and powered |
| 0 | **Phase 2A Week 1 begins** | Splunk Team | Ready for installation |

**Purchase Orders (POs):**

**PO-2025-001: Splunk Licensing**
```
Vendor: Splunk Inc.
Description: Splunk Enterprise 150 GB/day + MLTK
Amount: [VENDOR_QUOTE] (Year 1), [ANNUAL_OPEX - Contact Vendors] (Year 2-3)
Payment Terms: Net 30
Delivery: License key via email within 48 hours
```

**PO-2025-002: Hardware (NJ Site)**
```
Vendor: Cisco Systems, Inc.
Description: Cisco UCS servers: 3× C240 M6 (indexers), 3× C220 M6 (search heads), 1× C220 M6 (cluster master) + NVMe/SSD storage + VIC adapters
Amount: [VENDOR_QUOTE]
Payment Terms: Net 45
Delivery: 3 weeks ARO
Ship To: Abhavtech NJ Datacenter, 123 Main St, Newark, NJ 07102
```

**PO-2025-003: Hardware (London Site)**
```
Vendor: Cisco Systems International B.V. (UK)
Description: Cisco UCS servers: 3× C240 M6 (indexers) + NVMe storage + VIC adapters
Amount: [VENDOR_QUOTE in local currency] (~[VENDOR_QUOTE])
Payment Terms: Net 45
Delivery: 3 weeks ARO
Ship To: Abhavtech London Datacenter, 456 Thames St, London EC1A 1AB
```

---

### 1.3 Physical Infrastructure Design

#### 1.3.1 Rack Layout (New Jersey Primary Site)

**Rack: NJ-DC-RACK-42 (42U APC NetShelter)**

```
Position  Device                      Type          Power (W)  Notes
────────────────────────────────────────────────────────────────────────
U42      [Blank]                     -             -          Top of rack
U41      Cable Management            -             -          
U40      splunk-idx-01               Indexer       450W       10.252.100.11
U39      splunk-idx-01 (rear)        -             -          Cable mgmt
U38      Cable Management            -             -          
U37      splunk-idx-02               Indexer       450W       10.252.100.12
U36      splunk-idx-02 (rear)        -             -          
U35      Cable Management            -             -          
U34      splunk-idx-03               Indexer       450W       10.252.100.13
U33      splunk-idx-03 (rear)        -             -          
U32      Cable Management            -             -          
U31      [Blank]                     -             -          Airflow gap
U30      splunk-sh-01                Search Head   350W       10.252.100.21
U29      splunk-sh-01 (rear)         -             -          
U28      Cable Management            -             -          
U27      splunk-sh-02                Search Head   350W       10.252.100.22
U26      splunk-sh-02 (rear)         -             -          
U25      Cable Management            -             -          
U24      splunk-sh-03                Search Head   350W       10.252.100.23
U23      splunk-sh-03 (rear)         -             -          
U22      Cable Management            -             -          
U21      [Blank]                     -             -          Airflow gap
U20      splunk-cm-01                Cluster Master 250W      10.252.100.30
U19      splunk-cm-01 (rear)         -             -          
U18      Cable Management            -             -          
U17-U3   [Reserved for expansion]    -             -          
U2       APC PDU #1 (Primary)        PDU           -          20A 208V
U1       APC PDU #2 (Redundant)      PDU           -          20A 208V
────────────────────────────────────────────────────────────────────────

Total Power Consumption: 2,650W (peak)
Power Budget per PDU: 4,160W (20A × 208V)
Utilization: 64% (healthy - <80% recommended)
```

---

#### 1.3.2 Network Connectivity

**Network Design:**

```
                            ┌─────────────────────────────────────┐
                            │  Core Switch (Catalyst 9500)        │
                            │  VLAN 100: Splunk Management        │
                            │  VLAN 101: Splunk Replication       │
                            │  VLAN 102: Splunk Search            │
                            └──────────────┬──────────────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    │                                              │
         ┌──────────▼──────────┐                       ┌──────────▼──────────┐
         │  10GbE Switch #1    │                       │  10GbE Switch #2    │
         │  (Indexer Network)  │                       │  (Search Network)   │
         └──────────┬──────────┘                       └──────────┬──────────┘
                    │                                              │
        ┌───────────┼───────────┬───────────┐          ┌──────────┼──────────┬──────────┐
        │           │           │           │          │          │          │          │
   ┌────▼───┐  ┌───▼────┐  ┌───▼────┐  ┌──▼─────┐  ┌─▼──────┐ ┌─▼──────┐ ┌─▼──────┐ ┌─▼──────┐
   │ IDX-01 │  │ IDX-02 │  │ IDX-03 │  │   CM   │  │  SH-01 │ │  SH-02 │ │  SH-03 │ │Deployer│
   └────────┘  └────────┘  └────────┘  └────────┘  └────────┘ └────────┘ └────────┘ └────────┘
```

**Interface Assignments:**

| Server | Interface | VLAN | IP Address | Purpose |
|--------|-----------|------|----------|---------|
| splunk-idx-01 | eth0 | 100 | 10.252.100.11 | Management |
| splunk-idx-01 | eth1 | 101 | 10.252.101.11 | Replication (to idx-02, idx-03, London) |
| splunk-idx-02 | eth0 | 100 | 10.252.100.12 | Management |
| splunk-idx-02 | eth1 | 101 | 10.252.101.12 | Replication |
| splunk-idx-03 | eth0 | 100 | 10.252.100.13 | Management |
| splunk-idx-03 | eth1 | 101 | 10.252.101.13 | Replication |
| splunk-sh-01 | eth0 | 100 | 10.252.100.21 | Management |
| splunk-sh-01 | eth1 | 102 | 10.252.102.21 | Search (queries to indexers) |
| splunk-sh-02 | eth0 | 100 | 10.252.100.22 | Management |
| splunk-sh-02 | eth1 | 102 | 10.252.102.22 | Search |
| splunk-sh-03 | eth0 | 100 | 10.252.100.23 | Management |
| splunk-sh-03 | eth1 | 102 | 10.252.102.23 | Search |
| splunk-cm-01 | eth0 | 100 | 10.252.100.30 | Management |

**Bandwidth Planning:**

| Traffic Type | Expected Throughput | Interface | Notes |
|--------------|-------------------|-----------|-------|
| Data Ingestion | 1.5 GB/day ÷ 86,400 sec = 17 MB/sec ≈ 140 Mbps | eth0 (Management) | Light load |
| Replication (RF=3) | 140 Mbps × 2 (to 2 other indexers) = 280 Mbps | eth1 (Replication) | Moderate load |
| Search Results | 500 MB avg × 25 searches/hour = 3.5 Mbps avg | eth1 (Search Network) | Bursty |
| Multisite Replication | 140 Mbps to London | eth1 via WAN | Async replication |

**Result:** 10 GbE interfaces are appropriately sized (only ~3% utilization under normal load, room for bursts)

---

### 1.4 Cluster Deployment Procedures

#### 1.4.1 OS Installation & Preparation

**Phase 2A Week 1 Day 1-2: Operating System Setup**

**Step 1: Install RHEL 8.x on all 7 servers**

```bash
# Boot from RHEL 8.6 ISO
# Installation options:
# - Minimal Install
# - Network: eth0 static IP (from table above)
# - Disk: Use entire disk, LVM
# - Timezone: America/New_York (NJ site)
# - Root password: [secure password in CyberArk]

# Post-installation (run on each server):
hostnamectl set-hostname splunk-idx-01.abhavtech.local  # (adjust per server)

# Update OS
yum update -y

# Disable SELinux (Splunk recommendation)
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config
setenforce 0

# Disable firewalld (will use network firewalls)
systemctl stop firewalld
systemctl disable firewalld

# Configure NTP (critical for clustering)
yum install -y chrony
cat > /etc/chrony.conf << 'EOF'
server 10.252.1.50 iburst  # Abhavtech NTP server (GPS stratum-1)
driftfile /var/lib/chrony/drift
makestep 1.0 3
rtcsync
EOF

systemctl enable chronyd
systemctl start chronyd
chronyc tracking  # Verify sync

# Verify time synchronization across all servers
# CRITICAL: All servers must be within 1 second of each other
date; ssh splunk-idx-02 date; ssh splunk-idx-03 date
```

**Step 2: Configure storage**

```bash
# On indexer servers only (splunk-idx-01, idx-02, idx-03):

# Verify NVMe drives detected
lsblk
# Expected output:
# nvme0n1    259:0    0   2T  0 disk
# nvme1n1    259:1    0   2T  0 disk

# Create RAID-1 using mdadm
yum install -y mdadm

mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/nvme0n1 /dev/nvme1n1
mdadm --detail /dev/md0  # Verify RAID status

# Create filesystem (XFS recommended for Splunk)
mkfs.xfs -f -L SPLUNK_HOT /dev/md0

# Mount
mkdir -p /opt/splunk/var/lib/splunk
echo "/dev/md0  /opt/splunk/var/lib/splunk  xfs  defaults,noatime  0 0" >> /etc/fstab
mount -a
df -h  # Verify mount

# Set permissions
chmod 755 /opt/splunk/var/lib/splunk
```

**Step 3: Create splunk user**

```bash
# On all servers:
groupadd -g 1001 splunk
useradd -u 1001 -g splunk -d /opt/splunk -s /bin/bash splunk
echo "splunk ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers.d/splunk
```

---

#### 1.4.2 Splunk Enterprise Installation

**Phase 2A Week 1 Day 3-4: Splunk Software Deployment**

**Step 1: Download Splunk Enterprise**

```bash
# On splunk-idx-01 (will distribute to other servers):
cd /tmp
wget -O splunk-9.1.2-linux-x86_64.tgz \
  'https://download.splunk.com/products/splunk/releases/9.1.2/linux/splunk-9.1.2-b5a0a8c82d6f-linux-x86_64.tgz'

# Verify checksum
sha256sum splunk-9.1.2-linux-x86_64.tgz
# Compare with Splunk's published checksum
```

**Step 2: Install Splunk on all servers**

```bash
# On each server:
cd /opt
tar xzf /tmp/splunk-9.1.2-linux-x86_64.tgz
chown -R splunk:splunk /opt/splunk

# Start Splunk to accept license (interactive)
su - splunk
cd /opt/splunk/bin
./splunk start --accept-license --answer-yes --no-prompt --seed-passwd 'TempPassword123!'

# IMPORTANT: Splunk is now running on default port 8000
# Access via browser: http://10.252.100.11:8000
# Login: admin / TempPassword123!
# IMMEDIATELY change password via UI  to  Settings  to  Access Controls  to  Users  to  admin  to  Edit
```

**Step 3: Enable boot-start**

```bash
# On each server (as root):
/opt/splunk/bin/splunk enable boot-start -user splunk -systemd-managed 1

# This creates systemd unit file:
# /etc/systemd/system/Splunkd.service
systemctl daemon-reload
systemctl enable Splunkd
systemctl status Splunkd
```

---

#### 1.4.3 Indexer Cluster Configuration

**Phase 2A Week 1 Day 5 - Week 2 Day 1: Cluster Setup**

**Step 1: Configure Cluster Master**

```bash
# On splunk-cm-01:
su - splunk
cd /opt/splunk/bin

# Initialize as cluster master
./splunk edit cluster-config -mode master \
  -replication_factor 3 \
  -search_factor 2 \
  -secret 'AbhavClusterSecret2025!' \
  -cluster_label production

# Restart Splunk to apply
./splunk restart

# Verify cluster master initialized
./splunk show cluster-master-info
# Expected output:
#   cluster_label : production
#   mode : master
#   replication_factor : 3
#   search_factor : 2
```

**Step 2: Configure Indexers to join cluster**

```bash
# On splunk-idx-01:
su - splunk
cd /opt/splunk/bin

./splunk edit cluster-config -mode peer \
  -master_uri https://10.252.100.30:8089 \
  -secret 'AbhavClusterSecret2025!' \
  -replication_port 9887

./splunk restart

# Repeat on splunk-idx-02 and splunk-idx-03
```

**Step 3: Verify cluster formation**

```bash
# On splunk-cm-01:
su - splunk
/opt/splunk/bin/splunk list cluster-peers

# Expected output:
# peer1: splunk-idx-01 (10.252.100.11) - status: Up
# peer2: splunk-idx-02 (10.252.100.12) - status: Up
# peer3: splunk-idx-03 (10.252.100.13) - status: Up

# Check cluster health via UI:
# http://10.252.100.30:8000 (Cluster Master)
# Settings  to  Indexer Clustering
# Should show: 3 peers, Replication factor: 3, Search factor: 2, Status: Green
```

---

#### 1.4.4 Search Head Cluster Configuration

**Phase 2A Week 2 Day 2-3: SHC Setup**

**Step 1: Initialize Search Head Cluster**

```bash
# On splunk-sh-01 (will become captain):
su - splunk
cd /opt/splunk/bin

./splunk init shcluster-config \
  -auth admin:NewSecurePassword123! \
  -mgmt_uri https://10.252.100.21:8089 \
  -replication_port 9900 \
  -replication_factor 3 \
  -conf_deploy_fetch_url https://10.252.100.40:8089 \
  -secret 'AbhavSHCSecret2025!' \
  -shcluster_label production-shc

./splunk restart

# Bootstrap as captain
./splunk bootstrap shcluster-captain \
  -servers_list "https://10.252.100.21:8089,https://10.252.100.22:8089,https://10.252.100.23:8089" \
  -auth admin:NewSecurePassword123!
```

**Step 2: Add remaining search heads**

```bash
# On splunk-sh-02:
su - splunk
cd /opt/splunk/bin

./splunk init shcluster-config \
  -auth admin:NewSecurePassword123! \
  -mgmt_uri https://10.252.100.22:8089 \
  -replication_port 9900 \
  -replication_factor 3 \
  -conf_deploy_fetch_url https://10.252.100.40:8089 \
  -secret 'AbhavSHCSecret2025!' \
  -shcluster_label production-shc

./splunk restart

# Repeat on splunk-sh-03 (change mgmt_uri to 10.252.100.23:8089)
```

**Step 3: Verify SHC formation**

```bash
# On any search head:
/opt/splunk/bin/splunk show shcluster-status

# Expected output:
# Captain: splunk-sh-01 (10.252.100.21)
# Members:
#   splunk-sh-01 (10.252.100.21) - status: Up, captain
#   splunk-sh-02 (10.252.100.22) - status: Up
#   splunk-sh-03 (10.252.100.23) - status: Up
# Replication factor: 3
# Status: Green
```

---

**I'll continue this document with ThousandEyes, AppDynamics, and real-world scenarios. Should I proceed?**


### 1.5 Real-World Log Examples

#### 1.5.1 Sample DNAC Syslog Event

**Raw Log Entry:**

```
<189>Jan 17 14:32:15 dnac-primary.abhavtech.local %DNAC-6-CLIENT_HEALTH_CHANGE: Client health changed for MAC 00:50:56:AB:CD:EF, SSID: Corporate-WiFi, AP: AP-Floor3-West-01, Health Score: 85->45 (Poor), Reason: Low RSSI (-75dBm), VLAN: 10, IP: 10.252.2.45, Username: john.doe@abhavtech.com
```

**Parsed in Splunk:**

```spl
index=network_infra sourcetype=cisco:dnac:client_health
| table _time, client_mac, ssid, ap_name, health_score_before, health_score_after, health_status, rssi, vlan, client_ip, username
```

**Output:**

| _time | client_mac | ssid | ap_name | health_score_before | health_score_after | health_status | rssi | vlan | client_ip | username |
|-------|------------|------|---------|---------------------|-------------------|---------------|------|------|-----------|----------|
| 2025-01-17 14:32:15 | 00:50:56:AB:CD:EF | Corporate-WiFi | AP-Floor3-West-01 | 85 | 45 | Poor | -75 | 10 | 10.252.2.45 | john.doe@abhavtech.com |

---

#### 1.5.2 Sample ISE Authentication Log

**Raw Syslog:**

```
<166>Jan 17 14:32:10 ise-psn-01.abhavtech.local CISE_RADIUS_Accounting 0000 1 0 2025-01-17 14:32:10.234 +05:30 0012345678 3002 NOTICE Radius-Accounting: RADIUS Accounting watchdog update, ConfigVersionId=123, Device IP Address=10.252.10.1, DestinationIPAddress=10.252.5.11, DestinationPort=1813, UserName=john.doe@abhavtech.com, NAS-IP-Address=10.252.10.1, NAS-Port=50101, Framed-IP-Address=10.252.2.45, Calling-Station-ID=00-50-56-AB-CD-EF, Called-Station-ID=E8-84-A5-12-34-56:Corporate-WiFi, NetworkDeviceName=SW-Floor3-IDF-01, User-Name=john.doe@abhavtech.com, IdentityGroup=Employees, EapAuthentication=EAP-TLS, AuthorizationPolicyMatchedRule=Employee-Wireless-Policy, SelectedAuthorizationProfiles=EMPLOYEE_PROFILE, AuthenticationMethod=dot1x, AuthenticationProtocol=EAP-TLS, ServiceType=Framed, NetworkDeviceGroups=Location#All Locations#Mumbai#Floor3, NetworkDeviceGroups=Device Type#All Device Types#Access Switches
```

**Parsed in Splunk:**

| Field | Value |
|-------|-------|
| _time | 2025-01-17 14:32:10 |
| username | john.doe@abhavtech.com |
| client_ip (Framed-IP-Address) | 10.252.2.45 |
| client_mac (Calling-Station-ID) | 00:50:56:AB:CD:EF |
| switch_ip (NAS-IP-Address) | 10.252.10.1 |
| ssid | Corporate-WiFi |
| identity_group | Employees |
| auth_method | EAP-TLS |
| authorization_profile | EMPLOYEE_PROFILE |
| device_location | Mumbai#Floor3 |

---

## 2. THOUSANDEYES - DETAILED IMPLEMENTATION

### 2.1 Agent Deployment Step-by-Step

#### 2.1.1 Agent VM Provisioning

**Phase 2B Week 7 Day 1-2: VM Creation**

**Step 1: Create VM in vSphere (Mumbai HQ example)**

```bash
# VMware vSphere Web UI or CLI (govc):

# Create VM
govc vm.create \
  -m=4096 \
  -c=2 \
  -on=false \
  -net="VLAN-100-Management" \
  -g=ubuntu64Guest \
  -ds=NVMe-Datastore-01 \
  thousandeyes-mumbai

# Add disk
govc vm.disk.create -vm thousandeyes-mumbai -name disk1 -size 50G

# Power on
govc vm.power -on thousandeyes-mumbai

# Alternative: Manual vSphere UI creation
# Datacenter  to  VMs and Templates  to  Right-click  to  New Virtual Machine
#   Name: thousandeyes-mumbai
#   Compute Resource: Cluster-Mumbai
#   Storage: NVMe-Datastore-01
#   Guest OS: Ubuntu Linux (64-bit)
#   CPU: 2 vCPU
#   Memory: 4096 MB
#   Network: VLAN-100-Management
#   Disk: 50 GB (Thin Provision)
```

**Step 2: Install Ubuntu 20.04 LTS**

```bash
# Boot from Ubuntu 20.04 ISO
# Installation wizard:
#   Language: English
#   Keyboard: US
#   Network: Configure static IP
#     - IP: 10.252.1.100/24
#     - Gateway: 10.252.1.1
#     - DNS: 10.252.1.50, 10.252.1.51
#   Storage: Use entire disk (50GB)
#   Profile:
#     - Name: ThousandEyes Admin
#     - Server name: te-mumbai-agent
#     - Username: teadmin
#     - Password: [secure password]
#   SSH: Install OpenSSH server (enable)
#   Packages: None (will install Docker manually)

# After installation, login and update
sudo apt update && sudo apt upgrade -y
```

---

#### 2.1.2 Docker Installation

**Phase 2B Week 7 Day 2: Docker Setup**

```bash
# Install Docker (ThousandEyes agent runs as Docker container)
sudo apt install -y ca-certificates curl gnupg lsb-release

# Add Docker GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify Docker installation
sudo docker run hello-world
# Expected: "Hello from Docker!" message

# Enable Docker to start on boot
sudo systemctl enable docker
sudo systemctl status docker
```

---

#### 2.1.3 ThousandEyes Agent Installation

**Phase 2B Week 7 Day 3: Agent Deployment**

**Step 1: Obtain Account Group Token**

```
# ThousandEyes Portal (https://app.thousandeyes.com)
# Login  to  Account Settings  to  Account Group  to  Agents  to  Enterprise Agents  to  Add New Agent
# Select: Docker
# Copy installation command (contains unique account token)

# Example token: 1234567890abcdef1234567890abcdef
```

**Step 2: Install ThousandEyes Agent Container**

```bash
# On te-mumbai-agent:
sudo docker run \
  --hostname='mumbai-hq-agent' \
  --name='te-agent' \
  --restart=unless-stopped \
  --detach \
  --tty \
  --cap-add=NET_ADMIN \
  --cap-add=SYS_ADMIN \
  --shm-size=512M \
  -e TEAGENT_ACCOUNT_TOKEN=1234567890abcdef1234567890abcdef \
  -e TEAGENT_INET=4 \
  -v /var/thousandeyes:/var/lib/te-agent \
  thousandeyes/enterprise-agent:latest

# Verify container is running
sudo docker ps
# Expected output:
# CONTAINER ID   IMAGE                                  STATUS        NAMES
# a1b2c3d4e5f6   thousandeyes/enterprise-agent:latest   Up 30 seconds te-agent

# Check agent logs
sudo docker logs te-agent
# Expected: "Agent successfully registered with account group"
```

**Step 3: Verify Agent Registration in Portal**

```
# ThousandEyes Portal  to  Cloud & Enterprise Agents  to  Enterprise Agents
# Should see: "mumbai-hq-agent" with status "Online" (green checkmark)
# Location: Mumbai, India (detected via GeoIP)
# Public IP: [Abhavtech Mumbai public IP]
# Last Contact: Just now
```

**Step 4: Assign Agent to Tests**

```
# ThousandEyes Portal  to  Tests  to  [Select existing test or create new]
# Agents  to  Add Agent  to  Select "mumbai-hq-agent"
# Save Changes
```

---

**Repeat for remaining 5 agents:**

| Agent Hostname | VM Name | IP Address | Location |
|----------------|---------|-----------|----------|
| chennai-agent | te-chennai-agent | 10.253.1.100 | Chennai, India |
| london-hq-agent | te-london-agent | 10.254.1.100 | London, UK |
| frankfurt-agent | te-frankfurt-agent | 10.255.1.100 | Frankfurt, Germany |
| nj-hq-agent | te-nj-agent | 10.252.100.100 | New Jersey, USA |
| dallas-agent | te-dallas-agent | 10.256.1.100 | Dallas, USA |

---

### 2.2 Test Configuration Walkthroughs

#### 2.2.1 MPLS Agent-to-Agent Test Configuration

**Phase 2B Week 8 Day 1: MPLS Path Visibility**

**Step 1: Create Agent-to-Agent Test (Mumbai  to  London)**

```
# ThousandEyes Portal  to  Tests  to  Add New Test
# Test Type: Agent to Agent
# Test Name: MPLS-Mumbai-to-London

# BASIC CONFIGURATION:
  Test Name: MPLS-Mumbai-to-London
  Interval: 1 minute
  
# AGENT SELECTION:
  Source Agent: mumbai-hq-agent
  Target Agent: london-hq-agent
  
# PROTOCOL:
  Protocol: TCP
  Port: 49153 (default agent-to-agent port)
  
# METRICS:
  ☑ Enable Network Measurements
  ☑ Enable End-to-End Metrics
  ☑ Enable Path Trace
  ☑ Enable BGP Monitoring
  
# ADVANCED SETTINGS:
  Direction: Both (bidirectional test)
  MTU: 1500 bytes
  DSCP: 0 (Best Effort) - for baseline testing
  
# ALERTS:
  ☑ Enable Alerts
  Alert Rules:
    - Loss >= 1% for 2 consecutive rounds
    - Latency >= 100ms for 2 consecutive rounds
    - Jitter >= 10ms for 2 consecutive rounds
```

**Step 2: Save and Verify Test**

```
# Save Test
# ThousandEyes will immediately start running test from mumbai-hq-agent to london-hq-agent

# Wait 2-3 minutes, then view results:
# Tests  to  MPLS-Mumbai-to-London  to  Views

# Expected Results (healthy MPLS):
#   Latency: 95-105ms (Mumbai to London via MPLS)
#   Loss: 0%
#   Jitter: <5ms
#   Path: Mumbai  to  ISP1 Router  to  MPLS Core  to  ISP2 Router  to  London
```

---

#### 2.2.2 SaaS Monitoring Test Configuration

**Phase 2B Week 8 Day 2: Office 365 Monitoring**

**Step 1: Create HTTP Server Test**

```
# ThousandEyes Portal  to  Tests  to  Add New Test
# Test Type: HTTP Server

# BASIC CONFIGURATION:
  Test Name: Office365-Exchange-Global
  URL: https://outlook.office365.com
  Interval: 2 minutes
  
# AGENT SELECTION:
  ☑ mumbai-hq-agent
  ☑ chennai-agent
  ☑ london-hq-agent
  ☑ frankfurt-agent
  ☑ nj-hq-agent
  ☑ dallas-agent
  
# HTTP REQUEST:
  Method: GET
  Follow Redirects: Yes
  Verify SSL: Yes
  
# RESPONSE VALIDATION:
  Expected HTTP Status: 200
  Response Matches Regex: (Outlook|Microsoft) (optional validation)
  
# ADVANCED:
  Timeout: 5 seconds
  Custom Headers: None
  
# ALERTS:
  ☑ Enable Alerts
  Alert Rules:
    - Response Time >= 500ms for 2 consecutive rounds
    - Availability < 99.5% (calculated over 1 hour)
    - Server Error (HTTP 5xx) for any round
```

**Step 2: Review Results**

```
# After 10 minutes, view results:
# Tests  to  Office365-Exchange-Global  to  Table View

# Expected Results:
  Agent              Response Time    Availability   Connect Time   DNS Time
  ──────────────────────────────────────────────────────────────────────────
  mumbai-hq-agent    320ms           100%           45ms           12ms
  chennai-agent      340ms           100%           48ms           14ms
  london-hq-agent    180ms           100%           22ms           8ms
  frankfurt-agent    195ms           100%           25ms           9ms
  nj-hq-agent        150ms           100%           18ms           7ms
  dallas-agent       165ms           100%           20ms           7ms
```

---

### 2.3 Real-World Test Results & Logs

#### 2.3.1 MPLS Path Test - Healthy Example

**Test:** MPLS-Mumbai-to-London  
**Timestamp:** 2025-01-17 14:30:00 UTC  
**Result:** PASS (All metrics within threshold)

**Metrics:**

```json
{
  "test": {
    "testId": 123456,
    "testName": "MPLS-Mumbai-to-London",
    "type": "agent-to-agent",
    "interval": 60
  },
  "agent": {
    "agentId": 789012,
    "agentName": "mumbai-hq-agent",
    "location": "Mumbai, India"
  },
  "target": {
    "agentId": 789014,
    "agentName": "london-hq-agent",
    "location": "London, UK"
  },
  "metrics": {
    "latency": {
      "avg": 98.5,
      "min": 96.2,
      "max": 102.3,
      "unit": "ms"
    },
    "loss": {
      "avg": 0.0,
      "unit": "%"
    },
    "jitter": {
      "avg": 2.3,
      "max": 4.1,
      "unit": "ms"
    },
    "throughput": {
      "sent": 1250000,
      "received": 1250000,
      "unit": "bytes"
    }
  },
  "pathTrace": [
    {
      "hop": 1,
      "ipAddress": "10.252.1.1",
      "hostname": "vedge-mumbai-01.abhavtech.local",
      "latency": 1.2,
      "loss": 0.0,
      "mpls": [
        {
          "label": 100234,
          "exp": 0,
          "ttl": 255
        }
      ]
    },
    {
      "hop": 2,
      "ipAddress": "203.0.113.1",
      "hostname": "isp-mumbai-pe.example.net",
      "latency": 5.8,
      "loss": 0.0
    },
    {
      "hop": 3,
      "ipAddress": "203.0.113.45",
      "hostname": "isp-core-1.example.net",
      "latency": 52.3,
      "loss": 0.0
    },
    {
      "hop": 4,
      "ipAddress": "198.51.100.23",
      "hostname": "isp-london-pe.example.net",
      "latency": 95.1,
      "loss": 0.0
    },
    {
      "hop": 5,
      "ipAddress": "10.254.1.1",
      "hostname": "vedge-london-01.abhavtech.local",
      "latency": 96.8,
      "loss": 0.0,
      "mpls": [
        {
          "label": "POP"
        }
      ]
    },
    {
      "hop": 6,
      "ipAddress": "10.254.1.100",
      "hostname": "london-hq-agent",
      "latency": 98.5,
      "loss": 0.0
    }
  ],
  "alerts": []
}
```

**Analysis:**
- ✅ Latency: 98.5ms (under 100ms threshold)
- ✅ Packet Loss: 0% (excellent)
- ✅ Jitter: 2.3ms (very stable)
- ✅ Path: Consistent 6-hop MPLS path via primary ISP
- ✅ MPLS labels detected (confirms MPLS transport)

---

#### 2.3.2 MPLS Path Test - Degraded Example

**Test:** MPLS-Chennai-to-Mumbai  
**Timestamp:** 2025-01-17 11:00:00 UTC  
**Result:** ALERT (Loss threshold exceeded)

**Metrics:**

```json
{
  "test": {
    "testId": 123457,
    "testName": "MPLS-Chennai-to-Mumbai"
  },
  "agent": {
    "agentName": "chennai-agent"
  },
  "target": {
    "agentName": "mumbai-hq-agent"
  },
  "metrics": {
    "latency": {
      "avg": 45.2,
      "min": 22.1,
      "max": 180.5,
      "unit": "ms"
    },
    "loss": {
      "avg": 2.5,
      "unit": "%"
    },
    "jitter": {
      "avg": 28.3,
      "max": 45.1,
      "unit": "ms"
    }
  },
  "pathTrace": [
    {
      "hop": 1,
      "ipAddress": "10.253.1.1",
      "hostname": "vedge-chennai-01.abhavtech.local",
      "latency": 1.5,
      "loss": 0.0
    },
    {
      "hop": 2,
      "ipAddress": "203.0.113.100",
      "hostname": "isp-chennai-pe.example.net",
      "latency": 8.2,
      "loss": 0.5
    },
    {
      "hop": 3,
      "ipAddress": "*",
      "hostname": "Unknown",
      "latency": null,
      "loss": 100.0,
      "note": "Timeout - possible congestion"
    },
    {
      "hop": 4,
      "ipAddress": "203.0.113.150",
      "hostname": "isp-core-backup.example.net",
      "latency": 35.8,
      "loss": 1.2
    },
    {
      "hop": 5,
      "ipAddress": "10.252.1.1",
      "hostname": "vedge-mumbai-01.abhavtech.local",
      "latency": 42.1,
      "loss": 0.8
    },
    {
      "hop": 6,
      "ipAddress": "10.252.1.100",
      "hostname": "mumbai-hq-agent",
      "latency": 45.2,
      "loss": 0.0
    }
  ],
  "alerts": [
    {
      "ruleId": 1001,
      "alertType": "Packet Loss",
      "threshold": "1%",
      "actualValue": "2.5%",
      "state": "ACTIVE",
      "startTime": "2025-01-17T11:00:00Z"
    },
    {
      "ruleId": 1003,
      "alertType": "Jitter",
      "threshold": "10ms",
      "actualValue": "28.3ms",
      "state": "ACTIVE",
      "startTime": "2025-01-17T11:00:00Z"
    }
  ]
}
```

**Analysis:**
- ❌ Latency: 45.2ms avg (acceptable, but max 180.5ms indicates instability)
- ❌ Packet Loss: 2.5% (exceeds 1% threshold)  to  ALERT
- ❌ Jitter: 28.3ms (exceeds 10ms threshold)  to  ALERT
- ❌ Path Issue: Hop 3 timeout, traffic rerouted to backup core router
- **Root Cause:** ISP core router congestion/failure
- **Action:** Escalate to ISP, monitor backup path performance

---

#### 2.3.3 Voice Test - Webex Calling

**Test:** Webex-Calling-Global  
**Timestamp:** 2025-01-17 14:00:00 UTC  
**Agent:** mumbai-hq-agent  
**Result:** PASS (MOS >4.0)

**Voice Metrics:**

```json
{
  "test": {
    "testId": 123460,
    "testName": "Webex-Calling-Global",
    "type": "voice"
  },
  "agent": {
    "agentName": "mumbai-hq-agent"
  },
  "target": {
    "server": "calling.webex.com",
    "port": 5004
  },
  "voiceMetrics": {
    "mos": {
      "score": 4.25,
      "rating": "Good",
      "unit": "1-5 scale"
    },
    "latency": {
      "avg": 85.2,
      "max": 92.1,
      "unit": "ms"
    },
    "jitter": {
      "avg": 8.5,
      "max": 12.3,
      "unit": "ms"
    },
    "loss": {
      "avg": 0.3,
      "max": 0.8,
      "unit": "%"
    },
    "codec": "G.711",
    "bitrate": 64,
    "packetization": 20,
    "dscp": 46
  },
  "rFactor": 87.5,
  "alerts": []
}
```

**Analysis:**
- ✅ MOS Score: 4.25 (Target: >4.0) - "Good" quality
- ✅ Latency: 85.2ms (under 100ms threshold)
- ✅ Jitter: 8.5ms (under 10ms threshold)
- ✅ Packet Loss: 0.3% (under 0.5% threshold)
- ✅ R-Factor: 87.5 (>80 is considered good)
- **Conclusion:** Webex voice quality is excellent from Mumbai

---

## 3. APPDYNAMICS - DETAILED IMPLEMENTATION

### 3.1 Controller Setup & Configuration

#### 3.1.1 SaaS Controller Provisioning

**Phase 2C Week 13 Day 1: Controller Access**

**Step 1: AppDynamics Account Creation**

```
# AppDynamics Sales Team provides:
#   - Controller URL: https://abhavtech.saas.appdynamics.com
#   - Admin Username: admin@abhavtech.com
#   - Temporary Password: [emailed separately]
#   - Account Name: Abhavtech
#   - License Key: [in account settings]

# First login:
1. Navigate to https://abhavtech.saas.appdynamics.com
2. Login with admin@abhavtech.com / [temp password]
3. Change password (forced)
4. Accept Terms of Service
5. Complete initial setup wizard:
   - Company Name: Abhavtech
   - Time Zone: Asia/Kolkata (IST)
   - Default Notification Email: noc@abhavtech.com
```

**Step 2: Configure SSO (Duo SAML)**

```
# AppDynamics Controller  to  Settings  to  Administration  to  SSO Configuration

# SAML 2.0 Configuration:
  IdP Metadata URL: https://duo-sso.abhavtech.com/saml/metadata
  Entity ID: https://abhavtech.saas.appdynamics.com
  Assertion Consumer Service URL: https://abhavtech.saas.appdynamics.com/controller/auth/saml/callback
  NameID Format: urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress
  
# Attribute Mapping:
  FirstName  to  givenName
  LastName  to  sn
  Email  to  mail
  
# Save and Test
# Duo Admin Panel  to  Applications  to  AppDynamics SAML App
  - ACS URL: https://abhavtech.saas.appdynamics.com/controller/auth/saml/callback
  - Entity ID: https://abhavtech.saas.appdynamics.com
  - Save

# Test SSO:
  1. Logout of AppDynamics
  2. Navigate to https://abhavtech.saas.appdynamics.com
  3. Click "Sign in with SSO"
  4. Redirected to Duo  to  Authenticate with Duo Push
  5. Redirected back to AppDynamics dashboard
  6. ✅ SSO working
```

---

### 3.2 Java Agent Installation & Instrumentation

#### 3.2.1 Order Management Application (Java 11)

**Phase 2C Week 14 Day 1-3: Java Agent Deployment**

**Application Details:**

| Property | Value |
|----------|-------|
| Application Name | Order-Management |
| Tier Name | Order-Backend |
| Node Name | order-backend-01, order-backend-02, order-backend-03 |
| Framework | Spring Boot 2.7.x |
| Java Version | OpenJDK 11.0.18 |
| App Server | Embedded Tomcat 9.0.x |
| JVM Args | -Xms2g -Xmx4g -XX:+UseG1GC |

**Step 1: Download Java Agent**

```bash
# On order-backend-01 server:
cd /opt/appdynamics
wget https://download.appdynamics.com/download/prox/download-file/java-jdk11/22.10.0.35344/AppServerAgent-22.10.0.35344.zip

# Unzip
unzip AppServerAgent-22.10.0.35344.zip -d /opt/appdynamics/java-agent

# Set ownership
chown -R appuser:appuser /opt/appdynamics/java-agent
```

**Step 2: Configure Agent**

```bash
# Edit /opt/appdynamics/java-agent/ver22.10.0.35344/conf/controller-info.xml

<?xml version="1.0" encoding="UTF-8"?>
<controller-info>
    <controller-host>abhavtech.saas.appdynamics.com</controller-host>
    <controller-port>443</controller-port>
    <controller-ssl-enabled>true</controller-ssl-enabled>
    <account-name>Abhavtech</account-name>
    <account-access-key>a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6</account-access-key>
    <application-name>Order-Management</application-name>
    <tier-name>Order-Backend</tier-name>
    <node-name>order-backend-01</node-name>
</controller-info>
```

**Step 3: Attach Agent to JVM**

```bash
# Edit application startup script (e.g., /opt/order-management/bin/start.sh)
# Add -javaagent parameter BEFORE -jar

# Original:
java -Xms2g -Xmx4g -XX:+UseG1GC -jar /opt/order-management/order-backend.jar

# Modified:
java -Xms2g -Xmx4g -XX:+UseG1GC \
  -javaagent:/opt/appdynamics/java-agent/ver22.10.0.35344/javaagent.jar \
  -jar /opt/order-management/order-backend.jar
```

**Step 4: Restart Application**

```bash
# Stop application
systemctl stop order-backend

# Start with AppDynamics agent
systemctl start order-backend

# Verify agent is attached
tail -f /opt/order-management/logs/application.log | grep -i appdynamics

# Expected log output:
# [AppDynamics Agent] Agent Version 22.10.0.35344
# [AppDynamics Agent] Controller Host: abhavtech.saas.appdynamics.com
# [AppDynamics Agent] Application: Order-Management
# [AppDynamics Agent] Tier: Order-Backend
# [AppDynamics Agent] Node: order-backend-01
# [AppDynamics Agent] Successfully connected to controller
# [AppDynamics Agent] Auto-instrumentation enabled
```

**Step 5: Verify in Controller**

```
# AppDynamics Controller  to  Applications  to  Order-Management
# Should see:
  - Application: Order-Management (green checkmark)
  - Tier: Order-Backend
  - Nodes: order-backend-01 (reporting)
  - Health Status: Normal
  - Calls per Minute: [live data]
```

**Repeat for order-backend-02 and order-backend-03**

---

### 3.3 Business Transaction Configuration

#### 3.3.1 Order-Submission Transaction

**Phase 2C Week 14 Day 4: Transaction Detection**

**Step 1: Auto-Discovery**

```
# AppDynamics auto-detects transactions based on entry points
# Order-Management  to  Configuration  to  Instrumentation  to  Transaction Detection

# Auto-Detected Transaction:
  Entry Point Type: SERVLET
  Entry Point: /api/v1/order/submit (HTTP POST)
  Transaction Name: /api/v1/order/submit
  
# AppDynamics automatically instruments:
  - HTTP request/response
  - Database calls (via JDBC)
  - External HTTP calls (Payment Gateway)
  - Exceptions
```

**Step 2: Customize Transaction Naming**

```
# Configuration  to  Transaction Detection  to  Order-Backend tier
# Edit: /api/v1/order/submit

# Naming Scheme:
  Scheme Type: Use Segment of URI
  Segment: /api/{version}/order/{action}
  
# Result: Transaction name = "Order-Submission"
# (instead of raw URI /api/v1/order/submit)
```

**Step 3: Configure Data Collectors**

```
# Extract business data from HTTP request

# Configuration  to  Instrumentation  to  Data Collectors  to  HTTP Data Collectors

# Data Collector 1: Customer ID
  Name: customer_id
  Source: HTTP Parameter
  Parameter Name: customerId
  Display Name: Customer ID
  
# Data Collector 2: Order Total
  Name: order_total
  Source: HTTP Parameter
  Parameter Name: orderTotal
  Display Name: Order Total (USD)
  
# Data Collector 3: Session ID
  Name: session_id
  Source: HTTP Cookie
  Cookie Name: JSESSIONID
  Display Name: Session ID
```

---

### 3.4 Real-World Metrics & Snapshots

#### 3.4.1 Transaction Snapshot - Normal Transaction

**Transaction:** Order-Submission  
**Timestamp:** 2025-01-17 14:30:15 IST  
**Response Time:** 1,245 ms (Normal)  
**User:** john.doe@abhavtech.com (IP: 10.252.2.45)

**Call Graph:**

```
Order-Submission (Total: 1,245ms)
│
├─ Nginx Reverse Proxy (50ms)
│  └─ SSL Handshake (15ms)
│  └─ Load Balancer (35ms)
│
├─ Order-Backend Controller (200ms)
│  ├─ Authentication Filter (25ms)
│  │  └─ JWT Token Validation (20ms)
│  ├─ Order Validation (75ms)
│  │  └─ validateOrderRequest() (75ms)
│  └─ Order Processing (100ms)
│     └─ processOrder() (100ms)
│
├─ Database - Order Insert (150ms)
│  ├─ Connection Pool Checkout (5ms)
│  └─ SQL: INSERT INTO orders VALUES (...) (145ms)
│
├─ Payment Gateway API Call (600ms) ⚠️ SLOW
│  ├─ DNS Lookup (10ms)
│  ├─ TCP Connect (25ms)
│  ├─ SSL Handshake (35ms)
│  ├─ HTTP Request (15ms)
│  └─ HTTP Response Wait (515ms) ⚠️
│
├─ Database - Update Order Status (100ms)
│  └─ SQL: UPDATE orders SET status='PAID' WHERE id=... (100ms)
│
└─ Response Generation (145ms)
   └─ JSON Serialization (145ms)
```

**SQL Queries:**

```sql
-- Query 1: Insert Order (145ms)
INSERT INTO orders (
  order_id, customer_id, order_total, status, created_at
) VALUES (
  '2025011714301512345', 
  'CUST-12345', 
  150.00, 
  'PENDING', 
  '2025-01-17 14:30:15'
);

-- Query 2: Update Order Status (100ms)
UPDATE orders 
SET status = 'PAID', 
    payment_txn_id = 'PG-987654321',
    updated_at = '2025-01-17 14:30:16'
WHERE order_id = '2025011714301512345';
```

**External Calls:**

```http
POST https://api.paymentgateway.example.com/v2/charge HTTP/1.1
Host: api.paymentgateway.example.com
Content-Type: application/json
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...

{
  "amount": 150.00,
  "currency": "USD",
  "customer_id": "CUST-12345",
  "order_id": "2025011714301512345",
  "payment_method": "VISA_4242"
}

Response Time: 600ms
Status: 200 OK
Response:
{
  "transaction_id": "PG-987654321",
  "status": "SUCCESS",
  "timestamp": "2025-01-17T09:00:16Z"
}
```

**Business Data:**

| Field | Value |
|-------|-------|
| Customer ID | CUST-12345 |
| Order Total | $150.00 |
| Session ID | A1B2C3D4E5F6G7H8 |
| User IP | 10.252.2.45 |
| User Agent | Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 |

**Analysis:**
- ✅ Total Response Time: 1,245ms (under 2,000ms SLA)
- ⚠️ Payment Gateway Slow: 600ms (typical, external dependency)
- ✅ Database Performance: Good (145ms + 100ms = 245ms)
- ✅ Application Code: Fast (200ms)
- **Apdex Score:** Satisfied (response < 2,000ms)

---

#### 3.4.2 Transaction Snapshot - Slow Transaction (Network Issue)

**Transaction:** Order-Submission  
**Timestamp:** 2025-01-17 11:05:23 IST  
**Response Time:** 5,234 ms (SLOW - SLA VIOLATED)  
**User:** jane.smith@abhavtech.com (IP: 10.252.2.78)

**Call Graph:**

```
Order-Submission (Total: 5,234ms) ❌ SLOW
│
├─ Nginx Reverse Proxy (2,850ms) ❌ VERY SLOW
│  ├─ SSL Handshake (18ms)
│  ├─ Client TCP Retransmits (2,500ms) ❌ NETWORK ISSUE
│  └─ Load Balancer (332ms)
│
├─ Order-Backend Controller (195ms)
│  ├─ Authentication (22ms)
│  ├─ Validation (73ms)
│  └─ Processing (100ms)
│
├─ Database - Insert (140ms)
│
├─ Payment Gateway (1,850ms) ⚠️ SLOW (but within normal variance)
│
└─ Response (199ms)
```

**Root Cause Analysis (AppDynamics):**

```
ISSUE DETECTED: High Client-Side Latency

Correlation with DNAC (via API):
  User IP: 10.252.2.78
  MAC Address: 00:50:56:12:34:AB
  DNAC Client Health Score: 35/100 (POOR)
  RSSI: -78dBm (WEAK SIGNAL)
  SNR: 15dB (LOW)
  Access Point: AP-Floor2-East-03
  Wireless Channel: 36 (5GHz)
  Client Type: Windows 10 Laptop
  
ROOT CAUSE: Wireless signal degradation causing TCP retransmits
RECOMMENDATION: 
  1. User should move closer to AP or use wired connection
  2. Wi-Fi site survey needed for Floor 2 East zone
  3. Consider adding AP or adjusting channel/power
```

---

**I'll continue with Integration Implementation and Real-World Scenarios. Should I proceed?**


## 4. INTEGRATION IMPLEMENTATION

### 4.1 Data Format Specifications

#### 4.1.1 AppDynamics HEC Event Format

**JSON Payload sent to Splunk HEC:**

```json
{
  "time": 1705497015,
  "host": "order-backend-01",
  "source": "appdynamics",
  "sourcetype": "appdynamics:transaction",
  "index": "application",
  "event": {
    "application": "Order-Management",
    "tier": "Order-Backend",
    "node": "order-backend-01",
    "transaction": "Order-Submission",
    "response_time_ms": 1245,
    "error": false,
    "user_ip": "10.252.2.45",
    "session_id": "A1B2C3D4E5F6G7H8",
    "customer_id": "CUST-12345",
    "order_total": 150.00,
    "apdex_score": "Satisfied",
    "business_txn_id": "2025011714301512345",
    "timestamp_iso": "2025-01-17T14:30:15+05:30"
  }
}
```

---

#### 4.1.2 ThousandEyes Webhook Payload

**JSON Payload sent from ThousandEyes to OTel Collector:**

```json
{
  "eventId": "te-event-123456789",
  "eventType": "ALERT",
  "testId": 123456,
  "testName": "MPLS-Chennai-to-Mumbai",
  "testType": "agent-to-agent",
  "agent": {
    "agentId": 789013,
    "agentName": "chennai-agent",
    "location": "Chennai, India",
    "ipAddress": "10.253.1.100"
  },
  "target": {
    "agentId": 789012,
    "agentName": "mumbai-hq-agent",
    "ipAddress": "10.252.1.100"
  },
  "metrics": {
    "latency": 45.2,
    "loss": 2.5,
    "jitter": 28.3,
    "timestamp": "2025-01-17T11:00:00Z"
  },
  "alert": {
    "ruleId": 1001,
    "ruleName": "Packet Loss >= 1%",
    "alertType": "Packet Loss",
    "state": "ACTIVE",
    "threshold": 1.0,
    "actualValue": 2.5
  },
  "permalink": "https://app.thousandeyes.com/alerts/list?roundId=1705497600"
}
```

**After OTel Processing, forwarded to Splunk HEC:**

```json
{
  "time": 1705497600,
  "host": "otel-mumbai-collector",
  "source": "thousandeyes",
  "sourcetype": "thousandeyes:test:result",
  "index": "thousandeyes",
  "event": {
    "test_name": "MPLS-Chennai-to-Mumbai",
    "agent_name": "chennai-agent",
    "agent_location": "Chennai",
    "target_agent": "mumbai-hq-agent",
    "latency_ms": 45.2,
    "loss_percent": 2.5,
    "jitter_ms": 28.3,
    "alert_active": true,
    "alert_type": "Packet Loss",
    "threshold": 1.0,
    "actual_value": 2.5,
    "timestamp": "2025-01-17T11:00:00Z"
  }
}
```

---

### 4.2 Integration Deployment Procedures

#### 4.2.1 AppDynamics  to  Splunk HEC Integration

**Phase 2C Week 18 Day 1: Configure HEC Export**

**Step 1: Enable Analytics in AppDynamics**

```
# AppDynamics Controller  to  Analytics  to  Configuration

# Enable Transaction Analytics
☑ Enable Analytics Agent
☑ Enable Transaction Analytics
☑ Enable Business Transactions Data Collection

# Configure Data Retention
  Transaction Snapshots: 7 days
  Metrics: 30 days
  Analytics Events: 90 days
```

**Step 2: Configure HTTP Data Collector in AppDynamics**

```
# Analytics  to  Configuration  to  Data Collectors  to  HTTP Data Collectors  to  Add

Name: Splunk HEC Export
Type: HTTP Request

# HTTP Configuration:
  URL: https://10.252.100.10:8088/services/collector/event
  Method: POST
  Content-Type: application/json
  
# Headers:
  Authorization: Splunk ABC12345-1234-1234-1234-123456789ABC
  
# Body Template:
{
  "time": "${timestamp}",
  "host": "${nodeName}",
  "source": "appdynamics",
  "sourcetype": "appdynamics:transaction",
  "index": "application",
  "event": {
    "application": "${applicationName}",
    "tier": "${tierName}",
    "node": "${nodeName}",
    "transaction": "${transactionName}",
    "response_time_ms": ${responseTime},
    "error": ${hasErrors},
    "user_ip": "${clientIP}",
    "session_id": "${sessionID}",
    "apdex_score": "${apdexScore}"
  }
}

# Trigger:
  Event Type: Business Transaction
  Filter: All transactions
  Batch Size: 100 events
  Batch Interval: 5 seconds
```

**Step 3: Verify Data Flow**

```bash
# On Splunk search head:
# Search for AppDynamics events

index=application sourcetype=appdynamics:transaction earliest=-5m
| stats count by application, tier, node
| table application, tier, node, count

# Expected output:
application         tier            node              count
Order-Management    Order-Backend   order-backend-01  125
Order-Management    Order-Backend   order-backend-02  118
Order-Management    Order-Backend   order-backend-03  122
Billing-System      Billing-Backend billing-01        89
...

# If no results, troubleshoot:
# 1. Check AppDynamics HTTP collector logs
# 2. Check Splunk HEC token validity
# 3. Verify network connectivity from AppDynamics to Splunk
# 4. Check Splunk _internal index for HEC errors:

index=_internal sourcetype=splunkd component=HttpEventCollector
| stats count by status, error
```

---

#### 4.2.2 ThousandEyes  to  OTel  to  Splunk Integration

**Phase 2B Week 11 Day 1: Configure Webhook**

**Step 1: Configure OTel Collector Webhook Receiver**

```yaml
# /etc/otel-collector/config.yaml (on 10.252.100.100)

receivers:
  webhookevent:
    endpoint: 0.0.0.0:8080
    path: /thousandeyes
    # No authentication (internal network, firewall-protected)

processors:
  batch:
    timeout: 5s
    send_batch_size: 100
    send_batch_max_size: 1000
  
  # Transform ThousandEyes payload to Splunk format
  transform:
    log_statements:
      - context: log
        statements:
          # Extract fields from JSON
          - set(attributes["test_name"], body["testName"])
          - set(attributes["agent_name"], body["agent"]["agentName"])
          - set(attributes["latency_ms"], body["metrics"]["latency"])
          - set(attributes["loss_percent"], body["metrics"]["loss"])
          - set(attributes["jitter_ms"], body["metrics"]["jitter"])

exporters:
  splunk_hec:
    token: "XYZ98765-9876-9876-9876-987654321XYZ"
    endpoint: "https://10.252.100.10:8088/services/collector"
    source: "thousandeyes"
    sourcetype: "thousandeyes:test:result"
    index: "thousandeyes"
    max_content_length_logs: 2097152
    splunk_app_name: "thousandeyes_app"
    splunk_app_version: "1.0"
    # Retry settings
    timeout: 10s
    retry_on_failure:
      enabled: true
      initial_interval: 5s
      max_interval: 30s
      max_elapsed_time: 300s

service:
  pipelines:
    logs:
      receivers: [webhookevent]
      processors: [batch, transform]
      exporters: [splunk_hec]
  
  # Enable telemetry for debugging
  telemetry:
    logs:
      level: info
```

**Step 2: Start OTel Collector**

```bash
# Start OTel collector
sudo systemctl start otel-collector
sudo systemctl enable otel-collector

# Verify listening on port 8080
sudo netstat -tlnp | grep 8080
# Expected: tcp 0 0.0.0.0:8080 0.0.0.0:* LISTEN 12345/otelcol

# Check logs
sudo journalctl -u otel-collector -f
# Expected: "Webhook receiver listening on 0.0.0.0:8080"
```

**Step 3: Configure ThousandEyes Webhook**

```
# ThousandEyes Portal  to  Integrations  to  Webhooks  to  Add New Webhook

Name: Splunk OTel Integration
URL: http://10.252.100.100:8080/thousandeyes
Method: POST
Authentication: None

# Select Event Types:
☑ Test Alert (Created)
☑ Test Alert (Updated)
☑ Test Alert (Cleared)
☑ Test Data

# Custom Headers: (none needed)

# Payload Template: (use default ThousandEyes format)

# Test Integration:
  Click "Test Integration"
  Expected: "200 OK" response
```

**Step 4: Verify in Splunk**

```spl
# Search for ThousandEyes data
index=thousandeyes sourcetype=thousandeyes:test:result earliest=-10m
| stats count by test_name, agent_name
| sort -count

# Expected output:
test_name                  agent_name           count
MPLS-Mumbai-to-London      mumbai-hq-agent      10
MPLS-Chennai-to-Mumbai     chennai-agent        10
Office365-Exchange-Global  mumbai-hq-agent      5
...
```

---

### 4.3 Real-World Correlation Examples

#### 4.3.1 End-to-End Correlation Query

**Scenario:** Slow Order-Submission transaction - determine if cause is app, network, or wireless

**Step 1: Find slow transactions in Splunk**

```spl
index=application sourcetype=appdynamics:transaction 
    transaction="Order-Submission" response_time_ms>2000
    earliest=-1h
| table _time, user_ip, response_time_ms, error
| sort -response_time_ms
```

**Result:**

| _time | user_ip | response_time_ms | error |
|-------|---------|------------------|-------|
| 2025-01-17 11:05:23 | 10.252.2.78 | 5234 | false |
| 2025-01-17 11:04:18 | 10.252.2.45 | 3120 | false |

**Step 2: Correlate with ISE to get MAC address**

```spl
index=application sourcetype=appdynamics:transaction 
    transaction="Order-Submission" response_time_ms>2000
    earliest=-1h
| rename user_ip AS client_ip
| join client_ip [
    search index=security sourcetype=cisco:ise:syslog 
        earliest=-1h
    | rename Framed-IP-Address AS client_ip
    | stats latest(Calling-Station-Id) AS mac_address, 
            latest(User-Name) AS username 
        BY client_ip
]
| table _time, username, client_ip, mac_address, response_time_ms
```

**Result:**

| _time | username | client_ip | mac_address | response_time_ms |
|-------|----------|-----------|-------------|------------------|
| 2025-01-17 11:05:23 | jane.smith@abhavtech.com | 10.252.2.78 | 00:50:56:12:34:AB | 5234 |

**Step 3: Add DNAC client health**

```spl
...previous query...
| join mac_address [
    search index=network_infra sourcetype=cisco:dnac:client_health
        earliest=-1h
    | stats latest(healthScore) AS health_score,
            latest(rssi) AS rssi,
            latest(snr) AS snr,
            latest(apName) AS ap_name
        BY macAddress
    | rename macAddress AS mac_address
]
| table _time, username, client_ip, response_time_ms, health_score, rssi, snr, ap_name
```

**Result:**

| _time | username | client_ip | response_time_ms | health_score | rssi | snr | ap_name |
|-------|----------|-----------|------------------|--------------|------|-----|---------|
| 2025-01-17 11:05:23 | jane.smith@abhavtech.com | 10.252.2.78 | 5234 | 35 | -78 | 15 | AP-Floor2-East-03 |

**Step 4: Add ThousandEyes path metrics**

```spl
...previous query...
| eval location="Mumbai"
| join location [
    search index=thousandeyes sourcetype=thousandeyes:test:result
        test_name="MPLS*Mumbai*"
        earliest=-1h
    | stats avg(latency_ms) AS avg_network_latency,
            avg(loss_percent) AS avg_network_loss,
            avg(jitter_ms) AS avg_network_jitter
        BY test_name
    | eval location="Mumbai"
]
| table _time, username, response_time_ms, health_score, rssi, avg_network_latency, avg_network_loss
```

**Final Result:**

| _time | username | response_time_ms | health_score | rssi | avg_network_latency | avg_network_loss |
|-------|----------|------------------|--------------|------|---------------------|------------------|
| 2025-01-17 11:05:23 | jane.smith@abhavtech.com | 5234 | 35 | -78 | 98 | 0.2 |

**Step 5: Determine root cause**

```spl
...previous query...
| eval root_cause=case(
    health_score < 50 AND rssi < -70, "WIRELESS_ISSUE - Weak signal (RSSI=" + rssi + "dBm, Health=" + health_score + ")",
    avg_network_loss > 1.0, "NETWORK_ISSUE - High packet loss (" + avg_network_loss + "%)",
    avg_network_latency > 150, "NETWORK_ISSUE - High latency (" + avg_network_latency + "ms)",
    true(), "APPLICATION_ISSUE - Network and wireless are healthy"
)
| table _time, username, response_time_ms, root_cause
```

**Root Cause Identified:**

| _time | username | response_time_ms | root_cause |
|-------|----------|------------------|------------|
| 2025-01-17 11:05:23 | jane.smith@abhavtech.com | 5234 | WIRELESS_ISSUE - Weak signal (RSSI=-78dBm, Health=35) |

---

## 5. REAL-WORLD SCENARIO WALKTHROUGHS

### 5.1 Scenario 1: Application Slowness Investigation

**Timeline:** January 17, 2025, 11:00-11:30 IST

**Initial Alert:**

```
From: AppDynamics Health Rule Violation
To: noc@abhavtech.com
Subject: CRITICAL - Order-Submission Response Time > 2s

Application: Order-Management
Tier: Order-Backend
Transaction: Order-Submission
Current Response Time: 5.2s (p95)
Threshold: 2.0s
Affected Users: 15
Alert Time: 2025-01-17 11:05:30 IST
```

---

**Investigation Steps:**

**Step 1 (11:06): NOC Engineer opens AppDynamics**

```
AppDynamics  to  Applications  to  Order-Management  to  Transaction Snapshots

# Find slowest transaction:
Transaction: Order-Submission
Response Time: 5,234ms
User: jane.smith@abhavtech.com
IP: 10.252.2.78
Timestamp: 11:05:23

# Drill into snapshot:
Call Graph shows:
  - Nginx: 2,850ms (SLOW)
  - Application Code: 195ms (normal)
  - Database: 140ms (normal)
  - Payment Gateway: 1,850ms (normal for external API)
  
# Issue: High latency at Nginx layer (client-side)
```

**Step 2 (11:08): Check Splunk correlation**

```spl
index=application sourcetype=appdynamics:transaction 
    user_ip="10.252.2.78" 
    earliest="01/17/2025:11:00:00" latest="01/17/2025:11:10:00"
| join user_ip [
    search index=security sourcetype=cisco:ise:syslog 
        Framed-IP-Address="10.252.2.78"
    | stats latest(Calling-Station-Id) AS mac, latest(User-Name) AS user
        BY Framed-IP-Address
    | rename Framed-IP-Address AS user_ip
]
| join mac [
    search index=network_infra sourcetype=cisco:dnac:client_health
    | stats latest(healthScore) AS health, latest(rssi) AS rssi, latest(apName) AS ap
        BY macAddress
    | rename macAddress AS mac
]
| table _time, user, user_ip, mac, response_time_ms, health, rssi, ap
```

**Result:**

| _time | user | user_ip | mac | response_time_ms | health | rssi | ap |
|-------|------|---------|-----|------------------|--------|------|----|
| 11:05:23 | jane.smith@abhavtech.com | 10.252.2.78 | 00:50:56:12:34:AB | 5234 | 35 | -78 | AP-Floor2-East-03 |

**Step 3 (11:10): Root cause identified**

```
ROOT CAUSE: Wireless signal degradation
- Health Score: 35/100 (POOR)
- RSSI: -78dBm (WEAK - should be >-65dBm for good performance)
- Access Point: AP-Floor2-East-03

EVIDENCE:
- Application code response time normal (195ms)
- Database response time normal (140ms)
- Network latency normal (ThousandEyes shows 98ms avg)
- Client-side TCP retransmits causing 2,850ms delay at Nginx
```

**Step 4 (11:12): Immediate remediation**

```
ACTION 1: Contact user via Webex
  From: NOC Engineer
  To: jane.smith@abhavtech.com
  Message: "Hi Jane, we've detected you're experiencing slow application 
           performance due to weak WiFi signal. Can you please:
           1. Move closer to a WiFi access point, OR
           2. Switch to wired ethernet connection
           This should resolve the issue immediately."

ACTION 2: Create ServiceNow ticket for long-term fix
  Title: WiFi Site Survey Needed - Floor 2 East Zone
  Description: Multiple users on AP-Floor2-East-03 experiencing low RSSI
  Priority: Medium
  Assignment: Network Engineering Team
  Due Date: Within 1 week
```

**Step 5 (11:15): Verify fix**

```
# User confirms: Switched to wired connection
# Verify in AppDynamics:

Transaction: Order-Submission
User: jane.smith@abhavtech.com (10.252.2.78)
Response Time: 1,180ms ✅ NORMAL
Timestamp: 11:16:05

# Problem resolved for this user
```

**Step 6 (11:30): Document and close**

```
ServiceNow Incident: INC0012345
Status: Resolved
Resolution Time: 24 minutes (11:06 - 11:30)
Root Cause: Wireless signal degradation
Resolution: User moved to wired connection (immediate)
Follow-up: WiFi site survey ticket created (long-term)
```

**MTTR:** 24 minutes ✅ (Target: <30 minutes)

---

### 5.2 Scenario 2: Webex Quality Degradation

**Timeline:** January 17, 2025, 14:30-15:00 IST

**Initial Alert:**

```
From: ThousandEyes Alert
To: network-ops@abhavtech.com
Subject: Alert: Webex-Calling-Global MOS < 4.0

Test: Webex-Calling-Global
Agent: chennai-agent (Chennai, India)
MOS Score: 3.8 (threshold: 4.0)
Jitter: 28ms (threshold: 25ms)
Packet Loss: 1.8% (threshold: 1.5%)
Duration: 3 minutes
Alert Time: 2025-01-17 14:32:00 IST
```

---

**Investigation Steps:**

**Step 1 (14:33): WF-001 Workflow Automatically Triggered**

```python
# WF-001: Webex-Branch-Optimize workflow executed
# (running in Splunk as scheduled search or Python script)

# Log entry in Splunk:
index=wf_actions workflow=WF-001 location=Chennai
| table _time, action, target_circuit, result

# Output:
_time: 2025-01-17 14:33:15
workflow: WF-001
location: Chennai
trigger: MOS=3.8, Jitter=28ms, Loss=1.8%
guardrail_check: PASS (0 actions in last hour)
vManage_query: MPLS primary circuit 85% utilized, DIA backup 35% utilized
action: REROUTE_TO_BACKUP
target_circuit: DIA
vManage_policy_update: SUCCESS
result: Policy created - WF-001-Reroute-Chennai-webex
rollback_scheduled: 2025-01-17 15:03:15 (30 min from now)
```

**Step 2 (14:35): Verify Quality Improvement**

```
# ThousandEyes re-test (2 minutes after reroute):
Test: Webex-Calling-Global
Agent: chennai-agent
MOS Score: 4.3 ✅ IMPROVED
Jitter: 12ms ✅
Packet Loss: 0.3% ✅
Path: via DIA circuit (rerouted from MPLS)
```

**Step 3 (14:40): Investigate Root Cause (Why MPLS was congested)**

```spl
# Check MPLS circuit utilization
index=network_infra sourcetype=cisco:vmanage:interface 
    device_id="vedge-chennai-01" interface="ge0/0" (MPLS circuit)
    earliest=-1h
| timechart avg(tx_kbps) AS avg_tx, avg(rx_kbps) AS avg_rx

# Result: Spike in traffic at 14:25-14:35
# avg_tx: 85,000 kbps (85% of 100 Mbps circuit)
# Cause: Large file transfer started at 14:25
```

**Step 4 (14:45): Proactive Communication**

```
# Webex Teams message to #network-ops:

WF-001 Auto-Remediation Executed ✅
Location: Chennai
Issue: Webex voice quality degraded (MOS 3.8) due to MPLS congestion
Action: Rerouted Webex traffic to DIA circuit
Result: Quality improved to MOS 4.3
Root Cause: MPLS circuit congestion (large file transfer)
Rollback: Scheduled for 15:03 (will revert if quality still good)
ServiceNow: INC0012346 created for tracking
```

**Step 5 (15:03): Automatic Rollback**

```python
# Rollback function runs at 15:03
# Re-evaluate MOS score:

current_mos = get_thousandeyes_mos("chennai-agent", "Webex-Calling-Global")
# current_mos = 4.2

if current_mos >= 4.0:
    # Quality improved, MPLS congestion resolved
    # Revert to original policy (MPLS primary)
    vmanage_api.delete_policy("WF-001-Reroute-Chennai-webex")
    log_to_splunk("WF-001 rollback executed: Quality improved, reverted to MPLS")
    
# Result: Rollback successful, Webex now using MPLS again
# MOS remains at 4.2 (MPLS congestion cleared)
```

**Step 6 (15:05): Close Incident**

```
ServiceNow Incident: INC0012346
Status: Resolved
Resolution Time: 35 minutes (14:30 - 15:05)
Root Cause: MPLS circuit congestion
Resolution: WF-001 auto-rerouted to DIA, auto-rolled back after congestion cleared
Automation Success: ✅ Zero manual intervention
```

**MTTR:** 35 minutes (includes 30-min rollback timer)  
**Manual Effort:** 0 minutes ✅ FULLY AUTOMATED

---

### 5.3 Scenario 3: Network Path Issue Detection

**Timeline:** January 17, 2025, 16:00-16:45 IST

**Proactive Detection (NO USER COMPLAINT):**

```
From: Splunk MLTK Alert
To: noc@abhavtech.com
Subject: PREDICTIVE ALERT - Network Latency Anomaly Detected

MLTK Model: Traffic-Baseline-Anomaly
Detection: Mumbai  to  London MPLS latency increased 35% over 24-hour baseline
Current Latency: 132ms
24-hour Baseline: 98ms ± 5ms
Anomaly Score: 4.2 std deviations (HIGH CONFIDENCE)
Predicted Impact: Latency will exceed 150ms threshold within 2 hours
Alert Time: 2025-01-17 16:00:00 IST
```

---

**Investigation Steps:**

**Step 1 (16:02): Review ThousandEyes Path Trace**

```spl
index=thousandeyes sourcetype=thousandeyes:test:result 
    test_name="MPLS-Mumbai-to-London"
    earliest=-1h
| spath path=pathTrace{}
| mvexpand pathTrace
| spath input=pathTrace
| table _time, hop_number, hop_ip, hop_hostname, hop_latency, hop_loss
| sort _time, hop_number
```

**Result:**

| _time | hop_number | hop_ip | hop_hostname | hop_latency | hop_loss |
|-------|-----------|--------|--------------|-------------|----------|
| 16:01 | 1 | 10.252.1.1 | vedge-mumbai-01 | 1.2ms | 0% |
| 16:01 | 2 | 203.0.113.1 | isp-mumbai-pe | 5.8ms | 0% |
| 16:01 | 3 | 203.0.113.45 | isp-core-1 | 52.3ms | 0% |
| 16:01 | 4 | 203.0.113.89 | isp-core-2 | **98.5ms** ⚠️ | 0% |
| 16:01 | 5 | 198.51.100.23 | isp-london-pe | 130.1ms | 0% |
| 16:01 | 6 | 10.254.1.1 | vedge-london-01 | 131.8ms | 0% |
| 16:01 | 7 | 10.254.1.100 | london-hq-agent | 132.0ms | 0% |

**Analysis:**
- Hop 4 (isp-core-2) has abnormal latency jump: +46ms from previous hop
- This is an ISP core router in the MPLS cloud
- Issue is external (ISP network), not Abhavtech equipment

**Step 2 (16:10): Open ISP Ticket**

```
ISP Support Ticket: #ISP-2025-0117-456
Service Provider: Example Telecom
Circuit ID: MPLS-100234-MUMBAI-LONDON
Issue: High latency on core router (203.0.113.89)
Evidence: ThousandEyes path trace showing +46ms latency at hop 4
Current Impact: 132ms latency (baseline 98ms)
Predicted Impact: Will exceed 150ms SLA threshold within 2 hours
Requested Action: Investigate core router 203.0.113.89
Priority: Medium
Ticket Opened: 2025-01-17 16:10 IST
```

**Step 3 (16:15): Monitor Trend**

```spl
# Create real-time dashboard to monitor latency trend
index=thousandeyes test_name="MPLS-Mumbai-to-London"
| timechart span=5m avg(latency_ms) AS avg_latency

# Dashboard shows:
16:00 - 132ms
16:05 - 135ms
16:10 - 138ms ⚠️ Increasing
16:15 - 141ms ⚠️ Approaching threshold
```

**Step 4 (16:25): ISP Confirms Issue**

```
From: ISP Support (support@example-telecom.net)
Subject: RE: Ticket #ISP-2025-0117-456

We've identified a software bug on core router 203.0.113.89
causing increased processing delay. We're applying a patch now.
Expected resolution: 30 minutes
We'll notify you when complete.
```

**Step 5 (16:40): Verify Resolution**

```
# ThousandEyes test results:
16:40 - Latency: 97ms ✅ RESOLVED
16:42 - Latency: 98ms ✅ 
16:44 - Latency: 99ms ✅

# Path trace shows:
Hop 4 (isp-core-2): 52.0ms (normal, was 98.5ms)
```

**Step 6 (16:45): Close Proactive Detection**

```
ServiceNow Incident: INC0012347
Type: Proactive Detection (no user impact)
Status: Resolved
Resolution Time: 45 minutes (16:00 - 16:45)
Detection Method: MLTK Predictive Alert
Root Cause: ISP core router software bug
Resolution: ISP applied patch
User Impact: ZERO (detected and resolved before SLA breach)
```

**Value Delivered:**
- ✅ Detected issue 2 hours before user impact (proactive)
- ✅ Prevented SLA breach (latency stayed under 150ms threshold)
- ✅ Provided evidence to ISP (ThousandEyes path trace)
- ✅ Verified resolution with real-time monitoring

---

**END OF DOCUMENT 2.B**

---

*© 2025 Abhavtech.com - Document 2.B: Detailed Implementation Guide v1.0*  
*Companion to Document 2: AI-Enabled Observability*  

