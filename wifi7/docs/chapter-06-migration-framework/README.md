# CHAPTER 6: WIRED-TO-WIRELESS MIGRATION FRAMEWORK

## 6.1 Migration Strategy Overview

### 6.1.1 Strategic Vision: "Wireless by Default, Wired by Exception"

**Abhavtech's Phase 5 Goal**: Transition from traditional wired-first network to wireless-first enterprise by Q2 2026.

**Current State (Pre-Phase 5):**
- 15,840 wired access ports across 330 switches
- 1,185 wireless APs (primarily WiFi 5/6)
- **Wired utilization**: 48% (7,550 active ports)
- **Wireless adoption**: 30% (primarily BYOD, guests)

**Target State (Post-Phase 5B):**
- 7,350 wired access ports across 152 switches (54% reduction)
- 1,220 WiFi 7 APs
- **Wired utilization**: 48% (same utilization, fewer ports needed)
- **Wireless adoption**: 85% (corporate laptops, tablets, IoT devices)

**Benefits:**
- **CapEx Savings**: 178 access switches decommissioned ($3.2M avoided replacement cost)
- **OpEx Savings**: $420K/year (power, cooling, maintenance)
- **Agility**: Office reconfigurations require no re-cabling (save 3-5 weeks per move)
- **User Experience**: >4 Gbps wireless (vs 1 Gbps wired), seamless roaming

---

### 6.1.2 Migration Phases

**4-Phase Migration Model:**

| Phase | Name | Timeline | Scope | Success Criteria |
|-------|------|----------|-------|------------------|
| **Phase 5A** | Pilot Validation | Q2 2025 (Week 1-16) | 115 APs, 4 sites, 1,420 users | 3 use cases validated, >90% satisfaction |
| **Phase 5B-Wave 1** | Critical Sites | Q3 2025 (Week 17-30) | 400 APs, 6 HQ sites, 5,200 users | Executives + conference rooms wireless |
| **Phase 5B-Wave 2** | Regional Expansion | Q4 2025-Q1 2026 (Week 31-52) | 550 APs, 8 regional sites, 6,000 users | General office wireless, 70% adoption |
| **Phase 5B-Wave 3** | Branch Rollout | Q2 2026 (Week 53-65) | 155 APs, 5 branch sites, 2,300 users | Complete wireless-first transformation |
| **TOTAL** | Full Deployment | Q2 2025 - Q2 2026 (65 weeks) | 1,220 APs, 19 sites, 14,920 users | 85% wireless adoption, 54% port reduction |

**Phase Progression Logic:**

```
Phase 5A (Pilot) → Validate 3 Use Cases
    ↓ Exit Criteria: All 3 validated, >90% satisfaction, zero P1 incidents
    
Phase 5B-Wave 1 (Critical Sites) → Scale to HQ sites
    ↓ Exit Criteria: 70% wireless adoption, >85% satisfaction
    
Phase 5B-Wave 2 (Regional) → General office rollout
    ↓ Exit Criteria: 75% wireless adoption, switch consolidation started
    
Phase 5B-Wave 3 (Branches) → Complete transformation
    ↓ Exit Criteria: 85% wireless adoption, 178 switches decommissioned
```

---

### 6.1.3 Migration Principles

**Guiding Principles:**

1. **User-Centric Approach**: No forced migrations. Users volunteer for wireless-only workspaces. Provide "opt-out" option for users who prefer wired.

2. **Zero Disruption**: All migrations during maintenance windows or phased over weekends. No unplanned outages.

3. **Rollback-Ready**: Every migration has documented rollback procedure. Can revert to wired within 30 minutes.

4. **Phased Adoption**: Start with early adopters (tech-savvy executives), then expand to general population.

5. **Communication-First**: 3-week advance notice for all users. IT helpdesk staffed on-site during migration weeks.

6. **Data-Driven**: Continuous monitoring of adoption rates, satisfaction, performance. Pause rollout if metrics degrade.

---

## 6.2 Device Categorization Framework

### 6.2.1 Device Classification Matrix

**Every device in Abhavtech's network classified into 4 categories:**

| Category | Migration Strategy | Rationale | Examples |
|----------|-------------------|-----------|----------|
| **Category A: Wireless-First** | Migrate to WiFi 7, disable wired port | High mobility, WiFi 7-capable, non-critical uptime | Executive laptops, tablets, smartphones |
| **Category B: Wireless-Optional** | Wireless preferred, wired available on request | Moderate mobility, WiFi 7-capable, some reliability requirements | Engineer laptops, conference room devices |
| **Category C: Wired-Preferred** | Keep wired, wireless backup available | Low mobility, high bandwidth/reliability requirements | Desktop workstations, IP phones, printers |
| **Category D: Wired-Only** | Always wired, no wireless option | Stationary, mission-critical, regulatory requirements | Servers, network infrastructure, BMS, security cameras (non-AI) |

**Category Distribution (Pre-Phase 5):**

```
Total Devices: 15,840 wired ports active

Category A (Wireless-First): 4,200 devices (27%)
  • Executive laptops: 210
  • Employee laptops: 3,800
  • Tablets/smartphones: 190

Category B (Wireless-Optional): 6,000 devices (38%)
  • Engineer workstations: 2,200
  • Conference room equipment: 800 (AppleTV, Webex)
  • Guest devices: 3,000

Category C (Wired-Preferred): 4,450 devices (28%)
  • Desktop PCs: 3,200
  • IP phones: 800
  • Printers/MFPs: 250
  • Legacy devices (no WiFi): 200

Category D (Wired-Only): 1,190 devices (7%)
  • Servers: 450
  • Network infrastructure: 200
  • Building automation (BMS, HVAC): 300
  • Security cameras (wired PoE): 240
```

**Post-Phase 5B Target:**

```
Category A: 90% migrated to wireless (3,780 devices wireless, 420 wired on-demand)
Category B: 70% migrated to wireless (4,200 wireless, 1,800 wired on-demand)
Category C: 10% migrated to wireless (445 wireless, 4,005 wired)
Category D: 0% migrated (1,190 wired-only)

Total Wired Ports Needed: 420 + 1,800 + 4,005 + 1,190 = 7,415 ports
Actual Wired Ports (with 20% spare): 7,415 × 1.2 = 8,900 ports
Access Switches Needed: 8,900 ÷ 48 = 186 switches (rounded up from 152)
Switches Decommissioned: 330 - 186 = 144 switches
```

---

### 6.2.2 Detailed Device Assessment

**Category A: Wireless-First (4,200 devices)**

| Device Type | Quantity | WiFi 7 Capable? | Migration Priority | Notes |
|-------------|----------|----------------|-------------------|-------|
| **Executive Laptops** | 210 | 100% (refreshed 2023-2024) | **HIGH** (Week 11-12) | Dell Latitude 7450, MacBook Pro M4 |
| **Employee Laptops (Corporate)** | 3,800 | 65% (2,470 WiFi 7, 1,330 WiFi 6) | **MEDIUM** (Week 17-52) | Prioritize WiFi 7-capable first |
| **Tablets** | 120 | 90% (108 WiFi 7) | **LOW** (Week 30-52) | iPad Pro, Surface Pro |
| **Smartphones** | 70 | 100% (BYOD, latest models) | **LOW** (already wireless) | iPhone, Samsung Galaxy |

**Migration Strategy:**
- **Week 11-12 (Pilot)**: 80 executive laptops (Mumbai Floor 6)
- **Week 17-30 (Wave 1)**: 130 additional executive laptops (Chennai, London)
- **Week 31-52 (Wave 2)**: 2,470 WiFi 7-capable employee laptops
- **Week 53-65 (Wave 3)**: 1,330 WiFi 6 employee laptops (acceptable performance, 1-2 Gbps)

---

**Category B: Wireless-Optional (6,000 devices)**

| Device Type | Quantity | WiFi 7 Capable? | Migration Strategy | Notes |
|-------------|----------|----------------|-------------------|-------|
| **Engineering Workstations** | 2,200 | 40% (880 WiFi 7) | Wireless preferred, wired on request | Some engineers need wired for VPN stability |
| **Conference Room Equipment** | 800 | 60% (480 WiFi 7) | Migrate AppleTV/Miracast, keep Webex wired | Dual-mode: wireless presentation + wired backup |
| **Guest/Contractor Devices** | 3,000 | Variable (assume 50% WiFi 7) | Already wireless (guest SSID) | No migration needed |

**Migration Strategy:**
- **Conference Rooms**: 480 AppleTV/Miracast devices wireless-only (Week 10-30)
- **Engineering Workstations**: Offer wireless-first option, 60% adoption expected (Week 31-52)
- **Wired Fallback**: Engineers can request wired port if wireless insufficient (VPN, large file transfers)

---

**Category C: Wired-Preferred (4,450 devices)**

| Device Type | Quantity | Migration Strategy | Notes |
|-------------|----------|-------------------|-------|
| **Desktop PCs** | 3,200 | Keep 90% wired (2,880), migrate 10% (320) | USB WiFi adapters for hoteling desks |
| **IP Phones** | 800 | Keep 100% wired (PoE, voice quality) | No migration |
| **Printers/MFPs** | 250 | Keep 100% wired (reliability) | No migration |
| **Legacy Devices** | 200 | Keep 100% wired (no WiFi capability) | Replace in FY26 refresh |

**Migration Strategy:**
- **Desktop PCs**: Migrate only hoteling/shared desks (320 devices) to wireless via USB WiFi 7 adapters
- **IP Phones, Printers**: No migration (PoE, reliability requirements)
- **Legacy Devices**: No migration until hardware refresh

---

**Category D: Wired-Only (1,190 devices)**

| Device Type | Quantity | Migration Strategy | Notes |
|-------------|----------|-------------------|-------|
| **Servers** | 450 | Wired-only (10G/25G NICs) | Mission-critical, low latency |
| **Network Infrastructure** | 200 | Wired-only (switches, routers, firewalls) | Infrastructure backbone |
| **Building Automation (BMS)** | 300 | Wired-only (24x7 reliability) | HVAC, lighting, elevators |
| **Security Cameras (Wired PoE)** | 240 | Wired-only (existing deployment) | Only 40 AI cameras go wireless (Phase 5A) |

**No Migration**: All Category D devices remain wired permanently.

---

## 6.3 User Communication & Change Management

### 6.3.1 Communication Timeline

**3-Week Advance Notice Model:**

| Timeline | Communication | Target Audience | Message |
|----------|---------------|-----------------|---------|
| **T-21 days** | Executive briefing (email + town hall) | C-suite, VPs | "WiFi 7 rollout: faster, wireless-first workspace" |
| **T-14 days** | Department manager briefing | Managers | "Your team's migration schedule, what to expect" |
| **T-7 days** | User notification (email + Slack) | All affected users | "Your wireless migration: [Date], [Floor], [Support]" |
| **T-3 days** | Reminder email + helpdesk prep | All affected users | "Migration in 3 days, helpdesk on-site [Hours]" |
| **T-0 (Migration Day)** | On-site IT support | All affected users | IT team on-site for assistance |
| **T+1 day** | Follow-up survey | Migrated users | "How was your wireless migration experience?" |
| **T+7 days** | Performance check-in | Migrated users | "Any issues or concerns? Opt-out option available" |

---

### 6.3.2 Sample Communications

**Email Template 1: Executive Briefing (T-21)**

```
Subject: WiFi 7 Rollout: Faster, Wireless-First Workspace

Dear [Executive Name],

We're excited to announce Abhavtech's WiFi 7 wireless-first transformation, 
starting with Mumbai HQ Floor 6 (Executive Floor) in Week 11.

What's Changing:
  • Your desk will be 100% wireless (no Ethernet cable needed)
  • Faster performance: >4 Gbps WiFi 7 (vs 1 Gbps wired)
  • Seamless roaming: Stay connected desk → conference room → café
  • Cleaner workspace: No cable clutter

What You Need to Do:
  • Ensure your laptop is WiFi 7-capable (IT will confirm)
  • Connect to new "Corp-Secure-7" SSID on [Migration Date]
  • IT helpdesk on-site 8am-6pm for assistance

Your migration date: [Date], [Floor]

Have questions? Reply to this email or contact IT helpdesk.

Best regards,
[CTO Name]
Abhavtech Technology Team
```

---

**Email Template 2: User Notification (T-7)**

```
Subject: Your Wireless Migration: [Date], [Floor]

Hi [User Name],

Your wireless migration is scheduled for [Date] on [Floor]. Here's what to expect:

Before Migration:
  ✓ Backup your files (precaution, no data loss expected)
  ✓ Ensure laptop fully charged (disconnect Ethernet cable)
  ✓ Save open work, restart laptop before migration

Migration Day:
  1. Disconnect Ethernet cable from desk (8:00 AM)
  2. Connect to "Corp-Secure-7" SSID (same password)
  3. Verify internet connectivity (visit any website)
  4. IT helpdesk on-site 8am-6pm if you need assistance

After Migration:
  • Your old Ethernet port will be disabled (wired not available)
  • If wireless insufficient, contact IT for "wired on-demand" option
  • Survey: Share your feedback (helps us improve rollout)

Need help? IT helpdesk: ext. 5000 or helpdesk@abhavtech.com

Best regards,
Abhavtech IT Team
```

---

**Slack Announcement Template (T-3)**

```
📡 Wireless Migration Reminder: 3 Days!

Your wireless migration is in 3 DAYS: [Date], [Floor]

✅ What to do:
  • Backup files (precaution)
  • Charge laptop fully
  • Restart laptop before migration

🆘 Need help?
  • IT helpdesk on-site 8am-6pm: [Floor], [Room]
  • Slack: #it-helpdesk
  • Phone: ext. 5000

🎉 Benefits:
  • 4× faster than wired (4 Gbps vs 1 Gbps)
  • Seamless roaming (desk → meeting room)
  • No cable clutter

Questions? Reply in thread 👇
```

---

### 6.3.3 User Training & Support

**Training Options:**

| Format | Duration | Audience | Content |
|--------|----------|----------|---------|
| **Self-Service Video** | 5 min | All users | "How to connect to Corp-Secure-7 SSID" (screen recording) |
| **Live Demo (Lunch & Learn)** | 30 min | Early adopters | WiFi 7 benefits, troubleshooting tips |
| **1-on-1 IT Support** | 10-15 min | Executives, resistant users | Personal onboarding assistance |

**Helpdesk Staffing (Migration Week):**

```
Normal Helpdesk: 2 staff, 9am-5pm (8 hours)
Migration Week Helpdesk: 6 staff, 8am-6pm (10 hours)

Staffing Increase:
  • 4 additional roaming technicians (floor-by-floor support)
  • 2 hotline staff (dedicated to wireless migration calls)
  
Expected Call Volume:
  • Normal: 20 calls/day
  • Migration Week: 80-100 calls/day (4-5× increase)
  • Resolution Time: 10 min avg (most issues: wrong SSID, wrong password)
```

---

## 6.4 Migration Procedures

### 6.4.1 Standard Migration Workflow

**Step-by-Step Procedure (Per User):**

```yaml
Pre-Migration (T-1 day):
  1. Verify user device WiFi 7-capable (DNAC inventory check)
  2. Pre-stage user account in ISE (ensure 802.1X certificate valid)
  3. Send reminder email (T-1 day notification)

Migration Day (T-0):
  Step 1: User disconnects Ethernet cable (8:00 AM)
    • User unplugs Ethernet cable from laptop
    • Ethernet port disabled remotely (switch port shutdown)
  
  Step 2: User connects to Corp-Secure-7 SSID
    • Windows: Settings → Network → WiFi → "Corp-Secure-7"
    • Mac: WiFi menu → "Corp-Secure-7"
    • Authentication: Automatic (802.1X, uses existing AD credentials)
  
  Step 3: IT verifies connectivity
    • Check DNAC: User laptop connected, MLO active, >4 Gbps PHY rate
    • Check ISE: User authenticated successfully, SGT assigned
    • Ping test: ping google.com (verify internet connectivity)
  
  Step 4: User tests applications
    • Open Outlook (email sync)
    • Join test Webex meeting (video quality check)
    • Access SharePoint (large file transfer test)
  
  Step 5: IT marks migration complete
    • Update migration tracker spreadsheet: [User], [Date], [Status: Success]
    • User added to "wireless-only" AD group (for reporting)

Post-Migration (T+1 day):
  • User receives survey email (satisfaction, issues, feedback)
  • IT monitors user performance (DNAC client 360 view)
  • User can request "opt-out" within 7 days (revert to wired)

Duration per User: 15-20 minutes (including verification)
Daily Migration Capacity: 50-60 users per IT tech × 6 techs = 300-360 users/day
```

---

### 6.4.2 Batch Migration Procedure (Floor-by-Floor)

**Mumbai Floor 6 Example (80 Executives):**

```yaml
Week 11: Executive Floor Wireless Migration

Monday (Day 1): Preparation
  • 8:00 AM: IT team arrives, setup helpdesk on Floor 6
  • 9:00 AM: Send "migration today" reminder email
  • 10:00 AM: Disable Ethernet ports (40 ports, West Wing)
  • 10:15 AM: Roaming techs assist users connecting to Corp-Secure-7

Monday Metrics:
  • Users migrated: 40 (West Wing)
  • Success rate: 95% (38 successful, 2 needed assistance)
  • Average time: 12 minutes per user
  • Issues: 2 users wrong password, 1 user laptop WiFi 6 only (acceptable)

Tuesday (Day 2): Continuation
  • 10:00 AM: Disable Ethernet ports (40 ports, East Wing)
  • 10:15 AM: Roaming techs assist users

Tuesday Metrics:
  • Users migrated: 40 (East Wing)
  • Success rate: 97% (39 successful, 1 needed assistance)
  • Cumulative: 80 users migrated in 2 days ✓

Wednesday-Friday (Day 3-5): Monitoring & Support
  • Helpdesk on-site for any issues
  • Monitor DNAC/Splunk for performance degradation
  • Survey collection (target: 80% response rate)

Week 11 Summary:
  • Total users migrated: 80 executives
  • Success rate: 96% (77 successful first attempt, 3 needed assistance)
  • User satisfaction: 94% (survey results)
  • Wired ports freed: 65 ports (54% reduction on Floor 6)
  • Status: Migration SUCCESSFUL ✓
```

---

### 6.4.3 Troubleshooting Guide (Common Issues)

| Issue | Frequency | Root Cause | Resolution | Time |
|-------|-----------|------------|------------|------|
| **Cannot find Corp-Secure-7 SSID** | 15% | User searching for old "Corp-Secure" SSID | Instruct user to connect to "Corp-Secure-7" | 2 min |
| **802.1X authentication failed** | 8% | Expired AD password or certificate | User resets AD password, reconnect | 5 min |
| **Connected but no internet** | 5% | ISE posture check failed (outdated AV) | User updates antivirus software, reconnect | 10 min |
| **WiFi 7 not detected (WiFi 6 only)** | 3% | Older laptop (WiFi 6 chipset) | User connects to Corp-Secure-7 (backward compatible, 1-2 Gbps) | 2 min |
| **Slow performance (<1 Gbps)** | 2% | User far from AP (>15m) | Relocate user desk closer to AP, or provide wired port | 15 min |
| **Intermittent disconnections** | 1% | Driver issue or AP firmware | Update WiFi driver, escalate to L2 if persistent | 20 min |

**Escalation Path:**

```
Level 1 (Helpdesk Technician): 90% of issues resolved
  • Connection issues, wrong SSID, password resets
  • Resolution time: 5-10 minutes

Level 2 (Network Engineer): 8% of issues escalated
  • ISE policy issues, performance degradation, driver updates
  • Resolution time: 20-30 minutes

Level 3 (Wireless Architect): 2% of issues escalated
  • AP firmware bugs, channel interference, WLC misconfig
  • Resolution time: 1-2 hours (may require change control)
```

---

## 6.5 Rollback Procedures

### 6.5.1 Individual User Rollback

**Scenario**: User requests to revert to wired due to performance or reliability concerns.

**Procedure:**

```yaml
Step 1: User submits rollback request (within 7 days of migration)
  • Email to helpdesk@abhavtech.com
  • Subject: "Rollback Request: [User Name], [Floor], [Desk]"
  • Reason: [Performance issue / Preference / Other]

Step 2: IT verifies request
  • Check DNAC: User's WiFi performance metrics (throughput, latency, packet loss)
  • Check ISE: User's connection history (frequent disconnections?)
  • Determine: Legitimate issue or user preference?

Step 3: Re-enable wired port (if available)
  • Switch command: no shutdown interface GigabitEthernet1/0/X
  • Verify: Port operational, link up
  • User: Reconnect Ethernet cable

Step 4: Update migration tracker
  • Mark user as "rolled back" in spreadsheet
  • Reason documented for future analysis
  • User removed from "wireless-only" AD group

Duration: 15-30 minutes (depends on port availability)
Success Rate: 98% (rollback almost always successful)

Rollback Statistics (Expected):
  • Rollback rate: 5-8% of migrated users
  • Most common reason: "Prefer wired" (60%), "Performance issue" (30%), "Frequent disconnections" (10%)
  • Timing: 80% of rollbacks within 3 days of migration
```

---

### 6.5.2 Floor-Wide Rollback

**Scenario**: Critical issue discovered post-migration (e.g., AP firmware bug causing widespread disconnections). Need to rollback entire floor.

**Procedure:**

```yaml
Step 1: Incident declared (Severity 1)
  • NOC detects widespread disconnections (>20% of users on Floor 6)
  • Incident manager convened (CTO, Network Architect, Helpdesk Manager)
  • Decision: Rollback required

Step 2: Emergency communication
  • Email to all Floor 6 users: "Temporary wireless issue, reverting to wired"
  • Slack announcement: "IT team restoring wired connectivity"
  • Estimated downtime: 30 minutes

Step 3: Re-enable all Ethernet ports (batch operation)
  • Switch CLI (per floor switch):
    ```
    config t
    interface range GigabitEthernet1/0/1-48
    no shutdown
    end
    write memory
    ```
  • Verify: All ports operational (show interface status)

Step 4: User reconnects Ethernet cables
  • Users physically reconnect Ethernet cables to desks
  • Verify internet connectivity (ping test)
  • IT roaming techs assist users who need help

Step 5: Investigate root cause
  • Identify WiFi 7 AP firmware bug (WLC logs, DNAC)
  • Workaround: Downgrade AP firmware to previous stable version
  • Testing: Verify fix in lab environment before re-migration

Step 6: Plan re-migration
  • Once fix validated, schedule re-migration (T+7 days)
  • Communication: "WiFi 7 issue resolved, re-migration [Date]"
  • Lessons learned: More rigorous firmware testing in pilot phase

Duration: 30-60 minutes (emergency rollback)
Impact: Minimal (users back to wired, no productivity loss)
Frequency: Rare (expected <1% chance per migration)
```

---

### 6.5.3 Rollback Decision Matrix

**When to Rollback:**

| Scenario | Rollback Required? | Timeline | Decision Maker |
|----------|-------------------|----------|----------------|
| **Individual user dissatisfaction** | Yes (if requested within 7 days) | Same day | Helpdesk Manager |
| **<5% users report issues** | No (troubleshoot individually) | N/A | Helpdesk Manager |
| **5-10% users report issues** | Maybe (investigate root cause first) | 1-2 days | Network Architect |
| **>10% users report issues** | Yes (likely systematic issue) | Immediate (30 min) | Incident Manager |
| **P1 incident (executive complaints)** | Yes (executive floor priority) | Immediate (15 min) | CTO |
| **Security vulnerability discovered** | Yes (immediately disable WiFi) | Immediate | CISO |

---

## 6.6 Success Metrics & Monitoring

### 6.6.1 Key Performance Indicators (KPIs)

**Migration Progress Metrics:**

| Metric | Target | Measurement | Frequency |
|--------|--------|-------------|-----------|
| **Wireless Adoption Rate** | >85% by Q2 2026 | (Wireless users / Total users) × 100 | Weekly |
| **Migration Success Rate** | >95% first attempt | (Successful migrations / Total attempts) × 100 | Daily |
| **User Satisfaction** | >90% satisfied | Post-migration survey (5-point Likert scale) | Per migration wave |
| **Rollback Rate** | <8% | (Rollbacks / Total migrations) × 100 | Weekly |
| **Wired Port Reduction** | 54% (15,840 → 7,350) | Active ports before vs after | Monthly |
| **Switch Decommissioning** | 144 switches | Switches removed from production | Quarterly |

---

**Technical Performance Metrics:**

| Metric | Target | Measurement | Frequency |
|--------|--------|-------------|-----------|
| **Average Throughput** | >4 Gbps (320 MHz sites) | DNAC Client 360, iPerf3 testing | Daily |
| **Average Latency** | <10ms | DNAC, ping monitoring | Continuous |
| **AP Channel Utilization** | <50% | WLC, DNAC RF analytics | Hourly |
| **Client Connection Success Rate** | >98% | ISE authentication logs | Daily |
| **Roaming Success Rate** | >99% | WLC roaming statistics | Daily |
| **P1 Incident Rate** | 0 incidents/month | ServiceNow incident tracker | Monthly |

---

### 6.6.2 Real-Time Monitoring Dashboards

**Dashboard 1: Migration Progress (Splunk)**

```splunk
# Migration Progress Dashboard (Updated Daily)

index=abhavtech_migration sourcetype=migration_tracker
| stats 
    count(eval(status="migrated")) as migrated,
    count(eval(status="pending")) as pending,
    count(eval(status="rolled_back")) as rolled_back,
    count as total
| eval adoption_rate = round((migrated / total) * 100, 2)
| eval rollback_rate = round((rolled_back / total) * 100, 2)
| table migrated, pending, rolled_back, adoption_rate, rollback_rate

# Example Output:
# migrated | pending | rolled_back | adoption_rate | rollback_rate
# 1,420    | 13,500  | 115         | 9.5%          | 0.8%
```

---

**Dashboard 2: Wireless Performance (DNAC)**

```
DNAC → Assurance → Dashboards → "WiFi 7 Migration Performance"

Widgets:
  1. Average Client Throughput (last 24 hours)
     • Mumbai: 4.5 Gbps ✓
     • Chennai: 4.3 Gbps ✓
     • London: 2.8 Gbps ⚠️
  
  2. Client Connection Success Rate
     • Overall: 98.2% ✓ (Target: >98%)
  
  3. Top 10 APs by Client Count
     • MUM-F6-AP01: 18 clients (healthy)
     • MUM-F6-AP02: 16 clients (healthy)
     • ...
  
  4. Poor Performing Clients (Throughput <1 Gbps)
     • 3 clients (0.2% of total)
     • Root cause: Distance >20m from AP
     • Action: Relocate desk or provide wired port
```

---

### 6.6.3 Weekly Migration Reports

**Report Template (Sent to CTO, Network Architect, IT Managers):**

```
WEEKLY WIRELESS MIGRATION REPORT
Week: [Date Range]
Prepared by: Network Architect

MIGRATION PROGRESS:
  • Users migrated this week: 320
  • Cumulative total: 1,740 (12% of 14,920 target)
  • Adoption rate: 12% (Target: 85% by Q2 2026)
  • On track: ✓ Yes (ahead of schedule by 5%)

PERFORMANCE METRICS:
  • Average throughput: 4.4 Gbps (Target: >4 Gbps) ✓
  • Average latency: 9.5ms (Target: <10ms) ✓
  • User satisfaction: 93% (Target: >90%) ✓
  • Rollback rate: 6% (Target: <8%) ✓

ISSUES & RESOLUTIONS:
  • Issue 1: 3 users reported intermittent disconnections
    Resolution: Updated Intel WiFi driver (BE200) to latest version
    Status: Resolved ✓
  
  • Issue 2: 1 user slow performance (<2 Gbps)
    Resolution: User desk relocated from far corner to near AP
    Status: Resolved ✓

NEXT WEEK PLAN:
  • Target: Migrate Chennai Floor 4 (60 executives)
  • Preparation: Pre-stage ISE accounts, send T-7 notification
  • Staffing: 4 roaming techs, 2 helpdesk staff on-site

RISKS:
  • Risk 1: Holiday week (reduced user availability)
    Mitigation: Shift migration to following week
  
  • Risk 2: WLC upgrade scheduled (potential conflict)
    Mitigation: Coordinate with WLC team, schedule non-overlapping window
```

---

## 6.7 Phase-Specific Migration Details

### 6.7.1 Phase 5A (Pilot) - Week 1-16

**Scope:**
- 115 WiFi 7 APs deployed
- 1,420 users (80 Mumbai executives, 60 Chennai executives, 200 Bangalore, 70 London, 1,010 baseline)

**Migration Timeline:**

| Week | Site | Floor | Users | Status |
|------|------|-------|-------|--------|
| **Week 11** | Mumbai | Floor 6 (Executives) | 80 | ✅ Complete (Week 11-12) |
| **Week 12** | Chennai | Floor 4 (Executives) | 60 | ✅ Complete (Week 12) |
| **Week 13** | Bangalore | Full branch (both floors) | 200 | ✅ Complete (Week 13-14) |
| **Week 14** | London | Floor 2 (Executives) | 70 | ✅ Complete (Week 14) |
| **Week 15-16** | All sites | General office (baseline data) | 1,010 | ✅ Complete (voluntary adoption) |

**Outcomes:**
- Wireless adoption: 85% (1,207 of 1,420 users migrated)
- Rollback rate: 6% (85 users)
- User satisfaction: 92%
- Technical performance: All 3 use cases validated ✓

---

### 6.7.2 Phase 5B-Wave 1 (Critical Sites) - Week 17-30

**Scope:**
- 400 WiFi 7 APs deployed
- 6 HQ sites: New Jersey, Dallas, Frankfurt, Singapore, Tokyo, Sydney
- 5,200 users (primarily executives + conference rooms)

**Migration Strategy:**
- Focus: Executive floors + conference centers (Category A devices)
- Wired exceptions: Engineering workstations (Category B, wired on request)
- Timeline: 14 weeks (2-3 weeks per site)

**Expected Outcomes:**
- Wireless adoption: 75% (3,900 of 5,200 users)
- Rollback rate: <7%
- User satisfaction: >88%

---

### 6.7.3 Phase 5B-Wave 2 (Regional Expansion) - Week 31-52

**Scope:**
- 550 WiFi 7 APs deployed
- 8 regional sites: Hong Kong, Delhi, Amsterdam, Paris, Madrid, Milan, Chicago, Toronto
- 6,000 users (general office floors)

**Migration Strategy:**
- Focus: General office wireless-first (Category A + Category B devices)
- Wired retention: Desktop PCs, IP phones, printers (Category C)
- Switch consolidation begins: Decommission 60 access switches (first batch)

**Expected Outcomes:**
- Wireless adoption: 78% (4,680 of 6,000 users)
- Switch decommissioning: 60 switches (18% of 330 total)

---

### 6.7.4 Phase 5B-Wave 3 (Branch Rollout) - Week 53-65

**Scope:**
- 155 WiFi 7 APs deployed
- 5 branch sites: Mexico City, Remaining branches
- 2,300 users (complete wireless-first transformation)

**Migration Strategy:**
- Focus: Final branch sites, complete transformation
- Switch consolidation completes: Decommission remaining 84 switches
- Wired-only devices remain (Category D: servers, BMS, infrastructure)

**Expected Outcomes:**
- Wireless adoption: 85% (1,955 of 2,300 users)
- Switch decommissioning: 144 total switches (44% of 330)
- Final wired port count: 7,350 (down from 15,840, 54% reduction)

---

## 6.8 Lessons Learned & Best Practices

### 6.8.1 Key Success Factors

**From Phase 5A Pilot:**

1. **Over-communicate**: 3-week advance notice prevents surprises. Users appreciate clarity.

2. **On-site IT presence**: Roaming technicians on migration day reduces anxiety, speeds resolution.

3. **Opt-out option**: Providing "wired on-demand" option (7-day window) increases trust, reduces resistance.

4. **Phased approach**: Start with executives (tech-savvy, high visibility) builds momentum for general rollout.

5. **Data-driven decisions**: Real-time monitoring (DNAC, Splunk) identifies issues early, enables proactive remediation.

---

### 6.8.2 Common Pitfalls & Avoidance Strategies

| Pitfall | Impact | Avoidance Strategy |
|---------|--------|-------------------|
| **Insufficient communication** | Users surprised, confused | 3-week advance notice, multiple channels (email, Slack, town hall) |
| **Inadequate helpdesk staffing** | Long wait times, user frustration | 3× normal staffing during migration week, on-site roaming techs |
| **No rollback plan** | Users feel trapped, resistance increases | Document rollback procedure, communicate opt-out option |
| **Forced migration** | User resentment, low satisfaction | Voluntary adoption, "wireless-first" not "wireless-only" (wired on request) |
| **Poor performance** | Rollbacks increase, satisfaction drops | Dense AP deployment (1 per 1,333 sq ft), continuous monitoring |
| **Ignoring feedback** | Same issues repeat across waves | Post-migration surveys, weekly reports, lessons learned |

---

## 6.9 Migration Framework Summary

**Key Principles:**
- **User-centric**: Voluntary adoption, opt-out option, clear communication
- **Data-driven**: Continuous monitoring, real-time dashboards, weekly reports
- **Phased approach**: Pilot → Critical Sites → Regional → Branches
- **Rollback-ready**: Every migration has documented rollback procedure

**Expected Outcomes (End of Phase 5B, Q2 2026):**
- ✅ 85% wireless adoption (12,682 of 14,920 users)
- ✅ 54% wired port reduction (15,840 → 7,350 ports)
- ✅ 144 access switches decommissioned (330 → 186 switches)
- ✅ $3.2M CapEx savings (avoided switch replacement)
- ✅ $420K/year OpEx savings (power, cooling, maintenance)
- ✅ >90% user satisfaction

**Success Criteria:**
All Phase 5B success criteria met → Wireless-first transformation complete → "Mission Accomplished"
