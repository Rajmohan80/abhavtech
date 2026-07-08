# Chapter 7: WxCC Migration Execution (Phase 2) -- 7.8 UCCX Decommissioning

## 7.8 UCCX Decommissioning

## 7.8.1 Decommission Prerequisites

```
+-----------------------------------------------------------------------------+
|              UCCX DECOMMISSION - PREREQUISITES                              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  TIMING: After hypercare completion + 2-week buffer (Week 15+)            |
|                                                                             |
|  PREREQUISITES:                                                            |
|  -------------------------------------------------------------------------  |
|  [ ] All waves successfully migrated                                      |
|  [ ] Hypercare exit criteria met                                          |
|  [ ] 2-week stability period (no rollbacks)                               |
|  [ ] All 175 agents operational on WxCC                                   |
|  [ ] UCCX has 0 active calls for 2 weeks                                  |
|  [ ] Business owner sign-off for decommission                             |
|  [ ] Backup of all UCCX data archived                                     |
|  [ ] CDR/Recording data migrated or retained per compliance               |
|                                                                             |
|  [!]️ ONCE UCCX IS DECOMMISSIONED, ROLLBACK TO UCCX IS NOT POSSIBLE        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 7.8.2 UCCX Data Archival

| Data Type | Retention | Archive Location | Owner |
|-----------|-----------|------------------|-------|
| Call Detail Records (CDR) | 7 years | Archive storage | IT Ops |
| Call Recordings | Per compliance (1 yr India) | WFO migration or archive | CC Ops |
| Agent Statistics | 2 years | Data warehouse | Analytics |
| Script Backup (.aef files) | 2 years | Documentation repo | Voice Eng |
| Configuration Export | Permanent | Project documentation | Voice Eng |
| Queue Configuration | Permanent | Project documentation | Voice Eng |

## 7.8.3 UCCX Decommission Procedure

| Step | Action | Owner | Verification |
|------|--------|-------|--------------|
| 1 | Verify 0 active agents in UCCX | CC Ops | RTMT shows 0 |
| 2 | Verify 0 calls in last 14 days | Voice Eng | CDR check |
| 3 | Final backup of UCCX | Voice Eng | DRS backup |
| 4 | Export all historical reports | CC Ops | Reports saved |
| 5 | Archive call recordings | CC Ops | Per compliance |
| 6 | Disable UCCX services | Voice Eng | Services stopped |
| 7 | Remove CTI Route Points from CUCM | Voice Eng | CTI RPs deleted |
| 8 | Shutdown UCCX secondary | Voice Eng | VM powered off |
| 9 | Shutdown UCCX primary | Voice Eng | VM powered off |
| 10 | Update DNS records | Network | UCCX FQDNs removed |
| 11 | Delete UCCX VMs | IT Ops | VMs deleted |
| 12 | Release IP addresses | Network | IPAM updated |
| 13 | Update network diagrams | Network | Diagrams updated |
| 14 | Notify Cisco licensing | Procurement | Licenses released |
| 15 | Document decommission | PM | Project closure |

## 7.8.4 Post-Decommission Validation

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| UCCX servers powered off | Yes | | [ ] |
| UCCX DNS records removed | Yes | | [ ] |
| CTI Route Points removed from CUCM | Yes | | [ ] |
| Backup archived and accessible | Yes | | [ ] |
| Licensing updated with Cisco | Yes | | [ ] |
| Documentation updated | Yes | | [ ] |

---
