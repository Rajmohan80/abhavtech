# 4.10 TCP Optimization

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-POL-4.10 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 1. Executive Summary

TCP Optimization in Cisco Catalyst SD-WAN enhances application performance over WAN links through techniques like AppQoE. This section defines Abhavtech's TCP optimization strategy for improving throughput, reducing latency, and enhancing user experience.

### 1.1 TCP Optimization Architecture

```
+------------------------------------------------------------------+
|                  TCP OPTIMIZATION ARCHITECTURE                    |
+------------------------------------------------------------------+
|                                                                   |
|  Traditional TCP over WAN:                                        |
|  +----------------------------------------------------------+    |
|  | Client --> WAN (High RTT) --> Server                      |    |
|  | - Slow start takes longer                                 |    |
|  | - Small window = low throughput                           |    |
|  | - Single loss = major slowdown                            |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Optimized TCP (AppQoE):                                          |
|  +----------------------------------------------------------+    |
|  | Client --> WAN Edge --> WAN --> WAN Edge --> Server       |    |
|  | - Local ACKs (faster response)                            |    |
|  | - Optimized window size                                   |    |
|  | - Loss recovery acceleration                              |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 2. AppQoE Overview

### 2.1 AppQoE Features

| Feature | Description | Benefit |
|---------|-------------|---------|
| TCP Optimization | Accelerate TCP connections | Higher throughput |
| DRE | Data Redundancy Elimination | Bandwidth savings |
| LZ Compression | Lossless compression | Bandwidth savings |
| SSL Visibility | Decrypt/inspect/re-encrypt | Security + optimization |

### 2.2 Service Node Requirements

| Requirement | Specification |
|-------------|---------------|
| Platform | UCS-E, ENCS, ISR 4K with service module |
| Memory | 8 GB minimum |
| Storage | SSD for DRE dictionary |
| License | DNA Advantage or higher |

---

## 3. TCP Optimization Configuration

### 3.1 AppQoE Service Configuration

```
! Enable AppQoE service on WAN Edge
app-hosting appid appqoe
 app-vnic gateway0 virtualportgroup 0 guest-interface 0
  guest-ipaddress 192.168.2.2 netmask 255.255.255.252
 app-default-gateway 192.168.2.1 guest-interface 0
 start
!
interface VirtualPortGroup0
 ip address 192.168.2.1 255.255.255.252
 ip nat inside
!
! TCP optimization policy
sdwan
 appqoe
  tcpopt enable
 !
```

### 3.2 TCP Optimization Parameters

```
! Advanced TCP optimization settings
sdwan
 appqoe
  tcpopt
   ! Maximum segment size optimization
   mss-adjust 1300
   !
   ! Window scaling
   window-scale enable
   !
   ! Selective acknowledgment
   sack enable
   !
   ! Connection timeout
   timeout 3600
  !
 !
```

### 3.3 Application-Specific Optimization

```
! Optimize specific applications
policy
 data-policy _TCP-OPTIMIZATION_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     app-list OPTIMIZE-APPS
     protocol 6  ! TCP only
    action accept
     set
      service appqoe vpn 10
     !
    !
   !
  !
!
policy
 lists
  app-list OPTIMIZE-APPS
   app cifs
   app ms-office-365
   app sharepoint
   app salesforce
   app oracle-erp
   app sap
  !
```

---

## 4. Data Redundancy Elimination (DRE)

### 4.1 DRE Configuration

```
! Enable DRE for bandwidth savings
sdwan
 appqoe
  dre enable
  !
  ! DRE dictionary size
  dre-dictionary size 50  ! GB
  !
  ! DRE optimization level
  dre-optimization high
 !
```

### 4.2 DRE Benefits

| Traffic Type | Typical DRE Savings |
|--------------|-------------------|
| File transfers | 60-80% |
| Email attachments | 50-70% |
| Software updates | 70-90% |
| Database replication | 40-60% |
| Web browsing | 20-40% |

### 4.3 DRE Verification

```
! Check DRE statistics
show sdwan appqoe dre statistics

! Sample output:
! DIRECTION    ORIGINAL-BYTES    OPTIMIZED-BYTES    SAVINGS
! LAN-to-WAN   10,234,567,890    3,234,567,890      68.4%
! WAN-to-LAN   8,123,456,789     2,876,543,210      64.6%
```

---

## 5. Compression

### 5.1 LZ Compression Configuration

```
! Enable LZ compression
sdwan
 appqoe
  compression lz enable
  !
  ! Compression level (1-9, higher = more CPU)
  compression-level 6
 !
```

### 5.2 Compression Effectiveness

| Content Type | Compression Ratio |
|-------------|------------------|
| Text/HTML | 70-80% |
| Office docs | 30-50% |
| Already compressed (JPEG, ZIP) | 0-5% |
| Encrypted (TLS) | 0% (requires SSL visibility) |

---

## 6. SSL Visibility (Optional)

### 6.1 SSL Visibility Configuration

```
! SSL visibility for optimization of HTTPS traffic
! WARNING: Requires careful compliance consideration

sdwan
 appqoe
  ssl-proxy enable
  !
  ! Certificate configuration
  ssl-proxy
   ca-cert-bundle <BUNDLE-NAME>
   !
   ! Bypass list for sensitive sites
   bypass-list
    domain *.bank.com
    domain *.healthcare.gov
   !
  !
 !
```

### 6.2 SSL Bypass Categories

| Category | Bypass | Reason |
|----------|--------|--------|
| Banking/Finance | Yes | Privacy compliance |
| Healthcare | Yes | HIPAA compliance |
| Government | Yes | Security requirements |
| General SaaS | No | Enable optimization |
| Social media | No | Enable optimization |

---

## 7. Per-VPN TCP Optimization

### 7.1 VPN 10 - Employee (Full Optimization)

```
policy
 data-policy _VPN10-TCPOPT_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     app-list BUSINESS-APPS
     protocol 6
    action accept
     set
      service appqoe vpn 10
     !
    !
   !
   sequence 20
    match
     app-list SAAS-APPS
     protocol 6
    action accept
     set
      service appqoe vpn 10
     !
    !
   !
   default-action accept
  !
```

### 7.2 VPN 20 - Guest (No Optimization)

```
! Guest traffic not optimized
! Resources reserved for business traffic
```

### 7.3 VPN 100 - PCI (Selective Optimization)

```
policy
 data-policy _VPN100-TCPOPT_
  vpn-list VPN-100-PCI
   sequence 10
    match
     app-list PCI-APPS
     protocol 6
    action accept
     set
      service appqoe vpn 100
      ! Note: SSL visibility disabled for PCI compliance
     !
    !
   !
  !
```

---

## 8. Service Chaining with AppQoE

### 8.1 Firewall + TCP Optimization

```
+------------------------------------------------------------------+
|          TCP OPTIMIZATION WITH SERVICE CHAIN                      |
+------------------------------------------------------------------+
|                                                                   |
|  Branch --> WAN Edge --> [AppQoE] --> [FW] --> DC                 |
|                                                                   |
|  Traffic is optimized BEFORE firewall inspection                  |
|  Reduces firewall load, improves performance                      |
+------------------------------------------------------------------+
```

```
policy
 data-policy _FW-TCPOPT-CHAIN_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     destination-data-prefix-list DC-PREFIXES
     protocol 6
    action accept
     set
      service appqoe vpn 10
       next-service firewall vpn 10
      !
     !
    !
   !
  !
```

---

## 9. Monitoring and Verification

### 9.1 Verification Commands

```
! Check AppQoE status
show sdwan appqoe status
show sdwan appqoe service-chain

! View TCP optimization statistics
show sdwan appqoe tcpopt statistics
show sdwan appqoe flows

! Check DRE statistics
show sdwan appqoe dre statistics

! Check compression statistics
show sdwan appqoe compression statistics

! Sample output:
! TCPOPT STATISTICS:
! Connections Optimized: 12,345
! Throughput Improvement: 45%
! Latency Reduction: 35%
!
! DRE STATISTICS:
! Original Bytes: 10 TB
! Optimized Bytes: 3.5 TB
! Savings: 65%
```

### 9.2 Performance Metrics

| Metric | Baseline | Optimized | Improvement |
|--------|----------|-----------|-------------|
| File Transfer | 10 Mbps | 45 Mbps | 350% |
| Web Response | 500 ms | 200 ms | 60% |
| Email Sync | 60 sec | 20 sec | 67% |
| Database Query | 300 ms | 150 ms | 50% |

---

## 10. Best Practices

### 10.1 TCP Optimization Guidelines

| Guideline | Recommendation |
|-----------|----------------|
| Enable for Business Apps | Prioritize ERP, CRM, file sharing |
| DRE Dictionary Size | Match to traffic patterns |
| Compression Level | Balance CPU vs savings |
| SSL Visibility | Only if compliant |
| Monitoring | Track optimization metrics |

### 10.2 Capacity Planning

| Factor | Consideration |
|--------|---------------|
| Service Node Sizing | Based on concurrent connections |
| DRE Storage | 1 GB per 100 users typical |
| CPU Overhead | 10-20% for optimization |
| Memory | 8 GB base + scaling |

---

## 11. Summary

| Element | Abhavtech Configuration |
|---------|------------------------|
| TCP Optimization | Enabled for business apps |
| DRE | 50 GB dictionary per hub |
| Compression | LZ level 6 |
| SSL Visibility | Disabled (compliance) |
| Optimized VPNs | VPN 10 (Employee), VPN 100 (PCI) |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Next Review: March 2026*
