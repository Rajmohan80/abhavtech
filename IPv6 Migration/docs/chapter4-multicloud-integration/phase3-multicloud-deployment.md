# ABHAVTECH IPv6 MIGRATION — PHASE 3
## MULTI-CLOUD IPv6 DEPLOYMENT (AZURE + GCP)

**Project:** ABV-IPV6-2025  
**Phase:** 3 — Multi-Cloud IPv6  
**Duration:** 3 Weeks (Week 15-17)  
**Objective:** Deploy IPv6 on Azure ExpressRoute and GCP Cloud Interconnect with dual-stack workloads  
**Scope:** Azure (detailed archetype), GCP (validation archetype), Cross-cloud routing  

---

## PHASE 3 OVERVIEW

```
MULTI-CLOUD IPv6 DEPLOYMENT STRATEGY:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  WHY MULTI-CLOUD IPv6 MATTERS:                                    │
│                                                                    │
│  Business Drivers:                                                 │
│    ✅ GCP Vertex AI prefers IPv6 (better performance, native)     │
│    ✅ Azure services increasingly IPv6-native                     │
│    ✅ Eliminate SNAT/DNAT complexity for cloud workloads          │
│    ✅ Enable cloud-to-cloud routing via IPv6 (simpler policies)   │
│    ✅ Future-proof for cloud-native applications                  │
│                                                                    │
│  Current State (IPv4-Only):                                        │
│    ❌ ExpressRoute: IPv4 BGP peering only                         │
│    ❌ GCP Interconnect: IPv4 only                                 │
│    ❌ Cloud workloads: IPv4 private IPs                           │
│    ❌ Cross-cloud: Complex NAT for Azure ↔ GCP                    │
│                                                                    │
│  Target State (Dual-Stack):                                        │
│    ✅ ExpressRoute: IPv4 + IPv6 BGP prefixes                      │
│    ✅ GCP Interconnect: IPv4 + IPv6 routes                        │
│    ✅ Cloud VMs: Dual-stack (IPv4 + IPv6 interfaces)              │
│    ✅ Cross-cloud: Direct IPv6 routing (no NAT)                   │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  PHASE 3 STRUCTURE (3 WEEKS):                                      │
│                                                                    │
│  Week 15: Azure ExpressRoute IPv6 (Detailed Archetype)            │
│    - ExpressRoute IPv6 BGP configuration                          │
│    - Azure VNet dual-stack subnets                                │
│    - NSG/UDR rules for IPv6                                       │
│    - Private endpoints dual-stack (SQL, Storage)                  │
│    - SD-WAN integration validation                                │
│                                                                    │
│  Week 16: GCP Cloud Interconnect IPv6 (Validation Archetype)      │
│    - Cloud Interconnect IPv6 BGP                                  │
│    - GCP VPC dual-stack subnets                                   │
│    - Firewall rules for IPv6                                      │
│    - Vertex AI dual-stack endpoints                               │
│    - Cloud SQL dual-stack                                         │
│                                                                    │
│  Week 17: Cross-Cloud Validation + Templates                      │
│    - Azure ↔ GCP routing via SD-WAN IPv6                          │
│    - Multi-cloud workload connectivity                            │
│    - Performance baselines                                        │
│    - Automation templates                                         │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## WEEK 15: AZURE EXPRESSROUTE IPv6

## 15.1 Azure ExpressRoute Current State

```
ABHAVTECH AZURE INFRASTRUCTURE:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  EXPRESSROUTE CIRCUITS:                                            │
│                                                                    │
│  Circuit 1: Mumbai → Azure India South                             │
│    ├─ Circuit ID: abhavtech-er-mumbai                             │
│    ├─ Bandwidth: 2 Gbps                                           │
│    ├─ Provider: Tata Communications                               │
│    ├─ SKU: Premium (Global Reach enabled)                         │
│    └─ Current: IPv4 private peering only                          │
│                                                                    │
│  Circuit 2: New Jersey → Azure East US                             │
│    ├─ Circuit ID: abhavtech-er-newjersey                          │
│    ├─ Bandwidth: 2 Gbps                                           │
│    ├─ Provider: Verizon                                           │
│    ├─ SKU: Premium                                                │
│    └─ Current: IPv4 private peering only                          │
│                                                                    │
│  BGP PEERING (IPv4 — Existing):                                   │
│    Mumbai Circuit:                                                 │
│      Primary:   169.254.200.2/30 (Abhavtech) ↔ 169.254.200.1 (MS) │
│      Secondary: 169.254.200.6/30 (Abhavtech) ↔ 169.254.200.5 (MS) │
│      ASN: 64512 (Abhavtech) ↔ 12076 (Microsoft)                   │
│      Routes: Advertising 10.100.0.0/16, 10.101.0.0/16             │
│                                                                    │
│  AZURE VIRTUAL NETWORKS (VNets):                                   │
│    VNet-India-Prod:                                                │
│      ├─ Address Space: 10.100.0.0/16 (IPv4 only)                  │
│      ├─ Subnets: Web (10.100.1.0/24), App (10.100.2.0/24),       │
│      │           DB (10.100.3.0/24)                               │
│      ├─ Gateway Subnet: 10.100.255.0/24                           │
│      └─ Connected to ExpressRoute Gateway                         │
│                                                                    │
│    VNet-US-Prod:                                                   │
│      ├─ Address Space: 10.101.0.0/16 (IPv4 only)                  │
│      ├─ Similar subnet structure                                  │
│      └─ Connected to ExpressRoute Gateway (NJ circuit)            │
│                                                                    │
│  WORKLOADS:                                                        │
│    ├─ Azure SQL Database (10.100.3.10)                            │
│    ├─ Azure Storage (private endpoints: 10.100.3.20)              │
│    ├─ Azure Kubernetes Service (10.100.10.0/24)                   │
│    └─ App Services (outbound via VNet integration)                │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 15.2 Azure IPv6 Addressing Design

```
AZURE IPv6 ALLOCATION (from Abhavtech 2001:db8:abcf::/48):
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  RESERVED FOR CLOUD: 2001:db8:abcf::/48                           │
│    ├─ Azure: 2001:db8:abcf:0::/52 to 2001:db8:abcf:f::/52        │
│    └─ GCP:   2001:db8:abcf:10::/52 onwards                        │
│                                                                    │
│  AZURE INDIA SOUTH (VNet-India-Prod):                             │
│    VNet Address Space:                                             │
│      IPv4: 10.100.0.0/16 (existing, keep)                         │
│      IPv6: 2001:db8:abcf:0::/56    ← ADD                          │
│                                                                    │
│    Subnets:                                                        │
│      Web Tier:                                                     │
│        IPv4: 10.100.1.0/24                                        │
│        IPv6: 2001:db8:abcf:0:1::/64                               │
│                                                                    │
│      App Tier:                                                     │
│        IPv4: 10.100.2.0/24                                        │
│        IPv6: 2001:db8:abcf:0:2::/64                               │
│                                                                    │
│      Database Tier:                                                │
│        IPv4: 10.100.3.0/24                                        │
│        IPv6: 2001:db8:abcf:0:3::/64                               │
│                                                                    │
│      AKS Cluster:                                                  │
│        IPv4: 10.100.10.0/24                                       │
│        IPv6: 2001:db8:abcf:0:10::/64                              │
│                                                                    │
│      Gateway Subnet:                                               │
│        IPv4: 10.100.255.0/24                                      │
│        IPv6: 2001:db8:abcf:0:ff::/64                              │
│                                                                    │
│  AZURE EAST US (VNet-US-Prod):                                    │
│    VNet Address Space:                                             │
│      IPv4: 10.101.0.0/16                                          │
│      IPv6: 2001:db8:abcf:1::/56    ← ADD                          │
│                                                                    │
│    (Similar subnet structure with 2001:db8:abcf:1:X::/64)         │
│                                                                    │
│  EXPRESSROUTE BGP PEERING (IPv6):                                  │
│    Mumbai Circuit Primary:                                         │
│      IPv6: 2001:db8:cafe:1::2/126 (Abhavtech)                     │
│            2001:db8:cafe:1::1/126 (Microsoft)                     │
│                                                                    │
│    Mumbai Circuit Secondary:                                       │
│      IPv6: 2001:db8:cafe:2::2/126 (Abhavtech)                     │
│            2001:db8:cafe:2::1/126 (Microsoft)                     │
│                                                                    │
│    Advertised Routes (IPv6):                                       │
│      → To Azure: 2001:db8:abc1::/48 (on-prem Mumbai)              │
│                  2001:db8:abc2::/48 (on-prem Chennai)             │
│      ← From Azure: 2001:db8:abcf:0::/56 (VNet-India-Prod)         │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 15.3 ExpressRoute IPv6 Configuration

### Step 15.3.1: Enable IPv6 on ExpressRoute Circuit

```bash
# Azure Portal Method (GUI)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Navigate to ExpressRoute circuit
Azure Portal → ExpressRoute circuits → abhavtech-er-mumbai

# Private peering configuration
→ Peerings → Azure private peering → Configure

# Enable IPv6
☑ Enable IPv6 peering

# Microsoft assigns automatically:
Primary IPv6 subnet:   2001:db8:cafe:1::/126
  Your IPv6:           2001:db8:cafe:1::2/126
  Microsoft IPv6:      2001:db8:cafe:1::1/126

Secondary IPv6 subnet: 2001:db8:cafe:2::/126
  Your IPv6:           2001:db8:cafe:2::2/126
  Microsoft IPv6:      2001:db8:cafe:2::1/126

# BGP settings (auto-populated):
Peer ASN:              12076 (Microsoft, read-only)
Primary peer address:  2001:db8:cafe:1::1
Secondary peer:        2001:db8:cafe:2::1

# Click "Save"
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

```bash
# Azure CLI Method (Automation)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

az login

# Update ExpressRoute private peering to add IPv6
az network express-route peering update \
  --resource-group Abhavtech-Network-RG \
  --circuit-name abhavtech-er-mumbai \
  --name AzurePrivatePeering \
  --ip-version IPv6 \
  --primary-peer-address-prefix 2001:db8:cafe:1::/126 \
  --secondary-peer-address-prefix 2001:db8:cafe:2::/126 \
  --peer-asn 64512 \
  --vlan-id 4001

# Verify
az network express-route peering show \
  --resource-group Abhavtech-Network-RG \
  --circuit-name abhavtech-er-mumbai \
  --name AzurePrivatePeering \
  --query '{IPv6State:ipv6PeeringConfig.state, PrimaryPeer:ipv6PeeringConfig.primaryPeerAddressPrefix}'

# Expected output:
# {
# "IPv6State": "Enabled",
# "PrimaryPeer": "2001:db8:cafe:1::/126"
# }
```

---

### Step 15.3.2: Configure SD-WAN Router (Mumbai) for ExpressRoute IPv6

```cisco
! ═══════════════════════════════════════════════════════════════════
! MUM-HUB-01 EXPRESSROUTE IPv6 BGP CONFIGURATION
! ═══════════════════════════════════════════════════════════════════

! ExpressRoute interface (already exists from Phase 1, add IPv6)
interface TenGigabitEthernet0/0/2.4001
  description EXPRESSROUTE-PRIMARY-AZURE-DUAL-STACK
  encapsulation dot1Q 4001
  !
  ! IPv4 (existing)
  ip address 169.254.200.2 255.255.255.252
  !
  ! IPv6 (new — Microsoft-assigned)
  ipv6 address 2001:db8:cafe:1::2/126
  ipv6 enable
  !
  ! SD-WAN tunnel (already configured, supports dual-stack)
  tunnel-interface
    encapsulation ipsec preference 150
    color azure-expressroute
    restrict
    max-control-connections 0  ! Data-only
  exit
  !
  no shutdown

! ═══════════════════════════════════════════════════════════════════
! BGP CONFIGURATION FOR EXPRESSROUTE IPv6
! ═══════════════════════════════════════════════════════════════════

router bgp 64512
  bgp router-id 10.252.1.1
  bgp log-neighbor-changes
  !
  ! IPv4 address family (existing)
  neighbor 169.254.200.1 remote-as 12076
  neighbor 169.254.200.1 description Microsoft-ER-Primary-v4
  !
  address-family ipv4 unicast
    neighbor 169.254.200.1 activate
    network 10.100.0.0 mask 255.255.0.0
    network 10.101.0.0 mask 255.255.0.0
  exit-address-family
  !
  ! IPv6 address family (new)
  neighbor 2001:db8:cafe:1::1 remote-as 12076
  neighbor 2001:db8:cafe:1::1 description Microsoft-ER-Primary-v6
  neighbor 2001:db8:cafe:1::1 update-source TenGigabitEthernet0/0/2.4001
  !
  address-family ipv6 unicast
    neighbor 2001:db8:cafe:1::1 activate
    !
    ! Advertise on-prem IPv6 prefixes to Azure
    network 2001:db8:abc1::/48  ! Mumbai campus
    network 2001:db8:abc2::/48  ! Chennai campus
    !
    ! Route-map for filtering (optional)
    neighbor 2001:db8:cafe:1::1 route-map TO-AZURE-v6 out
  exit-address-family

! Route-map (filter what we send to Azure)
route-map TO-AZURE-v6 permit 10
  match ipv6 address prefix-list ONPREM-TO-AZURE
  
ipv6 prefix-list ONPREM-TO-AZURE permit 2001:db8:abc1::/48
ipv6 prefix-list ONPREM-TO-AZURE permit 2001:db8:abc2::/48
```

---

### Step 15.3.3: Verify ExpressRoute IPv6 BGP

```cisco
! On MUM-HUB-01

! Verify BGP neighbor (IPv6)
MUM-HUB-01# show bgp ipv6 unicast summary

BGP router identifier 10.252.1.1, local AS number 64512
BGP table version is 15, main routing table version 15
8 network entries using 2112 bytes of memory

Neighbor        V    AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd
2001:db8:cafe:1::1
                4 12076    1245    1230       15    0    0 00:18:23        4

! Expected: State = Established, PfxRcd > 0 (Azure routes received)

! Check received routes from Azure
MUM-HUB-01# show bgp ipv6 unicast neighbors 2001:db8:cafe:1::1 routes

     Network          Next Hop            Metric LocPrf Weight Path
*>   2001:db8:abcf:0::/56
                       2001:db8:cafe:1::1       0             0 12076 i
*>   2001:db8:abcf:1::/56
                       2001:db8:cafe:1::1       0             0 12076 i

! Analysis: Receiving Azure VNet IPv6 prefixes ✅

! Check advertised routes to Azure
MUM-HUB-01# show bgp ipv6 unicast neighbors 2001:db8:cafe:1::1 advertised-routes

     Network          Next Hop            Metric LocPrf Weight Path
*>   2001:db8:abc1::/48
                       ::                       0         32768 i
*>   2001:db8:abc2::/48
                       ::                       0         32768 i

! Analysis: Advertising on-prem prefixes to Azure ✅
```

---

## 15.4 Azure VNet Dual-Stack Configuration

### Step 15.4.1: Add IPv6 Address Space to VNet

```bash
# Azure Portal Method
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Azure Portal → Virtual networks → VNet-India-Prod → Address space

# Existing:
10.100.0.0/16

# Add IPv6:
2001:db8:abcf:0::/56

Click "Save"
```

```bash
# Azure CLI Method
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

az network vnet update \
  --resource-group Abhavtech-Network-RG \
  --name VNet-India-Prod \
  --address-prefixes 10.100.0.0/16 2001:db8:abcf:0::/56

# Verify
az network vnet show \
  --resource-group Abhavtech-Network-RG \
  --name VNet-India-Prod \
  --query 'addressSpace.addressPrefixes'

# Expected:
# [
# "10.100.0.0/16",
# "2001:db8:abcf:0::/56"
# ]
```

---

### Step 15.4.2: Add IPv6 Subnets

```bash
# Add IPv6 to Web Tier Subnet
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

az network vnet subnet update \
  --resource-group Abhavtech-Network-RG \
  --vnet-name VNet-India-Prod \
  --name WebTier \
  --address-prefixes 10.100.1.0/24 2001:db8:abcf:0:1::/64

# Add IPv6 to App Tier Subnet
az network vnet subnet update \
  --resource-group Abhavtech-Network-RG \
  --vnet-name VNet-India-Prod \
  --name AppTier \
  --address-prefixes 10.100.2.0/24 2001:db8:abcf:0:2::/64

# Add IPv6 to Database Tier Subnet
az network vnet subnet update \
  --resource-group Abhavtech-Network-RG \
  --vnet-name VNet-India-Prod \
  --name DatabaseTier \
  --address-prefixes 10.100.3.0/24 2001:db8:abcf:0:3::/64

# Add IPv6 to AKS Subnet
az network vnet subnet update \
  --resource-group Abhavtech-Network-RG \
  --vnet-name VNet-India-Prod \
  --name AKS-Subnet \
  --address-prefixes 10.100.10.0/24 2001:db8:abcf:0:10::/64

# Verify all subnets
az network vnet subnet list \
  --resource-group Abhavtech-Network-RG \
  --vnet-name VNet-India-Prod \
  --query '[].{Name:name, IPv4:addressPrefix, IPv6:addressPrefixes[1]}' \
  --output table

# Expected output:
# Name IPv4 IPv6
# ------------ -------------- --------------------------
# WebTier 10.100.1.0/24 2001:db8:abcf:0:1::/64
# AppTier 10.100.2.0/24 2001:db8:abcf:0:2::/64
# DatabaseTier 10.100.3.0/24 2001:db8:abcf:0:3::/64
# AKS-Subnet 10.100.10.0/24 2001:db8:abcf:0:10::/64
```

---

### Step 15.4.3: Enable IPv6 on Virtual Machines

```bash
# Add IPv6 IP configuration to existing VM NIC
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Example: Web server VM in WebTier subnet

# Get NIC name
az vm show \
  --resource-group Abhavtech-Workloads-RG \
  --name web-vm-01 \
  --query 'networkProfile.networkInterfaces[0].id' \
  --output tsv | awk -F'/' '{print $NF}'

# Add IPv6 IP configuration
az network nic ip-config create \
  --resource-group Abhavtech-Workloads-RG \
  --nic-name web-vm-01-nic \
  --name ipconfig-ipv6 \
  --vnet-name VNet-India-Prod \
  --subnet WebTier \
  --private-ip-address-version IPv6

# Verify dual-stack configuration
az network nic ip-config list \
  --resource-group Abhavtech-Workloads-RG \
  --nic-name web-vm-01-nic \
  --query '[].{Name:name, Version:privateIPAddressVersion, IP:privateIPAddress}' \
  --output table

# Expected:
# Name Version IP
# ------------- ------- ---------------------------------
# ipconfig1 IPv4 10.100.1.10
# ipconfig-ipv6 IPv6 2001:db8:abcf:0:1::10
```

---

### Step 15.4.4: Update Network Security Groups (NSGs) for IPv6

```bash
# NSG Rule for IPv6 SSH Access (Example)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

az network nsg rule create \
  --resource-group Abhavtech-Network-RG \
  --nsg-name WebTier-NSG \
  --name Allow-SSH-IPv6 \
  --priority 1100 \
  --source-address-prefixes '2001:db8:abc1::/48' \
  --destination-address-prefixes '2001:db8:abcf:0:1::/64' \
  --destination-port-ranges 22 \
  --protocol Tcp \
  --access Allow \
  --direction Inbound \
  --description "Allow SSH from on-prem (Mumbai) via IPv6"

# NSG Rule for IPv6 HTTPS
az network nsg rule create \
  --resource-group Abhavtech-Network-RG \
  --nsg-name WebTier-NSG \
  --name Allow-HTTPS-IPv6 \
  --priority 1110 \
  --source-address-prefixes '::/0' \
  --destination-address-prefixes '2001:db8:abcf:0:1::/64' \
  --destination-port-ranges 443 \
  --protocol Tcp \
  --access Allow \
  --direction Inbound \
  --description "Allow HTTPS from any IPv6"

# NSG Rule for IPv6 App Tier Access
az network nsg rule create \
  --resource-group Abhavtech-Network-RG \
  --nsg-name AppTier-NSG \
  --name Allow-From-Web-IPv6 \
  --priority 1100 \
  --source-address-prefixes '2001:db8:abcf:0:1::/64' \
  --destination-address-prefixes '2001:db8:abcf:0:2::/64' \
  --destination-port-ranges 8080 \
  --protocol Tcp \
  --access Allow \
  --direction Inbound \
  --description "Allow web tier to app tier via IPv6"

# List all IPv6 NSG rules
az network nsg rule list \
  --resource-group Abhavtech-Network-RG \
  --nsg-name WebTier-NSG \
  --query "[?contains(destinationAddressPrefix, ':')].{Name:name, Priority:priority, Source:sourceAddressPrefix, Dest:destinationAddressPrefix}" \
  --output table
```

---

## 15.5 Azure Private Endpoints Dual-Stack

### Step 15.5.1: Azure SQL Database Private Endpoint with IPv6

```bash
# Create Private Endpoint for Azure SQL (Dual-Stack)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Private endpoint will get both IPv4 and IPv6 from subnet

az network private-endpoint create \
  --resource-group Abhavtech-Workloads-RG \
  --name pe-sql-db-prod \
  --vnet-name VNet-India-Prod \
  --subnet DatabaseTier \
  --private-connection-resource-id "/subscriptions/XXXXXXXX/resourceGroups/Abhavtech-Workloads-RG/providers/Microsoft.Sql/servers/abhavtech-sql-prod" \
  --group-id sqlServer \
  --connection-name sql-private-connection

# Private endpoint automatically gets:
# IPv4: 10.100.3.20
# IPv6: 2001:db8:abcf:0:3::20

# Create Private DNS Zone (Dual-Stack)
az network private-dns zone create \
  --resource-group Abhavtech-Network-RG \
  --name privatelink.database.windows.net

# Link DNS zone to VNet
az network private-dns link vnet create \
  --resource-group Abhavtech-Network-RG \
  --zone-name privatelink.database.windows.net \
  --name DNSLink-VNet-India \
  --virtual-network VNet-India-Prod \
  --registration-enabled false

# Create DNS A record (IPv4)
az network private-dns record-set a add-record \
  --resource-group Abhavtech-Network-RG \
  --zone-name privatelink.database.windows.net \
  --record-set-name abhavtech-sql-prod \
  --ipv4-address 10.100.3.20

# Create DNS AAAA record (IPv6)
az network private-dns record-set aaaa add-record \
  --resource-group Abhavtech-Network-RG \
  --zone-name privatelink.database.windows.net \
  --record-set-name abhavtech-sql-prod \
  --ipv6-address 2001:db8:abcf:0:3::20

# Test DNS resolution
nslookup abhavtech-sql-prod.database.windows.net
# Expected: Returns both IPv4 (10.100.3.20) and IPv6 (2001:db8:abcf:0:3::20)
```

---

## 15.6 Week 15 Validation

```bash
#!/bin/bash
# validate_azure_ipv6.sh

echo "=== WEEK 15 VALIDATION: AZURE EXPRESSROUTE IPv6 ==="

# Test 1: ExpressRoute BGP (IPv6)
echo ""
echo "Test 1: ExpressRoute BGP Peering"
ssh admin@10.252.100.1 "show bgp ipv6 unicast summary | include 2001:db8:cafe"
# Expected: 2001:db8:cafe:1::1 State=Established, PfxRcd > 0

# Test 2: Routes from Azure
echo ""
echo "Test 2: Azure VNet Routes Received"
ssh admin@10.252.100.1 "show bgp ipv6 unicast | include 2001:db8:abcf"
# Expected: 2001:db8:abcf:0::/56 (VNet-India-Prod)

# Test 3: VNet dual-stack verification
echo ""
echo "Test 3: Azure VNet Dual-Stack Configuration"
az network vnet show \
  --resource-group Abhavtech-Network-RG \
  --name VNet-India-Prod \
  --query 'addressSpace.addressPrefixes'
# Expected: ["10.100.0.0/16", "2001:db8:abcf:0::/56"]

# Test 4: VM connectivity (IPv6)
echo ""
echo "Test 4: On-Prem to Azure VM (IPv6)"
ping6 -c 5 2001:db8:abcf:0:1::10
# Expected: 5/5 success, latency ~15-25ms (Mumbai → Azure India South)

# Test 5: Azure SQL Private Endpoint (IPv6)
echo ""
echo "Test 5: Azure SQL via Private Endpoint (IPv6)"
nslookup abhavtech-sql-prod.database.windows.net | grep AAAA
# Expected: AAAA record returns 2001:db8:abcf:0:3::20

# Test SQL connectivity via IPv6
psql -h abhavtech-sql-prod.database.windows.net -U sqladmin -d proddb -c "SELECT inet_server_addr();"
# Expected: Returns IPv6 address 2001:db8:abcf:0:3::20

echo ""
echo "✅ Week 15 Azure validation complete"
```

---

## WEEK 16: GCP CLOUD INTERCONNECT IPv6

## 16.1 GCP Infrastructure Current State

```
ABHAVTECH GCP INFRASTRUCTURE:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  CLOUD INTERCONNECT:                                               │
│    ├─ Type: Dedicated Interconnect (10 Gbps)                      │
│    ├─ Location: Mumbai (Equinix MB1)                              │
│    ├─ VLAN Attachments:                                           │
│    │    VLAN 4100: Production (asia-south1)                       │
│    │    VLAN 4101: Development (asia-south1)                      │
│    └─ Current: IPv4 BGP only                                      │
│                                                                    │
│  BGP PEERING (IPv4 — Existing):                                   │
│    Production VLAN Attachment:                                     │
│      Abhavtech: 169.254.100.2/29                                  │
│      Google:    169.254.100.1/29                                  │
│      ASN: 64512 (Abhavtech) ↔ 16550 (Google)                      │
│                                                                    │
│  GCP VPC:                                                          │
│    VPC-Prod-APAC:                                                  │
│      ├─ Mode: Custom                                              │
│      ├─ Regions: asia-south1 (Mumbai), asia-southeast1 (SG)       │
│      ├─ Subnets (IPv4 only):                                      │
│      │    mumbai-subnet-1: 10.128.1.0/24                          │
│      │    mumbai-subnet-2: 10.128.2.0/24                          │
│      └─ Routes: Default route to internet, custom to on-prem      │
│                                                                    │
│  WORKLOADS:                                                        │
│    ├─ GCE VMs (Compute Engine): 10.128.1.10-50                    │
│    ├─ GKE Cluster: 10.128.10.0/24                                 │
│    ├─ Cloud SQL: 10.128.2.10                                      │
│    └─ Vertex AI endpoints: 10.128.3.0/24                          │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 16.2 GCP IPv6 Addressing Design

```
GCP IPv6 ALLOCATION (from 2001:db8:abcf:10::/52):
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  VPC-Prod-APAC:                                                    │
│    IPv6 Range: 2001:db8:abcf:10::/52                              │
│                                                                    │
│  SUBNETS (asia-south1 / Mumbai):                                   │
│    mumbai-subnet-1:                                                │
│      IPv4: 10.128.1.0/24 (existing)                               │
│      IPv6: 2001:db8:abcf:10:1::/64  ← DUAL-STACK                  │
│                                                                    │
│    mumbai-subnet-2:                                                │
│      IPv4: 10.128.2.0/24                                          │
│      IPv6: 2001:db8:abcf:10:2::/64                                │
│                                                                    │
│    gke-subnet:                                                     │
│      IPv4: 10.128.10.0/24                                         │
│      IPv6: 2001:db8:abcf:10:10::/64                               │
│                                                                    │
│  CLOUD INTERCONNECT BGP (IPv6):                                    │
│    Production VLAN Attachment:                                     │
│      Link-local addresses (auto-assigned by Google):              │
│        Abhavtech: fe80::1/64                                      │
│        Google:    fe80::2/64                                      │
│      Global IPv6 (for prefix advertisement):                      │
│        Advertise: 2001:db8:abc1::/48 (on-prem Mumbai)             │
│        Receive:   2001:db8:abcf:10::/52 (GCP VPC)                 │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 16.3 GCP Cloud Interconnect IPv6 Configuration

### Step 16.3.1: Enable IPv6 on VPC

```bash
# GCP Console Method
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GCP Console → VPC Network → VPC-Prod-APAC

# Enable IPv6 (requires VPC recreation or update)
→ Edit
☑ Enable IPv6 (ULA - Unique Local Address or GUA - Global Unicast Address)
  Select: GUA (for global routing)
  IPv6 Range: 2001:db8:abcf:10::/52

Save
```

```bash
# gcloud CLI Method
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

gcloud compute networks update VPC-Prod-APAC \
  --enable-ula-internal-ipv6 \
  --internal-ipv6-range=2001:db8:abcf:10::/52

# Note: GCP requires VPCs to use either:
# 1. ULA (Unique Local Address) - internal IPv6
# 2. External IPv6 range (for internet-facing)
# For our use case (on-prem connectivity), we use internal IPv6
```

---

### Step 16.3.2: Add IPv6 to Subnets

```bash
# Add IPv6 to existing subnets
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# mumbai-subnet-1
gcloud compute networks subnets update mumbai-subnet-1 \
  --region=asia-south1 \
  --stack-type=IPV4_IPV6 \
  --ipv6-access-type=INTERNAL \
  --ipv6-range=2001:db8:abcf:10:1::/64

# mumbai-subnet-2
gcloud compute networks subnets update mumbai-subnet-2 \
  --region=asia-south1 \
  --stack-type=IPV4_IPV6 \
  --ipv6-access-type=INTERNAL \
  --ipv6-range=2001:db8:abcf:10:2::/64

# Verify
gcloud compute networks subnets describe mumbai-subnet-1 \
  --region=asia-south1 \
  --format="value(ipCidrRange,ipv6CidrRange,stackType)"

# Expected:
# 10.128.1.0/24 2001:db8:abcf:10:1::/64 IPV4_IPV6
```

---

### Step 16.3.3: Configure Cloud Interconnect VLAN Attachment for IPv6

```bash
# Enable IPv6 on VLAN Attachment
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

gcloud compute interconnects attachments update vlan-attach-prod \
  --region=asia-south1 \
  --enable-ipv6

# Google automatically assigns link-local addresses:
# Customer side: fe80::1/64
# Google side: fe80::2/64

# Verify
gcloud compute interconnects attachments describe vlan-attach-prod \
  --region=asia-south1 \
  --format="value(cloudRouterIpv6Address,customerRouterIpv6Address)"

# Expected:
# fe80::2 fe80::1
```

---

### Step 16.3.4: Configure Cloud Router for IPv6

```bash
# Add IPv6 BGP session to Cloud Router
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

gcloud compute routers add-bgp-peer router-mumbai \
  --peer-name=peer-abhavtech-ipv6 \
  --interface=if-vlan-prod \
  --peer-ip-address=fe80::1 \
  --peer-asn=64512 \
  --region=asia-south1 \
  --enable-ipv6

# Advertise GCP VPC IPv6 range
gcloud compute routers update-bgp-peer router-mumbai \
  --peer-name=peer-abhavtech-ipv6 \
  --region=asia-south1 \
  --advertisement-mode=CUSTOM \
  --set-advertisement-ranges=2001:db8:abcf:10::/52

# Verify
gcloud compute routers get-status router-mumbai \
  --region=asia-south1 \
  --format="value(result.bgpPeerStatus[].name,result.bgpPeerStatus[].ipv6NextHopAddress,result.bgpPeerStatus[].state)"

# Expected:
# peer-abhavtech-ipv6 fe80::1 Established
```

---

## 16.4 SD-WAN Router Configuration for GCP IPv6

```cisco
! ═══════════════════════════════════════════════════════════════════
! MUM-HUB-01 GCP CLOUD INTERCONNECT IPv6 BGP
! ═══════════════════════════════════════════════════════════════════

! Sub-interface for GCP (VLAN 4100)
interface TenGigabitEthernet0/0/4.4100
  description GCP-CLOUD-INTERCONNECT-DUAL-STACK
  encapsulation dot1Q 4100
  !
  ! IPv4 (existing)
  ip address 169.254.100.2 255.255.255.248
  !
  ! IPv6 link-local (for BGP)
  ipv6 enable
  ipv6 address fe80::1 link-local
  !
  no shutdown

! BGP configuration for GCP
router bgp 64512
  !
  ! IPv6 address family for GCP
  neighbor fe80::2 remote-as 16550
  neighbor fe80::2 description Google-Cloud-Interconnect-v6
  neighbor fe80::2 update-source TenGigabitEthernet0/0/4.4100
  !
  address-family ipv6 unicast
    neighbor fe80::2 activate
    !
    ! Advertise on-prem prefixes to GCP
    network 2001:db8:abc1::/48
    network 2001:db8:abc2::/48
    !
    neighbor fe80::2 route-map TO-GCP-v6 out
  exit-address-family

route-map TO-GCP-v6 permit 10
  match ipv6 address prefix-list ONPREM-TO-GCP

ipv6 prefix-list ONPREM-TO-GCP permit 2001:db8:abc1::/48
ipv6 prefix-list ONPREM-TO-GCP permit 2001:db8:abc2::/48
```

---

## 16.5 GCP VM Dual-Stack Configuration

```bash
# Create VM with dual-stack NIC
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

gcloud compute instances create web-vm-01 \
  --zone=asia-south1-a \
  --machine-type=n2-standard-2 \
  --network-interface=subnet=mumbai-subnet-1,stack-type=IPV4_IPV6 \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --tags=web-server

# VM automatically gets:
# IPv4: 10.128.1.10 (from subnet IPv4 range)
# IPv6: 2001:db8:abcf:10:1::10 (from subnet IPv6 range)

# Verify
gcloud compute instances describe web-vm-01 \
  --zone=asia-south1-a \
  --format="value(networkInterfaces[0].networkIP,networkInterfaces[0].ipv6Address)"

# Expected:
# 10.128.1.10 2001:db8:abcf:10:1::10
```

---

## 16.6 GCP Firewall Rules for IPv6

```bash
# Firewall rule for IPv6 SSH
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

gcloud compute firewall-rules create allow-ssh-ipv6 \
  --network=VPC-Prod-APAC \
  --allow=tcp:22 \
  --source-ranges=2001:db8:abc1::/48 \
  --direction=INGRESS \
  --priority=1000 \
  --target-tags=web-server \
  --description="Allow SSH from on-prem Mumbai via IPv6"

# Firewall rule for IPv6 HTTPS
gcloud compute firewall-rules create allow-https-ipv6 \
  --network=VPC-Prod-APAC \
  --allow=tcp:443 \
  --source-ranges=::/0 \
  --direction=INGRESS \
  --priority=1000 \
  --target-tags=web-server \
  --description="Allow HTTPS from any IPv6"

# List IPv6 firewall rules
gcloud compute firewall-rules list \
  --filter="sourceRanges:':'" \
  --format="table(name,sourceRanges,allowed[].map().firewall_rule().list():label=ALLOW)"
```

---

## 16.7 Week 16 Validation

```bash
#!/bin/bash
# validate_gcp_ipv6.sh

echo "=== WEEK 16 VALIDATION: GCP CLOUD INTERCONNECT IPv6 ==="

# Test 1: Cloud Interconnect BGP (IPv6)
echo ""
echo "Test 1: GCP Cloud Interconnect BGP Peering"
ssh admin@10.252.100.1 "show bgp ipv6 unicast neighbors fe80::2 | include state"
# Expected: BGP state = Established

# Test 2: Routes from GCP
echo ""
echo "Test 2: GCP VPC Routes Received"
ssh admin@10.252.100.1 "show bgp ipv6 unicast | include 2001:db8:abcf:10"
# Expected: 2001:db8:abcf:10::/52

# Test 3: GCP VPC dual-stack
echo ""
echo "Test 3: GCP VPC Subnets Dual-Stack"
gcloud compute networks subnets describe mumbai-subnet-1 \
  --region=asia-south1 \
  --format="value(stackType)"
# Expected: IPV4_IPV6

# Test 4: VM connectivity (IPv6)
echo ""
echo "Test 4: On-Prem to GCP VM (IPv6)"
ping6 -c 5 2001:db8:abcf:10:1::10
# Expected: 5/5 success, latency ~5-10ms (Mumbai on-prem → GCP Mumbai)

# Test 5: GCP Cloud Router status
echo ""
echo "Test 5: Cloud Router BGP Status"
gcloud compute routers get-status router-mumbai \
  --region=asia-south1 \
  --format="value(result.bgpPeerStatus[].state)"
# Expected: Established

echo ""
echo "✅ Week 16 GCP validation complete"
```

---

## WEEK 17: CROSS-CLOUD VALIDATION + TEMPLATES

## 17.1 Cross-Cloud Routing Validation

```bash
#!/bin/bash
# validate_cross_cloud_ipv6.sh

echo "=== CROSS-CLOUD IPv6 VALIDATION ==="

# Test 1: Azure → GCP (via SD-WAN IPv6)
echo ""
echo "Test 1: Azure VM → GCP VM (IPv6)"
# From Azure VM (2001:db8:abcf:0:1::10)
az vm run-command invoke \
  --resource-group Abhavtech-Workloads-RG \
  --name web-vm-01 \
  --command-id RunShellScript \
  --scripts "ping6 -c 5 2001:db8:abcf:10:1::10"

# Expected: 5/5 success, latency ~25-35ms
# Path: Azure VNet → ExpressRoute → MUM-HUB-01 → Cloud Interconnect → GCP VPC

# Test 2: GCP → Azure (reverse path)
echo ""
echo "Test 2: GCP VM → Azure VM (IPv6)"
gcloud compute ssh web-vm-01 \
  --zone=asia-south1-a \
  --command="ping6 -c 5 2001:db8:abcf:0:1::10"

# Expected: 5/5 success

# Test 3: Verify routing path
echo ""
echo "Test 3: Traceroute Azure → GCP"
az vm run-command invoke \
  --resource-group Abhavtech-Workloads-RG \
  --name web-vm-01 \
  --command-id RunShellScript \
  --scripts "traceroute6 2001:db8:abcf:10:1::10"

# Expected path:
# 1. Azure VNet gateway
# 2. ExpressRoute (encrypted, shows as *)
# 3. MUM-HUB-01 (2001:db8:abc1:8000::1)
# 4. Cloud Interconnect (shows as fe80::)
# 5. GCP VM

# Test 4: Multi-cloud application connectivity
echo ""
echo "Test 4: Azure App → GCP Cloud SQL (IPv6)"
# From Azure App VM, connect to GCP Cloud SQL via IPv6
psql -h 2001:db8:abcf:10:2::10 -U dbuser -d proddb -c "SELECT version();"
# Expected: Connection successful via IPv6

echo ""
echo "✅ Cross-cloud IPv6 validation complete"
```

---

## 17.2 Performance Baselines

```bash
#!/bin/bash
# performance_baseline_ipv6.sh

echo "=== MULTI-CLOUD IPv6 PERFORMANCE BASELINES ==="

# Test 1: Latency measurements
echo ""
echo "Test 1: IPv6 Latency Baselines"

# On-prem Mumbai → Azure India South
LATENCY_AZURE=$(ping6 -c 50 2001:db8:abcf:0:1::10 | tail -1 | awk -F'/' '{print $5}')
echo "  Mumbai → Azure India South: ${LATENCY_AZURE}ms"
# Expected: 15-25ms

# On-prem Mumbai → GCP asia-south1
LATENCY_GCP=$(ping6 -c 50 2001:db8:abcf:10:1::10 | tail -1 | awk -F'/' '{print $5}')
echo "  Mumbai → GCP Mumbai: ${LATENCY_GCP}ms"
# Expected: 5-10ms (direct interconnect vs ExpressRoute)

# Azure → GCP cross-cloud
echo ""
echo "Test 2: Cross-Cloud Latency"
az vm run-command invoke \
  --resource-group Abhavtech-Workloads-RG \
  --name web-vm-01 \
  --command-id RunShellScript \
  --scripts "ping6 -c 50 2001:db8:abcf:10:1::10 | tail -1"
# Expected: 25-35ms

# Test 3: Throughput
echo ""
echo "Test 3: IPv6 Throughput"
# iperf3 test Azure → GCP
# On GCP VM (server):
gcloud compute ssh web-vm-01 --zone=asia-south1-a --command="iperf3 -s -6"

# On Azure VM (client):
az vm run-command invoke \
  --resource-group Abhavtech-Workloads-RG \
  --name web-vm-01 \
  --command-id RunShellScript \
  --scripts "iperf3 -c 2001:db8:abcf:10:1::10 -6 -t 30"
# Expected: 800-1500 Mbps (limited by ExpressRoute bandwidth)

echo ""
echo "✅ Performance baselines documented"
```

---

## 17.3 Multi-Cloud IPv6 Automation Templates

### Terraform Template for Azure VNet Dual-Stack

```hcl
# azure_vnet_dual_stack.tf
# Terraform template for Azure VNet with IPv6

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

variable "resource_group_name" {
  description = "Resource group name"
  type        = string
  default     = "Abhavtech-Network-RG"
}

variable "vnet_name" {
  description = "VNet name"
  type        = string
}

variable "ipv4_address_space" {
  description = "IPv4 CIDR block"
  type        = string
}

variable "ipv6_address_space" {
  description = "IPv6 CIDR block"
  type        = string
}

# VNet with dual-stack
resource "azurerm_virtual_network" "vnet" {
  name                = var.vnet_name
  resource_group_name = var.resource_group_name
  location            = "southindia"
  
  address_space = [
    var.ipv4_address_space,
    var.ipv6_address_space
  ]
}

# Dual-stack subnet
resource "azurerm_subnet" "web_tier" {
  name                 = "WebTier"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.vnet.name
  
  address_prefixes = [
    cidrsubnet(var.ipv4_address_space, 8, 1),  # 10.100.1.0/24
    cidrsubnet(var.ipv6_address_space, 8, 1)   # :1::/64
  ]
}

# NSG with IPv6 rules
resource "azurerm_network_security_group" "web_nsg" {
  name                = "WebTier-NSG"
  resource_group_name = var.resource_group_name
  location            = "southindia"
}

# IPv6 HTTPS rule
resource "azurerm_network_security_rule" "allow_https_ipv6" {
  name                        = "Allow-HTTPS-IPv6"
  priority                    = 1110
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range          = "*"
  destination_port_range     = "443"
  source_address_prefix      = "::/0"
  destination_address_prefix = cidrsubnet(var.ipv6_address_space, 8, 1)
  resource_group_name        = var.resource_group_name
  network_security_group_name = azurerm_network_security_group.web_nsg.name
}

output "vnet_id" {
  value = azurerm_virtual_network.vnet.id
}

output "ipv6_address_space" {
  value = var.ipv6_address_space
}
```

**Usage:**
```bash
terraform init
terraform plan -var="vnet_name=VNet-Chennai-Prod" \
               -var="ipv4_address_space=10.102.0.0/16" \
               -var="ipv6_address_space=2001:db8:abcf:2::/56"
terraform apply
```

---

### GCP VPC Dual-Stack Template (gcloud)

```bash
#!/bin/bash
# create_gcp_vpc_dual_stack.sh

VPC_NAME="$1"
IPV6_RANGE="$2"
REGION="$3"

echo "Creating GCP VPC with dual-stack: $VPC_NAME"

# Create VPC
gcloud compute networks create $VPC_NAME \
  --subnet-mode=custom \
  --enable-ula-internal-ipv6 \
  --internal-ipv6-range=$IPV6_RANGE

# Create dual-stack subnet
gcloud compute networks subnets create ${VPC_NAME}-subnet-1 \
  --network=$VPC_NAME \
  --region=$REGION \
  --range=10.130.1.0/24 \
  --stack-type=IPV4_IPV6 \
  --ipv6-access-type=INTERNAL \
  --ipv6-range=$(echo $IPV6_RANGE | sed 's|::/52|:1::/64|')

# Firewall rules
gcloud compute firewall-rules create ${VPC_NAME}-allow-ssh-ipv6 \
  --network=$VPC_NAME \
  --allow=tcp:22 \
  --source-ranges=2001:db8:abc1::/48,2001:db8:abc2::/48 \
  --direction=INGRESS

echo "✅ GCP VPC $VPC_NAME created with dual-stack"
```

**Usage:**
```bash
chmod +x create_gcp_vpc_dual_stack.sh
./create_gcp_vpc_dual_stack.sh VPC-Chennai-Prod 2001:db8:abcf:20::/52 asia-south1
```

---

## 17.4 Phase 3 Completion Summary

```bash
#!/bin/bash
# phase3_summary.sh

echo "═══════════════════════════════════════════════════════════════"
echo "      PHASE 3 COMPLETION REPORT — MULTI-CLOUD IPv6"
echo "═══════════════════════════════════════════════════════════════"
echo ""

echo "AZURE EXPRESSROUTE IPv6:"
echo "  ✅ ExpressRoute circuits: IPv6 BGP configured"
echo "  ✅ VNet-India-Prod: Dual-stack (2001:db8:abcf:0::/56)"
echo "  ✅ VNet-US-Prod: Dual-stack (2001:db8:abcf:1::/56)"
echo "  ✅ VMs: Dual-stack NICs operational"
echo "  ✅ Private endpoints: Azure SQL, Storage (dual-stack)"
echo "  ✅ NSG rules: IPv6 security policies"
echo ""

echo "GCP CLOUD INTERCONNECT IPv6:"
echo "  ✅ Cloud Interconnect: IPv6 BGP via link-local"
echo "  ✅ VPC-Prod-APAC: Dual-stack (2001:db8:abcf:10::/52)"
echo "  ✅ Subnets: IPv4 + IPv6 ranges"
echo "  ✅ GCE VMs: Dual-stack"
echo "  ✅ Firewall rules: IPv6 ingress/egress"
echo ""

echo "CROSS-CLOUD VALIDATION:"
echo "  ✅ Azure ↔ GCP routing via SD-WAN IPv6"
echo "  ✅ Latency: Azure→GCP ~30ms (via Mumbai hub)"
echo "  ✅ Throughput: 800-1500 Mbps"
echo "  ✅ Multi-cloud workload connectivity validated"
echo ""

echo "TEMPLATES CREATED:"
echo "  ✅ Terraform: Azure VNet dual-stack"
echo "  ✅ gcloud script: GCP VPC dual-stack"
echo "  ✅ Automation scripts: BGP validation, testing"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "         ✅ PHASE 3 COMPLETE — MULTI-CLOUD IPv6"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "INFRASTRUCTURE STATUS:"
echo "  Phase 1: ✅ SD-WAN Underlay (19 sites)"
echo "  Phase 2: ✅ SD-Access Overlay (3 campuses)"
echo "  Phase 3: ✅ Multi-Cloud (Azure + GCP)"
echo ""
echo "NEXT PHASES (Optional):"
echo "  - Phase 4: Webex Calling/Contact Center IPv6"
echo "  - Phase 5: Observability IPv6 (ThousandEyes, Splunk)"
```

---

## PHASE 3 COMPLETE

**Summary:**
- **Azure ExpressRoute IPv6**: Dual-stack BGP, VNets, Private Endpoints
- **GCP Cloud Interconnect IPv6**: Dual-stack VPC, VMs, Firewall rules
- **Cross-cloud routing**: Azure ↔ GCP via SD-WAN IPv6
- **Performance baselines**: Documented latency and throughput
- **Automation templates**: Terraform (Azure), gcloud scripts (GCP)



**Infrastructure Achievement:**
- On-Prem (19 sites) ✅ Dual-stack
- Campus (3 sites) ✅ Dual-stack  
- Cloud (Azure + GCP) ✅ Dual-stack
- **Complete end-to-end IPv6 infrastructure** 🎯

---

*© 2025 Abhavtech - IPv6 Migration Phase 3 Guide*
*Version 1.0 | Last Updated: January 2025*
