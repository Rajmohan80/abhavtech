# 5.9 Troubleshooting Guides

### 5.9.1 Authentication Troubleshooting

```
+------------------------------------------------------------------+
|          AUTHENTICATION TROUBLESHOOTING FLOWCHART                 |
+------------------------------------------------------------------+

User Cannot Authenticate
          |
          v
    +----------------+
    | Check ISE      |---> Authentication in live logs?
    | Live Logs      |
    +----------------+
          |
    +-----+-----+
    |           |
   YES          NO
    |           |
    v           v
+--------+  +------------------+
| Check  |  | Check switch     |
| Failure|  | connectivity     |
| Reason |  +------------------+
+--------+       |
    |            v
    v       +----------------+
[See       | Check RADIUS   |
 Table     | config on NAS  |
 Below]    | show radius    |
           | show aaa       |
           +----------------+
```

**Common ISE Failure Reasons and Resolutions**

| Error Code | Failure Reason | Resolution |
|------------|----------------|------------|
| 5400 | Authentication failed | Check user credentials in AD |
| 5411 | Supplicant stopped responding | Check client supplicant config |
| 5417 | Dynamic authorization failed | Check CoA configuration |
| 5440 | Endpoint not found in portal | Check guest portal config |
| 12302 | Unknown NAS | Add device to network devices |
| 12514 | EAP-TLS failed | Check client certificate |
| 22028 | Authentication timed out | Check PSN reachability |
| 24408 | User not found | Check identity source sequence |
| 24459 | Wrong password | User password issue |

**Switch-Side Authentication Debugging**

```cisco
! Enable authentication debugging
debug authentication all
debug dot1x all
debug radius authentication
debug radius verbose

! Check authentication session
show authentication sessions interface Gi1/0/10 details

! Expected output analysis:
! - Session ID: Unique identifier
! - Method: Should show dot1x or mab
! - Status: Should be "Authorized"
! - SGT: Should show assigned SGT value
! - VLAN: Should match expected VLAN

! Check RADIUS connectivity
test aaa group RADIUS-GROUP admin <password> new-code

! Clear and restart authentication
authentication restart interface Gi1/0/10
```

### 5.9.2 Fabric Troubleshooting

**LISP Troubleshooting**

```cisco
! Check LISP site registrations (on Control Plane)
show lisp site
! All edge nodes should be registered

! Check LISP database (on Edge Node)
show lisp instance-id 8001 ipv4 database
! Should show locally attached EIDs

! Check LISP map-cache (on Edge Node)
show lisp instance-id 8001 ipv4 map-cache
! Should show remote EID-to-RLOC mappings

! Verify LISP session
show lisp session
! Session to CP nodes should be established

! Debug LISP (use with caution)
debug lisp control-plane all
```

**VXLAN Troubleshooting**

```cisco
! Check VXLAN tunnels
show vxlan tunnel
! All tunnels should show "UP"

! Check VXLAN VNI mapping
show vxlan vni
! VNIs should match configured VNs

! Check VXLAN interface
show vxlan interface
! NVE interface should be up

! Verify VXLAN encapsulation
show interface nve1

! Trace packet path through fabric
traceroute vrf VN_CORPORATE <destination_ip>
```

**Underlay Troubleshooting**

```cisco
! Check IS-IS adjacencies
show isis neighbors
! All expected neighbors should be UP

! Check IS-IS database
show isis database detail
! All nodes should have LSP entries

! Check BFD status
show bfd neighbors
! BFD sessions should be UP

! Verify underlay reachability
ping <remote_loopback> source Loopback0

! Check MTU (must support jumbo frames)
ping <remote_loopback> source Loopback0 size 9000 df-bit
```

### 5.9.3 Wireless Troubleshooting

```cisco
! On WLC - Check client status
show wireless client summary
show wireless client mac-address <mac> detail

! Check AP fabric status
show ap summary
show ap name <ap-name> config general

! Check fabric connectivity
show wireless fabric summary
show wireless profile fabric detailed <profile>

! Debug wireless client
debug client mac-address <mac>

! Check RADIUS authentication
show radius server-group all
test aaa radius <server-ip> <username> <password>

! Check wireless SGT assignment
show wireless client mac-address <mac> detail | include SGT
```

### 5.9.4 Quick Reference Troubleshooting Commands

```
+------------------------------------------------------------------+
|                    QUICK TROUBLESHOOTING REFERENCE                |
+------------------------------------------------------------------+

COMPONENT          | VERIFY COMMAND                    | EXPECTED
-------------------|-----------------------------------|------------------
IS-IS              | show isis neighbors               | All UP
LISP               | show lisp site                    | All registered
VXLAN              | show vxlan tunnel                 | All UP
SGT                | show cts role-based sgt-map all   | IP-SGT bindings
802.1X             | show authentication sessions      | Sessions present
RADIUS             | test aaa group <name> <u> <p>     | Success
BFD                | show bfd neighbors                | All UP
MTU                | ping x.x.x.x size 9000 df-bit    | Success
WLC Fabric         | show wireless fabric summary      | Enabled
Client Auth        | show auth session int <if> det    | Authorized
```

---
