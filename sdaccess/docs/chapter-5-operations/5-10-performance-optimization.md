# 5.10 Performance Optimization

### 5.10.1 DNAC Performance Tuning

```yaml
# System > Settings > System Configuration

Performance_Settings:
  Discovery_Threads: 10 (default)
  Inventory_Sync_Interval: 25 minutes
  Assurance_Collection_Interval: 5 minutes
  Configuration_Archive_Schedule: Daily
  
Database_Optimization:
  # Automatic maintenance runs nightly
  # Manual optimization if needed:
  # System > System 360 > Database Health
  
Log_Retention:
  Audit_Logs: 365 days
  System_Logs: 90 days
  Assurance_Data: 14 days (detailed), 90 days (summary)
```

### 5.10.2 ISE Performance Tuning

```yaml
# Administration > System > Settings

Performance_Settings:
  RADIUS_Request_Timeout: 5 seconds
  RADIUS_Connection_Attempts: 2
  Session_Timeout: 28800 seconds (8 hours)
  Idle_Timeout: 1800 seconds (30 minutes)
  
Profiler_Optimization:
  # Reduce unnecessary probes
  NMAP_Probe: Disabled (unless required)
  SNMP_Probe: Enabled (selective)
  NetFlow_Probe: Enabled (from key switches only)
  
Database_Maintenance:
  MnT_Purge_Interval: 7 days (detailed logs)
  Endpoint_Purge: 90 days (inactive)
  
PSN_Load_Balancing:
  Method: Round-robin
  Health_Check_Interval: 30 seconds
```

### 5.10.3 Switch Performance Tuning

```cisco
! Optimize authentication timers
interface range GigabitEthernet1/0/1-48
 authentication timer reauthenticate 28800
 authentication timer inactivity 1800
 dot1x timeout tx-period 10
 dot1x max-reauth-req 2

! Optimize RADIUS timeouts
radius-server timeout 5
radius-server retransmit 2
radius-server deadtime 15

! Optimize spanning-tree for faster convergence
spanning-tree mode rapid-pvst
spanning-tree portfast default
spanning-tree portfast bpduguard default

! Optimize for fabric
ip tcp path-mtu-discovery
```

---
