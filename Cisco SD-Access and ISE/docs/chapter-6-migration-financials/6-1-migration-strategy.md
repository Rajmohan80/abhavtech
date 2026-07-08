# 6.1 Migration Strategy

### 6.1.1 Migration Approach Selection

| Approach | Description | Risk | Duration | Selected |
|----------|-------------|------|----------|----------|
| Big Bang | All sites simultaneously | High | 4 weeks | |
| Phased by Region | Region at a time | Medium | 32 weeks | |
| Phased by Site | Site at a time | Low | 52 weeks | |
| **Phased Hybrid** | Hub sites first, branches parallel | Medium-Low | 40 weeks | **SELECTED** |

**Rationale for Phased Hybrid Approach**:
- Hub sites migrated sequentially (risk management)
- Branch sites migrated in parallel within regions (efficiency)
- Lessons learned from pilot applied to subsequent sites
- Resources optimized across teams

### 6.1.2 Migration Phases

```
+------------------------------------------------------------------+
|                    MIGRATION TIMELINE (40 WEEKS)                  |
+------------------------------------------------------------------+

Phase 1: Foundation (Weeks 1-6)
+----------------------------------------------------------------+
| Week 1-2  | Week 3-4  | Week 5-6                               |
| DNAC      | ISE       | Integration                            |
| Install   | Deploy    | DNAC-ISE, Underlay Prep                |
+----------------------------------------------------------------+

Phase 2: Pilot (Weeks 7-10)
+----------------------------------------------------------------+
| Week 7-8            | Week 9-10                                |
| Mumbai Pilot        | Validation & Refinement                  |
| (1 Building)        | Lessons Learned                          |
+----------------------------------------------------------------+

Phase 3: Hub Sites (Weeks 11-22)
+----------------------------------------------------------------+
| Week 11-12 | Week 13-14 | Week 15-16 | Week 17-18 | Week 19-22 |
| Mumbai     | Chennai    | London     | Frankfurt  | NJ + Dallas|
| Full       | Full       | Full       | Full       | Full       |
+----------------------------------------------------------------+

Phase 4: Branch Sites (Weeks 23-34)
+----------------------------------------------------------------+
| Week 23-26        | Week 27-30        | Week 31-34             |
| APAC Branches     | EMEA Branches     | Americas Branches      |
| (5 sites)         | (12 sites)        | (15 sites)             |
+----------------------------------------------------------------+

Phase 5: Optimization (Weeks 35-40)
+----------------------------------------------------------------+
| Week 35-36        | Week 37-38        | Week 39-40             |
| Performance       | Training &        | Documentation &        |
| Tuning            | Knowledge         | Handover               |
|                   | Transfer          |                        |
+----------------------------------------------------------------+
```

### 6.1.3 Site Migration Sequence

| Order | Site | Type | Devices | Endpoints | Duration | Dependencies |
|-------|------|------|---------|-----------|----------|--------------|
| 1 | Mumbai (Pilot) | Hub | 10 | 500 | 2 weeks | DNAC/ISE ready |
| 2 | Mumbai (Full) | Hub | 52 | 4,200 | 2 weeks | Pilot success |
| 3 | Chennai | Hub | 40 | 3,100 | 2 weeks | Mumbai complete |
| 4 | London | Hub | 46 | 3,500 | 2 weeks | Chennai complete |
| 5 | Frankfurt | Hub | 32 | 2,400 | 2 weeks | London complete |
| 6 | New Jersey | Hub | 56 | 4,500 | 2 weeks | Frankfurt complete |
| 7 | Dallas | Hub | 36 | 2,800 | 2 weeks | NJ complete |
| 8-12 | APAC Branches | Branch | 5 each | 200-400 | 4 weeks | Hub complete |
| 13-24 | EMEA Branches | Branch | 4 each | 150-300 | 4 weeks | Hub complete |
| 25-39 | Americas Branches | Branch | 4 each | 150-300 | 4 weeks | Hub complete |

### 6.1.4 Migration Dependencies

```
+------------------------------------------------------------------+
|                    DEPENDENCY MATRIX                              |
+------------------------------------------------------------------+

DNAC Installation
    |
    +--> ISE Deployment
    |        |
    |        +--> DNAC-ISE Integration
    |                  |
    |                  +--> Policy Definition
    |                           |
    +--> Underlay Provisioning   |
              |                  |
              +--> Fabric Site Creation <--+
                        |
                        +--> Node Provisioning
                                  |
                                  +--> Host Onboarding
                                           |
                                           +--> User Migration
                                                    |
                                                    +--> Legacy Decommission
```

### 6.1.5 Resource Requirements

| Phase | Network Engineers | Security Engineers | Project Manager | Vendor Support |
|-------|-------------------|-------------------|-----------------|----------------|
| Phase 1 | 4 | 2 | 1 | 2 (Cisco) |
| Phase 2 | 4 | 2 | 1 | 2 (Cisco) |
| Phase 3 | 6 | 3 | 1 | 2 (Cisco) |
| Phase 4 | 8 | 2 | 1 | 1 (Cisco) |
| Phase 5 | 4 | 2 | 1 | 0 |

---
