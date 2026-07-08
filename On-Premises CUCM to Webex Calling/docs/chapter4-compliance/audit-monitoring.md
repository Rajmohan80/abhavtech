# Audit & Monitoring

## 4.6 Recording & Consent by Region

### 4.6.1 Recording Consent Matrix

```
+-----------------------------------------------------------------------------+
|              CALL RECORDING CONSENT REQUIREMENTS - ABHAVTECH                 |
+-----------------------------------------------------------------------------+
|                                                                             |
|  REGION         CONSENT TYPE      IMPLEMENTATION                           |
|  ======         ============      ==============                           |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                                                                       |   |
|  |  INDIA                                                               |   |
|  |  -----                                                                |   |
|  |  Consent: ONE-PARTY (implied for business)                          |   |
|  |  Legal Basis: IT Act 2000, Contract Act                             |   |
|  |  Implementation:                                                     |   |
|  |  * Enterprise Calling: Recording without announcement (internal)    |   |
|  |  * Contact Center: Announcement required (customer calls)           |   |
|  |  * Announcement: "This call may be recorded for quality purposes"   |   |
|  |                                                                       |   |
|  |  UK                                                                  |   |
|  |  --                                                                   |   |
|  |  Consent: TWO-PARTY (with business exception)                       |   |
|  |  Legal Basis: UK GDPR, Regulation of Investigatory Powers           |   |
|  |  Implementation:                                                     |   |
|  |  * Enterprise Calling: Notification to all parties                  |   |
|  |  * Contact Center: IVR announcement before agent connect            |   |
|  |  * Announcement: "Calls are recorded for training and compliance"   |   |
|  |                                                                       |   |
|  |  GERMANY (EU)                                                        |   |
|  |  ------------                                                         |   |
|  |  Consent: TWO-PARTY (EXPLICIT)                                      |   |
|  |  Legal Basis: GDPR Art. 6, BDSG, TKG                                |   |
|  |  Implementation:                                                     |   |
|  |  * Enterprise Calling: Explicit consent required (rare use case)   |   |
|  |  * Contact Center: IVR with consent collection                      |   |
|  |  * Announcement + Consent: "Press 1 to consent to recording"        |   |
|  |  * Works Council: Consultation completed                            |   |
|  |                                                                       |   |
|  |  US (New Jersey)                                                     |   |
|  |  ---------------                                                      |   |
|  |  Consent: TWO-PARTY (all-party consent state)                       |   |
|  |  Legal Basis: NJ Wiretapping Act                                    |   |
|  |  Implementation:                                                     |   |
|  |  * Announcement to all parties before recording                     |   |
|  |  * Announcement: "This call is being recorded"                      |   |
|  |                                                                       |   |
|  |  US (Texas - Dallas)                                                 |   |
|  |  -------------------                                                  |   |
|  |  Consent: ONE-PARTY                                                 |   |
|  |  Legal Basis: Texas Penal Code                                      |   |
|  |  Implementation:                                                     |   |
|  |  * Recording permitted with one party's consent                    |   |
|  |  * Best practice: Announce anyway for consistency                   |   |
|  |                                                                       |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  [!]️ ABHAVTECH POLICY: Announce recording on ALL customer-facing calls    |
|     regardless of jurisdiction to ensure compliance and consistency.       |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.6.2 Recording Architecture

```
+-----------------------------------------------------------------------------+
|              RECORDING ARCHITECTURE - ABHAVTECH                              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  WEBEX CALLING RECORDING:                                                  |
|  =========================                                                 |
|                                                                             |
|  Recording Type: Cloud-based (Webex native)                               |
|  Storage: Regional (APAC for India, UK for UK, EU for Germany, US for US) |
|  Retention: 90 days (configurable)                                        |
|  Format: MP3 (audio)                                                       |
|  Access: Control Hub -> Recording Management                               |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  | Feature               | Calling Recording    | CC Recording         |   |
|  +-----------------------+----------------------+----------------------+   |
|  | Platform              | Webex Calling        | Webex Contact Center |   |
|  | Trigger               | Policy-based/On-demand| Always-on (queue)   |   |
|  | Storage Location      | Regional DC          | Regional DC          |   |
|  | Retention             | 90 days              | 90 days (WFO add-on) |   |
|  | Screen Recording      | Not available        | Optional (50 agents) |   |
|  | Quality Management    | Basic                | Full QM suite        |   |
|  | Transcription         | Not included         | Add-on available     |   |
|  | Search                | Metadata only        | Full-text (transcript)|   |
|  | Export                | Manual               | Bulk export API      |   |
|  | Legal Hold            | Via Compliance Officer| Native capability   |   |
|  +-----------------------+----------------------+----------------------+   |
|                                                                             |
|  RECORDING POLICY BY REGION:                                               |
|  ============================                                              |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  | Region      | Enterprise Calls  | Contact Center    | Announcement |   |
|  +-------------+-------------------+-------------------+--------------+   |
|  | India       | Selective         | 100% recorded     | CC only      |   |
|  | UK          | Selective         | 100% recorded     | All calls    |   |
|  | Germany     | Disabled          | Consent-based     | All + opt-in |   |
|  | US (NJ)     | Selective         | 100% recorded     | All calls    |   |
|  | US (TX)     | Selective         | 100% recorded     | All calls    |   |
|  +-------------+-------------------+-------------------+--------------+   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.6.3 Recording Announcement Prompts

**Standard Prompts by Region:**

| Region | Language | Prompt Text | Duration |
|--------|----------|-------------|----------|
| India | English | "This call may be recorded for quality and training purposes." | 4 sec |
| India | Hindi | "यह कॉल गुणवत्ता और प्रशिक्षण उद्देश्यों के लिए रिकॉर्ड की जा सकती है।" | 5 sec |
| UK | English | "Calls are recorded for training, quality and compliance purposes." | 4 sec |
| Germany | German | "Dieser Anruf wird zu Schulungs- und Qualitätszwecken aufgezeichnet. Drücken Sie 1, um zuzustimmen." | 7 sec |
| US | English | "This call is being recorded." | 2 sec |

---

