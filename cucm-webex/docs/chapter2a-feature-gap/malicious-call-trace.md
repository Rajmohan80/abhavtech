# Malicious Call Trace -- Compliance Replacement Procedure

> **[!]️ GAP SEVERITY: MEDIUM | Affects: Legal / Compliance Team, India & EU Operations**

## 2A.5.1 Problem Statement

CUCM Malicious Call Trace (MCT) allows a user to press a softkey during a live call to flag it as malicious. CUCM immediately logs the call with full CLI, timestamp, and trunk details to the MCT log, which is provided to law enforcement or legal teams.

This capability is required under India DoT regulations and is good practice for EU operations under GDPR. **Webex Calling has no native MCT feature.**

## 2A.5.2 Abhavtech MCT Replacement Design

The replacement approach relies on call recording and enhanced CDR logging:

- **100% call recording** is configured for all Webex Calling users (already planned in the compliance framework -- Chapter 4). This provides a complete audio record for any call flagged as malicious.
- **User procedure:** During/after a malicious call, the user calls the internal Security Helpdesk (ext **9911**) and logs a security incident in ServiceNow with the caller's number and timestamp.
- **Security team procedure:** Pull the CDR from Control Hub (**Control Hub > Calling > Reports > Call Detail Records**) and retrieve the call recording from the recording platform.
- The **CDR + recording combination** provides the equivalent evidence package to the legacy MCT log.

> This replacement is an accepted procedural gap. It requires user training and a documented internal procedure but provides equivalent legal evidence quality through call recording.

---
