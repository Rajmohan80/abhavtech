# CHAPTER 2: WIFI 7 TECHNOLOGY DEEP DIVE

## 2.1 IEEE 802.11be Standard Overview

### 2.1.1 WiFi 7 Standardization Timeline

**IEEE 802.11be (WiFi 7)** is the seventh generation of WiFi technology, ratified by the IEEE in **January 2024**.

| Milestone | Date | Significance |
|-----------|------|--------------|
| **802.11be Draft 1.0** | May 2021 | Initial specification released |
| **Draft 3.0** | July 2023 | Feature-complete draft, early hardware development |
| **Standard Ratification** | January 2024 | Official IEEE 802.11be standard published |
| **WiFi Alliance Certification** | Q1 2024 | WiFi 7 certification program launched |
| **Mass Market Availability** | Q2 2024-Q1 2025 | Chipsets (Intel BE200, Qualcomm FC7800) widely available |

**Abhavtech Deployment**: Q2 2025 (12-18 months post-ratification, mature ecosystem)

---

### 2.1.2 WiFi 7 Design Goals

**Primary Objectives:**

1. **Extremely High Throughput (EHT)**: 30+ Gbps theoretical (aggregate across all spatial streams)
2. **Ultra-Low Latency**: <5ms for real-time applications (VR, cloud gaming, industrial IoT)
3. **High Reliability**: 99.9%+ uptime through Multi-Link Operation (MLO)
4. **Spectrum Efficiency**: Better utilization of 6 GHz band (1200 MHz available in most regions)

**Target Use Cases:**
- Enterprise wireless-first workspaces (Abhavtech use case)
- 8K video streaming, AR/VR/XR applications
- Cloud gaming, remote desktop (low-latency requirements)
- Industrial IoT, smart factories (deterministic latency)
- Edge AI inference (camera-to-GPU real-time streaming)

---

### 2.1.3 Frequency Bands & Regulatory Status

**WiFi 7 Tri-Band Operation:**

| Band | Frequency Range | Channels | Max Channel Width | Regulatory Status (2025) |
|------|----------------|----------|-------------------|-------------------------|
| **2.4 GHz** | 2.400-2.495 GHz | 3 non-overlapping (Ch 1, 6, 11) | 40 MHz | Global (legacy support) |
| **5 GHz** | 5.150-5.850 GHz | 25 channels (DFS required) | 160 MHz | Global |
| **6 GHz** | 5.925-7.125 GHz | Up to 59 channels | **320 MHz** | **India: 1200 MHz (full)**, **EMEA: 500 MHz (limited)**, **US: 1200 MHz (full)** |

**Critical for Abhavtech Deployment:**

✅ **India Sites (Mumbai, Chennai, Bangalore)**: Full 1200 MHz 6 GHz spectrum  
→ **3 non-overlapping 320 MHz channels** (Ch 31, 63, 95)

⚠️ **EMEA Sites (London, Frankfurt)**: Limited 500 MHz 6 GHz spectrum  
→ **Only 2 non-overlapping 160 MHz channels** (Ch 31, 63)  
→ Performance: 2-3 Gbps (vs 4-5 Gbps in India)

✅ **US Sites (New Jersey, Dallas)**: Full 1200 MHz 6 GHz spectrum  
→ **3 non-overlapping 320 MHz channels**

---

## 2.2 Multi-Link Operation (MLO)

### 2.2.1 MLO Architecture Overview

**Multi-Link Operation (MLO)** is the **most transformative feature** in WiFi 7. It allows a single WiFi 7 client to **simultaneously transmit and receive on multiple frequency bands** (e.g., 5 GHz + 6 GHz).

**Traditional WiFi (Single-Link):**

```
┌──────────────────────────────────────────────────────────────┐
│         TRADITIONAL WiFi 6/6E (SINGLE-LINK)                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Client connects to ONE band at a time                      │
│                                                              │
│  ┌────────────┐                                             │
│  │  Laptop    │                                             │
│  │ (WiFi 6E)  │                                             │
│  └──────┬─────┘                                             │
│         │                                                    │
│         │ Connects to 6 GHz                                 │
│         ▼                                                    │
│    ┌─────────┐                                              │
│    │   AP    │                                              │
│    │ 6 GHz   │                                              │
│    └─────────┘                                              │
│                                                              │
│  If 6 GHz degrades (interference), client must:            │
│  1. Disconnect from 6 GHz                                   │
│  2. Scan for 5 GHz APs                                      │
│  3. Re-associate to 5 GHz                                   │
│  → Total time: 200-500ms (packet loss, latency spike)      │
└──────────────────────────────────────────────────────────────┘
```

**WiFi 7 with MLO (Multi-Link):**

```
┌──────────────────────────────────────────────────────────────┐
│         WiFi 7 MULTI-LINK OPERATION (MLO)                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Client simultaneously connects to MULTIPLE bands           │
│                                                              │
│  ┌────────────┐                                             │
│  │  Laptop    │                                             │
│  │ (WiFi 7)   │                                             │
│  └──┬─────┬───┘                                             │
│     │     │                                                  │
│     │     │ MLO: Two simultaneous links                     │
│     │     │                                                  │
│  Link 0   Link 1                                            │
│  (5 GHz)  (6 GHz)                                           │
│     │     │                                                  │
│     ▼     ▼                                                  │
│  ┌─────────────┐                                            │
│  │     AP      │                                            │
│  │ 5G + 6G     │                                            │
│  └─────────────┘                                            │
│                                                              │
│  If 6 GHz degrades:                                         │
│  - Traffic instantly shifts to 5 GHz (Link 0)              │
│  - NO disconnection, NO re-association                      │
│  - Failover time: <5ms                                      │
│  - Zero packet loss                                         │
│                                                              │
│  Benefits:                                                   │
│  • Higher aggregate throughput (5 GHz + 6 GHz combined)    │
│  • Seamless failover (no packet loss)                      │
│  • Load balancing (split traffic across links)            │
│  • Lower latency (transmit on best link instantly)        │
└──────────────────────────────────────────────────────────────┘
```

---

### 2.2.2 MLO Modes: STR vs NSTR

WiFi 7 defines **two MLO operation modes**:

**1. NSTR (Non-Simultaneous Transmit and Receive) - Abhavtech Deployment**

```yaml
NSTR Mode (Non-Simultaneous Tx/Rx):

Operation:
  • Client can transmit OR receive on multiple links, but NOT simultaneously
  • Example: Transmit on 6 GHz, receive on 5 GHz (at same time)
  • Example: Transmit on 6 GHz only (single-link Tx)

Hardware Requirements:
  • Simpler chipset design (lower cost)
  • 2024-2025 chipsets: Intel BE200, Qualcomm FC7800 (NSTR)

Performance:
  • Aggregate throughput: 5-8 Gbps (real-world)
  • Latency: <10ms
  • Suitable for enterprise use cases

Abhavtech Decision: NSTR mode (mature hardware in 2025)
```

**2. STR (Simultaneous Transmit and Receive) - Future**

```yaml
STR Mode (Simultaneous Tx/Rx):

Operation:
  • Client can transmit AND receive simultaneously on multiple links
  • Example: Transmit on 6 GHz + Receive on 5 GHz (both at same time)
  • Maximum throughput potential

Hardware Requirements:
  • Complex chipset design (higher cost, more power)
  • 2026+ chipsets expected

Performance:
  • Aggregate throughput: 10-15 Gbps (theoretical)
  • Latency: <5ms

Abhavtech Decision: Not available for Phase 5A pilot (2025)
Consider for Phase 5C (2027+) refresh
```

**Why Abhavtech Chose NSTR:**
✅ Mature hardware (Intel BE200, Qualcomm FC7800 support NSTR in Q2 2025)  
✅ Sufficient performance (4-5 Gbps meets executive throughput target)  
✅ Lower cost (NSTR chipsets $100-150 vs STR $200-300 projected)  
✅ Enterprise-grade stability (18+ months since WiFi 7 ratification)

---

### 2.2.3 MLO Link Selection & Aggregation

**How MLO Decides Which Link to Use:**

```yaml
MLO Link Selection Algorithm:

Factors:
  1. RSSI (Received Signal Strength)
     • Link 1 (6 GHz): -55 dBm (strong)
     • Link 0 (5 GHz): -70 dBm (weak)
     → Prefer Link 1 (6 GHz)

  2. Channel Utilization
     • Link 1 (6 GHz): 20% busy
     • Link 0 (5 GHz): 60% busy (congested)
     → Prefer Link 1 (less congestion)

  3. Traffic Priority
     • High-priority (voice, video): Send on best link (lowest latency)
     • Bulk data (file downloads): Send on both links (aggregate)

  4. Dynamic Switching
     • Link 1 suddenly degrades (interference, DFS event)
     → Instantly switch to Link 0 (<5ms)
     → Zero packet loss

Decision:
  • AP and client negotiate link selection every 10ms
  • Always use best available link for each packet
  • Load balance when both links are good
```

**Real-World Example (Executive Laptop):**

```
Scenario: Executive on video call (Webex) + downloading large file

MLO Link Allocation:
  • Link 1 (6 GHz, 320 MHz): Webex video (high priority, low latency)
    - Throughput: 15 Mbps (video stream)
    - Latency: 8ms
  
  • Link 0 (5 GHz, 160 MHz): File download (bulk data)
    - Throughput: 1.5 Gbps (background transfer)
    - Latency: 12ms (acceptable for bulk data)

Total Aggregate: 1.515 Gbps (Webex + File download)

Benefit: Video call unaffected by file download (separate links)
```

---

### 2.2.4 MLO Performance Benchmarks

**Throughput (Real-World Testing, Catalyst 9178I-BE AP):**

| Scenario | WiFi 6E (Single-Link, 6 GHz 160 MHz) | WiFi 7 MLO (5 GHz 160 MHz + 6 GHz 320 MHz) | Improvement |
|----------|--------------------------------------|-------------------------------------------|-------------|
| **Single Client, Ideal Conditions** | 2.1 Gbps | 5.4 Gbps | **2.6x faster** |
| **Single Client, 5m from AP** | 1.9 Gbps | 4.8 Gbps | **2.5x faster** |
| **Single Client, 15m from AP** | 1.2 Gbps | 3.2 Gbps | **2.7x faster** |
| **10 Clients, High Density** | 150 Mbps per client | 400 Mbps per client | **2.7x per client** |

**Latency (Ping to Gateway):**

| Scenario | WiFi 6E | WiFi 7 MLO | Improvement |
|----------|---------|------------|-------------|
| **Ideal Conditions** | 12ms | 6ms | **50% lower** |
| **Moderate Traffic** | 18ms | 9ms | **50% lower** |
| **High Density (20 clients)** | 35ms | 14ms | **60% lower** |

**Roaming (AP Handoff):**

| Scenario | WiFi 6E | WiFi 7 MLO | Improvement |
|----------|---------|------------|-------------|
| **Time to Re-Associate** | 200-500ms | <50ms | **4-10x faster** |
| **Packet Loss During Roaming** | 5-20 packets | 0 packets | **Zero packet loss** |

**Reliability (Uptime):**

| Scenario | WiFi 6E | WiFi 7 MLO | Improvement |
|----------|---------|------------|-------------|
| **Monthly Uptime** | 99.5% (3.6 hours downtime) | 99.98% (8.8 minutes downtime) | **24x fewer outages** |
| **Link Failure Impact** | Complete disconnection (200-500ms) | Transparent failover (<5ms) | **Seamless** |

---

## 2.3 320 MHz Channel Bonding

### 2.3.1 Channel Bonding Overview

**Channel bonding** combines multiple adjacent 20 MHz channels into wider channels for higher throughput.

**WiFi Evolution of Channel Width:**

| WiFi Generation | Max Channel Width | Theoretical PHY Rate | Real-World Throughput |
|-----------------|-------------------|---------------------|----------------------|
| **WiFi 4 (802.11n)** | 40 MHz | 600 Mbps | 200-300 Mbps |
| **WiFi 5 (802.11ac)** | 80 MHz | 1.7 Gbps | 600-800 Mbps |
| **WiFi 6 (802.11ax)** | 160 MHz | 2.4 Gbps | 1.0-1.5 Gbps |
| **WiFi 6E (802.11ax)** | 160 MHz (6 GHz) | 2.4 Gbps | 1.5-2.1 Gbps |
| **WiFi 7 (802.11be)** | **320 MHz** (6 GHz) | **5.8 Gbps** | **4.0-5.4 Gbps** |

**320 MHz = 16 bonded 20 MHz channels**

---

### 2.3.2 320 MHz Channel Plan (India Sites)

**6 GHz Spectrum Allocation (India):**

```
India 6 GHz Spectrum: 5.925 GHz - 7.125 GHz (1200 MHz total)

320 MHz Channel Plan:
┌──────────────────────────────────────────────────────────────┐
│  5.925 GHz                                      7.125 GHz    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ◄────────────── 1200 MHz available ──────────────────►     │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Channel 31 │  │  Channel 63 │  │  Channel 95 │         │
│  │  (320 MHz)  │  │  (320 MHz)  │  │  (320 MHz)  │         │
│  │             │  │             │  │             │         │
│  │  6.115 GHz  │  │  6.435 GHz  │  │  6.755 GHz  │         │
│  │  (center)   │  │  (center)   │  │  (center)   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
│  3 non-overlapping 320 MHz channels ✓                       │
└──────────────────────────────────────────────────────────────┘

Abhavtech Deployment:
  • Mumbai HQ: Ch 31, 63, 95 (all 3 channels used)
  • Chennai HQ: Ch 31, 63, 95
  • Bangalore Branch: Ch 31, 63 (2 channels sufficient)
```

**Channel Utilization Strategy:**

```yaml
Floor-by-Floor Channel Assignment:

Mumbai HQ - Floor 6 (Executive):
  • APs 1-5: Channel 31 (320 MHz)
  • APs 6-10: Channel 63 (320 MHz)
  • APs 11-15: Channel 95 (320 MHz)
  • Result: Zero co-channel interference

Mumbai HQ - Floor 3 (Edge AI):
  • APs 1-4: Channel 31 (320 MHz)
  • Result: Same channel as Floor 6 (acceptable, different floors)

Mumbai HQ - Floor 2 (Conference):
  • APs 1-5: Channel 63
  • APs 6-10: Channel 95
  • APs 11-15: Channel 31
  • Result: Reuse all 3 channels (high density conference center)
```

---

### 2.3.3 160 MHz Configuration (EMEA Sites)

**London/Frankfurt: Limited 500 MHz Spectrum**

```
EMEA 6 GHz Spectrum: 5.945 GHz - 6.425 GHz (500 MHz total)

160 MHz Channel Plan:
┌──────────────────────────────────────────────────────────────┐
│  5.945 GHz                         6.425 GHz                 │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ◄────────── 500 MHz available ──────────►                  │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐                           │
│  │  Channel 31 │  │  Channel 63 │                           │
│  │  (160 MHz)  │  │  (160 MHz)  │                           │
│  │             │  │             │                           │
│  │  6.025 GHz  │  │  6.185 GHz  │                           │
│  │  (center)   │  │  (center)   │                           │
│  └─────────────┘  └─────────────┘                           │
│                                                              │
│  Only 2 non-overlapping 160 MHz channels ⚠️                 │
│  320 MHz NOT possible (insufficient spectrum)               │
└──────────────────────────────────────────────────────────────┘

Abhavtech Deployment (London HQ):
  • Use 160 MHz (not 320 MHz)
  • Alternate channels: Ch 31, 63, 31, 63...
  • Co-channel interference managed via power control
  • Performance: 2-3 Gbps (vs 4-5 Gbps in India)
```

---

## 2.4 4096-QAM Modulation

### 2.4.1 QAM Overview

**QAM (Quadrature Amplitude Modulation)** encodes data into radio waves. Higher-order QAM = more bits per symbol = higher throughput.

**QAM Evolution:**

| WiFi Generation | Max QAM | Bits per Symbol | Throughput Gain |
|-----------------|---------|-----------------|-----------------|
| **WiFi 5** | 256-QAM | 8 bits | Baseline |
| **WiFi 6/6E** | 1024-QAM | 10 bits | 25% higher than WiFi 5 |
| **WiFi 7** | **4096-QAM** | **12 bits** | **20% higher than WiFi 6** |

**Mathematical Gain:**

```
Throughput Gain (4096-QAM vs 1024-QAM):
  12 bits per symbol / 10 bits per symbol = 1.2x = 20% higher
```

---

### 2.4.2 4096-QAM Requirements

**Challenge:** Higher QAM requires **higher SNR (Signal-to-Noise Ratio)**.

| QAM Level | Required SNR | Typical Range from AP |
|-----------|--------------|----------------------|
| **256-QAM** | 25 dB | 0-20 meters |
| **1024-QAM** | 32 dB | 0-10 meters |
| **4096-QAM** | **38 dB** | **0-5 meters** |

**Implication for Abhavtech:**

✅ **Executive desks (near APs)**: 4096-QAM active, 5.8 Gbps PHY rate  
⚠️ **Far corners (20m+ from AP)**: Falls back to 1024-QAM or 256-QAM, ~2-3 Gbps

**Deployment Strategy:**
- **Dense AP deployment** (1 AP per 5-6 executives) to maximize 4096-QAM coverage
- **AP placement**: Near executive desks for optimal SNR

---

### 2.4.3 4096-QAM Performance (Real-World)

**Throughput vs Distance (Catalyst 9178I-BE AP):**

| Distance from AP | SNR | Active QAM | PHY Rate | Real-World Throughput |
|------------------|-----|------------|----------|----------------------|
| **0-5m** | 40+ dB | 4096-QAM | 5.8 Gbps | 4.8-5.4 Gbps ✓ |
| **5-10m** | 35-38 dB | 4096-QAM (marginal) | 5.8 Gbps | 4.0-4.8 Gbps |
| **10-15m** | 30-35 dB | 1024-QAM (fallback) | 4.8 Gbps | 3.2-4.0 Gbps |
| **15-20m** | 25-30 dB | 256-QAM (fallback) | 3.2 Gbps | 2.0-2.8 Gbps |

**Recommendation for Abhavtech:**
- **Target**: 90% of executive desks within 10m of AP (4096-QAM or high-SNR 1024-QAM)
- **RF Design**: 1 AP per 1,500-2,000 sq ft (vs 1 AP per 2,500 sq ft WiFi 6)

---

## 2.5 Multi-RU (Multi-Resource Unit)

### 2.5.1 Resource Unit (RU) Basics

**WiFi 6/7 use OFDMA (Orthogonal Frequency Division Multiple Access)** to divide channels into **Resource Units (RUs)** for simultaneous multi-client transmission.

**RU Sizes (WiFi 6/7):**

| RU Size | Subcarriers | Typical Use Case |
|---------|-------------|------------------|
| **26-tone RU** | 26 | IoT devices (low bandwidth) |
| **52-tone RU** | 52 | Voice calls, messaging |
| **106-tone RU** | 106 | Standard web browsing |
| **242-tone RU** | 242 | Video streaming |
| **484-tone RU** | 484 | File downloads |
| **996-tone RU** | 996 | High-bandwidth (WiFi 6) |
| **2x996-tone RU** | 1992 | WiFi 6E (160 MHz) |
| **4x996-tone RU** | **3984** | **WiFi 7 (320 MHz)** |

---

### 2.5.2 Multi-RU Innovation (WiFi 7)

**WiFi 6 Limitation:**
- Each client assigned **one contiguous RU** (e.g., 242-tone RU)
- If interference on that RU → client throughput degrades

**WiFi 7 Multi-RU:**
- Each client can be assigned **multiple non-contiguous RUs**
- Example: Client gets 242-tone RU + 106-tone RU + 52-tone RU (non-adjacent)
- **Benefit**: Better spectrum utilization, avoid interference

**Example Scenario:**

```
320 MHz Channel (3984 subcarriers):

WiFi 6 Allocation (Contiguous RUs):
  Client A: 996-tone RU (subcarriers 0-995)
  Client B: 996-tone RU (subcarriers 996-1991)
  Client C: 996-tone RU (subcarriers 1992-2987)
  Client D: 996-tone RU (subcarriers 2988-3983)
  
  Problem: If interference on subcarriers 500-700, Client A suffers
  
WiFi 7 Multi-RU (Non-Contiguous):
  Client A: 484-tone RU (0-483) + 242-tone RU (800-1041) + 242-tone RU (1500-1741)
  Client B: 484-tone RU (484-799) + 484-tone RU (1042-1499)
  ...
  
  Benefit: Client A avoids interference (skips subcarriers 500-700)
  Result: 35% better spectrum utilization (measured in lab tests)
```

**Impact on Abhavtech Deployment:**
- **High-density conference rooms**: Multi-RU ensures 15-20 clients get fair bandwidth
- **Interference resilience**: Adjacent building WiFi 7 won't degrade performance

---

## 2.6 Punctured Transmission

### 2.6.1 Puncturing Overview

**Problem in WiFi 6:**
- 160 MHz channel bonding requires **all 16 sub-channels clear** (no interference)
- If **one 20 MHz sub-channel has interference** → entire 160 MHz channel unusable
- AP must fall back to 80 MHz or 40 MHz → **50-75% throughput loss**

**WiFi 7 Puncturing Solution:**
- AP can **"puncture" (skip) interfered 20 MHz sub-channels**
- Continue using remaining 140 MHz (160 MHz - 20 MHz punctured)
- **Throughput loss: Only 12%** (vs 50% in WiFi 6)

---

### 2.6.2 Puncturing Example

**Scenario: 320 MHz Channel with Interference**

```
WiFi 6E Behavior (160 MHz Channel):

┌──────────────────────────────────────────────────────────────┐
│  160 MHz Channel (8 × 20 MHz sub-channels)                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  │  20  │  20  │  20  │  20  │  20  │  20  │  20  │  20  │  │
│  │  MHz │  MHz │  MHz │  MHz │  MHz │  MHz │  MHz │  MHz │  │
│  │      │      │ ⚠️INTERFERENCE │      │      │      │      │  │
│                                                              │
│  Result: Entire 160 MHz channel UNUSABLE                    │
│  Fallback: 80 MHz (50% throughput loss)                     │
└──────────────────────────────────────────────────────────────┘

WiFi 7 Puncturing (320 MHz Channel):

┌──────────────────────────────────────────────────────────────┐
│  320 MHz Channel (16 × 20 MHz sub-channels)                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  │  20  │  20  │  20  │  20  │  20  │  20  │  20  │  20  │  │
│  │  MHz │  MHz │  MHz │  MHz │  MHz │  MHz │  MHz │  MHz │  │
│  │  ✓   │  ✓   │ ⚠️SKIP│  ✓   │  ✓   │  ✓   │  ✓   │  ✓   │  │
│                                                              │
│  │  20  │  20  │  20  │  20  │  20  │  20  │  20  │  20  │  │
│  │  MHz │  MHz │  MHz │  MHz │  MHz │  MHz │  MHz │  MHz │  │
│  │  ✓   │  ✓   │  ✓   │  ✓   │  ✓   │  ✓   │  ✓   │  ✓   │  │
│                                                              │
│  Result: 300 MHz usable (320 - 20 punctured)               │
│  Throughput: 94% of full 320 MHz (minimal loss)            │
└──────────────────────────────────────────────────────────────┘

Performance Comparison:
  WiFi 6E: 160 MHz → 80 MHz (50% throughput loss)
  WiFi 7: 320 MHz → 300 MHz (6% throughput loss)
  Improvement: 8x better resilience
```

---

### 2.6.3 Puncturing Benefits for Abhavtech

**Scenario**: Adjacent building deploys WiFi 7 on overlapping 6 GHz channel

**Without Puncturing (WiFi 6E):**
- Interference detected on 20 MHz
- Fall back to 80 MHz
- Executive throughput: 2.1 Gbps → 0.8 Gbps (62% loss)

**With Puncturing (WiFi 7):**
- Puncture interfered 20 MHz
- Continue using 300 MHz
- Executive throughput: 5.4 Gbps → 5.0 Gbps (7% loss)

**Result**: **8x more resilient** to adjacent building interference

---

## 2.7 WiFi 7 vs WiFi 6/6E Comparison

### 2.7.1 Feature Comparison Matrix

| Feature | WiFi 6 (802.11ax) | WiFi 6E (802.11ax) | **WiFi 7 (802.11be)** | Improvement (WiFi 7 vs 6E) |
|---------|-------------------|--------------------|-----------------------|---------------------------|
| **Max Channel Width** | 160 MHz | 160 MHz (6 GHz) | **320 MHz** (6 GHz) | **2x wider** |
| **Max QAM** | 1024-QAM | 1024-QAM | **4096-QAM** | **1.2x throughput** |
| **MLO (Multi-Link)** | No (single-band) | No | **Yes** (5+6 GHz) | **NEW capability** |
| **Multi-RU** | No (single contiguous RU) | No | **Yes** (non-contiguous RUs) | **35% better spectrum utilization** |
| **Punctured Transmission** | No (entire channel fails) | No | **Yes** (skip interfered sub-channels) | **8x more resilient** |
| **Max PHY Rate (Single Client)** | 2.4 Gbps | 2.4 Gbps | **5.8 Gbps** | **2.4x faster** |
| **Real-World Throughput** | 1.2 Gbps | 2.1 Gbps | **4.5 Gbps** | **2.1x faster** |
| **Latency (Typical)** | 20-30ms | 15-20ms | **<10ms** | **50% lower** |
| **Roaming Time** | 200-500ms | 150-200ms | **<50ms** | **75-80% faster** |
| **Uptime** | 99.5% | 99.7% | **99.98%** | **24x fewer outages** |

---

### 2.7.2 Performance Benchmarks (Real-World)

**Test Setup:**
- **AP**: Cisco Catalyst 9178I-BE (WiFi 7) vs Catalyst 9130AXI (WiFi 6E)
- **Client**: Intel BE200 (WiFi 7) vs Intel AX210 (WiFi 6E)
- **Environment**: Abhavtech lab (controlled RF environment)
- **Test Tool**: iPerf3 (TCP, 60-second tests)

**Single-Client Throughput (5m from AP):**

| Band Configuration | WiFi 6E | WiFi 7 | Improvement |
|-------------------|---------|--------|-------------|
| **5 GHz, 160 MHz** | 1.8 Gbps | 2.1 Gbps | 17% (better MCS in WiFi 7) |
| **6 GHz, 160 MHz** | 2.1 Gbps | 2.3 Gbps | 10% |
| **6 GHz, 320 MHz** | N/A | **5.4 Gbps** | **2.6x faster** |
| **MLO (5 GHz 160 + 6 GHz 320)** | N/A | **5.8 Gbps** | **2.8x faster** |

**Multi-Client Performance (10 Clients, High-Density Conference Room):**

| Metric | WiFi 6E | WiFi 7 | Improvement |
|--------|---------|--------|-------------|
| **Throughput per Client** | 180 Mbps | 420 Mbps | **2.3x per client** |
| **Aggregate Throughput** | 1.8 Gbps | 4.2 Gbps | **2.3x aggregate** |
| **Latency (Mean)** | 28ms | 11ms | **61% lower** |
| **Jitter (Std Dev)** | 8ms | 3ms | **63% lower** |

**Edge AI Camera Latency (Camera → UCS XE9305 Inference):**

| Metric | WiFi 6E | WiFi 7 MLO | Improvement |
|--------|---------|------------|-------------|
| **End-to-End Latency** | 18-24ms | **8-12ms** | **50-60% lower** |
| **99th Percentile** | 32ms | **14ms** | **56% lower** |
| **Packet Loss** | 0.5% | **<0.01%** | **50x better** |

---

## 2.8 Hardware Specifications (Catalyst 9178I-BE)

### 2.8.1 AP Hardware Overview

**Abhavtech Standard WiFi 7 AP: Cisco Catalyst 9178I-BE**

```yaml
Cisco Catalyst 9178I-BE Specifications:

Model: C9178I-BE-x (x = region: A=Americas, E=EMEA, W=World)

Radio Configuration:
  • Tri-Band: 2.4 GHz + 5 GHz + 6 GHz (simultaneous)
  • Spatial Streams: 4x4:4 (4 Tx, 4 Rx, 4 spatial streams per band)
  • Total Radios: 3 independent radios

WiFi 7 Features:
  • 802.11be (WiFi 7) certified
  • MLO: Supported (NSTR mode)
  • 320 MHz channels: Supported (6 GHz band)
  • 4096-QAM: Supported
  • Multi-RU: Supported
  • Punctured Transmission: Supported

Performance (Per Radio):
  • 2.4 GHz: 1.4 Gbps (4x4:4, 4096-QAM)
  • 5 GHz: 5.8 Gbps (4x4:4, 160 MHz, 4096-QAM)
  • 6 GHz: 11.5 Gbps (4x4:4, 320 MHz, 4096-QAM)
  • Aggregate: 18.7 Gbps (theoretical, all 3 radios)

Uplink:
  • 2x 10 Gbps SFP+ (for high-throughput aggregation)
  • Or: 1x 10G SFP+ + 1x mGig RJ45 (10/5/2.5/1G)

Power:
  • PoE++: 60W (802.3bt, 4-pair PoE)
  • Typical: 45W (all radios active, full transmit power)
  • Max: 60W (peak load)

Physical:
  • Dimensions: 8.7" (W) × 8.7" (D) × 1.8" (H)
  • Weight: 2.8 lbs (1.3 kg)
  • Mounting: Ceiling (T-bar or drywall), wall

Antennas:
  • Internal: 12 integrated antennas (4 per radio)
  • Gain: 4-6 dBi (omni-directional)
  • External: Optional (not recommended for Abhavtech deployment)

Operating Conditions:
  • Temperature: 0°C to 50°C (32°F to 122°F)
  • Humidity: 10% to 90% (non-condensing)

Certifications:
  • FCC (US), CE (EMEA), WPC (India)
  • WiFi Alliance: WiFi 7 Certified
```

---

### 2.8.2 WLC Requirements

**Catalyst 9800 Series WLC (Abhavtech Existing Infrastructure):**

| WLC Model | Abhavtech Sites | Max APs | WiFi 7 Support (IOS-XE 17.16+) | Notes |
|-----------|----------------|---------|--------------------------------|-------|
| **C9800-40** | Mumbai, Chennai | 2,000 APs | ✅ Yes | HA pair (active/standby) |
| **C9800-40** | London, Frankfurt | 2,000 APs | ✅ Yes | HA pair |
| **C9800-40** | New Jersey, Dallas | 2,000 APs | ✅ Yes | HA pair |

**Software Requirements:**
- **IOS-XE 17.16.1** or later (WiFi 7 support introduced in 17.16.1)
- **DNAC 2.3.7+** (WiFi 7 provisioning templates)

**No WLC Hardware Upgrade Required** ✅  
→ Software-only upgrade (IOS-XE 17.15 → 17.16)

---

### 2.8.3 Client Device Requirements

**WiFi 7 Chipsets (2025 Market):**

| Vendor | Chipset | NSTR MLO | 320 MHz | 4096-QAM | Availability | Devices |
|--------|---------|----------|---------|----------|--------------|---------|
| **Intel** | BE200 | ✅ Yes | ✅ Yes | ✅ Yes | Q4 2024 | Dell, HP, Lenovo laptops (2024+) |
| **Qualcomm** | FastConnect 7800 | ✅ Yes | ✅ Yes | ✅ Yes | Q4 2024 | Samsung Galaxy S25, Android flagship phones |
| **Apple** | WiFi 7 (custom) | ✅ Yes | ✅ Yes | ✅ Yes | Q4 2024 | iPhone 16 Pro, MacBook Pro (M4), iPad Pro (M4) |
| **MediaTek** | Filogic 880 | ✅ Yes | ✅ Yes | ✅ Yes | Q4 2024 | Budget Android phones, routers |
| **Broadcom** | BCM4398 | ✅ Yes | ✅ Yes | ✅ Yes | Q1 2025 | Samsung Galaxy tablets, Chromebooks |

**Abhavtech User Device Refresh Timeline:**
- **2024-2025**: New laptop purchases (Dell, HP, Lenovo) include Intel BE200
- **2025**: iPhone 16 Pro, iPad Pro refresh cycle (Apple WiFi 7)
- **By Q2 2025**: ~40% of Abhavtech users have WiFi 7-capable devices
- **By Q4 2025**: ~70% (during Phase 5B rollout)

---

## 2.9 Summary: Why WiFi 7 for Abhavtech

**Key Takeaways:**

✅ **Multi-Link Operation (MLO)**: Zero-packet-loss roaming, 99.98% uptime (vs 99.5% WiFi 6)  
✅ **320 MHz Channels**: 5.4 Gbps real-world throughput (vs 2.1 Gbps WiFi 6E)  
✅ **4096-QAM**: 20% higher throughput in good RF conditions  
✅ **Multi-RU**: 35% better spectrum efficiency in high-density environments  
✅ **Punctured Transmission**: 8x more resilient to interference  

**Enables Abhavtech Use Cases:**
1. **Edge AI Cameras**: <10ms latency (vs 20-30ms WiFi 6) for real-time inference
2. **Conference Rooms**: <20ms screen sharing (vs 50-100ms WiFi 6) for seamless collaboration
3. **Executive Wireless-Only**: >4 Gbps throughput (4x faster than wired 1G) for premium experience

**Deployment Readiness (Q2 2025):**
- ✅ Standard ratified (January 2024)
- ✅ Chipsets mature (Intel BE200, Qualcomm FC7800)
- ✅ Infrastructure ready (C9800 WLC software upgrade only)
- ✅ 40% user devices WiFi 7-capable by pilot start
