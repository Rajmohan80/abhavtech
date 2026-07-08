# SDA Forensics

 ROGUE AP DETECTION VIA AI ENDPOINT ANALYTICS

## Investigation Summary

**Incident:** AI Endpoint Analytics (AIEA) detected anomalous device behavior pattern on wireless network, classifying unknown device as "rogue access point" with 94% confidence.

**Detection:** AIEA behavioral analysis identified device mimicking legitimate AP but with suspicious traffic patterns (evil twin attack).

**Impact:** 12 users connected to rogue AP, credentials potentially compromised, 847 MB data intercepted.

**Outcome:** Rogue AP physically located and removed; affected users required password resets.

---

## Step 1: AIEA Alert Detection

**Detection Timestamp:** 2026-01-23 15:42:18 UTC

**Alert Source:** Catalyst Center AI Endpoint Analytics

```
AIEA Alert: Anomalous Device Detected
MAC Address: 08:96:D7:A1:B2:C3
SSID Advertised: Abhavtech-Corporate (spoofed)
Classification: Rogue Access Point (Evil Twin)
Confidence: 94%
Detection Method: Behavioral Analysis
Connected Clients: 12
Location: Chennai Office (estimated)
Risk Score: 95/100 (Critical)
Recommended Action: Immediate containment and physical removal
```

**Initial Response:**

```bash
CASE_ID="CASE-2026-005-ROGUE-AP"

curl -X POST https://abhavtech.service-now.com/api/now/table/incident \
  -H 'Content-Type: application/json' \
  -d '{
    "short_description": "AIEA Alert - Rogue AP Detected (Evil Twin)",
    "description": "AI Endpoint Analytics detected rogue access point in Chennai office",
    "urgency": "1",
    "impact": "1",
    "category": "Security",
    "assignment_group": "SOC-Forensics-Team"
  }'

## INC0012348
```

---

## Step 2: Collect AIEA Classification Details

**2.1 Export AIEA Analysis:**

```bash
## Query AI Endpoint Analytics API
curl -k -X GET \
  "https://dnac.abhavtech.com/dna/data/api/v1/aiEndpointAnalytics/device/08:96:D7:A1:B2:C3/classification" \
  -H "X-Auth-Token: $DNAC_TOKEN" \
  > /mnt/evidence_vault/EVD-20260123-001-aiea-classification.json

## Register on blockchain
sha256sum /mnt/evidence_vault/EVD-20260123-001-aiea-classification.json
peer chaincode invoke -n evidence-contract -C evidence-channel \
  -c '{"Args":["CollectEvidence","EVD-20260123-001","CASE-2026-005-ROGUE-AP",...]}'
```

**2.2 Parse AIEA Output:**

```bash
jq '.response' /mnt/evidence_vault/EVD-20260123-001-aiea-classification.json

## Output:
{
  "device_mac": "08:96:D7:A1:B2:C3",
  "classification": {
    "primary": "rogue_access_point",
    "secondary": ["evil_twin", "ssid_spoof"],
    "confidence": 0.94,
    "model_version": "AIEA-v2.1.0",
    "classification_timestamp": "2026-01-23T15:42:18Z"
  },
  "behavioral_analysis": {
    "normal_ap_similarity": 0.87,    # Mimics legitimate AP
    "traffic_pattern_anomaly": 0.92, # Suspicious traffic
    "ssid_match": "Abhavtech-Corporate",  # Spoofed
    "bssid_mismatch": true,          # Different BSSID than legitimate
    "channel": 6,
    "frequency": "2.4 GHz",
    "signal_strength_dbm": -45,
    "client_count": 12,
    "first_seen": "2026-01-23T14:15:00Z",
    "last_seen": "2026-01-23T15:42:00Z"
  },
  "anomalous_features": [
    {
      "feature": "ssid_broadcast",
      "value": "Abhavtech-Corporate",
      "legitimate_bssid": "70:DB:98:1A:2B:3C",  # Real AP
      "rogue_bssid": "08:96:D7:A1:B2:C3",       # Rogue AP
      "anomaly_score": 0.98
    },
    {
      "feature": "channel_overlap",
      "value": "Same channel as legitimate AP (CH 6)",
      "anomaly_score": 0.95
    },
    {
      "feature": "stronger_signal",
      "value": "-45 dBm (rogue) vs -68 dBm (legitimate)",
      "anomaly_score": 0.89,
      "comment": "Rogue AP closer to users, stronger signal"
    },
    {
      "feature": "dhcp_behavior",
      "value": "DHCP server responses observed",
      "anomaly_score": 0.92,
      "comment": "Rogue providing DHCP (not expected for client device)"
    },
    {
      "feature": "dns_proxying",
      "value": "DNS queries intercepted and proxied",
      "anomaly_score": 0.94,
      "comment": "Man-in-the-middle DNS interception"
    }
  ],
  "connected_clients": [
    {"mac": "3C:07:54:12:34:56", "ip": "192.168.100.101", "hostname": "LAPTOP-CHN-USER01"},
    {"mac": "A4:83:E7:23:45:67", "ip": "192.168.100.102", "hostname": "LAPTOP-CHN-USER02"},
    {"mac": "68:05:CA:34:56:78", "ip": "192.168.100.103", "hostname": "LAPTOP-CHN-USER03"},
    {"mac": "DC:A6:32:45:67:89", "ip": "192.168.100.104", "hostname": "LAPTOP-CHN-USER04"},
    {"mac": "00:0C:29:56:78:9A", "ip": "192.168.100.105", "hostname": "LAPTOP-CHN-USER05"},
    {"mac": "20:C9:D0:67:89:AB", "ip": "192.168.100.106", "hostname": "LAPTOP-CHN-USER06"},
    {"mac": "F4:5C:89:78:9A:BC", "ip": "192.168.100.107", "hostname": "iPhone-User07"},
    {"mac": "E8:DE:27:89:AB:CD", "ip": "192.168.100.108", "hostname": "iPad-User08"},
    {"mac": "AC:DE:48:9A:BC:DE", "ip": "192.168.100.109", "hostname": "LAPTOP-CHN-USER09"},
    {"mac": "10:DD:B1:AB:CD:EF", "ip": "192.168.100.110", "hostname": "LAPTOP-CHN-USER10"},
    {"mac": "B8:E8:56:BC:DE:F0", "ip": "192.168.100.111", "hostname": "LAPTOP-CHN-USER11"},
    {"mac": "64:20:0C:CD:EF:01", "ip": "192.168.100.112", "hostname": "LAPTOP-CHN-USER12"}
  ],
  "risk_assessment": {
    "risk_score": 95,
    "risk_level": "critical",
    "potential_threats": [
      "Credential harvesting (WPA2-Enterprise)",
      "Man-in-the-middle attack",
      "DNS hijacking",
      "Traffic interception",
      "Malware distribution"
    ]
  }
}
```

**AIEA Key Findings:**
- **94% confidence** this is a rogue AP
- **Spoofing SSID:** "Abhavtech-Corporate"
- **Stronger signal** than legitimate AP (-45 dBm vs -68 dBm)
- **Same channel** as legitimate (Channel 6)
- **12 users connected** unknowingly
- **DHCP + DNS services** running (MITM capability)

---

## Step 3: Validate with Wireless Infrastructure

**3.1 Check Legitimate AP Configuration:**

```bash
## Query Catalyst Center for legitimate APs broadcasting this SSID
curl -k -X GET \
  "https://dnac.abhavtech.com/dna/intent/api/v1/wireless/ap?ssid=Abhavtech-Corporate&location=Chennai" \
  -H "X-Auth-Token: $DNAC_TOKEN" \
  | jq '.response[] | {
      ap_name: .apName,
      mac: .macAddress,
      channel: .radioStats.channel,
      power_dbm: .radioStats.powerDbm,
      connected_clients: .clientCount
    }'

## Output:
{
  "ap_name": "Chennai-FL2-AP-01",
  "mac": "70:DB:98:1A:2B:3C",  # Legitimate BSSID
  "channel": 6,
  "power_dbm": -68,  # Weaker signal than rogue
  "connected_clients": 23
}

## Confirmed: Rogue AP (08:96:D7:A1:B2:C3) != Legitimate AP (70:DB:98:1A:2B:3C)
```

**3.2 Check WLC for Rogue Detection:**

```bash
## Query WLC API for rogue AP entries
curl -k -X GET \
  "https://wlc-chennai.abhavtech.com/webacs/api/v1/data/RogueAPs.json?.full=true" \
  -H "Authorization: Basic $WLC_AUTH" \
  | jq '.queryResponse.entity[] | select(.rogueApsDTO.macAddress == "08:96:D7:A1:B2:C3")'

## Output:
{
  "rogueApsDTO": {
    "macAddress": "08:96:D7:A1:B2:C3",
    "ssid": "Abhavtech-Corporate",
    "detectingAP": "Chennai-FL2-AP-01",
    "channel": 6,
    "rssi": -45,
    "classification": "Malicious",  # WLC also flagged it
    "containmentLevel": "0",  # Not yet contained
    "firstDetected": "2026-01-23T14:15:23Z",
    "lastDetected": "2026-01-23T15:42:18Z",
    "clientCount": 12,
    "state": "Alert"
  }
}

## WLC confirms: Malicious rogue AP detected
```

---

## Step 4: Locate Rogue AP Physically

**4.1 Triangulate Location:**

```bash
## Query DNAC for signal strength from multiple APs
curl -k -X GET \
  "https://dnac.abhavtech.com/dna/intent/api/v1/wireless/rogue-ap/08:96:D7:A1:B2:C3/detection" \
  -H "X-Auth-Token: $DNAC_TOKEN" \
  | jq '.response.detecting_aps | sort_by(.rssi) | reverse | .[:3]'

## Output (top 3 detecting APs by signal strength):
[
  {
    "ap_name": "Chennai-FL2-AP-02",
    "ap_mac": "70:DB:98:2C:3D:4E",
    "rssi": -42,  # Strongest
    "location": {
      "floor": "Floor 2",
      "x": 145.3,
      "y": 87.2
    }
  },
  {
    "ap_name": "Chennai-FL2-AP-03",
    "ap_mac": "70:DB:98:3D:4E:5F",
    "rssi": -48,
    "location": {
      "floor": "Floor 2",
      "x": 178.9,
      "y": 92.1
    }
  },
  {
    "ap_name": "Chennai-FL2-AP-01",
    "ap_mac": "70:DB:98:1A:2B:3C",
    "rssi": -51,
    "location": {
      "floor": "Floor 2",
      "x": 134.7,
      "y": 115.4
    }
  }
]

## Triangulation calculation:
## Rogue AP strongest at Chennai-FL2-AP-02
## Estimated location: Floor 2, near coordinates (145, 87)
## This corresponds to: Conference Room 2B
```

**4.2 Generate Heatmap:**

```python
## Generate RF heatmap showing rogue AP location
python3 << 'EOF'
import matplotlib.pyplot as plt
import numpy as np

## Detecting AP locations and RSSI
aps = [
    {"name": "AP-02", "x": 145.3, "y": 87.2, "rssi": -42},
    {"name": "AP-03", "x": 178.9, "y": 92.1, "rssi": -48},
    {"name": "AP-01", "x": 134.7, "y": 115.4, "rssi": -51}
]

## Estimate rogue AP location using weighted centroid
total_weight = sum(1 / abs(ap['rssi']) for ap in aps)
rogue_x = sum(ap['x'] / abs(ap['rssi']) for ap in aps) / total_weight
rogue_y = sum(ap['y'] / abs(ap['rssi']) for ap in aps) / total_weight

print(f"Estimated Rogue AP Location: ({rogue_x:.1f}, {rogue_y:.1f})")

## Plot floor plan with AP locations
fig, ax = plt.subplots(figsize=(12, 8))

## Floor 2 outline (simplified)
floor = plt.Rectangle((100, 50), 120, 100, fill=False, edgecolor='black', linewidth=2)
ax.add_patch(floor)

## Conference rooms
conf_2a = plt.Rectangle((130, 70), 30, 25, fill=True, facecolor='lightblue', alpha=0.3)
conf_2b = plt.Rectangle((130, 100), 30, 25, fill=True, facecolor='lightcoral', alpha=0.5)
ax.add_patch(conf_2a)
ax.add_patch(conf_2b)
ax.text(145, 112, 'Conf 2B\n(Rogue AP)', ha='center', fontweight='bold')

## Legitimate APs
for ap in aps:
    ax.plot(ap['x'], ap['y'], 'go', markersize=12, label=ap['name'])
    ax.text(ap['x']+2, ap['y']+2, ap['name'], fontsize=9)

## Rogue AP estimated location
ax.plot(rogue_x, rogue_y, 'r*', markersize=20, label='Rogue AP (estimated)')

ax.set_xlim(90, 230)
ax.set_ylim(40, 160)
ax.set_xlabel('X Coordinate (meters)')
ax.set_ylabel('Y Coordinate (meters)')
ax.set_title('Chennai Floor 2 - Rogue AP Location Triangulation')
ax.legend()
ax.grid(True, alpha=0.3)

plt.savefig('/mnt/evidence_vault/EVD-20260123-002-rogue-ap-location.png', dpi=150)
print("✅ Heatmap saved")
EOF

## Register on blockchain
sha256sum /mnt/evidence_vault/EVD-20260123-002-rogue-ap-location.png
peer chaincode invoke -n evidence-contract -C evidence-channel \
  -c '{"Args":["CollectEvidence","EVD-20260123-002","CASE-2026-005-ROGUE-AP",...]}'
```

**Physical Location:** Conference Room 2B, Floor 2, Chennai Office

---

## Step 5: Contain Rogue AP

**5.1 Enable RF Containment:**

```bash
## Configure WLC to contain rogue AP (deauth clients)
curl -k -X POST \
  "https://wlc-chennai.abhavtech.com/webacs/api/v1/op/rogueAPs/contain" \
  -H "Authorization: Basic $WLC_AUTH" \
  -H "Content-Type: application/json" \
  -d '{
    "rogueAPMacAddress": "08:96:D7:A1:B2:C3",
    "containmentLevel": "3",
    "containingAPs": [
      "Chennai-FL2-AP-01",
      "Chennai-FL2-AP-02",
      "Chennai-FL2-AP-03"
    ]
  }'

## Containment actions:
## - Legitimate APs send deauth frames to rogue's clients
## - Rogue AP channel jammed with null frames
## - Client associations to rogue prevented

## Wait 30 seconds for containment to take effect
sleep 30

## Verify clients disconnected from rogue
curl -k -X GET \
  "https://dnac.abhavtech.com/dna/data/api/v1/aiEndpointAnalytics/device/08:96:D7:A1:B2:C3/clients" \
  -H "X-Auth-Token: $DNAC_TOKEN" \
  | jq '.response.connected_clients | length'

## Output: 0 (all clients disconnected)
## RF containment successful
```

**5.2 Dispatch Security to Physical Location:**

```bash
## Alert physical security team
cat << EOF | mail -s "Rogue AP - Physical Removal Required" chennai-security@abhavtech.com
SECURITY ALERT: Rogue Access Point Detected

Location: Conference Room 2B, Floor 2, Chennai Office
Device: Unauthorized wireless access point (MAC: 08:96:D7:A1:B2:C3)
Risk: CRITICAL - 12 users connected, credentials potentially compromised

Actions Required:
1. Proceed to Conference Room 2B immediately
2. Locate unauthorized wireless device (small AP or router)
3. DO NOT POWER OFF - preserve for forensics
4. PHOTOGRAPH device in situ before moving
5. Place device in evidence bag
6. Deliver to IT Security (Bldg A, Room 101)

Contact: SOC Team (ext. 5555) if questions

This is a HIGH PRIORITY security incident.
EOF

## Physical security response log:
## 16:05 - Security dispatched to Floor 2
## 16:12 - Device located in Conference Room 2B (hidden behind projector)
## 16:15 - Device photographed and bagged
## 16:20 - Device delivered to IT Security
```

---

## Step 6: Forensic Analysis of Rogue Device

**6.1 Physical Inspection:**

```
Device Description:
- Manufacturer: TP-Link
- Model: TL-WR841N (consumer router)
- Form Factor: Small travel router (4" x 2.5")
- Power: USB-powered (connected to conference room projector USB port)
- Configuration: Placed behind projector, not easily visible
- Labels: None (stickers removed)
- Serial Number: 21450A0123456 (recorded)

Physical Evidence:
- Device powered on when found
- LED indicators: Power (on), WLAN (blinking), LAN (on)
- Ethernet cable connected to LAN port 1
- No WAN connection observed
```

**6.2 Connect Device to Forensics Workstation:**

```bash
## IMPORTANT: Isolate device on forensics VLAN (no production access)
## Connect LAN port to forensics switch port

## Scan device for open services
nmap -sV -p- 192.168.100.1

## Output:
PORT     STATE SERVICE    VERSION
22/tcp   open  ssh        Dropbear sshd 2019.78
23/tcp   open  telnet     Busybox telnetd
53/tcp   open  domain     dnsmasq 2.80
80/tcp   open  http       lighttpd 1.4.54
443/tcp  open  ssl/http   lighttpd 1.4.54

## Services detected: SSH, Telnet, DNS, HTTP/HTTPS
```

**6.3 Attempt Login:**

```bash
## Try default credentials
## Common TP-Link defaults: admin/admin

curl -k -X POST http://192.168.100.1/cgi-bin/luci \
  -d "username=admin&password=admin"

## Response: HTTP 200 (login successful!)
## Device still using default credentials

## Access web interface and export configuration
curl -k -X GET http://192.168.100.1/cgi-bin/luci/admin/system/backup \
  --cookie "sysauth=..." \
  > /mnt/evidence_vault/EVD-20260123-003-rogue-ap-config.tar.gz

## Register on blockchain
sha256sum /mnt/evidence_vault/EVD-20260123-003-rogue-ap-config.tar.gz
peer chaincode invoke -n evidence-contract -C evidence-channel \
  -c '{"Args":["CollectEvidence","EVD-20260123-003","CASE-2026-005-ROGUE-AP",...]}'
```

**6.4 Extract Configuration:**

```bash
## Decompress and analyze config
tar -xzf /mnt/evidence_vault/EVD-20260123-003-rogue-ap-config.tar.gz -C /tmp/rogue-config

## Check wireless config
cat /tmp/rogue-config/etc/config/wireless

config wifi-device 'radio0'
    option type 'mac80211'
    option channel '6'
    option hwmode '11g'
    option htmode 'HT20'
    option txpower '20'

config wifi-iface 'default_radio0'
    option device 'radio0'
    option network 'lan'
    option mode 'ap'
    option ssid 'Abhavtech-Corporate'  # ← Spoofed SSID
    option encryption 'psk2'
    option key 'Welcome123'  # ← WEAK PASSWORD (not actual corporate password)

## Check DHCP config
cat /tmp/rogue-config/etc/config/dhcp

config dnsmasq
    option domain 'abhavtech.local'  # ← Spoofed domain
    option log-queries '1'
    option log-dhcp '1'

config dhcp 'lan'
    option interface 'lan'
    option start '100'
    option limit '150'
    option leasetime '12h'
    option dhcp_option '3,192.168.100.1'  # Gateway (rogue AP)
    option dhcp_option '6,192.168.100.1'  # DNS (rogue AP)

## Confirmed: Evil twin attack with DNS hijacking capability
```

**6.5 Check for Malicious Software:**

```bash
## Check for packet capture tools
ssh admin@192.168.100.1 "ls /usr/sbin | grep -i tcpdump"
## Output: tcpdump (FOUND)

## Check for running packet captures
ssh admin@192.168.100.1 "ps | grep tcpdump"
## Output:
12345 root  tcpdump -i br-lan -w /tmp/capture.pcap

## CRITICAL: Attacker was capturing all traffic!

## Download captured traffic
scp admin@192.168.100.1:/tmp/capture.pcap \
  /mnt/evidence_vault/EVD-20260123-004-intercepted-traffic.pcap

## File size: 847 MB (1.5 hours of captured traffic)

## Register on blockchain
sha256sum /mnt/evidence_vault/EVD-20260123-004-intercepted-traffic.pcap
peer chaincode invoke -n evidence-contract -C evidence-channel \
  -c '{"Args":["CollectEvidence","EVD-20260123-004","CASE-2026-005-ROGUE-AP",...]}'
```

---

## Step 7: Analyze Intercepted Traffic

**7.1 PCAP Analysis with Wireshark:**

```bash
## Open captured traffic
wireshark /mnt/evidence_vault/EVD-20260123-004-intercepted-traffic.pcap &

## Apply filters to identify sensitive data
## Filter 1: HTTP Basic Auth
## http.authbasic

## Filter 2: Credentials in POST data
## http.request.method == "POST" && (frame contains "password" || frame contains "passwd")

## Filter 3: TLS Client Hello (to see which sites accessed)
## tls.handshake.type == 1
```

**7.2 Extract Credentials:**

```bash
## Use tshark to extract HTTP credentials
tshark -r /mnt/evidence_vault/EVD-20260123-004-intercepted-traffic.pcap \
  -Y "http.authorization" \
  -T fields \
  -e frame.time \
  -e ip.src \
  -e http.host \
  -e http.authorization \
  -E header=y \
  > /mnt/evidence_vault/EVD-20260123-005-extracted-creds.csv

## Sample output:
frame.time,ip.src,http.host,http.authorization
2026-01-23 14:32:15,192.168.100.101,intranet.abhavtech.com,Basic dXNlcjAxOlBhc3N3b3JkMTIz
2026-01-23 14:45:22,192.168.100.103,mail.abhavtech.com,Basic dXNlcjAzOkNvcnBvcmF0ZTIwMjU=

## Decode Base64 credentials
echo "dXNlcjAxOlBhc3N3b3JkMTIz" | base64 -d
## Output: user01:Password123

echo "dXNlcjAzOkNvcnBvcmF0ZTIwMjU=" | base64 -d
## Output: user03:Corporate2025

## CRITICAL: User credentials captured in plaintext!
```

**7.3 Identify Accessed Sites:**

```bash
## Extract DNS queries to see what sites were accessed
tshark -r /mnt/evidence_vault/EVD-20260123-004-intercepted-traffic.pcap \
  -Y "dns.flags.response == 0" \
  -T fields \
  -e frame.time \
  -e ip.src \
  -e dns.qry.name \
  | sort | uniq -c | sort -rn | head -20

## Top 20 queried domains:
    523 intranet.abhavtech.com      # Corporate intranet
    412 mail.abhavtech.com          # Corporate email
    347 jira.abhavtech.com          # Project management
    289 confluence.abhavtech.com    # Wiki
    234 salesforce.com              # CRM
    198 office365.com               # Microsoft Office
    187 github.com                  # Code repository
    145 aws.amazon.com              # Cloud services
    ...

## Users accessed sensitive corporate systems via rogue AP
```

---

## Step 8: Identify Affected Users

**8.1 Correlate MAC Addresses with ISE:**

```bash
## Query ISE for user identity associated with captured MACs
for MAC in $(jq -r '.response.connected_clients[].mac' \
  /mnt/evidence_vault/EVD-20260123-001-aiea-classification.json); do
  
  echo "Querying ISE for MAC: $MAC"
  
  curl -k -X GET \
    "https://ise.abhavtech.com/ers/config/endpoint/mac/$MAC" \
    -H "Accept: application/json" \
    -u "forensics-api:$ISE_PASSWORD" \
    | jq '.ERSEndPoint | {mac: .mac, username: .staticProfileAssignment}'
    
done > /mnt/evidence_vault/EVD-20260123-006-affected-users.json

## Sample output:
{"mac":"3C:07:54:12:34:56","username":"user01@abhavtech.com"}
{"mac":"A4:83:E7:23:45:67","username":"user02@abhavtech.com"}
{"mac":"68:05:CA:34:56:78","username":"user03@abhavtech.com"}
...

## Total: 12 affected users identified
```

**8.2 Create User Notification:**

```bash
## Extract affected usernames
AFFECTED_USERS=$(jq -r '.username' \
  /mnt/evidence_vault/EVD-20260123-006-affected-users.json | paste -sd,)

## Send security notification
cat << EOF | mail -s "URGENT: Security Incident - Password Reset Required" $AFFECTED_USERS
SECURITY INCIDENT NOTIFICATION

Your device was connected to an unauthorized wireless network on
2026-01-23 between 14:15 and 16:05 UTC at the Chennai office.

IMPACT:
- Your network traffic may have been intercepted
- Your credentials may have been compromised
- Sensitive data may have been exposed

REQUIRED ACTIONS:
1. Change your Abhavtech password immediately
2. Change passwords for any sites accessed from Chennai office on 01/23
3. Review account activity for unauthorized access
4. Contact IT Security if you accessed banking/financial sites

ASSISTANCE:
Contact IT Security: security@abhavtech.com or ext. 5555

This is a mandatory security action. Non-compliance may result in account suspension.

Abhavtech IT Security Team
EOF
```

---

## Step 9: Remediation

**9.1 Force Password Resets:**

```bash
## Disable affected accounts until password reset
for USER in $(jq -r '.username' \
  /mnt/evidence_vault/EVD-20260123-006-affected-users.json); do
  
  echo "Disabling account: $USER"
  
  # Set AD flag: must change password at next logon
  net user $USER /domain /logonpasswordchg:yes
  
  # Optional: Expire password immediately
  net user $USER /domain /expires:01/23/2026
  
done

## All affected users must reset password before next login
```

**9.2 Revoke Active Sessions:**

```bash
## Query Duo for active sessions from affected users
for USER in $(jq -r '.username' \
  /mnt/evidence_vault/EVD-20260123-006-affected-users.json); do
  
  echo "Revoking sessions for: $USER"
  
  curl -k -X POST \
    "https://api.duosecurity.com/admin/v1/users/$USER/sessions/revoke" \
    -u "$DUO_API_KEY:$DUO_API_SECRET" \
    -d "reason=Security incident - rogue AP exposure"
    
done

## All active sessions terminated
```

**9.3 Enhance Wireless Security:**

```bash
## Update WLC configuration for stronger rogue detection
curl -k -X PUT \
  "https://wlc-chennai.abhavtech.com/webacs/api/v1/config/RoguePolicy" \
  -H "Authorization: Basic $WLC_AUTH" \
  -H "Content-Type: application/json" \
  -d '{
    "roguePolicy": {
      "autoContainment": true,
      "containmentLevel": "3",
      "ssidFilterList": ["Abhavtech-Corporate", "Abhavtech-Guest"],
      "validationMethod": "adhoc",
      "friendlyAPRules": {
        "ssidList": ["Abhavtech-Corporate"],
        "minRSSI": -75,
        "requireValidCertificate": true
      }
    }
  }'

## Configure Catalyst Center to alert on SSID spoofing
curl -k -X POST \
  "https://dnac.abhavtech.com/dna/intent/api/v1/event/subscription" \
  -H "X-Auth-Token: $DNAC_TOKEN" \
  -d '{
    "subscriptionName": "Rogue-AP-SSID-Spoof-Alert",
    "subscriptionEndpoints": [
      {
        "instanceId": "ServiceNow-Webhook",
        "subscriptionDetails": {
          "connectorType": "REST",
          "url": "https://abhavtech.service-now.com/api/now/table/incident"
        }
      }
    ],
    "filter": {
      "eventIds": ["WIRELESS-ROGUE-AP-DETECTED"],
      "severities": ["HIGH", "CRITICAL"]
    }
  }'

## Enhanced rogue detection configured
```

---

## Step 10: Forensics Report and Lessons Learned

**Report Generation:**

```python
report = {
    "case_id": "CASE-2026-005-ROGUE-AP",
    "investigation_type": "Rogue AP Detection via AI Endpoint Analytics",
    "incident_date": "2026-01-23",
    "analyst": "SOC-Analyst-Meera-Reddy",
    
    "executive_summary": """
    AI Endpoint Analytics detected a rogue access point (evil twin attack) in
    Chennai office on 2026-01-23. The device was spoofing the corporate SSID
    'Abhavtech-Corporate' on the same channel (6) as the legitimate AP, with
    a stronger signal to attract client connections.
    
    12 users unknowingly connected to the rogue AP over 1.5 hours. The attacker
    captured 847 MB of network traffic including credentials for corporate
    intranet, email, Jira, Confluence, and Salesforce.
    
    Impact: HIGH
    - 12 users compromised
    - Credentials captured: 6+ plaintext HTTP credentials
    - Sensitive sites accessed: Intranet, email, project management
    - Data intercepted: 847 MB
    
    Response: Rogue AP contained via RF deauth within 30 minutes of detection.
    Physical device located in Conference Room 2B and seized. All affected users
    forced to reset passwords. No evidence of credential misuse detected.
    
    Cost: ~$15,000 (incident response + productivity loss)
    """,
    
    "aiea_effectiveness": """
    AI Endpoint Analytics Performance:
    - Detection time: ~1.5 hours from rogue AP placement
    - Classification confidence: 94%
    - False positives: 0
    - Detection method: Behavioral analysis
    
    AIEA Key Features that Enabled Detection:
    1. SSID spoofing detection (98% anomaly score)
    2. Channel overlap analysis (95% anomaly score)
    3. Signal strength anomaly (89% anomaly score - stronger than legitimate)
    4. DHCP server behavior (92% anomaly score - unexpected for client)
    5. DNS proxying detection (94% anomaly score - MITM indicator)
    
    Traditional Detection Would Have Taken:
    - User complaint-driven: 4-8 hours (estimated)
    - Manual RF scan: 24+ hours (if scheduled scan)
    
    AIEA Value: 2.5-6.5 hours faster detection = Reduced exposure window
    """,
    
    "attacker_profile": """
    Attacker Methodology:
    1. Physical access: Gained entry to Chennai office (visitor? contractor?)
    2. Device placement: Conference room (low traffic, behind projector)
    3. Power source: USB power from projector (no obvious power cable)
    4. Configuration: Consumer TP-Link router with default credentials
    5. Attack type: Evil twin (SSID spoofing) + MITM
    6. Data capture: tcpdump running to /tmp/capture.pcap
    7. Sophistication: LOW (default credentials, no encryption)
    
    Likely Attacker:
    - Script kiddie or opportunistic attacker (not APT)
    - Physical access via social engineering or tailgating
    - Goal: Credential harvesting for later sale or use
    """,
    
    "recommendations": [
        "Deploy 802.1X for all wireless (WPA2-Enterprise with certificate validation)",
        "Implement certificate pinning for corporate applications",
        "Enhance physical security in conference rooms",
        "Disable USB ports on projectors and displays",
        "Conduct quarterly wireless security audits",
        "Train users to verify SSID authenticity (check certificate)",
        "Deploy AIEA alerts to real-time SOC dashboard",
        "Implement MFA for all critical applications (even on internal network)",
        "Consider deploying wireless IDS (Cisco Hyperlocation)",
        "Schedule regular physical sweeps for unauthorized devices"
    ]
}

## Save report
with open('/mnt/evidence_vault/REPORT-CASE-2026-005-ROGUE-AP.json', 'w') as f:
    json.dump(report, f, indent=2)

## Register on blockchain
sha256sum /mnt/evidence_vault/REPORT-CASE-2026-005-ROGUE-AP.json
peer chaincode invoke -n evidence-contract -C evidence-channel \
  -c '{"Args":["CollectEvidence","EVD-20260123-REPORT","CASE-2026-005-ROGUE-AP",...]}'
```

---
