# Security & Compliance Framework

## Executive Summary

This chapter addresses security and compliance requirements for KidsWear India's contact center deployment where **all communication traverses the public internet**. With retail stores spread across multiple states in India, each with basic broadband connectivity, and agents working from either stores or home locations, the security architecture must assume a **zero-trust, cloud-first model** with no enterprise LAN/WAN infrastructure.

**Key Security Considerations:**
- All voice and data traffic over public internet (no MPLS/private WAN)
- Distributed retail stores with basic broadband (not enterprise-grade)
- Agents working remotely from home or store locations
- WebRTC-based communication requiring browser-level security
- PCI-DSS compliance for payment card processing (DTMF masking)
- DPDP Act 2023 (India's Digital Personal Data Protection)
- API security for cloud integrations (Webex + GCP + Zendesk)
- No on-premises security infrastructure to manage

---

## 1. Security Architecture Overview

### 1.1 Zero-Trust Security Model

```
ZERO-TRUST SECURITY ARCHITECTURE FOR INTERNET-BASED CONTACT CENTER

+------------------------------------------------------------------+
|                    UNTRUSTED NETWORK (Internet)                  |
+------------------------------------------------------------------+
        |                    |                    |
        v                    v                    v
+------------------+  +------------------+  +------------------+
|   RETAIL STORE   |  |   AGENT HOME     |  |   CLOUD SERVICES |
|   (Broadband)    |  |   (Broadband)    |  |                  |
+------------------+  +------------------+  +------------------+
| - Basic ISP line |  | - Personal ISP   |  | - Webex Calling  |
| - No firewall    |  | - Home router    |  | - Webex CC       |
| - Shared network |  | - No VPN required|  | - GCP CCAI       |
| - Multiple agents|  | - Single agent   |  | - Zendesk        |
+------------------+  +------------------+  +------------------+
        |                    |                    |
        +--------------------+--------------------+
                             |
                    SECURITY CONTROLS
                             |
        +--------------------+--------------------+
        |                    |                    |
        v                    v                    v
+------------------+  +------------------+  +------------------+
|   TRANSPORT      |  |   APPLICATION    |  |   DATA           |
|   SECURITY       |  |   SECURITY       |  |   SECURITY       |
+------------------+  +------------------+  +------------------+
| - TLS 1.2+ for   |  | - OAuth 2.0      |  | - Encryption at  |
|   all signaling  |  | - API tokens     |  |   rest (AES-256) |
| - SRTP for voice |  | - MFA for admins |  | - DTMF masking   |
| - DTLS for WebRTC|  | - Role-based     |  | - Data retention |
| - Certificate    |  |   access control |  | - Right to       |
|   validation     |  | - Session mgmt   |  |   erasure        |
+------------------+  +------------------+  +------------------+
```

### 1.2 Security Zones

| Zone | Location | Network Type | Trust Level | Security Controls |
|------|----------|-------------|-------------|-------------------|
| **Store Zone** | Retail stores (multi-state) | Basic broadband ISP | UNTRUSTED | TLS/SRTP, browser isolation, cloud-managed |
| **Home Zone** | Agent residences | Personal broadband | UNTRUSTED | TLS/SRTP, browser isolation, no VPN |
| **Cloud Zone** | Webex/GCP/Zendesk DCs | Cloud provider network | TRUSTED (provider-managed) | Provider security controls |
| **Customer Zone** | PSTN/Mobile network | Telco network | UNTRUSTED | Encryption from Webex entry point |

### 1.3 Threat Model for Retail MSME

| Threat | Risk Level | Attack Vector | Mitigation |
|--------|-----------|---------------|------------|
| **Man-in-the-Middle on broadband** | HIGH | Intercept calls/data on ISP network | TLS 1.2+, SRTP, certificate pinning |
| **Agent credential theft** | HIGH | Phishing, shoulder surfing at store | MFA, session timeout, security training |
| **Payment card data breach** | CRITICAL | Agent mishandles card numbers | DTMF masking, recording pause, no agent access |
| **Unauthorized data access** | MEDIUM | Ex-employee retains access | Immediate offboarding, RBAC, audit logs |
| **DDoS on cloud services** | LOW | Service disruption | Handled by Cisco/Google/Zendesk (cloud resilience) |
| **Store network compromise** | MEDIUM | Malware on shared store computers | Browser-only access, no local data storage |
| **Home network insecurity** | MEDIUM | Weak home router, shared WiFi | Agent security guidelines, encrypted comms |
| **Compliance violation (DPDP)** | CRITICAL | Improper data handling, no consent | Consent flows, retention policies, audit trail |

---

## 2. Transport Layer Security (Data in Transit)

### 2.1 Encryption Standards

**All communication over public internet must be encrypted:**

```
ENCRYPTION LAYERS FOR INTERNET-BASED CONTACT CENTER

CUSTOMER PSTN CALL:
[Customer Phone] --> [Telco Network] --> [Cloud Connect SIP Trunk] --> [Webex Calling]
                                              |
                                         SIP over TLS (SIPS)
                                         SRTP for media
                                              |
                                              v
                                    [Webex Contact Center]
                                              |
                                         WebRTC (DTLS-SRTP)
                                              |
                                              v
                                    [Agent Browser at Store/Home]
                                              |
                                         HTTPS (TLS 1.2+)
                                              |
                                              v
                                    [Zendesk CRM API]
```

**Encryption Protocol Requirements:**

| Communication Type | Protocol | Minimum Version | Cipher Suites | Certificate |
|-------------------|----------|-----------------|---------------|-------------|
| **Web/API Traffic** | TLS | 1.2 (prefer 1.3) | AES-256-GCM, CHACHA20 | Public CA (DigiCert, Let's Encrypt) |
| **SIP Signaling** | SIPS (TLS) | 1.2 | AES-256 | Webex-managed |
| **Voice Media** | SRTP | N/A | AES-128-CM-HMAC-SHA1-80 | Key exchange via SIPS |
| **WebRTC** | DTLS-SRTP | DTLS 1.2 | AES-128-GCM | Browser-managed, Webex-validated |
| **Agent Desktop** | HTTPS | TLS 1.2+ | AES-256-GCM | Webex certificate |
| **GCP API Calls** | HTTPS | TLS 1.2+ | AES-256-GCM | Google-managed |
| **Zendesk API** | HTTPS | TLS 1.2+ | AES-256-GCM | Zendesk-managed |

### 2.2 WebRTC Security for Remote Agents

```
WEBRTC SECURITY ARCHITECTURE (Agent at Home/Store)

+------------------+     +------------------+     +------------------+
|   Agent Browser  |     |   Webex CC       |     |   STUN/TURN      |
|   (Chrome)       |     |   Media Server   |     |   Servers        |
+------------------+     +------------------+     +------------------+
        |                        |                        |
        | 1. HTTPS (TLS 1.2+)    |                        |
        |    Agent login         |                        |
        |----------------------->|                        |
        |                        |                        |
        | 2. WSS (WebSocket      |                        |
        |    Secure) for         |                        |
        |    signaling           |                        |
        |<---------------------->|                        |
        |                        |                        |
        | 3. ICE connectivity    |                        |
        |    check (STUN)        |                        |
        |<---------------------------------------------->|
        |                        |                        |
        | 4. If direct fails,    |                        |
        |    use TURN relay      |                        |
        |<---------------------------------------------->|
        |                        |                        |
        | 5. DTLS handshake      |                        |
        |    (key exchange)      |                        |
        |<---------------------->|                        |
        |                        |                        |
        | 6. SRTP media flow     |                        |
        |    (encrypted voice)   |                        |
        |<---------------------->|                        |
        |                        |                        |
```

**Why WebRTC is secure for internet-based agents:**

1. **No VPN required** - Encryption built into WebRTC protocol
2. **Certificate validation** - Browser validates Webex server certificates
3. **Perfect Forward Secrecy** - New keys for each session
4. **Firewall traversal** - STUN/TURN handles NAT (home routers, store networks)
5. **No local data storage** - All processing in cloud
6. **Browser sandboxing** - Isolated from local system

### 2.3 Network Requirements for Retail Stores

**Store Broadband Configuration:**

```
TYPICAL RETAIL STORE NETWORK (MINIMAL INFRASTRUCTURE)

[ISP Broadband Modem] --> [Basic Router/WiFi] --> [Store Devices]
        |                         |
        | 50-100 Mbps            | DHCP
        | (shared connection)     | NAT
        |                         | No QoS
        v                         v
+------------------+     +------------------+
| POS Terminals    |     | Agent Laptops    |
| (Payment)        |     | (Contact Center) |
+------------------+     +------------------+
```

**Security Recommendations for Store Broadband:**

| Requirement | Implementation | Priority |
|------------|----------------|----------|
| **Separate SSID for agents** | Create dedicated WiFi network for CC agents | HIGH |
| **Strong WiFi password** | WPA3 or WPA2 with 20+ character password | HIGH |
| **Router firmware updates** | Enable automatic updates or monthly check | MEDIUM |
| **Disable WPS** | Turn off WiFi Protected Setup (vulnerable) | HIGH |
| **Change default router password** | Admin portal access secured | HIGH |
| **MAC address filtering** | Optional: Allow only agent laptops | LOW |
| **Bandwidth allocation** | If router supports: Prioritize agent devices | MEDIUM |

**Minimum Bandwidth per Store:**

```
Bandwidth Calculation for Retail Store:

Voice (per concurrent agent):
- WebRTC audio: 100-150 kbps bidirectional
- Overhead (DTLS, signaling): 50 kbps
- Per agent: ~200 kbps

Digital channels (per agent):
- Chat/WhatsApp: ~50 kbps
- Screen pop/CRM: ~100 kbps
- Per agent: ~150 kbps

Total per concurrent agent: ~350 kbps

Store with 3 concurrent agents:
= 3 x 350 kbps = 1,050 kbps = ~1 Mbps

Add 50% safety margin:
= 1.5 Mbps dedicated for contact center

Store also runs POS, inventory:
= Additional 2-5 Mbps

Total recommended: 10 Mbps minimum broadband
Recommended: 25-50 Mbps for comfort
```

### 2.4 Agent Home Network Security

**Home Network Security Guidelines (Provide to Agents):**

| Guideline | Action | Why Important |
|-----------|--------|---------------|
| **1. Secure WiFi** | WPA2/WPA3 with strong password (20+ chars) | Prevent neighbors from accessing |
| **2. Update router firmware** | Check monthly for updates | Patch security vulnerabilities |
| **3. Separate work device** | Use company laptop only for work | Reduce malware risk |
| **4. No public WiFi** | Never use cafe/public WiFi for work | Man-in-the-middle attacks |
| **5. Position workstation** | Screen not visible to others | Prevent shoulder surfing |
| **6. Secure physical space** | Private room for calls | Customer confidentiality |
| **7. Logout after shift** | Close browser, clear session | Prevent unauthorized access |
| **8. Family awareness** | Inform family not to use work laptop | Maintain device integrity |
| **9. Mobile hotspot backup** | 4G/5G as backup if broadband fails | Continuity of service |
| **10. Report incidents** | Immediately report suspicious activity | Rapid response to threats |

**Agent Home Network Checklist (Pre-Onboarding):**

```
AGENT HOME NETWORK SECURITY ASSESSMENT

Agent Name: ____________________
Date: ____________________

[ ] Internet speed test result: ____ Mbps down / ____ Mbps up
    Minimum required: 10 Mbps down / 5 Mbps up
    Recommended: 25 Mbps down / 10 Mbps up

[ ] Latency to Webex DC: ____ ms
    Maximum allowed: 150 ms
    Recommended: < 100 ms

[ ] Packet loss test: ____ %
    Maximum allowed: 1%
    Recommended: < 0.5%

[ ] WiFi security protocol: __________
    Required: WPA2 or WPA3 (NOT WEP or Open)

[ ] Router age: ____ years
    If > 5 years, recommend upgrade

[ ] Router default password changed: [ ] Yes [ ] No
    Required: Yes

[ ] Private workspace available: [ ] Yes [ ] No
    Required: Yes (for customer privacy)

[ ] USB headset available: [ ] Yes [ ] No
    Required: Yes (noise cancellation)

Assessed by: ____________________
Approved: [ ] Yes [ ] No
Notes: ____________________
```

---

## 3. Firewall and Network Access Control

### 3.1 Outbound Firewall Rules (Store/Home Router)

**Since agents use basic broadband with consumer routers, outbound rules are typically open. However, document required destinations:**

```
REQUIRED OUTBOUND ACCESS FROM AGENT LOCATION (Store/Home)

Destination Type: Webex Services
+------------------+------------------+------------------+------------------+
| Service          | Domains/IPs      | Ports            | Protocol         |
+------------------+------------------+------------------+------------------+
| Webex Control Hub| admin.webex.com  | 443              | HTTPS            |
| Webex CC Desktop | desktop.wxcc-*.  | 443              | HTTPS/WSS        |
|                  | cisco.com        |                  |                  |
| Webex Media      | *.wbx2.com       | 443, 5004        | HTTPS/SRTP       |
|                  | *.webex.com      | 19560-65535 UDP  | Media            |
| Webex Calling    | *.bcld.webex.com | 443, 5061        | HTTPS/SIPS       |
| Webex Common     | *.ciscospark.com | 443              | HTTPS            |
| Identity         | idbroker.webex.  | 443              | HTTPS            |
|                  | com              |                  |                  |
+------------------+------------------+------------------+------------------+

Destination Type: Google Cloud Platform (Dialogflow CX, Vertex AI)
+------------------+------------------+------------------+------------------+
| Service          | Domains/IPs      | Ports            | Protocol         |
+------------------+------------------+------------------+------------------+
| Dialogflow API   | dialogflow.      | 443              | HTTPS            |
|                  | googleapis.com   |                  |                  |
| Vertex AI        | aiplatform.      | 443              | HTTPS            |
|                  | googleapis.com   |                  |                  |
| Cloud Storage    | storage.         | 443              | HTTPS            |
|                  | googleapis.com   |                  |                  |
| Authentication   | oauth2.          | 443              | HTTPS            |
|                  | googleapis.com   |                  |                  |
+------------------+------------------+------------------+------------------+

Destination Type: Zendesk CRM
+------------------+------------------+------------------+------------------+
| Service          | Domains/IPs      | Ports            | Protocol         |
+------------------+------------------+------------------+------------------+
| Zendesk API      | *.zendesk.com    | 443              | HTTPS            |
| Zendesk Assets   | *.zdassets.com   | 443              | HTTPS            |
| Zendesk CDN      | *.zdusercontent. | 443              | HTTPS            |
|                  | com              |                  |                  |
+------------------+------------------+------------------+------------------+
```

**Network Configuration Recommendation:**

```
FOR STORES WITH BASIC ROUTER (NO FIREWALL):

1. Ensure NAT is enabled (standard for home routers)
2. No inbound port forwarding required (WebRTC handles traversal)
3. UPnP can be disabled (Webex uses TURN if needed)
4. DNS should be set to reliable provider:
   - Google DNS: 8.8.8.8, 8.8.4.4
   - Cloudflare DNS: 1.1.1.1, 1.0.0.1
   - ISP DNS (if reliable)

FOR STORES WITH MANAGED FIREWALL (Optional):

Rule 1: Allow HTTPS (TCP 443) to *.webex.com, *.cisco.com
Rule 2: Allow HTTPS (TCP 443) to *.googleapis.com
Rule 3: Allow HTTPS (TCP 443) to *.zendesk.com
Rule 4: Allow UDP 5004, 19560-65535 to Webex media servers
Rule 5: Allow SIP/TLS (TCP 5061) to Webex Calling
Rule 6: Block all other outbound (optional, may break other services)
```

### 3.2 Webex Cloud Media IP Ranges

**For advanced store setups with firewalls, whitelist Webex media IPs:**

```
WEBEX CALLING AND CONTACT CENTER IP RANGES (INDIA REGION)

Reference: Cisco Webex Network Requirements Documentation

Webex Global Media IPs (Example - Verify with Cisco):
- 170.72.0.0/16 (Webex primary)
- 128.177.0.0/16 (Webex secondary)
- 64.68.96.0/19 (Webex media)
- 66.114.160.0/20 (Webex signaling)

India-Specific Ranges (Verify with Cisco partner):
- Mumbai DC ranges
- Chennai DC ranges

Port Requirements:
- TCP 443 (HTTPS, WSS)
- TCP 5061 (SIPS - SIP over TLS)
- UDP 5004 (SRTP media)
- UDP 19560-65535 (WebRTC media relay)

IMPORTANT: 
These IP ranges change periodically. 
Subscribe to Cisco network requirements updates.
Use domain-based filtering where possible (*.webex.com).
```

---

## 4. PCI-DSS Compliance (Payment Card Security)

### 4.1 DTMF Masking Architecture

**KidsWear India processes payment cards for orders. Agents MUST NEVER hear, see, or store card numbers:**

```
DTMF MASKING FOR PCI-DSS COMPLIANCE

SCENARIO: Customer provides credit card number to pay for school uniform order

WITHOUT DTMF Masking (NON-COMPLIANT):
+------------------+     +------------------+     +------------------+
|   Customer       |     |   Call Recording |     |   Agent Desktop  |
|   (Phone)        |     |   (Webex CC)     |     |                  |
+------------------+     +------------------+     +------------------+
        |                        |                        |
        | Speaks: "4532-1234-    | Records: "4532-1234-  | Hears: "4532-1234-
        |         5678-9012"     |          5678-9012"   |        5678-9012"
        |                        |                        |
        v                        v                        v
   PCI VIOLATION           PCI VIOLATION            PCI VIOLATION
   (Card data in transit)  (Card data stored)       (Agent hears card)

WITH DTMF Masking (COMPLIANT):
+------------------+     +------------------+     +------------------+
|   Customer       |     |   Webex CC       |     |   Agent Desktop  |
|   (Phone)        |     |   IVR + Masking  |     |                  |
+------------------+     +------------------+     +------------------+
        |                        |                        |
        | Agent: "Please enter   |                        |
        | your card number using |                        |
        | your phone keypad"     |                        |
        |                        |                        |
        | Customer presses:      |                        |
        | 4-5-3-2-1-2-3-4-       |                        |
        | 5-6-7-8-9-0-1-2        |                        |
        |                        |                        |
        |----------------------->| DTMF Masking:          |
        |                        | - Replaces tones with  |
        |                        |   flat tone            |
        |                        | - Recording paused     |
        |                        | - Agent hears:         |
        |                        |   "beep beep beep..."  |
        |                        | - IVR sends card to    |
        |                        |   PCI-compliant        |
        |                        |   payment gateway      |
        |                        |                        |
        |                        |----------------------->|
        |                        |                        | Agent sees:
        |                        |                        | "Payment processing"
        |                        |                        | "Authorization: YES"
        |                        |                        | "Last 4 digits: 9012"
        |                        |                        |
        |                        | Recording resumed      |
        |                        |                        |
        v                        v                        v
   COMPLIANT               COMPLIANT                 COMPLIANT
   (Card via DTMF)         (No card in recording)   (No card heard)
```

### 4.2 Webex Contact Center DTMF Masking Configuration

**Webex CC Flow Designer configuration for DTMF masking:**

```
IVR FLOW: PAYMENT COLLECTION WITH DTMF MASKING

Step 1: Agent triggers payment collection
        Flow Activity: "Menu" -> Option "Collect Payment"

Step 2: Transfer to secure IVR
        Flow Activity: "Blind Transfer" to Payment_Collection_Flow

Step 3: Payment_Collection_Flow:

        +----------------------------------+
        | Activity: "Pause Recording"      |
        | Settings:                        |
        |   Action: Pause                  |
        |   Reason: "PCI Compliance"       |
        +----------------------------------+
                      |
                      v
        +----------------------------------+
        | Activity: "Play Message"         |
        | Settings:                        |
        |   Text-to-Speech: "Please enter  |
        |   your 16-digit card number      |
        |   using your phone keypad,       |
        |   followed by the pound key."    |
        +----------------------------------+
                      |
                      v
        +----------------------------------+
        | Activity: "Collect Digits"       |
        | Settings:                        |
        |   Variable: card_number          |
        |   Min Digits: 16                 |
        |   Max Digits: 16                 |
        |   Timeout: 30 seconds            |
        |   Terminator: #                  |
        |   DTMF Masking: ENABLED          |
        |   Mask Character: * (flat tone)  |
        +----------------------------------+
                      |
                      v
        +----------------------------------+
        | Activity: "Play Message"         |
        | Settings:                        |
        |   Text-to-Speech: "Please enter  |
        |   your card expiry date as       |
        |   4 digits, month then year."    |
        +----------------------------------+
                      |
                      v
        +----------------------------------+
        | Activity: "Collect Digits"       |
        | Settings:                        |
        |   Variable: expiry_date          |
        |   Min Digits: 4                  |
        |   Max Digits: 4                  |
        |   DTMF Masking: ENABLED          |
        +----------------------------------+
                      |
                      v
        +----------------------------------+
        | Activity: "Play Message"         |
        | Settings:                        |
        |   Text-to-Speech: "Please enter  |
        |   your 3-digit CVV number."      |
        +----------------------------------+
                      |
                      v
        +----------------------------------+
        | Activity: "Collect Digits"       |
        | Settings:                        |
        |   Variable: cvv                  |
        |   Min Digits: 3                  |
        |   Max Digits: 4                  |
        |   DTMF Masking: ENABLED          |
        +----------------------------------+
                      |
                      v
        +----------------------------------+
        | Activity: "HTTP Request"         |
        | Settings:                        |
        |   URL: Payment Gateway API       |
        |   Method: POST                   |
        |   Body: {                        |
        |     "card": "{{card_number}}",   |
        |     "expiry": "{{expiry_date}}", |
        |     "cvv": "{{cvv}}",            |
        |     "amount": "{{order_total}}"  |
        |   }                              |
        |   Headers: Authorization (token) |
        +----------------------------------+
                      |
                      v
        +----------------------------------+
        | Activity: "Resume Recording"     |
        | Settings:                        |
        |   Action: Resume                 |
        +----------------------------------+
                      |
                      v
        +----------------------------------+
        | Activity: "Play Message"         |
        | Settings:                        |
        |   Text-to-Speech: "Your payment  |
        |   of {{amount}} has been         |
        |   authorized. Thank you."        |
        +----------------------------------+
                      |
                      v
        +----------------------------------+
        | Activity: "Transfer Back"        |
        | Transfer to original agent       |
        +----------------------------------+
```

### 4.3 PCI-DSS Compliance Checklist for MSME

**PCI-DSS Level 4 (MSME with < 20,000 e-commerce transactions/year):**

| Requirement | Implementation | Status |
|------------|----------------|--------|
| **Req 1: Install firewall** | Webex cloud firewall (managed by Cisco) | COMPLIANT |
| **Req 2: No vendor defaults** | Webex cloud-managed (no defaults to change) | COMPLIANT |
| **Req 3: Protect stored card data** | DTMF masking - no card data stored | COMPLIANT |
| **Req 4: Encrypt transmission** | TLS 1.2+ for all API calls to payment gateway | COMPLIANT |
| **Req 5: Anti-virus** | Agent laptops have antivirus | REQUIRED |
| **Req 6: Secure systems** | Webex cloud-managed, auto-patched | COMPLIANT |
| **Req 7: Restrict access** | RBAC - only needed access | COMPLIANT |
| **Req 8: Unique IDs** | Each agent has unique login | COMPLIANT |
| **Req 9: Restrict physical access** | N/A - no on-premises card storage | N/A |
| **Req 10: Track access** | Webex audit logs, API logs | COMPLIANT |
| **Req 11: Test security** | Annual vulnerability scan (recommended) | RECOMMENDED |
| **Req 12: Security policy** | Document this security policy | COMPLIANT |

**Payment Gateway Integration:**

```
RECOMMENDED PCI-COMPLIANT PAYMENT GATEWAYS FOR INDIA

Option 1: Razorpay
- PCI-DSS Level 1 certified
- REST API for IVR integration
- INR settlement
- Documentation: https://razorpay.com/docs/

Option 2: Paytm for Business
- PCI-DSS Level 1 certified
- DTMF payment support
- UPI integration
- Popular in India

Option 3: CCAvenue
- PCI-DSS Level 1 certified
- IVR payment module
- Multi-bank support
- Long-standing India presence

INTEGRATION APPROACH:
1. Webex CC Flow collects DTMF digits (masked)
2. HTTP Request activity sends to payment gateway API
3. Gateway processes payment (agent never sees card)
4. Gateway returns authorization code
5. Agent sees only: "Authorized" and last 4 digits
```

---

## 5. Data Protection and Privacy (DPDP Act 2023)

### 5.1 DPDP Act 2023 Compliance Framework

**India's Digital Personal Data Protection Act 2023 requirements:**

```
DPDP ACT COMPLIANCE FOR CONTACT CENTER

+------------------------------------------------------------------+
|                    CUSTOMER PERSONAL DATA LIFECYCLE              |
+------------------------------------------------------------------+

1. COLLECTION (with consent)
   +--------------------------+
   | IVR Consent Prompt:      |
   | "This call may be        |
   | recorded for quality and |
   | training purposes. By    |
   | continuing, you consent  |
   | to data processing as    |
   | per our privacy policy.  |
   | Press 1 to continue or   |
   | press 2 to opt out."     |
   +--------------------------+
            |
            v
2. PROCESSING (purpose limitation)
   +--------------------------+
   | Data used ONLY for:      |
   | - Order processing       |
   | - Customer support       |
   | - Quality improvement    |
   | - Legal compliance       |
   | NOT for:                 |
   | - Unauthorized marketing |
   | - Third-party sales      |
   | - Profiling without      |
   |   consent                |
   +--------------------------+
            |
            v
3. STORAGE (data minimization)
   +--------------------------+
   | Collect only necessary:  |
   | - Name (required)        |
   | - Phone (required)       |
   | - Order details (req.)   |
   | - Address (required)     |
   | - NOT: Religion, caste,  |
   |   political views, etc.  |
   +--------------------------+
            |
            v
4. RETENTION (storage limitation)
   +--------------------------+
   | Retention Periods:       |
   | - Call recordings: 90 days|
   | - Order history: 7 years |
   |   (legal requirement)    |
   | - Analytics data: 1 year |
   | - AI training data:      |
   |   Anonymized after use   |
   +--------------------------+
            |
            v
5. DELETION (right to erasure)
   +--------------------------+
   | On customer request:     |
   | - Delete call recordings |
   | - Delete personal data   |
   | - Retain only legal      |
   |   minimums               |
   | - Provide deletion       |
   |   confirmation           |
   +--------------------------+
```

### 5.2 Consent Management Implementation

**IVR Consent Flow:**

```
CONSENT FLOW IN WEBEX CC IVR

Flow Name: Consent_Collection_Flow

+----------------------------------+
| Activity: "Play Message"         |
| Text-to-Speech:                  |
|                                  |
| "Welcome to KidsWear India.      |
|                                  |
|  This call may be recorded for   |
|  quality assurance and training. |
|                                  |
|  Your personal information will  |
|  be processed as per our privacy |
|  policy available at             |
|  kidswearindia.com/privacy.      |
|                                  |
|  By continuing, you consent to   |
|  this processing.                |
|                                  |
|  Press 1 to continue.            |
|  Press 2 to speak without        |
|  recording."                     |
+----------------------------------+
              |
              v
+----------------------------------+
| Activity: "Collect Digits"       |
| Variable: consent_choice         |
| Options: 1 or 2                  |
+----------------------------------+
              |
      +-------+-------+
      |               |
      v               v
[Press 1]         [Press 2]
      |               |
      v               v
+-------------+  +-------------+
| Set Variable|  | Set Variable|
| recording=  |  | recording=  |
| "enabled"   |  | "disabled"  |
+-------------+  +-------------+
      |               |
      +-------+-------+
              |
              v
+----------------------------------+
| Activity: "Condition"            |
| IF recording = "enabled"         |
|   -> Continue with recording     |
| ELSE                             |
|   -> Disable recording for call  |
+----------------------------------+
```

**Consent Data Storage:**

```
ZENDESK TICKET CUSTOM FIELD: Consent

Field Name: consent_recorded
Field Type: Dropdown
Options:
- "Consent Given - Recording Enabled"
- "Consent Given - Recording Disabled"
- "Consent Not Collected (Pre-IVR)"

Every ticket must have this field populated.
Audit trail maintained for compliance.
```

### 5.3 Data Subject Rights (DPDP Compliance)

**Customer Rights Under DPDP Act:**

| Right | Implementation in Contact Center | SLA |
|-------|----------------------------------|-----|
| **Right to Information** | Privacy policy on website, IVR prompt | Immediate |
| **Right to Access** | Customer requests data via support | 72 hours |
| **Right to Correction** | Agent updates Zendesk record | Immediate |
| **Right to Erasure** | Delete recordings, anonymize analytics | 72 hours |
| **Right to Grievance Redressal** | Escalate to Data Protection Officer | 15 days |
| **Right to Nominate** | Deceased customer's nominee can request | As per policy |

**Data Erasure Workflow:**

```
CUSTOMER DATA DELETION REQUEST WORKFLOW

1. Customer Request:
   - Email: privacy@kidswearindia.com
   - Subject: "Data Deletion Request"
   - Body: Name, Phone, Reason

2. Verification:
   - Agent verifies customer identity
   - Confirms phone number/email
   - Logs request in Zendesk ticket

3. Data Inventory:
   - Zendesk CRM records
   - Webex CC call recordings
   - BigQuery analytics (if any)
   - Dialogflow conversation logs

4. Deletion Execution:
   a. Zendesk:
      - Anonymize or delete customer profile
      - Retain order history for legal (but anonymize PII)
   
   b. Webex CC:
      - Delete call recordings for that phone number
      - API call to Webex for bulk deletion
   
   c. GCP:
      - Remove from BigQuery (if stored)
      - Dialogflow logs auto-expire (default 30 days)

5. Confirmation:
   - Email customer with deletion confirmation
   - Reference number for records
   - Close Zendesk ticket

6. Audit:
   - Log deletion in compliance register
   - Retain proof for 3 years (legal requirement)

SLA: Complete within 72 hours of verified request
```

### 5.4 Data Retention Policy

**Retention Schedule:**

| Data Type | Retention Period | Reason | Deletion Method |
|-----------|-----------------|--------|-----------------|
| **Call Recordings** | 90 days | Quality assurance | Auto-delete after 90 days |
| **Call Metadata** | 1 year | Analytics, reporting | Auto-archive then delete |
| **Customer Profile (Zendesk)** | Active + 3 years post-last-contact | Business continuity | Manual deletion on request |
| **Order History** | 7 years | Tax/legal compliance (GST) | Archive after 7 years |
| **Payment Records** | 7 years | Financial audit trail | Retain with anonymization |
| **AI Training Data** | Anonymized permanently | Model improvement | Original deleted after anonymization |
| **Agent Activity Logs** | 1 year | Performance management | Auto-delete after 1 year |
| **Security Audit Logs** | 3 years | Compliance, forensics | Archive then delete |

**Automated Retention in Webex CC:**

```
WEBEX CC RECORDING RETENTION SETTINGS

1. Navigate: Control Hub > Contact Center > Settings > Recording

2. Set retention policy:
   - Retention Period: 90 days
   - Auto-delete: ENABLED
   - Archive before delete: DISABLED (no long-term storage needed)
   - Encryption: AES-256 at rest

3. Storage location:
   - Region: India (Mumbai DC)
   - Storage type: Webex cloud storage
   - Access: Role-based (supervisors + compliance team)

4. Exception handling:
   - Litigation hold: Preserve specific recordings if legal case
   - Customer request: Delete before 90 days if requested
```

---

## 6. Application Security (Authentication & Authorization)

### 6.1 User Authentication Architecture

```
MULTI-LAYER AUTHENTICATION FOR CONTACT CENTER

+------------------------------------------------------------------+
|                    AUTHENTICATION LAYERS                         |
+------------------------------------------------------------------+

Layer 1: AGENT DESKTOP LOGIN
         +----------------------------------+
         | Webex CC Agent Desktop           |
         | - Username (email)               |
         | - Password                       |
         | - MFA (optional but recommended) |
         | - SSO via Webex Identity         |
         +----------------------------------+
                        |
                        v
Layer 2: ZENDESK CRM ACCESS
         +----------------------------------+
         | Zendesk embedded in Agent Desktop|
         | - Inherits Webex session         |
         | - OR separate Zendesk SSO        |
         | - Role-based permissions         |
         +----------------------------------+
                        |
                        v
Layer 3: ADMIN/SUPERVISOR ACCESS
         +----------------------------------+
         | Webex Control Hub                |
         | - MFA REQUIRED for admin         |
         | - IP restriction (optional)      |
         | - Session timeout: 30 minutes    |
         | - Audit logging: ALL actions     |
         +----------------------------------+
                        |
                        v
Layer 4: API SERVICE ACCOUNTS
         +----------------------------------+
         | GCP Service Account              |
         | - JSON key file                  |
         | - Minimal IAM permissions        |
         | - No interactive login           |
         | - Key rotation: 90 days          |
         +----------------------------------+
```

### 6.2 Role-Based Access Control (RBAC)

**User Roles and Permissions:**

| Role | Users | Webex CC Permissions | Zendesk Permissions | GCP Permissions |
|------|-------|---------------------|---------------------|-----------------|
| **Agent** | 50 | Answer calls, view CAD, set wrap-up | Create/update tickets, view customer | NONE (no direct access) |
| **Supervisor** | 2 | All Agent + Monitor calls, barge, view reports | All Agent + Team reports, edit workflows | NONE |
| **Admin** | 2 | Full Control Hub access, user management, flow designer | Full admin, settings, integrations | Viewer (BigQuery reports) |
| **Compliance Officer** | 1 | Recording access, audit logs, deletion | View only (no edit) | BigQuery read access |
| **IT Support** | 1 | User provisioning, password resets | User management | Service account management |
| **API Service** | N/A | HTTP Request activities in flows | CTI connector, ticket API | Dialogflow, Vertex AI predict |

**Webex Control Hub RBAC Configuration:**

```
WEBEX CC USER ROLES SETUP

1. Navigate: Control Hub > Contact Center > User Management

2. Create Custom Roles:

   Role: "Agent"
   Permissions:
   [x] Agent Desktop access
   [x] View assigned queues
   [x] Set availability status
   [x] Transfer calls
   [ ] Monitor other agents (NO)
   [ ] Access reports (NO)
   [ ] Modify flows (NO)
   [ ] Delete recordings (NO)

   Role: "Supervisor"
   Permissions:
   [x] All Agent permissions
   [x] Monitor team agents
   [x] Barge/whisper/coach
   [x] View team reports
   [x] Access quality management
   [ ] Modify system settings (NO)
   [ ] Delete users (NO)

   Role: "Admin"
   Permissions:
   [x] All Supervisor permissions
   [x] Full Control Hub access
   [x] User management
   [x] Flow Designer access
   [x] Integration configuration
   [x] Security settings
   [x] Audit log access

3. Assign users to roles:
   - Import from Excel/CSV
   - Or manual assignment per user
```

### 6.3 API Security

**API Authentication Methods:**

| API | Authentication Method | Token Storage | Rotation Policy |
|-----|----------------------|---------------|-----------------|
| **Webex CC APIs** | OAuth 2.0 (Service App) | Webex-managed | Auto-refresh |
| **GCP Dialogflow CX** | Service Account JSON key | Secure vault (GCP Secret Manager) | 90 days |
| **GCP Vertex AI** | Service Account JSON key | Secure vault | 90 days |
| **Zendesk API** | API Token | Environment variable (encrypted) | 180 days |
| **Payment Gateway** | API Key + Secret | Environment variable | Per gateway policy |

**GCP Service Account Security:**

```
GCP SERVICE ACCOUNT CONFIGURATION

1. Create dedicated service account:
   Name: kidswear-ccai-prod
   Email: kidswear-ccai-prod@project-id.iam.gserviceaccount.com

2. Assign minimal IAM roles:
   - roles/dialogflow.client (NOT roles/dialogflow.admin)
   - roles/aiplatform.user (NOT roles/aiplatform.admin)
   - roles/bigquery.dataViewer (if needed for reports)

3. Create JSON key:
   - Download once, store securely
   - NEVER commit to version control
   - NEVER share via email

4. Store key securely:
   Option A: GCP Secret Manager
   - Create secret: "ccai-service-key"
   - Access via API at runtime
   
   Option B: Environment variable (for Webex Flow)
   - Base64 encode the JSON
   - Store in Webex secure variables
   - Decrypt at runtime in HTTP Request

5. Key rotation process:
   - Every 90 days, create new key
   - Update in storage location
   - Delete old key after 7 days (grace period)
   - Log rotation in audit trail

6. Monitoring:
   - Enable Cloud Audit Logs for service account
   - Alert on unusual API patterns
   - Monthly review of permissions
```

**Zendesk API Token Security:**

```
ZENDESK API TOKEN CONFIGURATION

1. Generate API token:
   - Zendesk Admin > Settings > API > Add API token
   - Label: "Webex_CC_Integration_Prod"
   - Copy token immediately (shown once)

2. Usage in Webex CC:
   - HTTP Request header:
     Authorization: Basic {base64(email/token:api_token)}
   - Store base64 string as Webex secure variable

3. Token rotation:
   - Create new token every 180 days
   - Update Webex Flow HTTP Request
   - Revoke old token after verification
   - Log rotation in change management

4. Access control:
   - Only Admin user can generate API tokens
   - Token inherits permissions of generating user
   - Use dedicated API user with minimal permissions
```

### 6.4 Session Management

**Agent Desktop Session Security:**

| Security Control | Configuration | Purpose |
|-----------------|---------------|---------|
| **Session Timeout** | 30 minutes of inactivity | Prevent unauthorized access |
| **Auto-Logout** | End of shift auto-logout | Ensure agents log out |
| **Single Session** | Only one active session per user | Prevent credential sharing |
| **Browser Close** | Session ends on browser close | No persistent sessions |
| **Secure Cookies** | HttpOnly, Secure, SameSite flags | Prevent cookie theft |
| **Session Logging** | Log all login/logout events | Audit trail |

---

## 7. Call Recording Security

### 7.1 Recording Encryption Architecture

```
CALL RECORDING SECURITY LAYERS

Recording Capture:
[Agent Call] --> [Webex CC Media Server] --> [Recording Service]
                                                    |
                                           TLS 1.2+ in transit
                                                    |
                                                    v
                                            [Recording Storage]
                                            Mumbai DC (India)
                                                    |
                                            +-------+-------+
                                            |               |
                                            v               v
                                    [At-Rest Encryption] [Access Control]
                                      AES-256            RBAC
                                    Server-side keys     Supervisor+Admin
```

**Encryption Specifications:**

| Encryption Layer | Algorithm | Key Management | Access |
|-----------------|-----------|----------------|--------|
| **In Transit** | TLS 1.2+ | Webex-managed certificates | Automatic |
| **At Rest** | AES-256 | Webex KMS (Key Management Service) | Supervisor, Admin, Compliance |
| **Download** | HTTPS | User authentication required | Authorized roles only |
| **Backup** | AES-256 | Same as primary storage | Geo-replicated within India |

### 7.2 Recording Access Control

**Who Can Access Recordings:**

| Role | Can Listen | Can Download | Can Delete | Can Export |
|------|-----------|--------------|------------|------------|
| Agent | NO (own calls only in some configs) | NO | NO | NO |
| Supervisor | YES (team only) | YES (team only) | NO | NO |
| Admin | YES (all) | YES (all) | YES (with audit) | YES (with audit) |
| Compliance Officer | YES (all) | YES (all) | YES (with audit) | YES (all) |
| External Auditor | NO (provide specific recordings on request) | Via admin export | NO | N/A |

**Recording Access Workflow:**

```
RECORDING ACCESS AUDIT TRAIL

1. User requests recording access:
   - Login to Webex CC Analyzer
   - Navigate to Recording Search
   - Enter search criteria (date, agent, phone number)

2. System logs request:
   - Timestamp: 2024-XX-XX 14:30:00 IST
   - User: supervisor1@kidswearindia.com
   - Action: Search recordings
   - Criteria: Agent "AGT005", Date "2024-XX-XX"
   - Results: 15 recordings found

3. User plays recording:
   - Timestamp: 2024-XX-XX 14:32:00 IST
   - Recording ID: REC-123456
   - Action: Playback started
   - Duration: 4 minutes 30 seconds

4. User downloads recording:
   - Timestamp: 2024-XX-XX 14:35:00 IST
   - Recording ID: REC-123456
   - Action: Download initiated
   - Justification: "Quality coaching session" (mandatory field)
   - File: Encrypted download with watermark

5. Audit log stored:
   - Retained for 3 years
   - Accessible to Compliance Officer
   - Monthly review by Admin
```

---

## 8. Audit Logging and Monitoring

### 8.1 Security Events to Monitor

**Critical Security Events:**

| Event Category | Specific Events | Alert Priority | Response SLA |
|----------------|----------------|----------------|--------------|
| **Authentication** | Failed login > 3 attempts | HIGH | 15 minutes |
| **Authentication** | Login from new location | MEDIUM | 24 hours |
| **Authorization** | Permission change | HIGH | Immediate review |
| **Data Access** | Bulk data export | HIGH | Immediate review |
| **Recording** | Recording deletion | CRITICAL | Immediate review |
| **API** | API rate limit exceeded | MEDIUM | 1 hour |
| **API** | Service account key used from unknown IP | CRITICAL | 15 minutes |
| **System** | Admin setting changed | HIGH | 24 hours |
| **Compliance** | Data deletion request | HIGH | 72 hours to complete |
| **Agent** | Agent idle > 2 hours | LOW | Daily review |

### 8.2 Audit Log Architecture

```
CENTRALIZED AUDIT LOGGING

+------------------+     +------------------+     +------------------+
|   Webex CC       |     |   GCP Cloud      |     |   Zendesk        |
|   Audit Logs     |     |   Audit Logs     |     |   Audit Logs     |
+------------------+     +------------------+     +------------------+
        |                        |                        |
        |                        |                        |
        v                        v                        v
+------------------------------------------------------------------+
|                    CENTRAL LOG AGGREGATOR                        |
|                    (Optional: SIEM Integration)                  |
+------------------------------------------------------------------+
|                                                                  |
|  Options for MSME:                                               |
|                                                                  |
|  Option 1: Manual Review (Low Cost)                              |
|  - Weekly export from each platform                              |
|  - Excel consolidation                                           |
|  - Manual anomaly detection                                      |
|                                                                  |
|  Option 2: Google Cloud Logging (Medium Cost)                    |
|  - Export Webex logs via API                                     |
|  - GCP logs already in Cloud Logging                             |
|  - Zendesk logs via API                                          |
|  - Set up alerts in Cloud Monitoring                             |
|                                                                  |
|  Option 3: SIEM Tool (Higher Cost - Future Phase)                |
|  - Splunk, Azure Sentinel, or similar                            |
|  - Real-time correlation                                         |
|  - Automated threat detection                                    |
|                                                                  |
+------------------------------------------------------------------+
```

**Recommended for MSME (Option 2 - Google Cloud Logging):**

```
SETUP CLOUD LOGGING FOR AUDIT CONSOLIDATION

1. GCP Logs (Already available):
   - Dialogflow CX API logs
   - Vertex AI prediction logs
   - BigQuery query logs
   - Service account activity

2. Webex CC Logs (Export via API):
   - Webex CC provides Audit API
   - Schedule daily export (Python script)
   - Store in Cloud Storage bucket
   - Query via BigQuery external table

3. Zendesk Logs (Export via API):
   - Zendesk Audit Log API
   - Export weekly (lower volume)
   - Store in Cloud Storage
   - Query via BigQuery

4. Alert Configuration:
   - Set up Cloud Monitoring alerts
   - Email to admin@kidswearindia.com
   - Critical alerts: SMS/WhatsApp

5. Dashboard:
   - BigQuery for querying
   - Looker Studio (free) for visualization
   - Key metrics:
     * Failed logins per day
     * Recording access per week
     * API errors per hour
     * Data deletion requests
```

---

## 9. Incident Response Plan

### 9.1 Security Incident Categories

| Category | Examples | Severity | Response Team |
|----------|----------|----------|---------------|
| **P1 - Critical** | Data breach, payment card compromise, complete system down | CRITICAL | Admin + IT + Management + Legal |
| **P2 - High** | Agent credential theft, unauthorized recording access, compliance violation | HIGH | Admin + IT + Compliance |
| **P3 - Medium** | Service degradation, failed integrations, suspicious API activity | MEDIUM | IT + Admin |
| **P4 - Low** | Agent forgot password, minor config issue, low-priority alert | LOW | IT Support |

### 9.2 Incident Response Workflow

```
SECURITY INCIDENT RESPONSE WORKFLOW

+------------------+
|   DETECT         |
|   - Alert fired  |
|   - User reports |
|   - Audit review |
+------------------+
        |
        v
+------------------+
|   CLASSIFY       |
|   - P1/P2/P3/P4  |
|   - Assign owner |
|   - Notify team  |
+------------------+
        |
        v
+------------------+
|   CONTAIN        |
|   - Isolate      |
|   - Disable user |
|   - Pause service|
+------------------+
        |
        v
+------------------+
|   INVESTIGATE    |
|   - Collect logs |
|   - Timeline     |
|   - Root cause   |
+------------------+
        |
        v
+------------------+
|   REMEDIATE      |
|   - Fix issue    |
|   - Patch system |
|   - Restore svc  |
+------------------+
        |
        v
+------------------+
|   RECOVER        |
|   - Verify fix   |
|   - Monitor      |
|   - Confirm OK   |
+------------------+
        |
        v
+------------------+
|   REPORT         |
|   - Document     |
|   - Lessons      |
|   - Update policy|
+------------------+
```

### 9.3 Data Breach Notification (DPDP Act Requirement)

**72-Hour Breach Notification Process:**

```
DATA BREACH NOTIFICATION WORKFLOW (DPDP ACT COMPLIANCE)

Hour 0: Breach Detected
        - Stop the breach (contain)
        - Preserve evidence
        - Initial assessment

Hour 1-6: Assessment
        - What data was compromised?
        - How many data principals affected?
        - What is the likely harm?
        - Is notification required?

Hour 6-12: Decision
        - Consult with legal counsel
        - Determine if "significant harm" threshold met
        - Prepare notification content

Hour 12-24: Internal Notification
        - Notify senior management
        - Brief board/owners
        - Engage PR/communications if needed

Hour 24-48: Regulatory Notification
        - Notify Data Protection Board of India
        - Format as per DPDP Act requirements
        - Include:
          * Nature of breach
          * Categories of data affected
          * Number of data principals
          * Likely consequences
          * Measures taken to address

Hour 48-72: Data Principal Notification
        - Notify affected customers (email/SMS)
        - Clear, plain language
        - What happened
        - What data affected
        - What they should do (e.g., monitor accounts)
        - Contact information for questions

Post-72 Hours:
        - Ongoing investigation
        - Remediation measures
        - Policy updates
        - Training refresher
        - Regulatory follow-up
```

---

## 10. Security Training and Awareness

### 10.1 Agent Security Training Program

**Mandatory Security Training Topics:**

| Module | Duration | Frequency | Assessment |
|--------|----------|-----------|------------|
| **Data Protection Basics** | 1 hour | Initial + Annual | Quiz (80% pass) |
| **PCI-DSS for Agents** | 30 min | Initial + Annual | Quiz (90% pass) |
| **Password Security** | 30 min | Initial + Annual | Practical demo |
| **Phishing Awareness** | 1 hour | Quarterly | Simulated test |
| **DPDP Customer Rights** | 1 hour | Initial + Annual | Scenario-based |
| **Incident Reporting** | 30 min | Initial + Annual | Role-play |
| **Home Network Security** | 1 hour | Initial (for remote agents) | Checklist verification |
| **Physical Workspace Security** | 30 min | Initial | Site inspection |

**Training Delivery:**

```
SECURITY TRAINING DELIVERY (MSME BUDGET-FRIENDLY)

Option 1: In-House Training (Recommended)
- Admin creates PowerPoint presentations
- Supervisor delivers to small groups
- Document attendance
- Self-assessment quizzes
- Cost: TIME ONLY

Option 2: Vendor Training
- Cisco Webex training (often included)
- Google Cloud security basics (free courses)
- Zendesk security certification (online)
- Cost: FREE TO LOW

Option 3: Third-Party Training
- Local security training provider
- Customized for retail/contact center
- Cost: MEDIUM (negotiate for MSME)

TRACKING:
- Maintain training register (Excel)
- Document completion dates
- Store certificates
- Annual refresher reminders
- Compliance audit ready
```

### 10.2 Security Awareness Reminders

**Monthly Security Tips (Email/WhatsApp to Agents):**

```
SAMPLE MONTHLY SECURITY TIPS

Month 1: "PASSWORD POWER"
Your password is your first defense. Never share it, not even with 
supervisors. Use a passphrase: "ILoveMy2KidsAtHome!" is strong.

Month 2: "PHISHING ALERT"
Suspicious email? Check the sender carefully. 
webex-support@gmail.com is FAKE. 
support@webex.com is REAL.
When in doubt, don't click. Report to IT.

Month 3: "CLEAN DESK"
Before leaving (store or home), ensure:
- Laptop locked (Win+L)
- No customer info on paper
- Headset secured
- Browser logged out

Month 4: "CUSTOMER PRIVACY"
Remember: Customer data belongs to them, not us.
- Never discuss customer details with family/friends
- Never take photos of customer information
- Never share call recordings
- This is LAW (DPDP Act)

Month 5: "PAYMENT SECURITY"
When customer wants to pay:
- ALWAYS transfer to secure IVR
- NEVER ask for card number verbally
- NEVER write down card numbers
- If unsure, ask supervisor

Month 6: "SUSPICIOUS ACTIVITY"
See something odd? Report immediately:
- Unknown person asking for access
- System behaving strangely
- Colleague sharing credentials
- Unusual customer requests
Your report could prevent a breach!
```

---

## 11. Compliance Checklist Summary

### 11.1 Pre-Go-Live Security Checklist

**Technical Security Controls:**

- [ ] All agents using HTTPS to access Webex CC Desktop
- [ ] WebRTC encryption verified (check browser console)
- [ ] DTMF masking tested for payment collection
- [ ] Recording pause/resume functional
- [ ] Zendesk API using TLS 1.2+
- [ ] GCP service account with minimal permissions
- [ ] API tokens rotated and secured
- [ ] Firewall rules documented (if applicable)
- [ ] Agent home network assessments completed

**Compliance Controls:**

- [ ] IVR consent prompt recorded and approved
- [ ] Privacy policy published on website
- [ ] Data retention periods configured (90 days recordings)
- [ ] Data deletion workflow documented and tested
- [ ] RBAC configured in all platforms
- [ ] Audit logging enabled and verified
- [ ] PCI-DSS self-assessment questionnaire completed
- [ ] DPDP Act compliance register started

**Operational Security:**

- [ ] All agents completed security training
- [ ] All supervisors understand incident response
- [ ] Admin has MFA enabled on Control Hub
- [ ] Security incident response plan documented
- [ ] Data breach notification process defined
- [ ] Monthly security review scheduled
- [ ] Annual penetration test planned (recommended)

### 11.2 Ongoing Compliance Activities

**Daily:**
- Monitor login failures
- Check system health dashboards
- Review critical alerts

**Weekly:**
- Agent activity review (suspicious patterns)
- API error log review
- Backup verification (cloud-managed, but verify)

**Monthly:**
- Security tip distribution
- Recording access audit
- Permission review (any changes?)
- API token rotation check

**Quarterly:**
- Security training refresher
- Phishing simulation
- Policy review and update
- Vendor security update review

**Annually:**
- Full security audit
- PCI-DSS self-assessment renewal
- DPDP compliance review
- Penetration testing (recommended)
- Security training certification renewal
- Policy document update

---

## 12. Next Steps

**Proceed to Chapter 4: Platform Provisioning (LLD)**
- Step-by-step Webex Control Hub setup
- Webex Calling configuration with secure settings
- Webex Contact Center provisioning
- GCP CCAI setup with service account security
- Zendesk integration with secure API configuration
- Agent desktop deployment with security controls
- Monitoring dashboard setup with security alerts

---

## Document Information

**Document Title:** Chapter 3: Security and Compliance  
**Project:** KidsWear India - Cisco Webex Contact Center Greenfield Deployment  
**Version:** 1.0  
**Author:** Rajmohan M, Principal Consultant  
**AI-Assisted:** Claude (Anthropic)


---

**DISCLAIMER:** This document contains AI-assisted content. All security configurations, compliance requirements, and implementation recommendations should be validated with official vendor documentation, certified security professionals, and legal counsel. DPDP Act 2023 interpretations should be confirmed with qualified legal advisors. PCI-DSS compliance should be verified with a Qualified Security Assessor (QSA) if handling significant payment card volumes. This document provides guidance and does not constitute legal or professional security advice.

---

*End of Chapter 3*
