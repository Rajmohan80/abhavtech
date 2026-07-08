# CHAPTER 15: TROUBLESHOOTING PLAYBOOK

## 15.1 Troubleshooting Framework

### 15.1.1 Three-Tier Support Model

**Abhavtech WiFi 7 Support Structure:**

```yaml
Tier 1 (L1): Helpdesk (First Response)
  Team Size: 6 staff (8 AM - 6 PM, Mon-Fri)
  Tools: DNAC Client 360, ISE Live Logs, Knowledge Base
  Responsibilities:
    • Basic connectivity issues (password reset, SSID visibility)
    • User education (connect to Corp-Secure-7)
    • Ticket triage (escalate if >15 min resolution time)
  
  Resolution Rate: 75% (target: >70%)
  MTTR: 10 minutes (target: <15 min)

Tier 2 (L2): Network Engineers (Escalation)
  Team Size: 3 engineers (on-call rotation)
  Tools: WLC CLI, DNAC, Ekahau, packet capture
  Responsibilities:
    • Advanced connectivity issues (authentication failures)
    • Performance issues (slow throughput, high latency)
    • RF issues (channel interference, AP failures)
  
  Resolution Rate: 20% (escalated from L1)
  MTTR: 45 minutes (target: <60 min)

Tier 3 (L3): Wireless Architects (Complex Issues)
  Team Size: 2 architects (on-call, 24/7 for P1)
  Tools: TAC access, vendor support, lab environment
  Responsibilities:
    • Complex issues (WLC bugs, fabric integration)
    • Design changes (add APs, channel plan modifications)
    • Vendor escalation (Cisco TAC, Intel driver issues)
  
  Resolution Rate: 5% (escalated from L2)
  MTTR: 4 hours (target: <8 hours)
```

---

### 15.1.2 Issue Classification

**Priority Matrix:**

| Priority | Description | Response Time | Example |
|----------|-------------|---------------|---------|
| **P1** | Critical (entire site down) | 15 minutes | WLC failure, all APs offline |
| **P2** | Major (floor/department impacted) | 1 hour | AP cluster down, 20+ users affected |
| **P3** | Moderate (individual user) | 4 hours | Single user cannot connect |
| **P4** | Minor (cosmetic, no impact) | 24 hours | Low signal in server closet |

---

## 15.2 Common Issues & Resolutions

### 15.2.1 Issue: Client Cannot Connect to SSID

**Symptom:** User reports "Cannot find Corp-Secure-7" or "Connection failed"

**Troubleshooting Workflow:**

```yaml
Step 1: Verify SSID Broadcast (L1)
  Check: Is SSID visible on user's device?
  
  Test: Scan for available SSIDs
    • Windows: Settings → WiFi → Show available networks
    • macOS: WiFi menu → Scan for networks
    • iOS/Android: WiFi settings
  
  Scenario A: SSID Visible
    → Proceed to Step 2 (Authentication)
  
  Scenario B: SSID Not Visible
    → Troubleshoot AP/WLC
    → Check: Is AP online? (show ap summary)
    → Check: Is SSID enabled on WLC? (show wlan summary)

Step 2: Verify User Credentials (L1)
  Check: Are AD credentials correct?
  
  Test: User re-enters credentials
    • Common Issue: Password expired (reset via AD portal)
    • Common Issue: Wrong username format (use email: john@abhavtech.com)
  
  Verification:
    • ISE Live Logs → Search username
    • Look for: "Authentication Failed - Invalid Credentials"
  
  Resolution:
    • If password expired: User resets password via self-service portal
    • If locked out: L1 unlocks AD account
    • MTTR: 5 minutes

Step 3: Verify Client Certificate (L1 → L2)
  Check: Is EAP-TLS client certificate valid?
  
  Test: Check certificate on client device
    • Windows: certmgr.msc → Personal → Certificates
    • macOS: Keychain Access → My Certificates
  
  Common Issues:
    • Certificate expired (issue: renew certificate)
    • Certificate not installed (issue: deploy via Intune/Jamf)
    • Wrong certificate template (issue: re-enroll with correct template)
  
  ISE Logs:
    • Error: "EAP-TLS - Client certificate expired"
    • Resolution: User re-enrolls certificate (via Company Portal)
    • MTTR: 15 minutes (if L1), 30 minutes (if L2 cert re-enrollment)

Step 4: Verify Posture Compliance (L2)
  Check: Is client device compliant (AV, patches, encryption)?
  
  ISE Posture Assessment:
    • Navigate: ISE → Operations → Authentications
    • Filter: Username = john.exec@abhavtech.com
    • Check: Posture Status = Compliant / Non-Compliant
  
  Common Issues:
    • Antivirus outdated (Resolution: User updates AV)
    • OS not patched (Resolution: User installs Windows/macOS updates)
    • BitLocker disabled (Resolution: User enables disk encryption)
  
  Remediation Flow:
    • ISE redirects to posture portal (captive portal)
    • User sees: "Your device is not compliant. Update antivirus."
    • User remediates → Clicks "Re-check"
    • ISE re-evaluates posture → Grants access
    • MTTR: 20 minutes (user self-service)

Step 5: Check AP Health (L2)
  Check: Is AP operational and serving clients?
  
  WLC Commands:
    show ap summary
    • Look for: AP status = Registered (good) vs Down (bad)
  
  show ap name <AP-NAME> config general
    • Check: Admin State = Enabled
    • Check: Operation State = Up
  
  Common Issues:
    • AP offline: Power issue (PoE), network issue (uplink down)
    • AP rebooting: Firmware upgrade in progress (wait 10 min)
    • AP full: Client limit reached (25 clients max per AP)
  
  Resolution:
    • If AP offline: Check PoE status on fabric edge switch
      show power inline <interface>
      • If PoE off: Enable PoE (power inline auto)
    • If AP full: Load balance (DNAC RRM steers clients to other APs)
    • MTTR: 15 minutes (PoE enable), 30 minutes (load balance)

Step 6: Escalate to L3 (If Unresolved)
  Criteria: Issue not resolved after 60 minutes (L1 + L2 efforts)
  
  Escalation Path:
    • Create P2 ticket (if 5+ users affected)
    • Engage Wireless Architect (L3)
    • Potential root causes:
      - WLC bug (requires TAC case)
      - ISE misconfiguration (policy issue)
      - Fabric integration issue (VXLAN/SGT)
```

**Resolution Summary:**

| Root Cause | % of Cases | MTTR | Tier |
|------------|-----------|------|------|
| Password expired | 35% | 5 min | L1 |
| Certificate expired | 20% | 15 min | L1 |
| Posture non-compliant | 15% | 20 min | L1/L2 |
| AP offline (PoE issue) | 10% | 15 min | L2 |
| Wrong SSID (user error) | 8% | 2 min | L1 |
| Other (complex) | 12% | 60 min+ | L2/L3 |

---

### 15.2.2 Issue: Slow WiFi Performance (<1 Gbps)

**Symptom:** User reports "WiFi is slow" or "Downloads taking forever"

**Troubleshooting Workflow:**

```yaml
Step 1: Quantify "Slow" (L1)
  Question: What throughput is user experiencing?
  
  Test: Run speed test
    • Tool: fast.com, speedtest.net, or iPerf3
    • Expected (WiFi 7): >4 Gbps
    • Acceptable (WiFi 7): >2 Gbps
    • Unacceptable: <1 Gbps
  
  If <1 Gbps → Proceed to Step 2
  If 2-4 Gbps → Set expectation (acceptable, but investigate)

Step 2: Check RSSI (Signal Strength) (L1)
  Question: Is user close to AP?
  
  DNAC Client 360:
    • Navigate: DNAC → Assurance → Client 360
    • Search: MAC address or username
    • Check: RSSI value
  
  RSSI Interpretation:
    • -50 to -60 dBm: Excellent (expect 4+ Gbps)
    • -60 to -70 dBm: Good (expect 2-4 Gbps)
    • -70 to -80 dBm: Fair (expect 500 Mbps - 2 Gbps)
    • <-80 dBm: Poor (expect <500 Mbps)
  
  Resolution (If RSSI <-70 dBm):
    • User relocates closer to AP (immediate fix)
    • Or: L2 investigates (add AP, adjust power)
    • MTTR: 2 minutes (user relocates)

Step 3: Check Client Capability (L1)
  Question: Is client WiFi 7-capable?
  
  DNAC Client 360:
    • Check: Device Type (WiFi 7, WiFi 6, WiFi 5)
    • Check: PHY Rate (expected: 5,764 Mbps for WiFi 7)
  
  Common Issue: Legacy Client
    • Device: WiFi 6 client (Intel AX211)
    • Max Speed: 2.4 Gbps (160 MHz, WiFi 6E)
    • Resolution: Set expectation (user has old laptop)
    • Recommendation: Upgrade to WiFi 7 laptop (Capital refresh)
    • MTTR: 5 minutes (explain to user)

Step 4: Check Channel Utilization (L2)
  Question: Is AP channel congested?
  
  WLC Command:
    show ap dot11 6ghz channel <AP-NAME>
    • Check: Channel Utilization (%)
  
  Channel Utilization Interpretation:
    • <50%: Healthy (low contention)
    • 50-70%: Moderate (acceptable)
    • 70-90%: High (performance degradation expected)
    • >90%: Saturated (significant degradation)
  
  Resolution (If >70%):
    • DNAC RRM: Trigger dynamic channel change
      DNAC → Provision → Wireless → RRM → Run RRM Now
    • Or: Manual channel change (move to less congested channel)
    • Validation: Re-test throughput after channel change
    • MTTR: 15 minutes (RRM), 30 minutes (manual)

Step 5: Check Client Count per AP (L2)
  Question: Is AP overloaded (too many clients)?
  
  WLC Command:
    show ap clients <AP-NAME>
    • Count: Number of associated clients
  
  Client Count Interpretation:
    • 0-15 clients: Healthy
    • 15-25 clients: Moderate (acceptable)
    • 25-40 clients: High (performance impact likely)
    • >40 clients: Overloaded (add AP or load balance)
  
  Resolution (If >25 clients):
    • DNAC Load Balancing: Steer clients to adjacent APs
    • Or: Add AP (if no adjacent APs available)
    • MTTR: 10 minutes (load balance), 1 week (add AP)

Step 6: Check Uplink Saturation (L2)
  Question: Is fabric uplink saturated?
  
  Fabric Edge Switch Command:
    show interface <interface> | include load
    • Check: Input/Output load (%)
  
  If Uplink >80% utilized:
    • Root Cause: Too many APs on single uplink
    • Resolution: Add uplink (port-channel additional link)
    • MTTR: 1 hour (if cable available)

Step 7: Check for Interference (L2)
  Question: Is there RF interference?
  
  Spectrum Analysis (Ekahau Sidekick):
    • Tool: Ekahau Sidekick 2 (on-site survey)
    • Scan: 6 GHz band (5,925-7,125 MHz)
    • Look for: Non-WiFi interference (rare in 6 GHz)
  
  Common 6 GHz Interference Sources (Rare):
    • None (6 GHz is clean spectrum in most environments)
  
  If Interference Detected:
    • Change channel (move away from interference)
    • MTTR: 30 minutes (spectrum scan + channel change)
```

**Resolution Summary:**

| Root Cause | % of Cases | MTTR | Tier |
|------------|-----------|------|------|
| Poor signal (RSSI <-70) | 40% | 2 min (relocate) | L1 |
| Legacy client (WiFi 6) | 25% | 5 min (explain) | L1 |
| High channel utilization | 15% | 15 min (RRM) | L2 |
| AP overloaded (>25 clients) | 10% | 10 min (load balance) | L2 |
| Uplink saturation | 5% | 60 min (add uplink) | L2 |
| Other | 5% | Variable | L2/L3 |

---

### 15.2.3 Issue: Frequent Disconnections

**Symptom:** User reports "WiFi keeps dropping" or "Connection unstable"

**Troubleshooting Workflow:**

```yaml
Step 1: Quantify Disconnections (L1)
  Question: How often does WiFi disconnect?
  
  User Interview:
    • Frequency: Once per day? Once per hour? Every 5 minutes?
    • Duration: Disconnected for 5 seconds? 30 seconds? Minutes?
    • Pattern: Random? At specific times? Specific locations?

Step 2: Check WLC Client Logs (L2)
  WLC Command:
    show wireless client mac-address <MAC> detail
    • Check: "Last Disconnect Reason"
  
  Common Disconnect Reasons:
    1. Client disassociated (user action)
       → Resolution: User education (don't manually disconnect)
    
    2. Session timeout (ISE)
       → Check: ISE session timeout (86400 sec = 24 hours)
       → Resolution: Increase timeout if too short
    
    3. Idle timeout (WLC)
       → Check: WLC idle timeout (3600 sec = 1 hour default)
       → Resolution: Increase idle timeout (or disable)
    
    4. Roaming (inter-AP transition)
       → Expected: Normal behavior (user moving between APs)
       → Resolution: Verify 802.11r enabled (fast roaming)
    
    5. AP reboot/failure
       → Check: AP uptime (show ap uptime <AP-NAME>)
       → Resolution: Investigate AP reboots (hardware issue?)

Step 3: Check RSSI History (DNAC) (L2)
  DNAC Client 360:
    • Navigate: Client 360 → RSSI Timeline (last 24 hours)
    • Look for: RSSI drops below -75 dBm
  
  Pattern Analysis:
    • RSSI stable (-60 dBm): Not signal-related
    • RSSI fluctuating (-60 → -80 → -60): User moving (roaming issue)
    • RSSI consistently low (<-75 dBm): Poor coverage (add AP)
  
  Resolution (If RSSI-related):
    • Add AP (coverage gap identified)
    • Or: User relocates to better coverage area
    • MTTR: 1 week (add AP), 2 min (user relocates)

Step 4: Check MLO Link Stability (L2)
  Question: Is MLO causing instability (link flapping)?
  
  WLC Logs:
    show logging | include MLO
    • Look for: "MLO failover" events
    • Frequent failovers (>10/hour): Indicates instability
  
  Root Causes:
    • 6 GHz channel interference (rare)
    • Client WiFi driver issue (Intel BE200 driver bug)
    • AP firmware issue (upgrade AP firmware)
  
  Resolution:
    • Disable MLO for problematic client (fallback to single-link)
      WLC: config wlan mlo disable <WLAN-ID> <CLIENT-MAC>
    • Or: Update client WiFi driver (Intel website)
    • Or: Upgrade AP firmware (Cisco IOS-XE 17.16.1+)
    • MTTR: 5 min (disable MLO), 30 min (driver update)

Step 5: Check for Deauthentication Attacks (L2/L3)
  Question: Is someone attacking WiFi (DoS)?
  
  WLC Logs:
    show logging | include deauth
    • Look for: Repeated deauth messages (same client)
  
  Expected:
    • Protected Management Frames (802.11w) prevent deauth attacks
    • If deauth frames detected: PMF not working (investigate)
  
  Verification:
    WLC: show wlan id <WLAN-ID>
    • Check: PMF = Required (should be enabled)
  
  Resolution (If PMF disabled):
    • Enable PMF: config wlan security pmf required <WLAN-ID>
    • Validation: Deauth attacks no longer work
    • MTTR: 5 minutes (enable PMF)

Step 6: Check ISE CoA (Change of Authorization) (L2)
  Question: Is ISE forcibly disconnecting client?
  
  ISE Logs:
    • Navigate: ISE → Operations → RADIUS → Live Logs
    • Filter: Username
    • Look for: CoA events (RADIUS Disconnect-Request)
  
  Common CoA Triggers:
    • Posture re-assessment failed (AV signatures expired)
    • Policy change (admin changed authorization policy)
    • ANC (Adaptive Network Control) quarantine (malware detected)
  
  Resolution:
    • If posture failed: User updates AV/OS
    • If policy change: Verify ISE policy correct (rollback if needed)
    • If ANC quarantine: Investigate security alert (malware?)
    • MTTR: 20 min (posture), 60 min (policy/ANC)
```

**Resolution Summary:**

| Root Cause | % of Cases | MTTR | Tier |
|------------|-----------|------|------|
| User moving (roaming) | 30% | 5 min (explain) | L1 |
| Poor coverage (RSSI) | 25% | 2 min (relocate) or 1 week (add AP) | L1/L2 |
| MLO instability | 15% | 5 min (disable MLO) | L2 |
| ISE CoA (posture) | 10% | 20 min (user updates AV) | L2 |
| Idle timeout | 10% | 5 min (increase timeout) | L2 |
| Other | 10% | Variable | L2/L3 |

---

## 15.3 Advanced Troubleshooting

### 15.3.1 Packet Capture Analysis

**Scenario: Intermittent Connectivity (Root Cause Unknown)**

**Packet Capture Workflow:**

```yaml
Step 1: Plan Capture (L2/L3)
  Objective: Capture WiFi traffic to analyze at packet level
  
  Tools:
    • Ekahau Sidekick 2 (wireless capture, 6 GHz)
    • WLC embedded capture (wired side, CAPWAP)
    • Wireshark (analysis)

Step 2: Wireless Capture (Over-the-Air)
  Equipment: Ekahau Sidekick 2 + laptop
  
  Procedure:
    1. Position Sidekick near client (within 10 feet)
    2. Start capture (Ekahau Survey → Tools → Packet Capture)
    3. Reproduce issue (user connects, experiences disconnection)
    4. Stop capture (after 5 minutes or issue reproduced)
    5. Export: .pcap file
  
  Duration: 5 minutes (or until issue occurs)

Step 3: WLC Capture (CAPWAP Tunnel)
  WLC Command:
    debug client <MAC-ADDRESS>
    • Captures: CAPWAP tunnel traffic (AP ↔ WLC)
  
  Procedure:
    1. Enable debug: debug client <MAC>
    2. Reproduce issue
    3. Stop debug: no debug all
    4. Export logs: show logging (copy to text file)

Step 4: Analyze Capture (Wireshark)
  Open: .pcap file in Wireshark
  
  Filters:
    • WiFi Management Frames: wlan.fc.type == 0
    • Authentication: eapol (802.1X)
    • Data Frames: wlan.fc.type == 2
  
  Look For:
    1. Association Request/Response
       → Check: Successful association?
    
    2. EAPOL (802.1X Authentication)
       → Check: EAP-Success or EAP-Failure?
    
    3. Deauthentication Frames
       → Check: Who sent deauth? (AP or client?)
       → Reason Code: 1 (unspecified), 2 (prev auth invalid), etc.
    
    4. Roaming (Re-association)
       → Check: Roaming time (time between disassociation and re-association)
       → Expected: <50ms (802.11r fast transition)

Step 5: Identify Root Cause
  Common Findings:
    • EAP-Failure: ISE rejecting authentication (check ISE logs)
    • Deauth from AP: AP initiated disconnect (check AP logs)
    • Deauth from client: Client driver issue (update driver)
    • High retry rate (>20%): Poor signal or interference

Step 6: Remediate
  Based on root cause identified in capture:
    • EAP-Failure → Fix ISE policy
    • Deauth from AP → Investigate AP (firmware bug?)
    • Client driver issue → Update WiFi driver
    • High retry rate → Improve signal (add AP, reduce power)
```

---

### 15.3.2 TAC Escalation Procedures

**When to Escalate to Cisco TAC:**

```yaml
Escalation Criteria:
  1. Suspected product bug (WLC, AP firmware)
  2. Unresolved after 4+ hours L3 troubleshooting
  3. Vendor documentation contradicts observed behavior
  4. Known issue (release notes) requiring TAC assistance

TAC Case Opening (Cisco Support Website):
  Step 1: Log in to cisco.com (CCO account required)
  
  Step 2: Navigate to Support → Case Manager → Open New Case
  
  Step 3: Provide Information:
    • Product: Catalyst 9800-40 Wireless Controller
    • Software Version: IOS-XE 17.16.1
    • Problem Type: Configuration, Performance, Bug
    • Severity:
      - S1 (Critical): Network down, production impacted
      - S2 (Major): Major feature not working
      - S3 (Moderate): Minor feature issue
      - S4 (Low): Question, documentation request
  
  Step 4: Problem Description:
    • Subject: "WiFi 7 MLO link failover causing packet loss"
    • Description:
      - Environment: 15 APs, 100 WiFi 7 clients, 6 GHz
      - Issue: MLO failover (6 GHz → 5 GHz) causes 10% packet loss
      - Expected: 0% packet loss per 802.11be spec
      - Impact: User complaints, video calls freeze
      - Troubleshooting Done: (attach show tech-support output)
  
  Step 5: Attach Files:
    • show tech-support (WLC output)
    • show ap tech-support <AP-NAME> (AP logs)
    • Packet capture (.pcap file)
    • DNAC reports (PDF export)
  
  Step 6: Submit Case
    • TAC Response Time:
      - S1: 1 hour
      - S2: 4 hours
      - S3: 8 hours (next business day)
      - S4: 24 hours

TAC Working the Case:
  • TAC Engineer: Assigned within response time
  • Communication: Email + WebEx sessions
  • Troubleshooting: Remote access (VPN) or on-site
  • Resolution:
    - Workaround (temporary fix, e.g., disable MLO)
    - Bug ID: CSCxxxxxxxx (tracked in Cisco Bug Search)
    - Software upgrade (fixed in IOS-XE 17.16.2)
    - RMA (hardware replacement if defective)

Case Closure:
  • Resolution confirmed by Abhavtech
  • TAC provides: Case notes, solution summary, bug IDs
  • Abhavtech provides: Feedback (case survey)
```

---

## 15.4 Monitoring & Alerting

### 15.4.1 Proactive Monitoring (DNAC)

**DNAC Health Monitoring (Automated):**

```yaml
DNAC Assurance Dashboard:
  • Overall Network Health Score: 0-10 (target: >8.5)
  • Client Health: % of clients with health score >7
  • AP Health: % of APs online and healthy
  • SSID Health: Availability, authentication success rate

Real-Time Alerts (DNAC → Email/Slack):
  Alert 1: AP Down
    • Trigger: AP offline >5 minutes
    • Severity: P2 (major)
    • Action: Auto-ticket to ServiceNow, email L2
  
  Alert 2: High Channel Utilization
    • Trigger: Channel utilization >80% for 10 minutes
    • Severity: P3 (moderate)
    • Action: DNAC RRM auto-adjusts channel
  
  Alert 3: Client Health Score <5
    • Trigger: Individual client health degraded
    • Severity: P4 (low)
    • Action: Log for trend analysis (no immediate action)
  
  Alert 4: Authentication Failure Rate >5%
    • Trigger: >5% of auth attempts fail (last hour)
    • Severity: P2 (major)
    • Action: Email L2, investigate ISE
```

---

### 15.4.2 Splunk Monitoring & Correlation

**Splunk Dashboards (WiFi 7 Health):**

```splunk
Dashboard 1: Real-Time Client Issues
index=ise_pxgrid OR index=wlc_logs OR index=dnac_telemetry
| stats count by issue_type, user, ap_name
| where issue_type IN ("Auth Failure", "Poor Signal", "Disconnection")
| sort -count

# Output: Top 10 users experiencing issues (real-time)
```

**Splunk Alerts:**

```splunk
Alert: Spike in Authentication Failures
index=ise_pxgrid sourcetype=ise:session auth_status="Failed"
| timechart span=15m count
| where count > 20  # >20 failures in 15 min = spike

Action:
  • Email: L2 team
  • Slack: #wifi-alerts
  • Investigate: ISE policy change? AD issue?
```

---

## 15.5 Troubleshooting Tools Reference

### 15.5.1 Essential Tools

**Tool Matrix:**

| Tool | Purpose | Platform | License Required |
|------|---------|----------|------------------|
| **DNAC** | Network health, client 360, AP monitoring | Web-based | ✓ (DNA Advantage) |
| **ISE Live Logs** | Authentication troubleshooting | Web-based | ✓ (ISE license) |
| **WLC CLI** | AP/client debugging, logs | SSH | ✓ (SMART account) |
| **Ekahau Sidekick 2** | Spectrum analysis, packet capture | Hardware + software | ✓ ($3K) |
| **Wireshark** | Packet analysis | Windows/macOS/Linux | ✗ (free) |
| **iPerf3** | Throughput testing | Windows/macOS/Linux | ✗ (free) |
| **Splunk** | Log aggregation, alerting | Web-based | ✓ (enterprise) |
| **ThousandEyes** | End-to-end monitoring | Web-based | ✓ (per-agent) |

---

### 15.5.2 Command Reference (Quick Guide)

**WLC Essential Commands:**

```cisco
# Show all APs
show ap summary

# Show specific AP details
show ap name <AP-NAME> config general

# Show clients on specific AP
show ap name <AP-NAME> client

# Show all clients (summary)
show wireless client summary

# Show specific client details
show wireless client mac-address <MAC> detail

# Show SSID configuration
show wlan summary
show wlan id <WLAN-ID>

# Debug specific client (real-time)
debug client <MAC-ADDRESS>

# Show WLC version
show version

# Show tech-support (for TAC)
show tech-support
```

**DNAC API (Python Examples):**

```python
# Get client health score
import requests

dnac_url = "https://dnac.abhavtech.com"
token = get_auth_token()  # Function to get token

response = requests.get(
    f"{dnac_url}/dna/intent/api/v1/client-health",
    headers={"X-Auth-Token": token}
)

client_health = response.json()
print(f"Overall Client Health: {client_health['overall']}%")
```

---

## 15.6 Troubleshooting Playbook Summary

### 15.6.1 Top 10 Issues & Quick Fixes

**Quick Reference Card:**

```yaml
1. Cannot Connect to SSID
   • Quick Fix: Verify password, check SSID visible
   • MTTR: 5 minutes (L1)

2. Slow Performance (<1 Gbps)
   • Quick Fix: Check RSSI (move closer to AP if <-70 dBm)
   • MTTR: 2 minutes (L1)

3. Frequent Disconnections
   • Quick Fix: Check MLO stability (disable MLO if flapping)
   • MTTR: 5 minutes (L2)

4. Authentication Failed
   • Quick Fix: Reset password, verify certificate
   • MTTR: 10 minutes (L1)

5. Poor Coverage (RSSI <-70 dBm)
   • Quick Fix: User relocates, or L2 adds AP
   • MTTR: 2 min (relocate), 1 week (add AP)

6. High Latency (>20ms)
   • Quick Fix: Check channel utilization (RRM if >70%)
   • MTTR: 15 minutes (L2)

7. AP Offline
   • Quick Fix: Check PoE status on switch
   • MTTR: 10 minutes (L2)

8. Roaming Issues
   • Quick Fix: Verify 802.11r enabled on SSID
   • MTTR: 5 minutes (L2)

9. MLO Not Working
   • Quick Fix: Check client WiFi 7-capable (Intel BE200)
   • MTTR: 5 minutes (L1)

10. Posture Non-Compliant
    • Quick Fix: User updates AV/OS patches
    • MTTR: 20 minutes (L1, user self-service)
```
