# 7.6 Stealthwatch Integration

### 7.6.1 Stealthwatch Architecture

```
+------------------------------------------------------------------+
|                    STEALTHWATCH INTEGRATION                       |
+------------------------------------------------------------------+

Network Devices              Stealthwatch              DNAC/ISE
(NetFlow Source)            (Analytics)               (Context)

+---------------+        +------------------+       +-------------+
| Fabric Nodes  |------->| Stealthwatch     |<----->| DNAC        |
| (NetFlow)     |        | Management       |       | (Assurance) |
+---------------+        | Console (SMC)    |       +-------------+
       |                 +------------------+              |
       |                        |                          |
+---------------+        +------------------+       +-------------+
| Border Nodes  |------->| Flow Collector   |<----->| ISE         |
| (NetFlow)     |        | (FC)             |       | (pxGrid)    |
+---------------+        +------------------+       +-------------+
       |                        |
       |                        v
+---------------+        +------------------+
| WAN Routers   |------->| Flow Sensor      |
| (NetFlow)     |        | (FS)             |
+---------------+        +------------------+
                                |
                                v
                         +------------------+
                         | UDP Director     |
                         | (Load Balance)   |
                         +------------------+
```

### 7.6.2 NetFlow Configuration for Stealthwatch

```cisco
! NetFlow Configuration on Fabric Nodes

flow exporter STEALTHWATCH
 destination 10.252.50.10
 source Loopback0
 transport udp 2055
 template data timeout 60
 option interface-table
 option exporter-stats
 option application-table

flow record STEALTHWATCH-RECORD
 match ipv4 source address
 match ipv4 destination address
 match transport source-port
 match transport destination-port
 match ipv4 protocol
 match ipv4 tos
 match interface input
 match flow direction
 collect counter bytes long
 collect counter packets long
 collect timestamp sys-uptime first
 collect timestamp sys-uptime last
 collect application name

flow monitor STEALTHWATCH-MONITOR
 exporter STEALTHWATCH
 record STEALTHWATCH-RECORD
 cache timeout active 60
 cache timeout inactive 15

! Apply to all interfaces
interface range GigabitEthernet1/0/1-48
 ip flow monitor STEALTHWATCH-MONITOR input
 ip flow monitor STEALTHWATCH-MONITOR output
```

### 7.6.3 ISE-Stealthwatch pxGrid Integration

```yaml
# ISE pxGrid Configuration for Stealthwatch

pxGrid_Integration:
  ISE_Settings:
    # Administration > pxGrid Services
    Enable_pxGrid: Yes
    
  Stealthwatch_Client:
    Name: Stealthwatch-SMC
    Client_Certificate: stealthwatch-smc.corp.local.pem
    Topics_Subscribed:
      - Session Directory
      - Endpoint Profile
      - TrustSec Configuration
      
  Data_Exchange:
    ISE_to_Stealthwatch:
      - User identity (username)
      - Endpoint MAC address
      - SGT assignment
      - Device profile
      - Session state
      
    Stealthwatch_to_ISE:
      - Threat indicators
      - Anomaly detection
      - Rapid Threat Containment (RTC)
```

### 7.6.4 Threat Detection Use Cases

| Use Case | Detection Method | Response |
|----------|------------------|----------|
| Malware C2 | Known bad IP/domain | Quarantine endpoint (ISE) |
| Data exfiltration | Unusual outbound volume | Alert + investigate |
| Lateral movement | Internal scanning patterns | Micro-segment (SGT) |
| Crypto mining | CPU/network signature | Block + remediate |
| DDoS participation | Outbound flood patterns | Rate limit + alert |
| Insider threat | Abnormal user behavior | Monitor + escalate |

---
