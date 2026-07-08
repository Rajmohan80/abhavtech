# 5.4 Network Monitoring

### 5.4.1 SNMP Monitoring Configuration

**Device SNMP Configuration**

```cisco
! SNMPv3 Configuration on Fabric Nodes

snmp-server group DNAC-GROUP v3 priv
snmp-server user dnac-snmp DNAC-GROUP v3 auth sha <auth_password> priv aes 128 <priv_password>
snmp-server host 10.252.10.10 version 3 priv dnac-snmp

! SNMP Traps
snmp-server enable traps snmp authentication linkdown linkup coldstart warmstart
snmp-server enable traps entity
snmp-server enable traps cpu threshold
snmp-server enable traps memory bufferpeak
snmp-server enable traps config
snmp-server enable traps bridge newroot topologychange
snmp-server enable traps stpx inconsistency root-inconsistency loop-inconsistency
snmp-server enable traps flash insertion removal
snmp-server enable traps envmon fan shutdown supply temperature status
snmp-server enable traps auth-framework sec-violation
snmp-server enable traps dot1x auth-fail-vlan no-resp
```

### 5.4.2 Syslog Configuration

**Device Syslog Configuration**

```cisco
! Syslog Configuration

logging buffered 65536 informational
logging host 10.252.1.30 transport udp port 514
logging host 10.252.1.31 transport udp port 514
logging source-interface Loopback0
logging trap informational

! Structured syslog for ISE profiling
logging discriminator ISE-PROFILING severity includes 6
logging host 10.252.30.10 discriminator ISE-PROFILING transport udp port 1514

! Timestamp configuration
service timestamps log datetime msec localtime show-timezone
service timestamps debug datetime msec localtime show-timezone
```

**Syslog Severity Levels**

| Level | Name | Description | Action |
|-------|------|-------------|--------|
| 0 | Emergency | System unusable | Page on-call |
| 1 | Alert | Immediate action needed | Page on-call |
| 2 | Critical | Critical conditions | Alert NOC |
| 3 | Error | Error conditions | Alert NOC |
| 4 | Warning | Warning conditions | Log, review |
| 5 | Notice | Normal but significant | Log |
| 6 | Informational | Informational messages | Log |
| 7 | Debug | Debug messages | Troubleshooting only |

### 5.4.3 NetFlow Configuration

```cisco
! NetFlow/Flexible NetFlow Configuration

flow exporter DNAC-EXPORTER
 destination 10.252.10.10
 source Loopback0
 transport udp 9996
 template data timeout 60
 option interface-table
 option sampler-table

flow record FABRIC-RECORD
 match ipv4 source address
 match ipv4 destination address
 match transport source-port
 match transport destination-port
 match ipv4 protocol
 match ipv4 tos
 collect counter bytes long
 collect counter packets long
 collect timestamp sys-uptime first
 collect timestamp sys-uptime last

flow monitor FABRIC-MONITOR
 record FABRIC-RECORD
 exporter DNAC-EXPORTER
 cache timeout active 60
 cache timeout inactive 15

! Apply to interfaces
interface range GigabitEthernet1/0/1-48
 ip flow monitor FABRIC-MONITOR input
 ip flow monitor FABRIC-MONITOR output
```

### 5.4.4 Fabric-Specific Monitoring

```cisco
! LISP Monitoring Commands
show lisp site
show lisp instance-id 8001 ipv4 database
show lisp instance-id 8001 ipv4 map-cache
show lisp session

! VXLAN Monitoring
show vxlan tunnel
show vxlan vni
show vxlan interface

! CTS/SGT Monitoring
show cts environment-data
show cts role-based permissions
show cts role-based sgt-map all
show cts role-based counters

! 802.1X Monitoring
show authentication sessions
show authentication interface <interface> details
show dot1x all summary

! Fabric Wireless Monitoring (on WLC)
show wireless fabric summary
show wireless profile fabric detailed <profile>
show wireless client summary
```

---
