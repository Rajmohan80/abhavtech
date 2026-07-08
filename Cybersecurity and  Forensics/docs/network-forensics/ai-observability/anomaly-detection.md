# Anomaly Detection

 THOUSANDEYES BGP HIJACKING DETECTION

## Investigation Summary

**Incident:** ThousandEyes AI detected BGP route hijacking for Abhavtech's public IP space; traffic rerouted through China.

**Detection:** ML-based path analysis identified anomalous AS path prepending and geolocation shift.

**Impact:** 12 minutes of traffic interception affecting Mumbai and Chennai sites; potential data exposure.

**Outcome:** Upstream ISP notified, BGP routes corrected, RPKI validation enabled to prevent future hijacks.

---

## Step 1: ThousandEyes BGP Alert

**Detection Timestamp:** 2026-02-04 08:17:23 UTC

**Alert Source:** ThousandEyes Network Intelligence - BGP Hijack Detection

```
ThousandEyes Alert: BGP Route Hijacking Detected
Prefix: 102.23.XX.XXX/24 (Abhavtech Mumbai/Chennai)
Alert Type: BGP Hijack
Confidence: 98%
Severity: CRITICAL

Anomaly Details:
Normal Path:
  AS Path: AS15169 (Google) → AS9498 (Bharti Airtel) → AS138478 (Abhavtech)
  Origin AS: AS138478 (Abhavtech - legitimate)
  Prefix Length: /24
  Route Propagation: 847 peers
  Geographic Path: US → IN (Mumbai)

Hijacked Path:
  AS Path: AS4134 (China Telecom) → AS138478 (Abhavtech)  # ← Suspicious
  Origin AS: AS138478 (appears legitimate, but path is wrong)
  Prefix Length: /24 (more specific, wins over /22 aggregate)
  Route Propagation: 234 peers
  Geographic Path: US → CN (Beijing) → IN (Mumbai)  # ← Traffic via China!

ThousandEyes AI Analysis:
- AS Path anomaly score: 0.94 (very high)
- Geolocation anomaly: Traffic routing through China (never baseline)
- Path length increase: +2 AS hops
- Latency increase: +147ms
- Packet loss: 2.3% (baseline: 0.1%)
- First seen: 2026-02-04 08:05:12 UTC (12 minutes ago)
```

**Immediate Response:**

```bash
CASE_ID="CASE-2026-017-BGP-HIJACK"
INVESTIGATION_TYPE="bgp_route_hijacking"

## ServiceNow incident
curl -X POST https://abhavtech.service-now.com/api/now/table/incident \
  -d '{
    "short_description": "CRITICAL: BGP Hijack - Traffic via China",
    "urgency": "1",
    "impact": "1",
    "category": "Security - BGP Hijacking",
    "u_nation_state_threat": true
  }'

## INC0012360

## Notify CISO immediately
curl -X POST https://slack.com/api/chat.postMessage \
  -H "Authorization: Bearer $SLACK_TOKEN" \
  -d '{
    "channel": "@ciso",
    "text": "🚨 CRITICAL BGP HIJACK: 102.23.XX.XXX/24 routed via China. 12 min exposure. Investigating."
  }'

## Contact upstream ISP (Bharti Airtel)
## Phone: +91-124-4222222 (NOC)
```

---

## Step 2: Verify BGP Hijacking

**2.1 Check Route Visibility:**

```bash
## Query multiple BGP route servers
for RS in route-views.routeviews.org rrc00.ripe.net route-server.east.us; do
  echo "=== Route Server: $RS ==="
  telnet $RS 23 << EOF
show ip bgp 102.23.XX.XXX/24
exit
EOF
done

## Output shows two announcements:
## Route 1 (Legitimate):
## 102.23.XX.XXX/24 via AS9498 AS138478
## Origin: AS138478
## Path: AS15169 AS9498 AS138478
## Next Hop: 102.23.XX.XXX
#
## Route 2 (Hijacked):
## 102.23.XX.XXX/24 via AS4134 AS138478 # ← China Telecom
## Origin: AS138478 (FORGED)
## Path: AS4134 AS138478
## Next Hop: 119.56.XX.XXX (China)

## Confirmed: Dual announcement (legitimate + hijack)
```

**2.2 Analyze AS Path:**

```python
## Parse BGP data
legitimate_path = ["AS15169", "AS9498", "AS138478"]  # Google → Airtel → Abhavtech
hijacked_path = ["AS4134", "AS138478"]                # China Telecom → "Abhavtech"

print("Path Comparison:")
print(f"  Legitimate: {' → '.join(legitimate_path)}")
print(f"  Hijacked: {' → '.join(hijacked_path)}")
print(f"  Hijacked path is SHORTER (BGP prefers shorter paths)")
print(f"  ⚠️ Hijacker exploited BGP path selection algorithm")

## Geolocation analysis
import geoip2.database
reader = geoip2.database.Reader('/usr/share/GeoIP/GeoLite2-City.mmdb')

next_hop_hijacked = "119.56.XX.XXX"
response = reader.city(next_hop_hijacked)

print(f"\nHijacked Next Hop Geolocation:")
print(f"  IP: {next_hop_hijacked}")
print(f"  Country: {response.country.name}")  # China
print(f"  City: {response.city.name}")        # Beijing
print(f"  ISP: China Telecom")

## Traffic routed through China confirmed
```

---

## Step 3: Determine Impact Window

**3.1 Query ThousandEyes Timeline:**

```bash
## Export ThousandEyes BGP data
curl -X GET \
  "https://api.thousandeyes.com/v6/bgp-routes.json?prefix=102.23.XX.XXX/24&window=1h" \
  -H "Authorization: Bearer $TE_TOKEN" \
  > /mnt/evidence_vault/EVD-20260204-001-bgp-routes.json

## Register on blockchain
sha256sum /mnt/evidence_vault/EVD-20260204-001-bgp-routes.json
peer chaincode invoke -n evidence-contract -C evidence-channel \
  -c '{"Args":["CollectEvidence","EVD-20260204-001","CASE-2026-017-BGP-HIJACK",...]}'
```

**3.2 Parse Timeline:**

```python
import json
from datetime import datetime

with open('/mnt/evidence_vault/EVD-20260204-001-bgp-routes.json') as f:
    data = json.load(f)

## Extract hijack timeline
events = []
for route in data['bgpRoutes']:
    if 'AS4134' in route['asPath']:  # China Telecom
        events.append({
            'timestamp': route['timestamp'],
            'as_path': route['asPath'],
            'prefix': route['prefix'],
            'monitors': route['numMonitors']
        })

## Sort chronologically
events.sort(key=lambda x: x['timestamp'])

print("BGP Hijack Timeline:")
print(f"  First detection: {events[0]['timestamp']}")  # 2026-02-04 08:05:12 UTC
print(f"  Last detection: {events[-1]['timestamp']}")  # 2026-02-04 08:17:23 UTC
print(f"  Duration: 12 minutes 11 seconds")
print(f"  Peak propagation: {max(e['monitors'] for e in events)} monitors")

## Impact window: 12 minutes
```

---

## Step 4: Analyze Traffic Interception

**4.1 Check Flow Data:**

```bash
## Query NetFlow from Mumbai edge router
curl -X POST https://stealthwatch.abhavtech.com/api/v1/flows \
  -d '{
    "start_time": "2026-02-04T08:05:00Z",
    "end_time": "2026-02-04T08:18:00Z",
    "src_ip": "102.23.XX.XXX/24",
    "dst_ip": "any"
  }' | jq '.flows[] | select(.next_hop | startswith("202.97"))'

## Output shows flows routed to China:
{
  "timestamp": "2026-02-04T08:06:47Z",
  "src_ip": "102.23.XX.XXX",
  "dst_ip": "8.8.8.8",
  "protocol": "TCP",
  "dst_port": 443,
  "bytes": 1847293,
  "packets": 1234,
  "next_hop": "119.56.XX.XXX"  # China Telecom
}

## Count intercepted traffic
jq '.flows | length' /tmp/intercepted-flows.json
## 847 flows intercepted
```

**4.2 Estimate Data Exposure:**

```python
## Calculate total intercepted data
flows = pd.read_json('/tmp/intercepted-flows.json')

total_bytes = flows['bytes'].sum()
total_gb = total_bytes / (1024**3)

print(f"Traffic Interception Analysis:")
print(f"  Total flows: {len(flows):,}")
print(f"  Total data: {total_gb:.2f} GB")
print(f"  Duration: 12 minutes")
print(f"  Avg throughput: {total_gb / (12/60):.2f} GB/min")

## Categorize by protocol
protocol_breakdown = flows.groupby('dst_port')['bytes'].sum()
protocol_breakdown = protocol_breakdown.sort_values(ascending=False)

print(f"\nTraffic Breakdown:")
for port, bytes_val in protocol_breakdown.head(5).items():
    gb = bytes_val / (1024**3)
    print(f"  Port {port}: {gb:.2f} GB")

## Output:
## Traffic Interception Analysis:
## Total flows: 847
## Total data: 4.73 GB
## Duration: 12 minutes
## Avg throughput: 0.39 GB/min
#
## Traffic Breakdown:
## Port 443 (HTTPS): 3.84 GB (81%) # Encrypted
## Port 80 (HTTP): 0.67 GB (14%) # PLAINTEXT!
## Port 22 (SSH): 0.18 GB (4%) # Encrypted
## Port 25 (SMTP): 0.04 GB (1%) # PLAINTEXT!
```

**Data Exposure Risk:**
- **HTTPS (81%):** Encrypted, but China can MITM with rogue certs
- **HTTP (14%):** PLAINTEXT - fully exposed
- **SSH (4%):** Encrypted
- **SMTP (1%):** PLAINTEXT - email metadata + content exposed

---

## Step 5: Coordinate Hijack Mitigation

**5.1 Contact Upstream ISP (Bharti Airtel):**

```bash
## Email to Airtel NOC
cat << 'EOF' | mail -s "URGENT: BGP Prefix Hijacking - 102.23.XX.XXX/24" noc@airtel.in
Bharti Airtel NOC,

We are experiencing BGP prefix hijacking of our IP space 102.23.XX.XXX/24 
(AS138478 - Abhavtech Technologies Pvt Ltd).

INCIDENT DETAILS:
- Hijacked prefix: 102.23.XX.XXX/24
- Hijacking AS: AS4134 (China Telecom)
- Hijack start: 2026-02-04 08:05:12 UTC
- Current status: ONGOING
- Impact: Traffic routed via China

EVIDENCE:
- Anomalous AS path: AS4134 → AS138478
- ThousandEyes detection: 98% confidence
- Multiple route servers confirm dual announcement

URGENT REQUEST:
1. Filter announcements of 102.23.XX.XXX/24 from AS4134
2. Implement ROV (Route Origin Validation) for our prefix
3. Contact APNIC CERT and report hijacking

Our NOC: +91-124-XXXXXXX
Our Email: noc@abhavtech.com

Abhavtech Security Operations
EOF

## Airtel Response (received 08:22 UTC, 5 minutes later):
## "Filter applied. AS4134 announcements for 102.23.XX.XXX/24 now blocked.
## ROV enabled. Hijack should clear within 15 minutes as BGP converges."
```

**5.2 Monitor BGP Convergence:**

```bash
## Watch for hijack withdrawal
watch -n 30 'curl -s "https://api.thousandeyes.com/v6/bgp-routes.json?prefix=102.23.XX.XXX/24" \
  -H "Authorization: Bearer $TE_TOKEN" \
  | jq ".bgpRoutes[] | select(.asPath | contains(\"AS4134\")) | .numMonitors"'

## Output (every 30 seconds):
234  # 08:22 - Hijack still propagated
187  # 08:22:30
134  # 08:23
 89  # 08:23:30
 47  # 08:24
 12  # 08:24:30
  0  # 08:25 - Hijack cleared!

## BGP hijack mitigated in 8 minutes after ISP filter
```

---

## Step 6: Implement RPKI Validation

**6.1 Create ROA (Route Origin Authorization):**

```bash
## Register ROA with APNIC
## Via APNIC MyAPNIC portal:

ROA Details:
- Prefix: 102.23.XX.XXX/24
- Max Length: /24
- Origin AS: AS138478 (Abhavtech)
- Status: Valid
- Signed: 2026-02-04 09:15:00 UTC

## ROA signed and published to RPKI repository
## Any future announcements from other ASes will be marked INVALID
```

**6.2 Configure BGP RPKI Validation on Routers:**

```bash
## SSH to border router
ssh admin@mumbai-edge-01.abhavtech.com

## Configure RPKI validator
Mumbai-Edge-01(config)# router bgp 138478
Mumbai-Edge-01(config-router)# bgp rpki server 192.0.2.1
Mumbai-Edge-01(config-router-rpki-server)# transport tcp port 323
Mumbai-Edge-01(config-router-rpki-server)# exit
Mumbai-Edge-01(config-router)# address-family ipv4
Mumbai-Edge-01(config-router-af)# bgp bestpath prefix-validate allow-invalid
Mumbai-Edge-01(config-router-af)# exit
Mumbai-Edge-01(config-router)# end

## Verify RPKI state
Mumbai-Edge-01# show bgp rpki table

Network            ROA Status  Origin AS
102.23.XX.XXX/24     Valid       AS138478  ✅

## RPKI validation enabled
```

---

## Step 7: Forensics Report

```python
report = {
    "case_id": "CASE-2026-017-BGP-HIJACK",
    "investigation_type": "BGP Route Hijacking (ThousandEyes Detection)",
    "incident_date": "2026-02-04",
    "analyst": "NetOps-Engineer-Arun-Kumar",
    
    "executive_summary": """
    BGP route hijacking detected on 2026-02-04 at 08:17 UTC for Abhavtech's
    public IP space (102.23.XX.XXX/24). ThousandEyes AI detected anomalous AS
    path routing traffic through China Telecom (AS4134) instead of legitimate
    path via Bharti Airtel.
    
    Impact:
    - Duration: 12 minutes (08:05 - 08:17 UTC)
    - Traffic intercepted: 4.73 GB (847 flows)
    - Exposure: 14% plaintext (HTTP), 1% email (SMTP)
    - Affected sites: Mumbai, Chennai
    
    Detection:
    - ThousandEyes AI BGP anomaly detection
    - Confidence: 98%
    - AS path analysis: AS4134 → AS138478 (abnormal)
    - Geolocation: Traffic via Beijing, China
    
    Response:
    - Upstream ISP (Airtel) notified immediately
    - BGP filter applied to block AS4134 announcements
    - Hijack cleared within 8 minutes
    - RPKI ROA created to prevent future hijacks
    - Total incident duration: 20 minutes (detection to full mitigation)
    
    Root Cause:
    - Malicious BGP announcement from AS4134 (China Telecom)
    - No RPKI validation enabled (allowing invalid origin)
    - Shorter AS path (2 hops vs 3) won BGP best path selection
    
    Nation-State Attribution:
    - Likely: State-sponsored surveillance
    - Method: BGP hijacking for traffic interception
    - Goal: Intelligence gathering
    
    Preventive Measures:
    - RPKI ROA registered and validated
    - BGP route monitoring enhanced (ThousandEyes)
    - ISP filtering configured
    - Incident reported to APNIC CERT
    """,
    
    "thousandeyes_technical_analysis": """
    ThousandEyes BGP Monitoring:
    - Monitors: 1,847 global BGP peers
    - Update interval: 5 minutes
    - Anomaly detection: ML-based path analysis
    
    Detection Algorithm:
    1. Baseline AS path establishment (30-day history)
    2. Real-time path monitoring
    3. Anomaly scoring (0.0 - 1.0)
    4. Geolocation correlation
    5. Alert generation (score >0.75)
    
    Hijack Indicators:
    1. AS Path Anomaly (score: 0.94)
       - Baseline: AS15169 → AS9498 → AS138478
       - Observed: AS4134 → AS138478
       - Never seen AS4134 in path historically
    
    2. Geographic Anomaly (score: 0.98)
       - Baseline: US → India (direct)
       - Observed: US → China (Beijing) → India
       - Traffic routing through non-baseline country
    
    3. Path Length Anomaly (score: 0.67)
       - Baseline: 3 AS hops
       - Observed: 2 AS hops (SHORTER = wins BGP)
    
    4. Latency Anomaly (score: 0.89)
       - Baseline: 187ms (US → Mumbai)
       - Observed: 334ms (+147ms via China)
    
    5. Packet Loss Anomaly (score: 0.76)
       - Baseline: 0.1%
       - Observed: 2.3%
    
    Why ThousandEyes Succeeded:
    - ML baseline: Learned normal paths over 30 days
    - Geographic correlation: Detected traffic via China
    - Multi-dimensional: Path + latency + geolocation
    - Fast detection: 12 minutes vs hours/days with manual monitoring
    """,
    
    "evidence_summary": [
        "EVD-20260204-001: ThousandEyes BGP routes (1-hour window)",
        "EVD-20260204-002: BGP route server dumps (Route Views, RIPE)",
        "EVD-20260204-003: NetFlow data (intercepted flows)",
        "EVD-20260204-004: RPKI ROA certificate",
        "EVD-20260204-005: ISP communication logs (Airtel)",
        "EVD-20260204-REPORT: Complete forensics report"
    ],
    
    "recommendations": [
        "Deploy RPKI validation on all BGP routers (MANDATORY)",
        "Implement BGP route filtering (prefix lists + AS path filters)",
        "Enable BGP Prefix Independent Convergence (PIC)",
        "Deploy ThousandEyes BGP monitoring globally",
        "Create automated playbook for BGP hijack response",
        "Register all IP prefixes with RPKI ROAs",
        "Coordinate with upstream ISPs for route filtering",
        "Implement MANRS (Mutually Agreed Norms for Routing Security)",
        "Deploy BGP flowspec for DDoS mitigation",
        "Quarterly BGP security audits"
    ]
}

with open('/mnt/evidence_vault/REPORT-CASE-2026-017-BGP-HIJACK.json', 'w') as f:
    json.dump(report, f, indent=2)
```

---
