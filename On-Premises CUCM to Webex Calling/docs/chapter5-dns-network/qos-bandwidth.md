# QoS & Bandwidth

## 5.6 QoS Configuration

### 5.6.1 Webex Traffic Classification

| Traffic Type | DSCP Marking | Queue | Bandwidth |
|--------------|--------------|-------|-----------|
| Voice (RTP) | EF (46) | Priority | 128 kbps/call |
| Video | AF41 (34) | Class 4 | 2 Mbps/call |
| Signaling (SIP/TLS) | CS3 (24) | Class 3 | 64 kbps/call |
| App Sharing | AF21 (18) | Class 2 | 1 Mbps/session |

### 5.6.2 SD-WAN QoS Policy (Existing ABV-SDWAN-2024)

**Reference:** Abhavtech SD-WAN uses Cisco SD-WAN (Viptela). QoS policies already configured.

```
! Verify existing Voice policy
show sdwan policy from-vsmart | include voice

! Expected output - Voice class mapped to EF
class voice
 bandwidth-percent 30
 buffer-percent 30
 scheduling strict
```

### 5.6.3 Campus Switch QoS (Existing ABV-SDA-ISE-2025)

**Reference:** SD-Access fabric already has QoS policies for voice VLAN.

```
! Verify voice VLAN QoS on access switch
show policy-map interface GigabitEthernet1/0/1

! Expected - Trust DSCP on voice ports
interface GigabitEthernet1/0/1
 switchport voice vlan 100
 mls qos trust dscp
```

### 5.6.4 QoS Validation Commands

| Platform | Command | Expected Output |
|----------|---------|-----------------|
| Cisco Switch | `show mls qos interface` | Trust DSCP enabled |
| Cisco Router | `show policy-map interface` | EF queue active |
| SD-WAN Edge | `show sdwan policy` | Voice policy applied |
| Palo Alto | `show qos interface` | QoS profile active |

---

