# Validation & Testing

## 7.8 Post-Migration Validation

### 7.8.1 Call Testing Matrix

| Test Case | From | To | Expected | Pass |
|-----------|------|----|---------| -----|
| Internal (Webex-Webex) | Ext 1001 | Ext 1002 | Rings, connects | [ ] |
| Internal (Webex-CUCM) | Ext 1001 | Ext 2001 | Rings, connects | [ ] |
| Internal (CUCM-Webex) | Ext 2001 | Ext 1001 | Rings, connects | [ ] |
| PSTN Outbound | Ext 1001 | +91-9876543210 | Connects | [ ] |
| PSTN Inbound | +91-9876543210 | +91-22-4960-1001 | Rings user | [ ] |
| Voicemail (no answer) | Any | Ext 1001 | VM after 4 rings | [ ] |
| Voicemail (direct) | User | VM pilot | Access VM | [ ] |
| Hunt Group | External | HG pilot | Distributes | [ ] |
| Auto Attendant | External | AA pilot | Menu plays | [ ] |
| Emergency | Ext 1001 | 112 | Routes to PSAP | [ ] |
| Forward Busy | Any | Ext 1001 (busy) | Forwards | [ ] |
| Forward No Answer | Any | Ext 1001 (no ans) | Forwards | [ ] |

### 7.8.2 Quality Validation

| Metric | Target | Measurement | Pass |
|--------|--------|-------------|------|
| MOS Score | >4.0 | Control Hub Analytics | [ ] |
| Jitter | <30ms | Network monitoring | [ ] |
| Latency | <150ms | Network monitoring | [ ] |
| Packet Loss | <1% | Network monitoring | [ ] |
| Call Setup Time | <3 seconds | Stopwatch test | [ ] |

### 7.8.3 User Sign-Off Template

```
+-----------------------------------------------------------------+
|  USER MIGRATION SIGN-OFF                                         |
+-----------------------------------------------------------------+
|                                                                 |
|  User Name: _____________________                              |
|  Extension: _________  DID: _________________                  |
|  Migration Date: ___________  Batch: _________                 |
|                                                                 |
|  VALIDATION CHECKLIST (User confirms):                         |
|                                                                 |
|  [ ] I can make internal calls                                   |
|  [ ] I can receive internal calls                                |
|  [ ] I can make external (PSTN) calls                           |
|  [ ] I can receive external calls on my DID                     |
|  [ ] My voicemail is working                                     |
|  [ ] My call forwarding is set correctly                        |
|  [ ] My speed dials work                                         |
|  [ ] Webex App is installed and working                         |
|  [ ] I have completed the training                               |
|                                                                 |
|  Issues Reported: ________________________________________     |
|                                                                 |
|  User Signature: _________________  Date: __________           |
|                                                                 |
+-----------------------------------------------------------------+
```

---

