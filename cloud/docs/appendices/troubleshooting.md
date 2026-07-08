# Troubleshooting Guide

**Common Issues and Resolution Procedures**

---

## Overview

This guide provides systematic troubleshooting procedures for common issues encountered in multi-cloud connectivity deployments. Follow the diagnostic steps in order for efficient problem resolution.

---

## SD-WAN Troubleshooting

### Issue: SD-WAN Tunnel Not Establishing

**Symptoms:**

- Tunnel status shows "down" in vManage
- Remote site unreachable via SD-WAN
- Control connections failing

**Diagnostic Steps:**

```bash
# 1. Check tunnel status
show sdwan tunnel statistics

# 2. Verify control connections
show sdwan control connections

# 3. Check OMP routes
show sdwan omp routes

# 4. Verify underlay connectivity
ping <remote-tloc-ip>

# 5. Check certificates
show sdwan certificate installed
```

**Common Causes:**

| Cause | Resolution |
|-------|----------|
| **Firewall blocking UDP 12346** | Open required ports (UDP 12346, 12366) |
| **Certificate expired** | Renew certificates via vManage |
| **Incorrect TLOC configuration** | Verify TLOC color and IP address |
| **Time sync issues** | Ensure NTP is configured and synchronized |
| **MTU mismatch** | Adjust MTU on WAN interfaces |

**Resolution Steps:**

```bash
# Verify firewall rules
show ip access-lists

# Check NTP synchronization
show ntp associations

# Verify MTU settings
show interfaces summary

# Reset tunnel (last resort)
request platform software sdwan security ipsec-rekey
```

---

### Issue: Poor SD-WAN Application Performance

**Symptoms:**

- High latency for specific applications
- Packet loss on SD-WAN tunnels
- Applications using suboptimal paths

**Diagnostic Steps:**

```bash
# 1. Check application-aware routing
show sdwan policy app-route-policy

# 2. Verify SLA class mapping
show sdwan policy sla-class

# 3. Check tunnel statistics
show sdwan tunnel statistics

# 4. Verify QoS configuration
show policy-map interface <interface>
```

**Resolution:**

1. Verify application DPI classification
2. Check SLA class thresholds
3. Adjust QoS policies if needed
4. Verify tunnel capacity and utilization

---

## BGP Troubleshooting

### Issue: BGP Neighbor Not Establishing

**Symptoms:**

- BGP peer stuck in "Idle" or "Active" state
- No routes received from cloud provider
- Intermittent BGP flapping

**Diagnostic Steps:**

```bash
# 1. Check BGP neighbor status
show ip bgp summary

# 2. Verify BGP neighbor configuration
show ip bgp neighbors <neighbor-ip>

# 3. Check routing table
show ip route bgp

# 4. Verify connectivity to peer
ping <neighbor-ip>

# 5. Check BGP logs
show logging | include BGP
```

**Common Causes:**

| Cause | Resolution |
|-------|----------|
| **Incorrect AS number** | Verify peer AS matches cloud provider |
| **MD5 authentication mismatch** | Ensure MD5 password matches |
| **TCP port 179 blocked** | Verify firewall allows TCP 179 |
| **IP connectivity issue** | Verify layer 3 reachability |
| **Hold time expiration** | Increase BGP timers if needed |

**Resolution Steps:**

```bash
# Clear BGP session
clear ip bgp <neighbor-ip>

# Verify configuration
router bgp 65001
 neighbor <neighbor-ip> remote-as <as-number>
 neighbor <neighbor-ip> password <password>
 
# Enable BGP debugging (use caution)
debug ip bgp
debug ip bgp keepalives
```

---

### Issue: BGP Routes Not Propagating

**Symptoms:**

- Routes advertised but not received by peer
- Routing loops detected
- Suboptimal routing paths

**Diagnostic Steps:**

```bash
# 1. Check advertised routes
show ip bgp neighbors <neighbor-ip> advertised-routes

# 2. Check received routes
show ip bgp neighbors <neighbor-ip> routes

# 3. Verify route filters
show ip prefix-list
show route-map

# 4. Check AS path
show ip bgp | include <network>
```

**Resolution:**

1. Verify prefix-lists and route-maps
2. Check for route filtering or dampening
3. Ensure network statement or redistribution configured
4. Verify maximum-paths configuration for ECMP

---

## GCP Connectivity Troubleshooting

### Issue: Cloud Interconnect VLAN Attachment Down

**Symptoms:**

- VLAN attachment status "Down" in GCP console
- BGP session not establishing with Cloud Router
- No connectivity to GCP VPC

**Diagnostic Steps:**

1. **Check VLAN attachment status in GCP Console:**
   - Navigation: Hybrid Connectivity → Cloud Interconnect → VLAN Attachments
   - Verify attachment is "Active"

2. **Verify VLAN configuration on on-premises router:**

```bash
# Check VLAN interface
show interface GigabitEthernet0/0/0.100

# Verify IP address
show ip interface brief | include Gi0/0/0.100

# Check VLAN tag
show vlan id 100
```

3. **Test layer 3 connectivity:**

```bash
# Ping Cloud Router interface
ping 169.254.1.1

# Traceroute
traceroute 169.254.1.1
```

**Common Causes:**

- VLAN tag mismatch between GCP and on-premises
- Interface not configured on interconnect
- IP address configuration error
- MTU mismatch (should be 1500)

**Resolution:**

```bash
# Configure VLAN subinterface
interface GigabitEthernet0/0/0.100
 description GCP-Cloud-Interconnect-Primary
 encapsulation dot1Q 100
 ip address 169.254.1.2 255.255.255.252
 ip mtu 1500
 no shutdown
```

---

### Issue: GCP API Connectivity Failures

**Symptoms:**

- Vertex AI API calls timing out
- BigQuery queries failing
- Cloud Storage access denied

**Diagnostic Steps:**

1. **Verify VPC Service Controls:**

```bash
# GCloud command to check perimeter
gcloud access-context-manager perimeters describe <perimeter-name>
```

2. **Check service account permissions:**

```bash
# List IAM roles
gcloud projects get-iam-policy <project-id>
```

3. **Test API connectivity:**

```bash
# Test from on-premises
curl -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  https://aiplatform.googleapis.com/v1/projects/<project>/locations/<location>/models
```

**Resolution:**

- Add IP ranges to VPC Service Controls perimeter
- Grant appropriate IAM roles to service account
- Verify Private Service Connect endpoint configuration

---

## Azure Troubleshooting

### Issue: ExpressRoute Circuit Not Provisioned

**Symptoms:**

- Circuit shows "NotProvisioned" status
- No BGP session with Microsoft
- Office 365 connectivity via internet only

**Diagnostic Steps:**

1. **Check circuit status in Azure Portal:**
   - Navigate to ExpressRoute Circuits
   - Verify "Provider status" and "Circuit status"

2. **Verify service key with provider:**
   - Obtain service key from Azure Portal
   - Confirm provider has received and provisioned circuit

3. **Check peering configuration:**

```bash
# Azure CLI
az network express-route peering list \
  --circuit-name <circuit-name> \
  --resource-group <rg-name>
```

**Common Causes:**

- Provider has not completed provisioning
- Incorrect service key provided to provider
- Missing peering configuration
- Cross-connect not completed at colocation facility

**Resolution:**

1. Contact ExpressRoute provider for provisioning status
2. Verify service key matches between Azure and provider
3. Complete peering configuration after circuit provisioned
4. Allow 2-4 weeks for physical provisioning

---

### Issue: Azure Virtual WAN Site Connection Failing

**Symptoms:**

- IPsec tunnel down between branch and Virtual WAN
- Branch site cannot reach Azure VNets
- Virtual WAN dashboard shows "Disconnected"

**Diagnostic Steps:**

1. **Check IPsec tunnel status:**

```bash
# On branch router
show crypto ikev2 sa
show crypto ipsec sa
```

2. **Verify Virtual WAN configuration:**
   - Azure Portal → Virtual WAN → VPN Sites
   - Check "Connection status"

3. **Review BGP configuration:**

```bash
# Verify BGP peer is Azure VPN Gateway
show ip bgp summary
show ip bgp neighbors <azure-gateway-ip>
```

**Common Causes:**

| Cause | Resolution |
|-------|----------|
| **Pre-shared key mismatch** | Verify PSK matches Azure configuration |
| **IKE policy mismatch** | Use Azure-supported encryption/hash algorithms |
| **BGP ASN mismatch** | Verify branch ASN matches Azure site configuration |
| **Traffic selector issue** | Configure correct proxy IDs |
| **Firewall blocking UDP 500/4500** | Allow IKE/IPsec ports |

**Resolution:**

```bash
# Verify IKE proposal
show crypto ikev2 proposal

# Check IPsec transform set
show crypto ipsec transform-set

# Reset tunnel
clear crypto session
clear crypto sa
```

---

## Office 365 Troubleshooting

### Issue: Poor Office 365 Performance Despite ExpressRoute

**Symptoms:**

- Teams video calls experiencing quality issues
- SharePoint upload speeds slow
- Outlook connection delays

**Diagnostic Steps:**

1. **Verify traffic is using ExpressRoute:**

```bash
# Traceroute to Office 365 endpoint
traceroute outlook.office365.com

# Check BGP routes for Office 365 prefixes
show ip bgp | include 52.96.0.0
```

2. **Test bandwidth and latency:**

```bash
# Use Microsoft's Office 365 Network Connectivity tool
# https://connectivity.office.com

# Measure ExpressRoute latency
ping <expressroute-gateway-ip>
```

3. **Check QoS configuration:**

```bash
# Verify QoS policy on WAN interface
show policy-map interface <interface>
```

**Common Causes:**

- Traffic not routing via ExpressRoute (using internet instead)
- Missing QoS configuration for Teams
- Bandwidth exhaustion on ExpressRoute circuit
- NAT or proxy interference
- DNS resolution returning public IPs

**Resolution:**

1. Configure route filters for Office 365 prefixes
2. Implement QoS for Teams (EF marking)
3. Verify ExpressRoute circuit capacity
4. Ensure direct routing (no proxy for Teams)
5. Configure Private DNS zones for Private Endpoints

---

## Umbrella SASE Troubleshooting

### Issue: DNS Not Redirecting to Umbrella

**Symptoms:**

- DNS queries not being protected by Umbrella
- Web filtering not working
- Users accessing blocked sites

**Diagnostic Steps:**

```bash
# 1. Verify DNS redirection
show ip nat translations | include 208.67.222.222

# 2. Check DNS server configuration
show run | include ip name-server

# 3. Test DNS resolution
nslookup internetbadguys.com

# 4. Verify Umbrella dashboard shows traffic
# Check: Umbrella Dashboard → Reporting → Activity Search
```

**Common Causes:**

| Cause | Resolution |
|-------|----------|
| **NAT not configured** | Configure DNS NAT to Umbrella IPs |
| **Bypass routes exist** | Remove static routes to public DNS |
| **DHCP distributing wrong DNS** | Update DHCP scope with Umbrella IPs |
| **Devices using DoH/DoT** | Block DNS over HTTPS/TLS ports |
| **Virtual adapter registration issue** | Re-register virtual adapter |

**Resolution:**

```bash
# Configure DNS redirection
ip nat inside source static udp <internal-dns> 53 interface <outside> 53

# Update DHCP
ip dhcp pool BRANCH-POOL
 dns-server 208.67.222.222 208.67.220.220

# Verify registration
show sdwan app-fwd cflowd template
```

---

## Monitoring & Alerting Troubleshooting

### Issue: ThousandEyes Tests Not Running

**Symptoms:**

- Tests showing "disabled" status
- No data in dashboards
- Enterprise Agents offline

**Diagnostic Steps:**

1. **Check Enterprise Agent status:**
   - ThousandEyes Portal → Agents → Enterprise Agents
   - Verify "Status" column shows green

2. **Verify agent connectivity:**

```bash
# SSH to Enterprise Agent VM
ssh ubuntu@<agent-ip>

# Check ThousandEyes services
sudo systemctl status te-agent
sudo systemctl status te-browserbot

# View agent logs
sudo tail -f /var/log/te-agent.log
```

3. **Test internet connectivity from agent:**

```bash
# From Enterprise Agent
curl -I https://www.thousandeyes.com

# DNS resolution
nslookup api.thousandeyes.com
```

**Common Causes:**

- Firewall blocking outbound HTTPS (TCP 443)
- Proxy configuration required
- NTP synchronization failure
- Insufficient resources (CPU/RAM)
- License expired

**Resolution:**

1. Allow outbound HTTPS to `*.thousandeyes.com`
2. Configure proxy if required
3. Ensure NTP is synchronized
4. Increase VM resources if needed
5. Verify account license status

---

## General Troubleshooting Methodology

### Layer-by-Layer Approach

**Layer 1 (Physical):**

```bash
# Check interface status
show interfaces status

# Verify link state
show controllers <interface>

# Check error counters
show interfaces <interface> | include error
```

**Layer 2 (Data Link):**

```bash
# Verify VLAN configuration
show vlan brief

# Check MAC address table
show mac address-table

# Verify STP state
show spanning-tree
```

**Layer 3 (Network):**

```bash
# Check IP configuration
show ip interface brief

# Verify routing table
show ip route

# Test reachability
ping <destination>
traceroute <destination>
```

**Layer 4+ (Transport/Application):**

```bash
# Check open connections
show tcp brief

# Verify NAT translations
show ip nat translations

# Test application connectivity
telnet <destination> <port>
```

---

## Emergency Contact Information

**Vendor TAC Escalation:**

| Vendor | Contact | Priority |
|--------|---------|----------|
| **Cisco TAC** | 1-800-553-2447 | P1-P4 |
| **Google Cloud Support** | Cloud Console | P1-P4 |
| **Microsoft Azure Support** | Azure Portal | A-Critical, B-High, C-Medium |
| **ThousandEyes Support** | support@thousandeyes.com | Critical, High, Normal |

**Internal Escalation:**

- **Network Engineering:** escalation@example.com
- **Security Team:** security@example.com
- **Cloud Team:** cloudops@example.com
- **On-Call:** pagerduty.com/escalation-policy

---

## Diagnostic Data Collection

**Standard Data Collection Package:**

```bash
# Cisco Router
show tech-support > tech_support.txt
show run > running_config.txt
show sdwan system status > sdwan_status.txt

# Packet Capture
monitor capture CAP interface <interface> both
monitor capture CAP match ipv4 any any
monitor capture CAP start
# Reproduce issue
monitor capture CAP stop
monitor capture CAP export tftp://<server>/capture.pcap
```

**GCP Logs:**

```bash
# Export logs
gcloud logging read "resource.type=gce_instance" \
  --limit 1000 \
  --format json > gcp_logs.json
```

**Azure Logs:**

```bash
# Export ExpressRoute logs
az monitor activity-log list \
  --resource-group <rg-name> \
  --offset 1d > azure_logs.json
```

---

*For issues not covered here, engage vendor TAC or professional services.*
