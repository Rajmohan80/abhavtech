# 2.9.5 Wi-Fi 6E and Wi-Fi 7 Design

## Document Information
| Item | Details |
|------|---------|
| Organization | Abhavtech.com |
| Domain | abhavtech.com |
| Version | 2.0 |
| Last Updated | December 2025 |

---

## 1. Wi-Fi 6E/7 Overview

### 1.1 Technology Comparison

| Feature | Wi-Fi 6 (802.11ax) | Wi-Fi 6E (802.11ax) | Wi-Fi 7 (802.11be) |
|---------|-------------------|---------------------|-------------------|
| Bands | 2.4 GHz, 5 GHz | 2.4 GHz, 5 GHz, 6 GHz | 2.4 GHz, 5 GHz, 6 GHz |
| Max Channel Width | 160 MHz | 160 MHz | 320 MHz |
| Max Data Rate | 9.6 Gbps | 9.6 Gbps | 46 Gbps |
| Modulation | 1024-QAM | 1024-QAM | 4096-QAM |
| Multi-Link Operation | No | No | Yes |
| OFDMA | Yes | Yes | Enhanced |
| Target Wake Time | Yes | Yes | Enhanced |
| WPA3 Required | Optional | **Mandatory** | **Mandatory + Enhanced** |

### 1.2 6 GHz Band Characteristics

```
┌─────────────────────────────────────────────────────────────────────┐
│                    6 GHz Spectrum (5.925 - 7.125 GHz)               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   UNII-5          UNII-6          UNII-7          UNII-8           │
│   5.925-6.425     6.425-6.525     6.525-6.875     6.875-7.125      │
│   500 MHz         100 MHz         350 MHz         250 MHz          │
│                                                                     │
│   ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐   │
│   │ 1 │ 5 │ 9 │13 │17 │21 │25 │29 │...│93 │97 │...│173│177│...│   │
│   └───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘   │
│                                                                     │
│   Total: 59 x 20 MHz channels                                       │
│          29 x 40 MHz channels                                       │
│          14 x 80 MHz channels                                       │
│           7 x 160 MHz channels                                      │
│           3 x 320 MHz channels (Wi-Fi 7)                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Security Requirements

### 2.1 Wi-Fi 6E Security (Mandatory)

| Requirement | Setting | Notes |
|-------------|---------|-------|
| Authentication | WPA3-SAE | No WPA2 fallback on 6 GHz |
| Encryption | AES-CCMP-128 or GCMP-128 | Minimum |
| PMF | Required | Protected Management Frames mandatory |
| Transition Mode | **Not Allowed** | Cannot mix WPA2/WPA3 on 6 GHz |
| Fast Transition | FT + SAE | 802.11r with SAE |

### 2.2 Wi-Fi 7 Security (Enhanced Requirements)

| Requirement | Setting | Notes |
|-------------|---------|-------|
| Authentication | WPA3-SAE with SAE-EXT-KEY | AKM 24 or 25 required |
| Encryption | **GCMP-256** | AES-128 clients cannot use Wi-Fi 7 |
| PMF | **Required** | Mandatory for all Wi-Fi 7 |
| Beacon Protection | **Required** | New for Wi-Fi 7 |
| Enhanced Open | OWE with GCMP-256 | For guest networks |

### 2.3 Security Configuration Matrix

```yaml
Abhavtech_SSID_Security:
  
  Corp-Secure-6E:
    Band: 6 GHz (Wi-Fi 6E)
    Authentication: WPA3-Enterprise
    AKM: SAE (AKM 8)
    Encryption: GCMP-128
    PMF: Required
    Fast_Transition: Enabled (FT-SAE)
    
  Corp-Secure-7:
    Band: 6 GHz (Wi-Fi 7)
    Authentication: WPA3-Enterprise
    AKM: SAE-EXT-KEY (AKM 24)
    Encryption: GCMP-256
    PMF: Required
    Beacon_Protection: Enabled
    Fast_Transition: Enabled (FT-SAE-EXT-KEY)
    MLO: Enabled
    
  Corp-Guest-6E:
    Band: 6 GHz
    Authentication: Enhanced Open (OWE)
    Encryption: GCMP-128
    PMF: Required
    Transition_Mode: Disabled
    CWA: Post-OWE
```

---

## 3. Catalyst 9800 Wi-Fi 7 Configuration

### 3.1 Wi-Fi 7 WLAN Configuration

```
! Wi-Fi 7 Enterprise WLAN for Abhavtech
!
wlan Corp-Secure-WiFi7 91 Corp-Secure-WiFi7
 ! Security - WPA3 with SAE-EXT-KEY (AKM 24)
 security wpa psk set-key ascii 0 <removed>
 security wpa akm sae-ext-key
 security wpa wpa3
 
 ! Encryption - GCMP-256 (mandatory for Wi-Fi 7)
 security wpa pairwise-cipher gcmp256
 security wpa group-cipher gcmp256
 
 ! Protected Management Frames (mandatory)
 security pmf mandatory
 
 ! Beacon Protection (mandatory for Wi-Fi 7)
 security beacon-protection
 
 ! Fast Transition with SAE-EXT-KEY
 security ft
 security ft akm sae-ext-key
 
 ! 802.1X configuration
 security dot1x authentication-list ISE-ABHAVTECH
 
 ! AAA Override for dynamic VLAN/SGT
 aaa-override
 
 ! Multi-Link Operation (Wi-Fi 7 specific)
 multilink-operation
 
 no shutdown
!
```

### 3.2 Wi-Fi 6E WLAN Configuration

```
! Wi-Fi 6E Enterprise WLAN (backward compatible)
!
wlan Corp-Secure-WiFi6E 90 Corp-Secure-WiFi6E
 ! Security - WPA3-SAE (mandatory for 6 GHz)
 security wpa akm sae
 security wpa wpa3
 
 ! Encryption - GCMP-128 minimum
 security wpa pairwise-cipher gcmp128
 
 ! PMF mandatory for 6 GHz
 security pmf mandatory
 
 ! Fast Transition
 security ft
 security ft akm sae
 
 ! 802.1X
 security dot1x authentication-list ISE-ABHAVTECH
 aaa-override
 
 no shutdown
!
```

### 3.3 Enhanced Open (OWE) for Guest

```
! Enhanced Open for Guest on 6 GHz
!
wlan Corp-Guest-OWE 92 Corp-Guest-OWE
 ! Enhanced Open with OWE
 security owe
 
 ! Encryption - GCMP-256 for Wi-Fi 7 clients
 security wpa pairwise-cipher gcmp256
 
 ! PMF mandatory
 security pmf mandatory
 
 ! Web Authentication post-OWE
 security web-auth authentication-list ISE-GUEST
 security web-auth parameter-map GUEST-PARAM-MAP
 
 no shutdown
!
```

---

## 4. Multi-Link Operation (MLO) - Wi-Fi 7

### 4.1 MLO Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Multi-Link Operation (MLO)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Wi-Fi 7 Client                      Wi-Fi 7 Access Point         │
│   ┌───────────────┐                   ┌───────────────────┐        │
│   │               │                   │                   │        │
│   │  Link 1 ──────┼───── 5 GHz ──────┼──► Radio 1       │        │
│   │  (Primary)    │                   │                   │        │
│   │               │                   │                   │        │
│   │  Link 2 ──────┼───── 6 GHz ──────┼──► Radio 2       │        │
│   │  (Secondary)  │                   │                   │        │
│   │               │                   │                   │        │
│   └───────────────┘                   └───────────────────┘        │
│                                                                     │
│   Benefits:                                                         │
│   • Aggregated throughput across links                             │
│   • Seamless failover between links                                │
│   • Reduced latency through link selection                         │
│   • Single MAC address across all links                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 MLO Configuration

```
! Enable MLO on Wi-Fi 7 WLAN
!
wlan Corp-Secure-WiFi7 91 Corp-Secure-WiFi7
 multilink-operation
 ! MLO specific settings
 mlo-link-preference performance
 mlo-transition-delay 50
!

! AP MLO Settings
!
ap profile ABHAVTECH-WIFI7-PROFILE
 ! Enable MLO on capable APs
 multilink enable
 ! Link configuration
 multilink-config 5ghz primary
 multilink-config 6ghz secondary
!
```

### 4.3 MLO Verification

```
! Show MLO status
show wireless client mac-address <mac> detail

Client MAC Address : e4:60:17:bb:3a:50
Protocol : 802.11be
Multilink Client : Yes
  Primary Link : 5 GHz (Channel 36)
  Secondary Link : 6 GHz (Channel 5)
  Link Aggregation : Active
  
! Show AP MLO capability
show ap name ABHAVTECH-AP-01 multilink

AP Name: ABHAVTECH-AP-01
MLO Capable: Yes
MLO Enabled: Yes
Active MLO Clients: 45
```

---

## 5. RF Design for 6 GHz

### 5.1 Propagation Considerations

| Factor | 5 GHz | 6 GHz | Impact |
|--------|-------|-------|--------|
| Free Space Path Loss | Baseline | +2-3 dB higher | Shorter range |
| Wall Penetration | Moderate | Reduced | More APs needed |
| Interference | Congested | Clean spectrum | Better performance |
| Channel Width | 160 MHz max | 320 MHz available | Higher throughput |

### 5.2 6 GHz Site Survey Requirements

```yaml
6GHz_Survey_Requirements:
  
  New_Survey_Required:
    - Dedicated 6 GHz walkthrough
    - Different propagation model
    - Cannot reuse 5 GHz survey data
    
  AP_Placement_Adjustments:
    - 10-20% more APs than 5 GHz
    - Lower mounting height preferred
    - Avoid exterior walls
    
  Power_Considerations:
    - AFC (Automated Frequency Coordination) zones
    - Indoor vs Outdoor power limits
    - Standard Power vs Low Power Indoor
```

### 5.3 Abhavtech 6 GHz Channel Plan

| Site | Channel Width | Primary Channels | AFC Required |
|------|---------------|------------------|--------------|
| Mumbai | 80 MHz | 5, 21, 37, 53, 69, 85 | No (Indoor) |
| Chennai | 80 MHz | 5, 21, 37, 53, 69 | No (Indoor) |
| London | 160 MHz | 5, 37, 69, 101 | Yes |
| Frankfurt | 80 MHz | 5, 21, 37, 53, 69, 85 | Yes |
| New Jersey | 160 MHz | 5, 37, 69, 101, 133 | Yes |
| Dallas | 80 MHz | 5, 21, 37, 53, 69, 85 | Yes |

---

## 6. Access Point Selection

### 6.1 Wi-Fi 7 Capable APs

| Model | Wi-Fi Standard | Radios | Max Data Rate | Use Case |
|-------|---------------|--------|---------------|----------|
| CW9178I | Wi-Fi 7 | Tri-band | 24.2 Gbps | High-density offices |
| CW9176I | Wi-Fi 7 | Tri-band | 19.3 Gbps | Standard offices |
| CW9176D | Wi-Fi 7 | Tri-band | 19.3 Gbps | Directional coverage |
| CW9172H | Wi-Fi 7 | Tri-band | 9.3 Gbps | Hospitality/MDU |

### 6.2 Wi-Fi 6E Capable APs

| Model | Wi-Fi Standard | Radios | Max Data Rate | Use Case |
|-------|---------------|--------|---------------|----------|
| C9164I | Wi-Fi 6E | 5 radios | 7.8 Gbps | High-density |
| C9163E | Wi-Fi 6E | Tri-band | 5.9 Gbps | Outdoor |
| C9136I | Wi-Fi 6E | Tri-band | 5.9 Gbps | Standard |

### 6.3 Abhavtech AP Deployment Plan

| Site | Wi-Fi 7 APs | Wi-Fi 6E APs | Wi-Fi 6 APs | Total |
|------|-------------|--------------|-------------|-------|
| Mumbai | 50 (CW9176I) | 100 (C9136I) | 50 (C9130) | 200 |
| Chennai | 30 (CW9176I) | 60 (C9136I) | 30 (C9130) | 120 |
| London | 40 (CW9176I) | 80 (C9136I) | 40 (C9130) | 160 |
| Frankfurt | 25 (CW9176I) | 50 (C9136I) | 25 (C9130) | 100 |
| New Jersey | 60 (CW9178I) | 120 (C9136I) | 60 (C9130) | 240 |
| Dallas | 30 (CW9176I) | 60 (C9136I) | 30 (C9130) | 120 |
| **Total** | **235** | **470** | **235** | **940** |

---

## 7. Software Requirements

### 7.1 Minimum Versions for Wi-Fi 7

| Component | Minimum Version | Recommended |
|-----------|-----------------|-------------|
| Catalyst 9800 WLC | IOS-XE 17.15.1 | 17.17.1 |
| Catalyst Center | 2.3.7.x | Latest |
| ISE | 3.3 | 3.4 Patch 3 |
| Secure Client | 5.1.2 | 5.1.7+ |

### 7.2 Wi-Fi 7 Readiness Check

```
! Use Wireless Configuration Analyzer Express
! Download from developer.cisco.com

WCAE Wi-Fi 7 Readiness Report:
┌──────────────────────────────────────────────────────────────┐
│ Configuration Check                           │ Status       │
├──────────────────────────────────────────────────────────────┤
│ WPA3 with SAE-EXT-KEY configured             │ ✅ Pass      │
│ GCMP-256 encryption enabled                  │ ✅ Pass      │
│ PMF set to mandatory                         │ ✅ Pass      │
│ Beacon Protection enabled                    │ ✅ Pass      │
│ MLO enabled on WLAN                          │ ✅ Pass      │
│ Compatible AP profile assigned               │ ✅ Pass      │
│ RF profile supports 6 GHz                    │ ✅ Pass      │
└──────────────────────────────────────────────────────────────┘
Overall: Wi-Fi 7 Ready ✅
```

---

## 8. ISE Policy for Wi-Fi 6E/7

### 8.1 Enhanced Authorization Conditions

```xml
<!-- Wi-Fi 7 Client Detection -->
<condition name="WiFi7-Client">
  <attribute>Cisco-AVPair</attribute>
  <operator>CONTAINS</operator>
  <value>protocol=802.11be</value>
</condition>

<!-- Wi-Fi 6E Client Detection -->
<condition name="WiFi6E-Client">
  <attribute>Cisco-AVPair</attribute>
  <operator>CONTAINS</operator>
  <value>band=6ghz</value>
</condition>

<!-- WPA3-SAE Client -->
<condition name="WPA3-SAE-Client">
  <attribute>Cisco-AVPair</attribute>
  <operator>CONTAINS</operator>
  <value>akm=sae</value>
</condition>
```

### 8.2 Wi-Fi 7 Authorization Policy

```
Policy Set: WIFI7-POLICY
│
├── Rule: WiFi7-Enterprise-Full
│   Condition: WiFi7-Client AND AD-Member AND Posture-Compliant
│   Result: 
│     Profile: WiFi7-Full-Access
│     SGT: Employee-WiFi7 (SGT 17)
│     QoS: Platinum
│
├── Rule: WiFi6E-Enterprise
│   Condition: WiFi6E-Client AND AD-Member
│   Result:
│     Profile: WiFi6E-Access
│     SGT: Employee-Full (SGT 10)
│     QoS: Gold
│
└── Default: Standard-Wireless-Access
```

---

## 9. Troubleshooting Wi-Fi 7

### 9.1 Common Issues

| Issue | Cause | Resolution |
|-------|-------|------------|
| Client won't connect on 6 GHz | WPA2 configured | Enable WPA3-only |
| Wi-Fi 7 features not working | AES-128 encryption | Switch to GCMP-256 |
| MLO not activating | Incompatible AP | Verify CW9176/9178 |
| Beacon protection errors | Old WLC firmware | Upgrade to 17.15.1+ |

### 9.2 Verification Commands

```
! Verify Wi-Fi 7 client connection
show wireless client mac-address <mac> detail | inc Protocol|Multilink|Security

! Verify WLAN security settings
show wlan id 91 | inc Security|PMF|Beacon

! Verify AP Wi-Fi 7 capability
show ap name <ap-name> config general | inc Wi-Fi

! Check 6 GHz channel utilization
show ap dot11 6ghz channel
```

---

## 10. Migration Path

### 10.1 Phased Deployment

```yaml
Phase_1_Foundation:
  Duration: Months 1-2
  Activities:
    - Upgrade WLCs to IOS-XE 17.15.1+
    - Upgrade Catalyst Center to 2.3.7+
    - Deploy Wi-Fi 6E APs in pilot buildings
    - Configure WPA3-only SSIDs for 6 GHz
    
Phase_2_Wi-Fi_6E_Rollout:
  Duration: Months 3-4
  Activities:
    - Deploy Wi-Fi 6E APs campus-wide
    - Create dual-band SSIDs (5 GHz + 6 GHz)
    - Migrate enterprise clients to WPA3
    - Validate 6 GHz coverage
    
Phase_3_Wi-Fi_7_Enablement:
  Duration: Months 5-6
  Activities:
    - Deploy Wi-Fi 7 APs (CW9176/CW9178)
    - Enable MLO on SSIDs
    - Configure GCMP-256 encryption
    - Enable Beacon Protection
    
Phase_4_Optimization:
  Duration: Ongoing
  Activities:
    - Monitor AI RRM performance
    - Tune channel plans
    - Optimize MLO settings
    - Client experience monitoring
```

---

*Document Version: 2.0*
*Abhavtech.com - SD-Access Implementation*
