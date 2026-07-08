# Appendix B: CLI Quick Reference

### LISP Commands

```cisco
! Show LISP site registrations (on Control Plane)
show lisp site

! Show LISP database (on Edge Node)
show lisp instance-id 8001 ipv4 database

! Show LISP map-cache (on Edge Node)
show lisp instance-id 8001 ipv4 map-cache

! Show LISP sessions
show lisp session

! Debug LISP (use with caution)
debug lisp control-plane all
```

### VXLAN Commands

```cisco
! Show VXLAN tunnel status
show vxlan tunnel

! Show VXLAN VNI mapping
show vxlan vni

! Show NVE interface
show interface nve1

! Show VXLAN peers
show nve peers
```

### IS-IS Commands

```cisco
! Show IS-IS neighbors
show isis neighbors

! Show IS-IS database
show isis database detail

! Show IS-IS routes
show ip route isis

! Debug IS-IS adjacency
debug isis adj-packets
```

### CTS/SGT Commands

```cisco
! Show CTS environment data
show cts environment-data

! Show SGT role-based permissions
show cts role-based permissions

! Show IP-to-SGT bindings
show cts role-based sgt-map all

! Show CTS counters
show cts role-based counters

! Clear SGT cache
clear cts role-based sgt-map all
```

### Authentication Commands

```cisco
! Show authentication sessions
show authentication sessions

! Show authentication session details
show authentication sessions interface Gi1/0/10 details

! Show dot1x summary
show dot1x all summary

! Show MAB summary
show mab all summary

! Debug authentication
debug authentication all
debug dot1x all
debug radius authentication
```

### Device Health Commands

```cisco
! Show CPU utilization
show processes cpu sorted

! Show memory utilization
show memory statistics

! Show environmental status
show environment all

! Show interface errors
show interfaces counters errors

! Show power status
show power inline
```

### Troubleshooting Commands

```cisco
! Trace path through fabric
traceroute vrf VN_CORPORATE <destination>

! Test RADIUS authentication
test aaa group RADIUS-GROUP <username> <password> new-code

! Check RADIUS server status
show radius server-group all

! Show logging
show logging | include error|warning

! Capture packets
monitor capture <name> interface <if> both
```

---
