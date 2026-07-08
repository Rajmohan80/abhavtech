# Glossary

Definitions for all terms, acronyms, and variables used in this workbook.

## Variables

| Symbol | Full name | Definition |
|--------|-----------|-----------|
| A | Adjustment factor | Infrastructure quality coefficient (0.5–1.0). Reflects the reliability and manageability of the WAN link. Higher A = better infrastructure. |
| AIW | Average AI Workload | Average Mbps consumed per effective load unit (U_eff). A composite of all concurrent AI data streams multiplied by a burst factor. |
| ARS | AI Readiness Score | Composite infrastructure assessment score out of 100 across five domains. Must reach 70 before AI production deployment. |
| B | Bandwidth | Provisioned bandwidth in Mbps on the link being evaluated. |
| B_gap | Bandwidth gap | B_required minus B_current. A positive value indicates an upgrade deficit. |
| B_min | Minimum bandwidth | Raw calculated bandwidth before safety margin. |
| B_rec | Recommended bandwidth | B_min multiplied by 1.5 safety margin. |
| B_req | Required bandwidth | Bandwidth needed to achieve IS = 3 at current load. Back-calculated from the IS formula. |
| CS | Cybersecurity risk factor | Dimensionless score 1–5 representing security and compliance overhead on AI traffic. |
| H | Human operators | Number of simultaneous human agents or operators. Multiplier: 1.0. |
| IS | Impact Score | Primary design validation metric. IS = (U_eff × AIW × CS × LL) / (B × A). IS ≤ 3 required for production AI. |
| LL | Low-latency factor | Dimensionless score 1–5 representing the latency requirement. Determines RTT budget and required inference tier. |
| Pod | GPU inference pod | Number of GPU inference containers or physical GPUs serving AI inference. Multiplier: 7.0. |
| PUO | Per-User Output | IS divided by U_eff. Per-user fairness metric. PUO > 2 indicates agent-level degradation. |
| RTT | Round-trip time | Total latency in milliseconds for a request to travel from user to inference and back. |
| U_eff | Effective load units | Weighted sum of all entity types accounting for relative network consumption. The correct input for IS and B formulas. |

## Technical terms

| Term | Definition |
|------|-----------|
| ASIC | Application-Specific Integrated Circuit. The switching chip in a network switch. Cut-through ASICs (Catalyst 9K, Nexus 9K) introduce sub-microsecond latency vs legacy ASICs at 5–15 µs. |
| BFD | Bidirectional Forwarding Detection. Lightweight protocol for sub-second link failure detection, typically used with OSPF or BGP to accelerate failover. |
| CBWFQ | Class-Based Weighted Fair Queuing. QoS queuing mechanism that guarantees minimum bandwidth to each traffic class. |
| DPDP | Digital Personal Data Protection Act. India's data protection regulation enacted in 2023. Requires personal data of Indian citizens to be processed with specific consent and protection controls. |
| DSCP | Differentiated Services Code Point. 6-bit field in IP header marking traffic class for QoS treatment. EF = 46, CS5 = 40, CS4 = 32, CS3 = 24, CS1 = 8, BE = 0. |
| ECMP | Equal-Cost Multi-Path routing. Distributes traffic across multiple equal-cost paths. Used in campus core design for load balancing and redundancy. |
| FHRP | First Hop Redundancy Protocol. Generic term for HSRP, VRRP, GLBP. Provides default gateway redundancy. |
| FP16 | 16-bit floating point. Standard precision format for AI model weights. A 7B parameter model in FP16 weighs approximately 14 GB. |
| gNMI | gRPC Network Management Interface. Protocol for streaming telemetry from network devices. Enables sub-minute monitoring interval vs 5-minute SNMP. |
| GPU | Graphics Processing Unit. Repurposed for AI inference due to massively parallel architecture. NVIDIA A10G, L4, A30, A100, H100 are common inference GPUs. |
| gRPC | Google Remote Procedure Call. Binary protocol over HTTP/2 used by most modern AI APIs. Requires L7-aware load balancer for request routing. |
| HIPAA | Health Insurance Portability and Accountability Act. US regulation governing healthcare data protection. Requires specific network security controls for covered data. |
| HSRP | Hot Standby Router Protocol. Cisco proprietary FHRP providing default gateway redundancy with 3–10 second failover. |
| HTTP/2 | Second major version of HTTP protocol. Uses multiplexed streams over a single TCP connection. Required for efficient AI API communication. |
| INT4 / INT8 | 4-bit and 8-bit integer quantisation formats for AI models. INT4 reduces a 7B FP16 model from 14 GB to 3.5 GB, with minor accuracy trade-off. |
| InfiniBand | High-speed interconnect for GPU-to-GPU communication within a cluster. 200–400 Gbps, sub-microsecond latency. Used in Tier 4 GPU clusters. |
| MPLS | Multi-Protocol Label Switching. WAN technology providing guaranteed bandwidth, QoS, and low jitter with provider SLA. A factor typically 0.90–0.95. |
| MCP | Multi-Cloud Platform. In this workbook, the four-tier AI inference architecture (Cloud, Regional Edge, Campus Edge, On-Prem) that routes workloads based on LL and CS requirements. |
| MIG | Multi-Instance GPU. NVIDIA technology that partitions a single GPU into independent smaller GPUs. Allows a single A30 to serve multiple workloads with isolation. |
| NVMe-oF | NVMe over Fabrics. Storage protocol that extends NVMe performance over a network (typically RoCEv2). Enables model weight load times of < 3 seconds vs 45 seconds on FC SAN. |
| NVLink | NVIDIA proprietary GPU-to-GPU interconnect. Used in Tier 4 multi-GPU clusters for distributed inference. |
| OSPF | Open Shortest Path First. Link-state routing protocol. With BFD, achieves 1–3 second failover on campus core links. |
| PCI DSS | Payment Card Industry Data Security Standard. Global standard for organisations handling card payment data. Requires network segmentation, encryption, and access controls. |
| PII | Personally Identifiable Information. Any data that can identify a natural person — names, Aadhaar numbers, financial accounts, health records, biometrics. |
| PTP | Precision Time Protocol (IEEE 1588). Hardware-assisted time synchronisation to ±1 µs accuracy. Required for AI telemetry correlation and distributed ML training log alignment. |
| QoS | Quality of Service. Network mechanisms for classifying, prioritising, and guaranteeing bandwidth for different traffic classes. |
| RAG | Retrieval-Augmented Generation. AI architecture that combines a language model with a vector database of documents. The LLM queries the database to ground its responses in factual content. |
| RoCEv2 | RDMA over Converged Ethernet version 2. High-speed, low-latency network protocol for storage (NVMe-oF) and GPU communication. |
| SD-WAN | Software-Defined WAN. Overlay technology providing application-aware path steering across multiple transport links. A factor 0.82–0.90 for managed deployments. |
| SGT | Security Group Tag. Cisco TrustSec tag applied to packets identifying the source security group. Enables dynamic access policy without ACL-per-VLAN complexity. |
| SLM | Small Language Model. AI language model with 1–3 billion parameters. Suitable for Tier 4 on-prem deployment due to lower compute and storage requirements. |
| STT | Speech-to-Text. AI function converting audio to text in real time. Generates a continuous 0.3–0.5 Mbps stream per agent during calls. LL = 4 requirement. |
| TLS 1.3 | Transport Layer Security version 1.3. Current encryption standard for AI API traffic. Requires NGFW with hardware TLS 1.3 decryption for DLP inspection. |
| VXLAN | Virtual Extensible LAN. Layer 2 overlay protocol enabling micro-segmentation across a shared IP fabric. Required for AI workload isolation in enterprise networks. |
| ZTNA | Zero Trust Network Access. Security model where no implicit trust is granted based on network location. AI inference pods should be ZTNA-enforced — access granted per workload, not per VLAN. |

## Additional terms (Chapter 9 — IS Layer-by-Layer)

| Term | Definition |
|------|-----------|
| B1–B9 | The nine bandwidth measurement points from agent access port (B1) to in-house DC fabric (B9). IS must be calculated at each point independently. |
| CIR | Committed Information Rate. The guaranteed minimum bandwidth on an MPLS circuit that the provider must deliver under any conditions. Use CIR as B when calculating IS for MPLS paths. |
| SD-WAN aggregate | When SD-WAN combines two circuits in active-active mode, the effective B is the sum of both circuit bandwidths, with a blended A factor. |
| WAN AIW | The portion of AIW that actually traverses the WAN link. After MCP tiering, WAN AIW = only Tier 1/2 cloud traffic (typically 2.0 Mbps vs full AIW of 6.8–12.0 Mbps). |
| A factor degradation | The reduction in A factor caused by network congestion, path quality issues, or contention. Monitoring IS in real time detects A factor degradation before it causes service failure. |
| Dual 25G port-channel | Two 25G links bonded via LACP into a 50G aggregate. IS in normal operation = 0.75. IS in failover (one link down) = 1.50. Both acceptable for campus AI. |
| Port-channel (LACP) | Link Aggregation Control Protocol. Bonds multiple physical links into a single logical interface with higher bandwidth and built-in redundancy. |
| Active-active SD-WAN | Both WAN circuits carry traffic simultaneously. B = sum of both circuits. Traffic steering policy (DSCP-based) determines which flows use which circuit. |
| Failover IS | The IS score when the primary WAN path fails and the secondary path carries the full load. Failover IS must remain below 3 for 99.9% availability design to hold. |
| 5G ISP | A 5G-technology internet service provider link — fibre-connected infrastructure delivered to premises via 5G radio. Not the same as 5G cellular modem backup. Much higher capacity (1–10 Gbps). |
