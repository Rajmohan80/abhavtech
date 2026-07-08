# Migration Runbook

## 7.6 Batch Migration Runbook

### 7.6.1 Migration Day Schedule Template

**T-1 Day (Day Before Migration):**

| Time | Task | Owner | Status |
|------|------|-------|--------|
| 09:00 | Final batch user list review | PM | [ ] |
| 10:00 | Verify all users have Webex accounts | Webex Admin | [ ] |
| 11:00 | Verify all phones staged in Webex | Webex Admin | [ ] |
| 14:00 | Send user reminder email | Comms | [ ] |
| 16:00 | Verify coexistence trunk operational | Voice Eng | [ ] |
| 17:00 | Brief help desk on expected calls | Help Desk Lead | [ ] |

**Migration Day (T-Day):**

| Time | Task | Owner | Status |
|------|------|-------|--------|
| 17:00 | Migration team go/no-go call | PM | [ ] |
| 17:30 | Begin CUCM phone deletions | Voice Eng | [ ] |
| 18:00 | Factory reset phones (if required) | Site IT | [ ] |
| 18:30 | Activate phones in Webex | Webex Admin | [ ] |
| 19:00 | Phones download Webex firmware | Auto | [ ] |
| 19:30 | Begin user validation testing | Voice Eng | [ ] |
| 20:00 | Update CUCM route patterns | Voice Eng | [ ] |
| 20:30 | Configure user features (forwards, etc.) | Webex Admin | [ ] |
| 21:00 | Complete validation testing | Voice Eng | [ ] |
| 21:30 | Migration status call | PM | [ ] |
| 22:00 | Notify users migration complete | Comms | [ ] |

**T+1 Day (Day After Migration):**

| Time | Task | Owner | Status |
|------|------|-------|--------|
| 08:00 | Help desk prepared for calls | Help Desk | [ ] |
| 09:00 | Floor walk - verify phones working | Site IT | [ ] |
| 10:00 | Address any user issues | Voice Eng | [ ] |
| 12:00 | Midday status check | PM | [ ] |
| 17:00 | End of day status | PM | [ ] |

### 7.6.2 Hour-by-Hour Runbook Template

```
+-----------------------------------------------------------------+
|  MIGRATION RUNBOOK - BATCH [X] - [DATE]                          |
+-----------------------------------------------------------------+
|                                                                 |
|  BATCH DETAILS:                                                |
|  Site: [Location]                                              |
|  Users: [Count]                                                |
|  Extensions: [Range]                                           |
|  Migration Lead: [Name]                                        |
|  Rollback Decision Time: [Time]                                |
|                                                                 |
|  HOUR-BY-HOUR EXECUTION:                                       |
|                                                                 |
|  17:00 - GO/NO-GO DECISION                                     |
|  +-- [ ] All pre-checks passed                                   |
|  +-- [ ] Team assembled                                          |
|  +-- [ ] Rollback plan confirmed                                 |
|  +-- [ ] GO decision made by: ________                           |
|                                                                 |
|  17:30 - CUCM DEACTIVATION                                     |
|  +-- [ ] CUCM phones deleted (BAT or manual)                    |
|  +-- [ ] Phones show unregistered                                |
|  +-- [ ] Screenshot captured for records                         |
|                                                                 |
|  18:00 - PHONE RESET                                           |
|  +-- [ ] Factory reset completed (if needed)                    |
|  +-- [ ] Phones connected to voice VLAN                         |
|  +-- [ ] Phones requesting config                                |
|                                                                 |
|  18:30 - WEBEX ACTIVATION                                      |
|  +-- [ ] MACs registered in Control Hub                         |
|  +-- [ ] Phones downloading firmware                             |
|  +-- [ ] Firmware download complete                              |
|                                                                 |
|  19:00 - PHONE REGISTRATION                                    |
|  +-- [ ] Phones showing user lines                               |
|  +-- [ ] Extension displayed correctly                           |
|  +-- [ ] Registration status GREEN in Control Hub               |
|                                                                 |
|  19:30 - VALIDATION TESTING                                    |
|  +-- [ ] Internal call test (extension to extension)            |
|  +-- [ ] PSTN outbound test                                      |
|  +-- [ ] PSTN inbound test (call DID)                           |
|  +-- [ ] Voicemail test                                          |
|  +-- [ ] CUCM-to-Webex call test (coexistence)                  |
|  +-- [ ] Webex-to-CUCM call test (coexistence)                  |
|                                                                 |
|  20:00 - CUCM ROUTE PATTERN UPDATE                             |
|  +-- [ ] Route patterns updated for migrated extensions         |
|  +-- [ ] Test CUCM user calling migrated extension              |
|  +-- [ ] Test migrated user calling CUCM extension              |
|                                                                 |
|  20:30 - FEATURE CONFIGURATION                                 |
|  +-- [ ] Call forwards configured                                |
|  +-- [ ] Speed dials/BLF configured                              |
|  +-- [ ] Hunt groups updated (if all members migrated)          |
|  +-- [ ] Voicemail greetings reminder sent                       |
|                                                                 |
|  21:00 - FINAL VALIDATION                                      |
|  +-- [ ] 10% sample call testing                                 |
|  +-- [ ] No open P1/P2 issues                                    |
|  +-- [ ] Help desk briefed                                       |
|  +-- [ ] User notification sent                                  |
|                                                                 |
|  21:30 - SIGN-OFF                                              |
|  +-- [ ] Migration Lead sign-off: ________                       |
|  +-- [ ] Issues documented: [Count]                              |
|  +-- [ ] Rollback: NOT REQUIRED / PARTIAL / FULL                |
|                                                                 |
+-----------------------------------------------------------------+
```

---

