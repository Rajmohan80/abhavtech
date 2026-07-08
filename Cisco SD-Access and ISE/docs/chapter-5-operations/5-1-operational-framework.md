# 5.1 Operational Framework

### 5.1.1 ITIL-Aligned Operating Model

```
+------------------------------------------------------------------+
|                    SD-ACCESS OPERATIONS MODEL                     |
+------------------------------------------------------------------+

                    +-------------------+
                    |  Service Desk     |
                    |  (Tier 0/1)       |
                    +-------------------+
                            |
              +-------------+-------------+
              |                           |
    +-------------------+       +-------------------+
    |  Network Ops      |       |  Security Ops     |
    |  (Tier 2)         |       |  (Tier 2)         |
    +-------------------+       +-------------------+
              |                           |
              +-------------+-------------+
                            |
                    +-------------------+
                    |  Engineering      |
                    |  (Tier 3)         |
                    +-------------------+
                            |
                    +-------------------+
                    |  Vendor Support   |
                    |  (Cisco TAC)      |
                    +-------------------+
```

### 5.1.2 Team Roles and Responsibilities

| Role | Responsibilities | Shift Coverage |
|------|------------------|----------------|
| NOC Analyst (Tier 1) | Alert monitoring, initial triage, ticket creation | 24×7 (3 shifts) |
| Network Engineer (Tier 2) | Troubleshooting, configuration changes, incident resolution | 16×5 + on-call |
| Security Analyst (Tier 2) | ISE policy, authentication issues, security incidents | 16×5 + on-call |
| SD-Access Engineer (Tier 3) | Complex issues, design changes, vendor escalation | Business hours + on-call |
| DNAC Administrator | Platform administration, software updates, integrations | Business hours |
| ISE Administrator | Policy management, certificate management, profiling | Business hours |

### 5.1.3 Operational KPIs

| KPI | Target | Measurement | Frequency |
|-----|--------|-------------|-----------|
| Network Availability | 99.99% | DNAC Assurance | Real-time |
| Mean Time to Detect (MTTD) | <5 minutes | Alert to ticket | Monthly |
| Mean Time to Resolve (MTTR) | <2 hours (P2) | Ticket closure | Monthly |
| Authentication Success Rate | >99.5% | ISE reports | Daily |
| Change Success Rate | >95% | Post-change validation | Monthly |
| First Call Resolution | >70% | Service desk metrics | Monthly |

### 5.1.4 Operational Runbook Structure

```yaml
Runbooks:
  Daily_Operations:
    - Health_Check_Morning.md
    - Health_Check_Evening.md
    - Authentication_Report_Review.md
    
  Weekly_Operations:
    - Capacity_Review.md
    - Security_Posture_Review.md
    - Change_Review_Preparation.md
    
  Monthly_Operations:
    - Compliance_Report_Generation.md
    - License_Usage_Review.md
    - Performance_Baseline_Update.md
    
  Incident_Response:
    - Authentication_Failure_Triage.md
    - Fabric_Node_Down.md
    - WAN_Failover_Procedure.md
    - ISE_PSN_Failover.md
    
  Maintenance:
    - Software_Upgrade_Procedure.md
    - Certificate_Renewal.md
    - Backup_Verification.md
```

---
