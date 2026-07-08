# Purple Team Operations

## 9. PURPLE TEAM OPERATIONS

### 9.1 Purple Team Philosophy

**Purple Team Definition:** Collaborative security exercise where Red Team (attackers) and Blue Team (defenders) work together to improve detection and response capabilities.

**Key Differences from Traditional Pen Testing:**

| Traditional Pen Test | Purple Team Exercise |
|---------------------|---------------------|
| Red Team operates independently | Red Team + Blue Team collaborate |
| Focus on finding vulnerabilities | Focus on improving detection |
| Single test cycle | Iterative cycles (attack → detect → tune → retest) |
| Final report delivered | Continuous improvement process |
| Adversarial relationship | Cooperative relationship |

### 9.2 Purple Team Exercise Structure

**Weekly/Bi-weekly Cadence:**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                   PURPLE TEAM EXERCISE WORKFLOW                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  WEEK 1: PLANNING & BASELINE                                                    │
│  ══════════════════════════════════════════════════════════════════════════     │
│  Monday:                                                                         │
│  • Select MITRE ATT&CK technique to test (e.g., T1003: OS Credential Dumping)   │
│  • Red Team prepares attack scenario                                            │
│  • Blue Team documents current detection capabilities                           │
│                                                                                  │
│  Tuesday-Wednesday:                                                              │
│  • Baseline test: Red Team executes attack (Blue Team unaware)                  │
│  • Measure: Detection time, alert generation, response actions                  │
│                                                                                  │
│  Thursday:                                                                       │
│  • Debrief session: Red Team reveals attack methods                             │
│  • Blue Team reviews missed detections                                          │
│  • Identify gaps: Why didn't we detect this?                                    │
│                                                                                  │
│  Friday:                                                                         │
│  • Blue Team tunes detection rules (Splunk, XDR, AMP)                           │
│  • Implement new alerts, playbooks                                              │
│                                                                                  │
│  WEEK 2: VALIDATION & ITERATION                                                 │
│  ══════════════════════════════════════════════════════════════════════════     │
│  Monday:                                                                         │
│  • Red Team repeats same attack with tuned defenses                             │
│  • Measure: Improved detection time, alert accuracy                             │
│                                                                                  │
│  Tuesday:                                                                        │
│  • Red Team introduces variations of attack (evasion techniques)                │
│  • Test detection robustness                                                    │
│                                                                                  │
│  Wednesday:                                                                      │
│  • Final debrief: Lessons learned, metrics comparison                           │
│  • Document improvements (detection coverage %, MTTD reduction)                 │
│                                                                                  │
│  Thursday-Friday:                                                                │
│  • Plan next week's technique                                                   │
│  • Update detection coverage matrix                                             │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 9.3 Purple Team Scenario Example

**Scenario:** Credential Dumping (MITRE T1003.001: LSASS Memory)

**Week 1 Baseline:**

| Phase | Red Team Action | Blue Team Detection | Result |
|-------|----------------|-------------------|--------|
| **Baseline** | Use Mimikatz to dump LSASS memory on compromised endpoint | No alert generated | ❌ **MISS** (60 min to detect via manual investigation) |

**Root Cause Analysis:**
- AMP signature for Mimikatz is outdated (only detects default binary name)
- Splunk Event ID 4656 (process access to LSASS) not correlated with suspicious process names
- No alert configured for LSASS memory dumps

**Tuning Actions:**
1. Update AMP custom signatures to detect obfuscated Mimikatz variants
2. Create Splunk alert: Event ID 4656 (LSASS access) + Event ID 10 (Sysmon process access)
3. Configure XDR playbook: Auto-quarantine endpoint if LSASS dump detected

**Week 2 Validation:**

| Phase | Red Team Action | Blue Team Detection | Result |
|-------|----------------|-------------------|--------|
| **Test 1** | Execute same Mimikatz command | AMP alert + Splunk correlation + XDR playbook (endpoint quarantined) | ✅ **DETECT** (2 min MTTD, 5 min MTTR) |
| **Test 2** | Use custom LSASS dumping tool (not Mimikatz) | Splunk Event ID 4656 correlation still detects | ✅ **DETECT** (3 min MTTD) |
| **Test 3** | Attempt to disable Sysmon before dumping | AMP detects Sysmon service stop attempt | ✅ **DETECT** (1 min MTTD) |

**Metrics Improvement:**
- Detection Rate: 0% → 100%
- MTTD: 60 min → 2 min (97% improvement)
- MTTR: N/A → 5 min (automated playbook)

### 9.4 Purple Team Metrics Dashboard

**Quarterly Progress Tracking:**

| MITRE Technique | Baseline Detection | Q1 Detection | Q2 Detection | Q3 Detection | Q4 Target |
|----------------|-------------------|-------------|-------------|-------------|-----------|
| T1003 (Credential Dumping) | 0% | 100% ✅ | 100% | 100% | 100% |
| T1059.001 (PowerShell) | 40% | 75% | 85% | 95% ✅ | 95% |
| T1021.001 (RDP Lateral Movement) | 50% | 70% | 85% | 90% ✅ | 90% |
| T1071.001 (Web C2) | 60% | 75% | 85% | 90% ✅ | 90% |
| T1048 (Exfiltration) | 30% | 50% | 65% | 80% | 90% |
| **Overall Coverage** | **45%** | **68%** | **80%** | **90%** ✅ | **90%** |

**Detection Coverage Heatmap:**

```
MITRE ATT&CK Tactic Coverage (Q3 2025):

Initial Access:        â– â– â– â– â– â– â– â– â–¡â–¡  80%
Execution:             â– â– â– â– â– â– â– â– â– â–¡  90%
Persistence:           â– â– â– â– â– â– â–¡â–¡â–¡â–¡  60%  ⚠️ Need improvement
Privilege Escalation:  â– â– â– â– â– â– â– â–¡â–¡â–¡  70%
Defense Evasion:       â– â– â– â– â– â–¡â–¡â–¡â–¡â–¡  50%  ⚠️ Need improvement
Credential Access:     â– â– â– â– â– â– â– â– â– â– 100% ✅
Discovery:             â– â– â– â– â– â– â– â–¡â–¡â–¡  70%
Lateral Movement:      â– â– â– â– â– â– â– â– â– â–¡  90%
Collection:            â– â– â– â– â–¡â–¡â–¡â–¡â–¡â–¡  40%  ⚠️ Need improvement
Exfiltration:          â– â– â– â– â– â– â– â– â–¡â–¡  80%
Command & Control:     â– â– â– â– â– â– â– â– â– â–¡  90%
```

### 9.5 Purple Team Best Practices

**DO's:**
- ✅ Focus on one technique at a time (depth over breadth)
- ✅ Document everything (attack commands, detection queries, tuning changes)
- ✅ Celebrate improvements (detection coverage increases)
- ✅ Share knowledge (Red Team teaches Blue Team attack techniques)
- ✅ Iterate frequently (weekly/bi-weekly exercises)

**DON'Ts:**
- ❌ Don't blame Blue Team for missed detections (collaborative, not adversarial)
- ❌ Don't rush through exercises (quality over quantity)
- ❌ Don't skip documentation (lessons learned are valuable)
- ❌ Don't test in production during business hours (use after-hours or lab environment)
- ❌ Don't forget to revert changes (clean up test accounts, firewall rules)

---
