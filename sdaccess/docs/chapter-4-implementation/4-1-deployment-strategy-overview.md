# 4.1 Deployment Strategy Overview

### 4.1.1 Phased Migration Approach

The migration follows a structured 5-phase approach minimizing business disruption while ensuring systematic validation at each stage.

```
PHASE 1          PHASE 2          PHASE 3          PHASE 4          PHASE 5
Foundation       Pilot Site       Hub Sites        Branch Sites     Optimization
(Weeks 1-6)      (Weeks 7-10)     (Weeks 11-22)    (Weeks 23-34)    (Weeks 35-40)
    |                |                |                |                |
    v                v                v                v                v
+----------+    +----------+    +----------+    +----------+    +----------+
| DNAC/ISE |    | Mumbai   |    | Chennai  |    | APAC     |    | Tuning   |
| Install  |    | Pilot    |    | London   |    | EMEA     |    | Training |
| Underlay |    | Fabric   |    | Frankfurt|    | Americas |    | Handover |
| Prep     |    | Test     |    | NJ/Dallas|    | Branches |    | Document |
+----------+    +----------+    +----------+    +----------+    +----------+
```

### 4.1.2 Deployment Timeline

| Phase | Duration | Sites | Activities | Exit Criteria |
|-------|----------|-------|------------|---------------|
| Phase 1: Foundation | 6 weeks | N/A | DNAC cluster, ISE deployment, underlay prep | DNAC/ISE operational, underlay validated |
| Phase 2: Pilot | 4 weeks | Mumbai (partial) | Single building fabric, limited users | 500 users migrated, 95% success rate |
| Phase 3: Hub Sites | 12 weeks | 6 hub sites | Full fabric deployment, all VNs | All hub sites operational, 99.9% uptime |
| Phase 4: Branch Sites | 12 weeks | 30+ branches | Fabric-in-a-Box, SD-WAN integration | All branches migrated, failover tested |
| Phase 5: Optimization | 6 weeks | All | Performance tuning, training, handover | SLA compliance, team certified |

**Total Duration: 40 weeks (10 months)**

### 4.1.3 Governance Structure

```
                    +---------------------------+
                    |    Steering Committee     |
                    |    (Monthly Review)       |
                    +---------------------------+
                               |
            +------------------+------------------+
            |                                     |
    +---------------+                     +---------------+
    | Project       |                     | Technical     |
    | Management    |                     | Review Board  |
    | (Weekly)      |                     | (Weekly)      |
    +---------------+                     +---------------+
            |                                     |
    +-------+-------+                     +-------+-------+
    |               |                     |               |
+-------+    +----------+           +----------+    +----------+
| Change|    | Resource |           | Network  |    | Security |
| Mgmt  |    | Tracking |           | Team     |    | Team     |
+-------+    +----------+           +----------+    +----------+
```

### 4.1.4 Change Control Process

| Change Type | Approval Required | Lead Time | Rollback Window |
|-------------|-------------------|-----------|-----------------|
| Standard (documented procedure) | Team Lead | 24 hours | 2 hours |
| Normal (planned change) | CAB | 5 business days | 4 hours |
| Emergency (critical fix) | Emergency CAB | 2 hours | 1 hour |
| Major (site cutover) | Steering Committee | 10 business days | 8 hours |

---
