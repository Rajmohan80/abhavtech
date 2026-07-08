# Agent Endpoints Design

## 1. Overview

This document defines the agent endpoint architecture for Webex Contact Center, covering desktop client types, authentication methods, device registration strategies, and integration with corporate identity systems. The endpoint strategy directly impacts agent productivity, user experience, and operational complexity.

**Key Objectives:**
- Provide agents with intuitive, high-performance desktop experience
- Support hybrid work (office and home agents)
- Integrate with existing identity management (SSO)
- Minimize agent training requirements
- Enable supervisor monitoring and coaching

---

## 2. Agent Endpoint Options

### 2.1 Desktop Client Comparison Matrix

| Feature | Webex App | Agent Desktop (Browser) | Finesse Desktop | Hardware Phone |
|---------|-----------|------------------------|-----------------|----------------|
| **Platform** | Native app (Win/Mac/Mobile) | Web browser (Chrome/Edge) | Web browser (deprecated) | Physical IP phone |
| **Installation** | Download & install | No installation | No installation | Provision via CUCM |
| **Voice/Video** | ✅ Native | ✅ WebRTC | ✅ WebRTC | ✅ Native (SCCP/SIP) |
| **Screen Pop (CRM)** | ✅ Yes | ✅ Yes | ⚠️ Limited | ❌ No |
| **Unified Communications** | ✅ Chat, presence, meetings | ❌ Contact center only | ❌ Contact center only | ❌ Voice only |
| **Mobile Support** | ✅ iOS/Android | ⚠️ Mobile browser | ❌ No | ❌ No |
| **Ease of Use** | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐ Good | ⭐⭐⭐ Average | ⭐⭐ Basic |
| **Recommended For** | **Most agents** | Light users | Legacy migrations | Call center only |
| **Licensing Cost** | $25/user/month (Webex Calling) | Included in CC license | Included | Phone hardware cost |

---

### 2.2 Recommended Strategy for This Migration

**Primary Endpoint: Webex App (Desktop & Mobile)**

**Rationale:**
1. ✅ **Best user experience:** Modern, intuitive interface
2. ✅ **Hybrid ready:** Same experience in office, home, mobile
3. ✅ **Future-proof:** Cisco's strategic platform (Finesse EOL path)
4. ✅ **Unified communications:** Agents use one app for calls, chat, meetings
5. ✅ **Lower training costs:** Simplified onboarding

**Secondary Endpoint: Agent Desktop (Browser-Based)**

**Use Case:**
- Contractors or temporary agents (no app installation)
- Shared workstations (kiosks)
- Quick access without installation

**Tertiary Endpoint: IP Phones (Cisco 8800 Series)**

**Use Case:**
- Call center floor (shared workstations)
- Agents with minimal PC interaction
- Cost-sensitive deployments (reuse existing phones)

---

## 3. Webex App Agent Endpoint

### 3.1 Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                   AGENT WORKSTATION                   │
│  ┌────────────────────────────────────────────────┐  │
│  │          Webex App (Native Client)             │  │
│  │  ┌──────────────┐  ┌──────────────────────┐   │  │
│  │  │Contact Center│  │ Unified Comms (UC)   │   │  │
│  │  │  Widget      │  │ - Calling            │   │  │
│  │  │  - Queue     │  │ - Chat               │   │  │
│  │  │  - Screenpop │  │ - Presence           │   │  │
│  │  └──────────────┘  └──────────────────────┘   │  │
│  └────────────────────────────────────────────────┘  │
│         │                        │                    │
│         │ HTTPS/WSS              │ SIP/SRTP          │
│         ▼                        ▼                    │
│  ┌─────────────────┐      ┌──────────────────┐      │
│  │ Webex Contact   │      │  Webex Calling   │      │
│  │ Center Cloud    │      │  Cloud Platform  │      │
│  └─────────────────┘      └──────────────────┘      │
└──────────────────────────────────────────────────────┘
```

**Communication Protocols:**
- **Signaling:** HTTPS/WebSockets (443) for contact center control
- **Media:** SRTP (UDP 8000-48199) for voice/video
- **Authentication:** SAML 2.0 SSO via Azure AD/Okta

---

### 3.2 Webex App System Requirements

**Minimum Requirements:**

| Component | Specification |
|-----------|---------------|
| **Operating System** | Windows 10/11, macOS 11+, iOS 14+, Android 8+ |
| **Processor** | Dual-core 2.0 GHz |
| **Memory** | 4 GB RAM (8 GB recommended) |
| **Disk Space** | 500 MB free |
| **Display** | 1280×720 resolution minimum |
| **Network** | 10 Mbps download, 5 Mbps upload |
| **Latency** | <100ms to Webex cloud |
| **Browser (for web version)** | Chrome 90+, Edge 90+, Safari 14+ |

**Recommended Requirements (for optimal performance):**

| Component | Specification |
|-----------|---------------|
| **Processor** | Quad-core 2.5 GHz or higher |
| **Memory** | 8 GB RAM (16 GB for multitasking) |
| **Network** | 25 Mbps download, 10 Mbps upload |
| **Headset** | USB headset (Cisco 500 Series or Jabra equivalent) |
| **Webcam** | 720p or higher (for video interactions) |

---

### 3.3 Webex App Installation and Deployment

**Deployment Methods:**

#### Option 1: User Self-Install (Recommended for Small Teams)

1. Agent visits: https://www.webex.com/downloads.html
2. Downloads Webex App installer
3. Runs installer (auto-updates enabled by default)
4. Logs in with corporate credentials (SSO redirect to Azure AD)

#### Option 2: Mass Deployment via SCCM/Intune (Enterprise)

**Silent Installation (Windows):**

```powershell
# Download MSI installer
Invoke-WebRequest -Uri "https://binaries.webex.com/WebexTeamsDesktop-Windows-Gold/Webex.msi" -OutFile "C:\Temp\Webex.msi"

# Silent install
msiexec /i "C:\Temp\Webex.msi" /qn ALLUSERS=1 AUTOSTART=1
```

**GPO Deployment:**
- Place MSI in network share: `\\fileserver\software\webex\Webex.msi`
- Create GPO: Computer Configuration > Policies > Software Settings > Software Installation
- Assign to OU containing agent workstations

**Intune Deployment:**
- Upload Webex MSI to Intune
- Create assignment targeting agent device group
- Deploy with required installation

---

### 3.4 Webex App Configuration (Contact Center Widget)

**Enable Contact Center Widget in Webex App:**

1. **Admin Configuration (Webex Control Hub):**
   - Navigate to: Control Hub > Contact Center > Settings > Desktop
   - Enable "Webex App Integration"
   - Configure widget layout and features

2. **Agent Experience:**
   - Agent opens Webex App
   - Contact Center widget appears in left navigation
   - Agent sets status to "Available"
   - Incoming calls routed to Webex App with screen pop

**Widget Features:**

| Feature | Description |
|---------|-------------|
| **Queue Status** | Real-time view of calls in queue |
| **Agent State** | Available, Unavailable, Break, Lunch, etc. |
| **Call Controls** | Answer, hold, transfer, conference, mute |
| **Screen Pop** | Automatic CRM record display (Salesforce, etc.) |
| **Wrap-Up Codes** | Post-call disposition selection |
| **Chat/Email** | Omnichannel interactions in single interface |

---

## 4. Agent Desktop (Browser-Based)

### 4.1 Architecture Overview

**URL:** https://desktop.wxcc-us1.cisco.com (region-specific)

```
┌─────────────────────────────────────────────┐
│       Agent Workstation (Web Browser)        │
│  ┌────────────────────────────────────────┐ │
│  │  Webex Contact Center Agent Desktop    │ │
│  │  (Chrome/Edge Browser)                 │ │
│  │  ┌──────────┐  ┌──────────────────┐   │ │
│  │  │  WebRTC  │  │  Screen Pop (CRM)│   │ │
│  │  │  Softphone│  │  Integration     │   │ │
│  │  └──────────┘  └──────────────────┘   │ │
│  └────────────────────────────────────────┘ │
│         │                      │             │
│         │ HTTPS/WSS            │ HTTPS       │
│         ▼                      ▼             │
│  ┌──────────────┐      ┌─────────────────┐ │
│  │ Webex CC     │      │  Salesforce CRM │ │
│  │ Cloud        │      │  (or other CRM) │ │
│  └──────────────┘      └─────────────────┘ │
└─────────────────────────────────────────────┘
```

**Communication:**
- **Signaling:** WebSockets over HTTPS (port 443)
- **Media:** WebRTC (SRTP over UDP, or TCP if UDP blocked)
- **Authentication:** SAML 2.0 SSO

---

### 4.2 Browser Requirements

**Supported Browsers:**

| Browser | Minimum Version | Recommended | Notes |
|---------|----------------|-------------|-------|
| **Google Chrome** | 90+ | Latest | ✅ Best performance |
| **Microsoft Edge** | 90+ (Chromium) | Latest | ✅ Recommended |
| **Safari** | 14+ | Latest | ⚠️ macOS/iOS only |
| **Firefox** | 88+ | Latest | ⚠️ Limited WebRTC support |

**Browser Extensions/Plugins:**
- ❌ No extensions required (native WebRTC)
- ⚠️ Disable ad-blockers (may block WebSocket connections)
- ✅ Allow microphone/camera permissions

---

### 4.3 Agent Desktop Login Flow

1. Agent navigates to: https://desktop.wxcc-us1.cisco.com
2. Click "Sign In"
3. SSO redirect to Azure AD/Okta
4. Enter corporate credentials (username@company.com)
5. MFA challenge (if enabled): Authenticator app code or SMS
6. SSO redirects back to Webex Agent Desktop
7. Agent desktop loads, agent selects team and goes "Available"

**Session Duration:**
- Default timeout: 8 hours of inactivity
- Refresh token valid: 30 days

---

## 5. Authentication and Identity Integration

### 5.1 Single Sign-On (SSO) Architecture

**Identity Provider (IdP):** Azure AD (Microsoft Entra ID)

```
┌──────────┐       ┌───────────┐       ┌─────────────┐
│  Agent   │       │ Azure AD  │       │ Webex Cloud │
│ Browser  │       │   (IdP)   │       │     (SP)    │
└────┬─────┘       └─────┬─────┘       └──────┬──────┘
     │                   │                     │
     │─1. Access Webex───────────────────────►│
     │                   │                     │
     │◄2. Redirect to IdP (SAML AuthnRequest)─│
     │                   │                     │
     │─3. Present Credentials──────────────────►│
     │                   │                     │
     │◄4. MFA Challenge─────────────────────────│
     │                   │                     │
     │─5. MFA Code──────────────────────────────►│
     │                   │                     │
     │◄6. SAML Assertion─────────────────────────│
     │                   │                     │
     │─7. SAML Response (token)────────────────►│
     │                   │                     │
     │◄8. Grant Access (session established)──────│
```

---

### 5.2 Azure AD SAML Configuration

**Step 1: Register Webex in Azure AD**

1. Azure Portal > Enterprise Applications > New Application
2. Search "Cisco Webex"
3. Add application
4. Configure SAML settings:

| Setting | Value |
|---------|-------|
| **Identifier (Entity ID)** | https://idbroker.webex.com/{OrgID} |
| **Reply URL (ACS URL)** | https://idbroker.webex.com/idb/saml2/sso/{OrgID} |
| **Sign-on URL** | https://admin.webex.com |
| **Logout URL** | https://idbroker.webex.com/idb/saml2/slo/{OrgID} |

**Step 2: Configure User Attributes**

| Claim | Attribute | Source |
|-------|-----------|--------|
| uid | user.userprincipalname | User attribute |
| email | user.mail | User attribute |
| givenName | user.givenname | User attribute |
| sn (surname) | user.surname | User attribute |

**Step 3: Assign Users/Groups**

- Assign Azure AD security group: "Contact-Center-Agents"
- All members auto-provisioned to Webex

**Step 4: Download SAML Metadata**

- Download Federation Metadata XML
- Upload to Webex Control Hub > Organization Settings > SSO

---

### 5.3 Multi-Factor Authentication (MFA)

**Requirement:** MFA mandatory for all agent logins.

**Supported MFA Methods:**

| Method | User Experience | Security Level |
|--------|-----------------|----------------|
| **Microsoft Authenticator** | Push notification to mobile app | ⭐⭐⭐⭐⭐ Highest |
| **SMS/Text Message** | 6-digit code via SMS | ⭐⭐⭐ Medium |
| **Email Code** | 6-digit code via email | ⭐⭐ Low (not recommended) |
| **Hardware Token (YubiKey)** | Physical FIDO2 key | ⭐⭐⭐⭐⭐ Highest |

**Recommended:** Microsoft Authenticator (push notifications)

**Enrollment Process:**

1. Agent logs in for first time (Azure AD SSO)
2. Azure AD prompts: "More information required"
3. Agent installs Microsoft Authenticator app
4. Scans QR code to link account
5. Subsequent logins: Receive push notification, approve on phone

---

## 6. Device Registration Strategies

### 6.1 Webex Calling (Cloud Registration)

**Architecture:** Agents register directly to Webex Calling cloud (no CUCM).

```
┌──────────────┐         ┌─────────────────┐
│  Webex App   │ SIP/TLS │ Webex Calling   │
│  (Agent)     │◄────────►│ Cloud Platform  │
└──────────────┘         └─────────────────┘
       │                         │
       │                         │
       │ Contact Center Call     │
       │                         │
       ▼                         ▼
┌──────────────┐         ┌─────────────────┐
│ Webex CC     │         │ PSTN (via CUBE) │
│ Cloud        │◄────────►│ or Cloud PSTN   │
└──────────────┘         └─────────────────┘
```

**Advantages:**
- ✅ Simplified architecture (no CUCM dependency for agents)
- ✅ Cloud-native, fully managed
- ✅ Unified Webex experience (calling + contact center)

**Disadvantages:**
- ❌ Requires Webex Calling license ($25/user/month)
- ❌ Cannot reuse existing CUCM-registered phones

**Use Case:** Greenfield or modernization projects.

---

### 6.2 CUCM Registration (Hybrid Model)

**Architecture:** Agent phones register to on-premises CUCM, CUCM integrates with Webex CC.

```
┌──────────────┐         ┌─────────────────┐
│  IP Phone    │  SCCP/  │  CUCM Cluster   │
│  (8841, etc.)│  SIP    │  (On-Premises)  │
└──────────────┘         └─────────────────┘
       │                         │
       │                    SIP Trunk
       │                         │
       ▼                         ▼
┌──────────────┐         ┌─────────────────┐
│ Webex CC     │◄────────►│ CUBE/SBC        │
│ Cloud        │  TLS/SIP │ (On-Premises)   │
└──────────────┘         └─────────────────┘
```

**Advantages:**
- ✅ Reuse existing IP phones (CAPEX savings)
- ✅ Leverage existing CUCM infrastructure
- ✅ No additional Webex Calling license required

**Disadvantages:**
- ❌ More complex architecture (CUCM + CUBE + Webex)
- ❌ CUCM maintenance burden
- ❌ No unified Webex App experience

**Use Case:** Avaya migrations with existing Cisco IP phones.

---

### 6.3 Recommended Strategy for This Migration

**Phase 1 (Migration):** CUCM Registration
- Reuse existing IP phones
- Minimize initial change
- Reduce licensing costs

**Phase 2 (Optimization, +6 months):** Migrate to Webex Calling
- Transition agents to Webex App
- Decommission CUCM (reduce on-premises footprint)
- Simplify architecture

---

## 7. Headset and Audio Device Standards

### 7.1 Approved Headset Models

**USB Headsets (Recommended):**

| Model | Type | Noise Cancellation | Price | Use Case |
|-------|------|-------------------|-------|----------|
| **Cisco 730** | Over-ear | Active (ANC) | $249 | Premium, executives |
| **Cisco 522** | Single-ear | Passive | $99 | Standard agents |
| **Jabra Evolve2 65** | Over-ear | Active | $229 | Hybrid (UC + CC) |
| **Plantronics Blackwire 3325** | Over-ear | Passive | $79 | Budget-friendly |

**Wireless Headsets (for mobility):**

| Model | Type | Battery Life | Range | Use Case |
|-------|------|--------------|-------|----------|
| **Cisco 730 Wireless** | Over-ear | 20 hours | 30 meters | Premium, mobile |
| **Jabra Engage 75** | Over-ear | 13 hours | 150 meters | Call center floor |

**Procurement Recommendation:**
- **Standard agents:** Cisco 522 or Plantronics Blackwire 3325
- **Supervisors/managers:** Cisco 730 or Jabra Evolve2 65
- **Shared workstations:** Cisco 522 (wired, durable)

---

### 7.2 Audio Configuration Best Practices

**Webex App Audio Settings:**

1. Open Webex App > Settings > Audio
2. **Microphone:** Select USB headset
3. **Speaker:** Select USB headset
4. **Automatic Gain Control:** Enabled
5. **Echo Cancellation:** Enabled
6. **Noise Suppression:** Enabled (AI-powered)

**Windows Audio Settings:**

- Set Cisco headset as "Default Communication Device"
- Disable "Exclusive Mode" (allows multiple apps to use audio)
- Test microphone levels: 50-70% input volume

---

## 8. Supervisor Desktop and Monitoring

### 8.1 Supervisor Capabilities

**Real-Time Monitoring:**

| Feature | Description |
|---------|-------------|
| **Agent Status View** | See all agents' real-time status (Available, On Call, Break) |
| **Queue Statistics** | Calls in queue, longest wait time, service level |
| **Silent Monitoring** | Listen to agent-customer calls (agent unaware) |
| **Whisper Coaching** | Speak to agent (customer cannot hear) |
| **Barge-In** | Join call as 3rd party (customer hears supervisor) |

**Historical Reporting:**

- Agent performance reports (calls handled, average handle time)
- Queue performance (service level, abandonment rate)
- Export to CSV/Excel

---

### 8.2 Supervisor Desktop Access

**Option 1: Webex App (Supervisor Widget)**

- Supervisor logs into Webex App with supervisor credentials
- Supervisor widget displays team performance dashboard
- Real-time call controls (monitor, whisper, barge)

**Option 2: Agent Desktop (Supervisor View)**

- Access: https://desktop.wxcc-us1.cisco.com
- Role: Supervisor (assigned in Webex Control Hub)
- Full access to agent monitoring and reporting

---

## 9. Home Agent Considerations

### 9.1 Home Office Endpoint Requirements

**Network:**
- 10 Mbps download / 5 Mbps upload minimum
- <100ms latency to Webex cloud
- Wired connection preferred (Wi-Fi acceptable if 5 GHz)

**Hardware:**
- Laptop/desktop meeting Webex App system requirements
- USB headset (not laptop built-in mic/speaker)
- Webcam (if video interactions enabled)

**Software:**
- Webex App installed (or browser-based Agent Desktop)
- VPN client (if required for CRM access)
- Antivirus/endpoint protection

---

### 9.2 Home Agent Security

**Endpoint Protection:**

- [ ] Antivirus software (Windows Defender, CrowdStrike, etc.)
- [ ] Firewall enabled
- [ ] Disk encryption enabled (BitLocker, FileVault)
- [ ] Auto-updates enabled (OS and Webex App)

**Access Control:**

- [ ] VPN required for CRM/internal systems (split-tunnel for Webex)
- [ ] MFA mandatory for all logins
- [ ] Screen lock after 5 minutes of inactivity

**Acceptable Use Policy:**

- Agent workstation dedicated to work use
- No family members sharing workstation
- No installation of unauthorized software
- Compliance with corporate security policy

---

## 10. Troubleshooting and Common Issues

### 10.1 Webex App Issues

| Symptom | Likely Cause | Resolution |
|---------|--------------|------------|
| **Cannot log in** | SSO misconfiguration | Verify Azure AD SAML settings, check user assignment |
| **No audio on calls** | Headset not selected | Webex App > Settings > Audio > Select USB headset |
| **One-way audio** | Firewall blocking UDP | Check firewall rules for UDP 8000-48199 |
| **Contact Center widget missing** | Not enabled in Control Hub | Admin: Enable CC integration in Control Hub |
| **Choppy audio** | Network congestion or packet loss | Test network (latency, jitter), switch to wired connection |

---

### 10.2 Agent Desktop (Browser) Issues

| Symptom | Likely Cause | Resolution |
|---------|--------------|------------|
| **"Browser not supported"** | Using unsupported browser | Switch to Chrome or Edge (latest) |
| **Microphone not working** | Browser permission denied | Chrome: Settings > Privacy > Microphone > Allow |
| **Call not connecting** | WebRTC blocked by firewall | Check corporate firewall, contact IT |
| **Screen pop not appearing** | CRM integration issue | Verify Salesforce connector in Control Hub |

---

### 10.3 Diagnostic Tools

**Webex App Logs:**

Windows: `%APPDATA%\CiscoSparkNativeMessenger\logs`
macOS: `~/Library/Logs/Cisco Spark/`

**Browser Console (Agent Desktop):**

1. Open Agent Desktop in Chrome
2. Press `F12` to open Developer Tools
3. Go to "Console" tab
4. Look for errors (red text)
5. Screenshot and send to support

**Network Test Tool:**

https://mediatest.webex.com
- Tests bandwidth, latency, jitter, packet loss
- Provides pass/fail report for Webex readiness

---

## 11. Training and Onboarding

### 11.1 Agent Training Plan

**Duration:** 4 hours (half-day session)

**Curriculum:**

| Module | Duration | Topics |
|--------|----------|--------|
| **1. Webex App Basics** | 30 min | Login, navigation, status management |
| **2. Handling Calls** | 60 min | Answer, hold, transfer, conference, mute |
| **3. CRM Screen Pop** | 30 min | Understanding customer context, updating records |
| **4. Omnichannel (Chat/Email)** | 45 min | Responding to chat, email handling |
| **5. Supervisor Interaction** | 15 min | Escalation, coaching, team communication |
| **6. Troubleshooting** | 30 min | Common issues, who to contact |
| **7. Q&A and Practice** | 30 min | Live practice in sandbox environment |

**Training Delivery:**
- **Weeks 1-2:** Supervisor training (train the trainer)
- **Weeks 3-6:** Agent training (batches of 20-30 agents)
- **Week 7+:** Ongoing support (office hours, knowledge base)

---

### 11.2 Quick Reference Guide

**Agent Quick Reference Card (Print/PDF):**

```
╔═══════════════════════════════════════════════════════╗
║  WEBEX CONTACT CENTER AGENT QUICK REFERENCE           ║
╠═══════════════════════════════════════════════════════╣
║ LOGIN:                                                 ║
║ 1. Open Webex App                                      ║
║ 2. Click Contact Center icon (left menu)              ║
║ 3. Select Team → Go Available                          ║
╠═══════════════════════════════════════════════════════╣
║ CALL CONTROLS:                                         ║
║ • Answer: Click "Accept" or press Space                ║
║ • Hold: Click "Hold" button                            ║
║ • Transfer: Click "Transfer" → Select destination      ║
║ • Mute: Click "Mute" or press Ctrl+D                   ║
╠═══════════════════════════════════════════════════════╣
║ BREAKS:                                                ║
║ 1. Click status dropdown (top right)                   ║
║ 2. Select "Break" or "Lunch"                           ║
║ 3. Return: Select "Available"                          ║
╠═══════════════════════════════════════════════════════╣
║ NEED HELP?                                             ║
║ • IT Support: x5555 or helpdesk@company.com            ║
║ • Supervisor: Click "Escalate" button                  ║
║ • Knowledge Base: https://kb.company.com/webex         ║
╚═══════════════════════════════════════════════════════╝
```

---
