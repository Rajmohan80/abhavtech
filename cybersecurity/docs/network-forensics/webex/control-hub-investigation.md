# Control Hub Investigation

 SBC/CUBE PSTN GATEWAY ATTACK

## Investigation Summary

**Incident:** Distributed SIP INVITE flood attack targeted London CUBE gateway, causing service degradation and failed call attempts for 45 minutes.

**Detection:** ThousandEyes alerted on Webex Calling quality degradation; CUBE CPU spiked to 98% processing malicious SIP packets.

**Impact:** 234 failed inbound calls, degraded service for London office users, CUBE resources exhausted.

**Outcome:** DDoS attack from botnet; implemented SIP rate limiting and carrier-level filtering.

---

## Step 1: Detection and Service Impact

**Detection Timestamp:** 2026-01-26 14:32:18 UTC

**Alert Source:** ThousandEyes Webex Calling Test

```
ThousandEyes Alert: Webex Call Quality Degradation
Test: London-Office-Webex-Calling
Metric: Call Setup Time
Baseline: 1.2 seconds
Current: 18.7 seconds (15.6x increase)
MOS Score: Dropped from 4.3 to 1.8 (Poor)
Packet Loss: 23% (baseline: 0.2%)
Location: London Office
```

**Immediate Impact Check:**

```bash
CASE_ID="CASE-2026-008-SIP-DDOS"

curl -X POST https://abhavtech.service-now.com/api/now/table/incident \
  -H 'Content-Type: application/json' \
  -d '{
    "short_description": "Webex Calling Service Degradation - London",
    "description": "ThousandEyes detected call quality issues, high latency",
    "urgency": "1",
    "impact": "2",
    "category": "Performance"
  }'

## INC0012351
```

---

## Step 2: CUBE Health Analysis

**2.1 Check CUBE CPU and Memory:**

```bash
## SSH to London CUBE
ssh admin@london-cube-01.abhavtech.com

## Check CPU utilization
London-CUBE-01# show processes cpu sorted

CPU utilization for five seconds: 98%/12%; one minute: 95%; five minutes: 87%

PID   Runtime(ms)   Invoked    uSecs    5Sec   1Min   5Min   TTY Process
142   82471947      94827393   869      87.2%  85.1%  78.3%  0   SIP Process
89    12847293      38472938   333      8.9%   7.2%   6.1%   0   IP Input
...

## SIP Process consuming 87% CPU (abnormal - baseline: 15%)

## Check memory
London-CUBE-01# show memory statistics

        Head    Total(b)    Used(b)    Free(b)   Lowest(b)  Largest(b)
Processor  8A2C4D60  2147483648  1947283648  200199000  198374920  187294872

## Memory at 90% utilization (abnormal - baseline: 45%)
```

**2.2 Check Active Call Statistics:**

```bash
## Query active calls
London-CUBE-01# show call active voice brief | include ACTIVE

Total active calls: 482

## Normal capacity: 50 channels
## Current: 482 calls (9.6x overcapacity!)

## Most calls are in "ALERTING" state (ringing but not answered)
London-CUBE-01# show call active voice brief | include ALERTING | count

Count: 467 calls in ALERTING state

## 467 calls stuck in alerting = SIP attack signature
```

**2.3 Analyze SIP Message Rate:**

```bash
## Check SIP statistics
London-CUBE-01# show sip-ua statistics

Total SIP messages received: 84729384
Total SIP messages sent: 28374928

SIP messages received (last 60 seconds):
  INVITE:     8472  # ← ABNORMAL: Should be ~10/min, seeing 8472/min
  ACK:        23
  BYE:        45
  CANCEL:     12
  REGISTER:   0
  OPTIONS:    234

## INVITE flood: 8,472 INVITEs per minute (847x normal rate)
```

---

## Step 3: Capture Malicious SIP Traffic

**3.1 Enable SIP Debugging:**

```bash
## Enable SIP message debugging (WARNING: High CPU impact)
London-CUBE-01# debug voip ccapi inout
London-CUBE-01# debug ccsip messages

## Sample output (first 10 messages):
*Jan 26 14:33:02.123: SIP/2.0 INVITE sip:+442012345678@london-cube-01.abhavtech.com
*Jan 26 14:33:02.234: Via: SIP/2.0/UDP 114.91.XX.XXX:5060
*Jan 26 14:33:02.345: From: "Attacker" <sip:000000000@114.91.XX.XXX>
*Jan 26 14:33:02.456: To: <sip:+442012345678@london-cube-01.abhavtech.com>
*Jan 26 14:33:02.567: Call-ID: malicious-123456@114.91.XX.XXX
*Jan 26 14:33:02.678: CSeq: 1 INVITE
*Jan 26 14:33:02.789: Max-Forwards: 70
*Jan 26 14:33:02.890: User-Agent: friendly-scanner
*Jan 26 14:33:02.901: Contact: <sip:000000000@114.91.XX.XXX:5060>
*Jan 26 14:33:02.912: Content-Length: 0

## Disable debugging (too much output)
London-CUBE-01# no debug all
```

**3.2 Capture SIP Packets via SPAN:**

```bash
## Configure SPAN on switch connected to CUBE WAN interface
ssh admin@london-wan-sw01.abhavtech.com

London-WAN-SW01# config t
London-WAN-SW01(config)# monitor session 1 source interface Gi1/0/1
London-WAN-SW01(config)# monitor session 1 destination interface Gi1/0/48
London-WAN-SW01(config)# monitor session 1 filter ip
London-WAN-SW01(config)# end

## On forensics workstation, capture SIP traffic
sudo tcpdump -i eth0 -w /tmp/sip-attack.pcap \
  'port 5060 or port 5061' \
  -G 300 -W 1

## After 5 minutes...
sudo mv /tmp/sip-attack.pcap \
  /mnt/evidence_vault/EVD-20260126-001-sip-attack.pcap

## File size: 4.2 GB (massive INVITE flood)

## Register on blockchain
sha256sum /mnt/evidence_vault/EVD-20260126-001-sip-attack.pcap
## b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4

peer chaincode invoke -n evidence-contract -C evidence-channel \
  -c '{"Args":["CollectEvidence","EVD-20260126-001","CASE-2026-008-SIP-DDOS",...]}'
```

**3.3 Analyze Attack Pattern with Wireshark:**

```bash
## Open in Wireshark
wireshark /mnt/evidence_vault/EVD-20260126-001-sip-attack.pcap &

## Apply SIP filter
## sip.Method == "INVITE"

## Statistics → Conversations → IPv4
## Top 10 source IPs:

IP Address       Packets    Bytes        Comment
114.91.XX.XXX     487293     2847382947   Bot #1
121.58.XX.XXX    398472     1847293847   Bot #2
122.67.XX.XXX     287493     1283749283   Bot #3
116.73.XX.XXX     234729     982374928    Bot #4
...

## 234 unique source IPs (botnet)
## All sending INVITE floods to same destination: +442012345678

## Extract unique source IPs
tshark -r /mnt/evidence_vault/EVD-20260126-001-sip-attack.pcap \
  -Y "sip.Method == INVITE" \
  -T fields -e ip.src \
  | sort | uniq > /mnt/evidence_vault/EVD-20260126-002-attacker-ips.txt

wc -l /mnt/evidence_vault/EVD-20260126-002-attacker-ips.txt
## 234 unique attacker IPs
```

---

## Step 4: Identify Attack Characteristics

**4.1 Analyze INVITE Messages:**

```bash
## Extract INVITE details with tshark
tshark -r /mnt/evidence_vault/EVD-20260126-001-sip-attack.pcap \
  -Y "sip.Method == INVITE" \
  -T fields \
  -e frame.time \
  -e ip.src \
  -e sip.from.user \
  -e sip.to.user \
  -e sip.User-Agent \
  -E header=y \
  > /mnt/evidence_vault/EVD-20260126-003-invite-analysis.csv

## Sample output:
frame.time,ip.src,sip.from.user,sip.to.user,sip.User-Agent
2026-01-26 14:32:18,114.91.XX.XXX,000000000,+442012345678,friendly-scanner
2026-01-26 14:32:18,121.58.XX.XXX,000000000,+442012345678,friendly-scanner
2026-01-26 14:32:18,122.67.XX.XXX,111111111,+442012345678,friendly-scanner
2026-01-26 14:32:18,116.73.XX.XXX,222222222,+442012345678,sipvicious

## Characteristics:
## - User-Agent: "friendly-scanner" or "sipvicious" (attack tools)
## - From: Sequential numbers (000000000, 111111111, 222222222)
## - To: All targeting same number (+442012345678)
## - Call-ID: Random/malicious patterns
## - No SDP (Session Description Protocol) body - incomplete INVITEs
```

**4.2 Calculate Attack Rate:**

```python
## Calculate INVITEs per second
import pandas as pd
from datetime import datetime

## Load CSV
df = pd.read_csv('/mnt/evidence_vault/EVD-20260126-003-invite-analysis.csv')
df['timestamp'] = pd.to_datetime(df['frame.time'])

## Group by second
invites_per_second = df.groupby(df['timestamp'].dt.floor('S')).size()

print(f"Average INVITEs/second: {invites_per_second.mean():.1f}")
print(f"Peak INVITEs/second: {invites_per_second.max()}")
print(f"Attack duration: {(df['timestamp'].max() - df['timestamp'].min()).seconds / 60:.1f} minutes")

## Output:
## Average INVITEs/second: 141.2
## Peak INVITEs/second: 287
## Attack duration: 45.3 minutes
```

---

## Step 5: Identify Target and Motivation

**5.1 Check Targeted Number:**

```bash
## All attacks target: +442012345678
## Lookup in Webex Control Hub

curl -X GET "https://webexapis.com/v1/people?callingData=true&displayName=+442012345678" \
  -H "Authorization: Bearer $WEBEX_TOKEN"

## Output:
{
  "items": [
    {
      "id": "Y2lzY29zcGFyazovL3VzL1BFT1BMRS8xMjM0NQ",
      "displayName": "CEO Office - Reception",
      "phoneNumbers": [
        {
          "type": "work",
          "value": "+442012345678"
        }
      ],
      "locationId": "london-office-id"
    }
  ]
}

## Target: CEO office reception line
```

**5.2 Determine Attack Goal:**

- **Disruption:** Prevent legitimate calls from reaching CEO office
- **Reconnaissance:** Test CUBE capacity and security controls
- **Ransom:** Precursor to extortion demand (call off attack for payment)

**No ransom demand received, likely just disruption/testing**

---

## Step 6: Check Carrier Filtering

**6.1 Query Carrier (Verizon) for Filtering:**

```bash
## Contact Verizon SOC
## Phone call to carrier NOC: 2026-01-26 14:50:00

## Verizon Response:
## - Detected abnormal SIP traffic to customer trunk
## - No filtering applied (customer responsible for DDoS mitigation)
## - Offered to enable carrier-level SIP firewall ($500/month)

## Carrier did NOT filter attack traffic
```

---

## Step 7: Immediate Mitigation

**7.1 Implement CUBE Rate Limiting:**

```bash
## SSH to London CUBE
ssh admin@london-cube-01.abhavtech.com

## Configure SIP rate limiting
London-CUBE-01# config t
London-CUBE-01(config)# voice service voip
London-CUBE-01(config-voi-serv)# ip address trusted list
London-CUBE-01(config-voi-serv-trunk)# ipv4 198.51.100.0 255.255.255.0  # Verizon SIP proxy range
London-CUBE-01(config-voi-serv-trunk)# exit

## Reject SIP from untrusted sources
London-CUBE-01(config-voi-serv)# sip
London-CUBE-01(config-voi-sip)# midcall-signaling passthru
London-CUBE-01(config-voi-sip)# early-offer forced
London-CUBE-01(config-voi-sip)# g729 annexb-all
London-CUBE-01(config-voi-sip)# options-keepalive
London-CUBE-01(config-voi-sip)# asymmetric payload full

## Rate limit per source IP
London-CUBE-01(config-voi-sip)# call threshold interface 1000  # Max 1000 concurrent per interface
London-CUBE-01(config-voi-sip)# max-forwards 10

## Block known attack User-Agents
London-CUBE-01(config-voi-sip)# early-offer forced
London-CUBE-01(config-voi-sip)# midcall-signaling passthru

## Exit and save
London-CUBE-01(config-voi-sip)# end
London-CUBE-01# write mem

## Rate limiting configured
```

**7.2 Deploy Firewall Rules:**

```bash
## Add FTD firewall rules to block attacker IPs
for IP in $(cat /mnt/evidence_vault/EVD-20260126-002-attacker-ips.txt | head -50); do
  echo "Blocking IP: $IP"
  
  curl -k -X POST \
    "https://fmc.abhavtech.com/api/fmc_platform/v1/domain/default/policy/accesspolicies/<policy-id>/accessrules" \
    -H "X-auth-access-token: $FMC_TOKEN" \
    -d "{
      \"action\": \"BLOCK\",
      \"enabled\": true,
      \"name\": \"Block-SIP-Attack-$IP\",
      \"sourceNetworks\": {\"objects\": [{\"type\": \"Host\", \"value\": \"$IP\"}]},
      \"destinationPorts\": {\"objects\": [{\"type\": \"ProtocolPortObject\", \"protocol\": \"UDP\", \"port\": \"5060\"}]}
    }"
done

## Deploy policy
curl -k -X POST \
  "https://fmc.abhavtech.com/api/fmc_platform/v1/domain/default/deployment/deployabledevices" \
  -H "X-auth-access-token: $FMC_TOKEN"

## Top 50 attacker IPs blocked on firewall
```

**7.3 Monitor Mitigation Effectiveness:**

```bash
## Wait 5 minutes, check CUBE CPU
ssh admin@london-cube-01.abhavtech.com "show processes cpu sorted | include SIP"

## Output:
PID   5Sec   1Min   5Min   Process
142   12.3%  15.2%  24.1%  SIP Process

## CPU normalized (87% → 12%)

## Check active calls
ssh admin@london-cube-01.abhavtech.com "show call active voice brief | count"

## Output: 47 calls (normal)

## Attack mitigated successfully
```

---

## Step 8: Long-Term Hardening

**8.1 Deploy SIP Application Firewall:**

```bash
## Configure CUBE with SIP inspection
London-CUBE-01# config t
London-CUBE-01(config)# class-map type inspect sip match-all SIP-INSPECTION
London-CUBE-01(config-cmap)# match protocol sip

London-CUBE-01(config)# policy-map type inspect sip SIP-POLICY
London-CUBE-01(config-pmap)# class SIP-INSPECTION
London-CUBE-01(config-pmap-c)# inspect
London-CUBE-01(config-pmap-c)# drop log  # Drop and log violations

## Apply to interface
London-CUBE-01(config)# interface GigabitEthernet0/0/0  # WAN interface
London-CUBE-01(config-if)# service-policy type inspect input SIP-POLICY
London-CUBE-01(config-if)# end
London-CUBE-01# write mem
```

**8.2 Enable Carrier-Level DDoS Protection:**

```bash
## Contact Verizon to enable SIP firewall service
## Cost: $500/month
## Features:
## - Rate limiting (configurable thresholds)
## - Geoblocking (block traffic from specific countries)
## - User-Agent filtering
## - SIP message validation
## - Real-time attack mitigation

## Enabled for London and all other PSTN gateways
```

---

## Step 9: Forensics Report

```python
report = {
    "case_id": "CASE-2026-008-SIP-DDOS",
    "incident_type": "SIP INVITE Flood - CUBE DDoS Attack",
    "incident_date": "2026-01-26",
    
    "executive_summary": """
    Distributed SIP INVITE flood attack targeted London CUBE gateway on
    2026-01-26 from 14:32 to 15:17 UTC (45 minutes). Botnet of 234 unique
    IP addresses sent 42,360 malicious SIP INVITE messages (average 141/sec,
    peak 287/sec), exhausting CUBE resources and causing service degradation.
    
    Impact: 234 failed inbound calls, CUBE CPU at 98%, degraded call quality
    for all London users (MOS score dropped from 4.3 to 1.8).
    
    Mitigation: Deployed CUBE rate limiting, blocked top attacker IPs on
    firewall, enabled carrier SIP filtering. Attack stopped within 15 minutes
    of mitigation deployment.
    
    Root Cause: No SIP rate limiting configured on CUBE, no carrier-level
    DDoS protection active.
    
    Long-term: Enabled carrier SIP firewall ($500/mo), deployed SIP application
    inspection, implemented real-time monitoring.
    """,
    
    "recommendations": [
        "Enable carrier DDoS protection on all PSTN gateways",
        "Deploy SIP application-level firewalling",
        "Implement geo-blocking for high-risk countries",
        "Create ThousandEyes alerts for call quality degradation",
        "Configure automatic CUBE rate limiting",
        "Establish SIP baseline monitoring in Splunk"
    ]
}
```

---
