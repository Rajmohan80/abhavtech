# Unity Connection Voicemail -- Webex Calling Voicemail Migration

> **[!]️ GAP SEVERITY: HIGH | Affects: All 3,200 Users -- Mailbox & Greeting Migration**

## 2A.4.1 Problem Statement

The existing Unity Connection deployment provides voicemail for all 3,200 Abhavtech users with features including visual voicemail, IMAP email delivery, Class of Service policies, custom greetings, distribution lists, and message notification rules.

Webex Calling's built-in voicemail is more limited -- it supports basic voicemail-to-email, visual voicemail in the Webex App, and PIN-based access, but **does not support IMAP, complex CoS policies, or voicemail distribution lists**.

## 2A.4.2 Feature Comparison -- Unity Connection vs. Webex Calling Voicemail

| Feature | Unity Connection | Webex Calling VM | Decision |
|---|---|---|---|
| Visual voicemail (app) | [OK] Yes (ViewMail) | [OK] Yes (Webex App) | Native migration |
| Voicemail to email (WAV) | [OK] Yes | [OK] Yes | Native migration |
| IMAP email client access | [OK] Yes | [X] No | **Accepted gap** |
| Custom personal greeting | [OK] Yes | [OK] Yes | Native migration |
| Alternate/busy greetings | [OK] Yes (multiple) | [OK] Yes (limited) | Native migration |
| Class of Service (storage/length) | [OK] Yes (per-mailbox) | [!]️ Fixed: 100 messages, 5 min | **Accepted limitation** |
| Distribution lists (voicemail) | [OK] Yes | [X] No | **Replaced by M365 email DLs** |
| Message notification rules | [OK] Yes (email/SMS/pager) | [!]️ Email only | **Accepted limitation** |
| PIN-based telephone access | [OK] Yes | [OK] Yes | Native migration |
| Greeting-only mailboxes | [OK] Yes | [OK] Yes (Announcement-only) | Native migration |

## 2A.4.3 Mailbox Migration Procedure

> **Important:** Unity Connection does not have a native export-to-Webex migration tool. Voicemail message history **cannot** be migrated.

1. **T-28 days:** Send user communication -- "Your voicemail messages will not be automatically transferred. Save any important messages to email before [batch date]."
2. **T-14 days:** Send reminder notification
3. **T-7 days:** Export saved greetings from Unity Connection using CUCA greeting export tool -- convert to WAV and store in project SharePoint
4. **T-0:** Disable Unity Connection mailbox for migrated users. Webex Calling VM activates automatically.
5. **T+1:** Test voicemail deposit and retrieval for all migrated users
6. Assist IMAP users with switching to Webex App visual voicemail (individual sessions)
7. Recreate Unity Connection distribution lists as **M365 distribution groups**

**Accepted Gaps for Abhavtech:**
- IMAP voicemail access -> replaced by Webex App visual voicemail
- Voicemail distribution lists -> replaced by M365 email distribution groups

---
