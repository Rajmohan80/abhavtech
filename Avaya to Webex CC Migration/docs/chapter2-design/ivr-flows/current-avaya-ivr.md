# Current State: Avaya Experience Portal IVR Assessment

## Executive Summary

This document provides a comprehensive assessment of the existing Avaya Experience Portal (AEP) IVR infrastructure, including platform architecture, application inventory, speech technologies, performance metrics, and migration readiness analysis. The assessment identifies 12 production IVR applications handling approximately 2.4 million monthly interactions with an average containment rate of 68%.

**Migration Complexity Score:** High (360 estimated engineering hours)  
**Recommended Approach:** Phased migration with parallel operation period  
**Target Platform:** Cisco Webex Contact Center with Google CCAI integration

---

## 1. Avaya Experience Portal Overview

### 1.1 Platform Details

| Component | Specification |
|-----------|--------------|
| **Platform Version** | Avaya Experience Portal 7.2.3 |
| **Deployment Model** | On-premises, High Availability Cluster |
| **Geographic Distribution** | 2 Data Centers (Primary: Dallas, DR: Phoenix) |
| **License Type** | Enterprise Perpetual with Annual Maintenance |
| **Support Contract Expiry** | December 2025 |
| **End of Vendor Support** | March 2026 |

### 1.2 Current Licensing

- **Port Licenses:** 500 concurrent IVR ports
- **ASR Licenses:** 200 concurrent recognition sessions
- **TTS Licenses:** 150 concurrent synthesis sessions
- **Outbound Licenses:** 100 concurrent outbound ports
- **Annual Maintenance Cost:** $485,000

### 1.3 Integration Points

The AEP platform integrates with the following enterprise systems:

- **Avaya Communication Manager 8.1** - Call routing and transfer
- **Avaya AES 8.1** - CTI and call control
- **Oracle Database 19c** - Customer data and transaction history
- **IBM MQ 9.2** - Message queuing for backend services
- **REST/SOAP Web Services** - CRM and fulfillment systems
- **Nuance Speech Server 5.2** - ASR/TTS processing

---

## 2. Platform Architecture

### 2.1 Infrastructure Topology

```
                    ┌─────────────────┐
                    │   PSTN/SIP      │
                    │   Gateway       │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Avaya Session  │
                    │    Border       │
                    │   Controller    │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
     ┌────────▼────────┐          ┌────────▼────────┐
     │   AEP Media     │          │   AEP Media     │
     │   Server 1      │          │   Server 2      │
     │  (Primary)      │          │  (Secondary)    │
     └────────┬────────┘          └────────┬────────┘
              │                             │
              └──────────────┬──────────────┘
                             │
                    ┌────────▼────────┐
                    │  Experience     │
                    │  Portal Manager │
                    │    (EPM)        │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
     ┌────────▼────────┐          ┌────────▼────────┐
     │   Application   │          │   Nuance        │
     │   Servers       │          │   Speech        │
     │   (VoiceXML)    │          │   Server        │
     └─────────────────┘          └─────────────────┘
```

### 2.2 High Availability Configuration

- **Failover Mode:** Active-Active with load balancing
- **Session Persistence:** Sticky sessions with 30-minute timeout
- **Database Replication:** Oracle Data Guard (synchronous)
- **Monitoring:** Avaya System Manager + Nagios
- **Backup Schedule:** Daily incremental, weekly full
- **RTO:** 4 hours | **RPO:** 1 hour

### 2.3 Network Configuration

| Parameter | Value |
|-----------|-------|
| **SIP Transport** | TLS 1.2 (TCP port 5061) |
| **Media Protocol** | RTP/SRTP (UDP 16384-32767) |
| **Codec Support** | G.711 μ-law, G.729a |
| **DTMF Method** | RFC 2833 (preferred), In-band |
| **QoS Marking** | DSCP EF (46) for voice media |

---

## 3. Application Inventory

### 3.1 Production IVR Applications

| App ID | Application Name | DNIS Range | Monthly Volume | Containment Rate | Business Hours |
|--------|-----------------|------------|----------------|------------------|----------------|
| IVR-001 | **Main_IVR_Menu** | 800-XX5-0100 | 850,000 | 45% | 24x7 |
| IVR-002 | **Sales_IVR** | 800-XX5-0101 | 320,000 | 72% | 8am-8pm ET |
| IVR-003 | **Support_IVR** | 800-XX5-0102 | 445,000 | 65% | 24x7 |
| IVR-004 | **Billing_IVR** | 800-XX5-0103 | 380,000 | 78% | 24x7 |
| IVR-005 | **Collections_IVR** | 800-XX5-0104 | 125,000 | 82% | 8am-9pm ET |
| IVR-006 | **Account_Lookup** | 800-XX5-0105 | 95,000 | 88% | 24x7 |
| IVR-007 | **Payment_IVR** | 800-XX5-0106 | 78,000 | 91% | 24x7 |
| IVR-008 | **Order_Status** | 800-XX5-0107 | 62,000 | 85% | 24x7 |
| IVR-009 | **Password_Reset** | 800-XX5-0108 | 28,000 | 94% | 24x7 |
| IVR-010 | **Appointment_Scheduler** | 800-XX5-0109 | 15,000 | 76% | 8am-6pm ET |
| IVR-011 | **Survey_Outbound** | N/A (Outbound) | 12,000 | N/A | 9am-9pm ET |
| IVR-012 | **Emergency_Hotline** | 800-XX5-0199 | 2,200 | 15% | 24x7 |

**Total Monthly Volume:** ~2,412,200 interactions  
**Weighted Average Containment:** 68%

### 3.2 Application Dependencies Matrix

| Application | Database | Web Services | External APIs | Speech Services |
|------------|----------|--------------|---------------|-----------------|
| Main_IVR_Menu | Oracle | CRM REST | None | ASR + TTS |
| Sales_IVR | Oracle | CRM, Inventory | Product Catalog | ASR + TTS |
| Support_IVR | Oracle | Ticketing, KB | None | ASR + TTS |
| Billing_IVR | Oracle | Billing System | Payment Gateway | ASR + TTS |
| Collections_IVR | Oracle | Collections DB | Credit Bureau | TTS Only |
| Account_Lookup | Oracle | CRM REST | None | ASR + TTS |
| Payment_IVR | Oracle | Payment System | PCI Gateway | TTS Only |
| Order_Status | Oracle | Order Management | Shipping API | ASR + TTS |
| Password_Reset | LDAP | Identity System | SMS Gateway | TTS Only |
| Appointment_Scheduler | Oracle | Scheduling System | Calendar API | ASR + TTS |
| Survey_Outbound | Oracle | Survey Platform | None | TTS Only |
| Emergency_Hotline | Oracle | Incident System | Pager API | TTS Only |

---

## 4. VoiceXML/CCXML Applications

### 4.1 Application Framework

All IVR applications are built using:

- **VoiceXML Version:** 2.1 (W3C Compliant)
- **CCXML Version:** 1.0 (Call Control)
- **Application Server:** Apache Tomcat 9.0
- **Framework:** Custom Java/JSP with VoiceXML generation
- **Session Management:** Server-side with Oracle persistence

### 4.2 Code Structure Analysis

```
/opt/avaya/applications/
├── Main_IVR_Menu/
│   ├── vxml/
│   │   ├── main_menu.vxml (2,450 lines)
│   │   ├── authentication.vxml (890 lines)
│   │   ├── routing_logic.vxml (1,200 lines)
│   │   └── error_handlers.vxml (650 lines)
│   ├── ccxml/
│   │   ├── call_control.ccxml (780 lines)
│   │   └── transfer_logic.ccxml (420 lines)
│   ├── grammars/
│   │   ├── main_menu_options.grxml (340 lines)
│   │   ├── yes_no.grxml (85 lines)
│   │   └── digit_string.grxml (120 lines)
│   ├── audio/
│   │   └── [45 audio prompt files]
│   └── config/
│       ├── app_config.xml
│       └── database_config.xml
├── Sales_IVR/
│   └── [similar structure - 3,800 total lines]
├── Support_IVR/
│   └── [similar structure - 4,200 total lines]
└── [remaining applications...]
```

**Total Codebase Size:** ~48,000 lines of VoiceXML/CCXML/GRXML

### 4.3 Sample VoiceXML Structure (Main Menu)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<vxml version="2.1" xmlns="http://www.w3.org/2001/vxml">
  
  <property name="inputmodes" value="dtmf voice"/>
  <property name="timeout" value="5s"/>
  <property name="bargein" value="true"/>
  <property name="interdigittimeout" value="3s"/>
  
  <var name="customer_id" expr="session.telephone.ani"/>
  <var name="call_reason" expr="'unknown'"/>
  <var name="auth_status" expr="'unauthenticated'"/>
  
  <form id="main_menu">
    <field name="menu_selection">
      <prompt bargein="true">
        <audio src="audio/welcome.wav"/>
        <audio src="audio/main_menu_options.wav"/>
        For sales, press 1 or say sales.
        For support, press 2 or say support.
        For billing, press 3 or say billing.
        To check order status, press 4.
        To speak with a representative, press 0.
      </prompt>
      
      <grammar src="grammars/main_menu_options.grxml" type="application/srgs+xml"/>
      
      <filled>
        <if cond="menu_selection == 'sales' || menu_selection == '1'">
          <assign name="call_reason" expr="'sales'"/>
          <goto next="sales_ivr.vxml"/>
        <elseif cond="menu_selection == 'support' || menu_selection == '2'"/>
          <assign name="call_reason" expr="'support'"/>
          <goto next="support_ivr.vxml"/>
        <elseif cond="menu_selection == 'billing' || menu_selection == '3'"/>
          <assign name="call_reason" expr="'billing'"/>
          <goto next="billing_ivr.vxml"/>
        <elseif cond="menu_selection == 'order' || menu_selection == '4'"/>
          <assign name="call_reason" expr="'order_status'"/>
          <goto next="order_status.vxml"/>
        <elseif cond="menu_selection == 'agent' || menu_selection == '0'"/>
          <goto next="#transfer_to_agent"/>
        </if>
      </filled>
      
      <noinput count="1">
        <prompt>I didn't hear anything. Please make a selection.</prompt>
        <reprompt/>
      </noinput>
      
      <noinput count="2">
        <prompt>I still didn't hear you. Let me connect you with an agent.</prompt>
        <goto next="#transfer_to_agent"/>
      </noinput>
      
      <nomatch count="1">
        <prompt>I didn't understand. Please try again.</prompt>
        <reprompt/>
      </nomatch>
      
      <nomatch count="2">
        <prompt>I'm having trouble understanding. Transferring to an agent.</prompt>
        <goto next="#transfer_to_agent"/>
      </nomatch>
    </field>
  </form>
  
  <form id="transfer_to_agent">
    <block>
      <prompt>Please hold while I transfer your call.</prompt>
      <data name="queue_result" src="routing_service" method="post">
        <param name="ani" expr="customer_id"/>
        <param name="reason" expr="call_reason"/>
      </data>
      <transfer name="agent_transfer" 
                dest="tel:+18005550200" 
                bridge="true"
                type="consultation">
        <filled>
          <if cond="agent_transfer == 'busy'">
            <prompt>All agents are busy. Estimated wait time is 
              <value expr="queue_result.wait_time"/> minutes.</prompt>
          </if>
        </filled>
      </transfer>
    </block>
  </form>
  
  <catch event="error.badfetch">
    <prompt>We're experiencing technical difficulties. Please try again later.</prompt>
    <exit/>
  </catch>
  
  <catch event="connection.disconnect.hangup">
    <log>Customer disconnected: <value expr="customer_id"/></log>
    <exit/>
  </catch>
  
</vxml>
```

### 4.4 Call Control (CCXML) Sample

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ccxml version="1.0">
  
  <eventprocessor statevariable="state">
    
    <transition state="initial" event="connection.alerting">
      <log>Incoming call from: <value expr="event$.connection.remote"/></log>
      <accept/>
      <assign name="state" expr="'accepting'"/>
    </transition>
    
    <transition state="accepting" event="connection.connected">
      <log>Call connected, launching IVR</log>
      <dialogstart src="main_menu.vxml" connectionid="event$.connectionid">
        <param name="ani" expr="event$.connection.remote"/>
        <param name="dnis" expr="event$.connection.local"/>
      </dialogstart>
      <assign name="state" expr="'in_ivr'"/>
    </transition>
    
    <transition state="in_ivr" event="dialog.exit">
      <log>IVR completed with result: <value expr="event$.values.result"/></log>
      <if cond="event$.values.result == 'transfer'">
        <createcall dest="event$.values.transfer_dest" 
                    connectionid="outbound_leg"
                    timeout="30s"/>
        <assign name="state" expr="'transferring'"/>
      <else/>
        <disconnect connectionid="event$.connectionid"/>
        <assign name="state" expr="'complete'"/>
      </if>
    </transition>
    
    <transition state="transferring" event="connection.connected">
      <log>Transfer target answered</log>
      <join id1="event$.connectionid" id2="outbound_leg" 
            duplex="full" dtmfclamp="true"/>
      <assign name="state" expr="'bridged'"/>
    </transition>
    
    <transition state="*" event="connection.disconnected">
      <log>Call ended</log>
      <exit/>
    </transition>
    
    <transition state="*" event="error.*">
      <log>Error occurred: <value expr="event$.reason"/></log>
      <exit/>
    </transition>
    
  </eventprocessor>
  
</ccxml>
```

---

## 5. ASR Configuration

### 5.1 Nuance Recognizer Setup

| Parameter | Configuration |
|-----------|--------------|
| **Engine** | Nuance Recognizer 11.0 |
| **Language Pack** | US English (enu-USA) |
| **Acoustic Model** | Telephony 8kHz optimized |
| **Recognition Mode** | Grammar-based (SRGS) |
| **Confidence Threshold** | 0.65 (adjustable per grammar) |
| **Endpointer** | Automatic with 700ms silence |
| **Max Speech Timeout** | 15 seconds |

### 5.2 SRGS Grammar Examples

#### Main Menu Options Grammar

```xml
<?xml version="1.0" encoding="UTF-8"?>
<grammar xmlns="http://www.w3.org/2001/06/grammar"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.w3.org/2001/06/grammar
                             http://www.w3.org/TR/speech-grammar/grammar.xsd"
         xml:lang="en-US" version="1.0" root="main_options" mode="voice"
         tag-format="semantics/1.0">

  <rule id="main_options" scope="public">
    <one-of>
      <item>
        <one-of>
          <item>sales</item>
          <item>buy something</item>
          <item>purchase</item>
          <item>new order</item>
          <item>1</item>
          <item>one</item>
        </one-of>
        <tag>out = "sales";</tag>
      </item>
      
      <item>
        <one-of>
          <item>support</item>
          <item>technical support</item>
          <item>help</item>
          <item>assistance</item>
          <item>2</item>
          <item>two</item>
        </one-of>
        <tag>out = "support";</tag>
      </item>
      
      <item>
        <one-of>
          <item>billing</item>
          <item>my bill</item>
          <item>payment</item>
          <item>invoice</item>
          <item>3</item>
          <item>three</item>
        </one-of>
        <tag>out = "billing";</tag>
      </item>
      
      <item>
        <one-of>
          <item>order status</item>
          <item>check my order</item>
          <item>where is my order</item>
          <item>track order</item>
          <item>4</item>
          <item>four</item>
        </one-of>
        <tag>out = "order";</tag>
      </item>
      
      <item>
        <one-of>
          <item>agent</item>
          <item>representative</item>
          <item>operator</item>
          <item>speak to someone</item>
          <item>human</item>
          <item>0</item>
          <item>zero</item>
        </one-of>
        <tag>out = "agent";</tag>
      </item>
    </one-of>
  </rule>
  
</grammar>
```

#### Account Number Grammar (with checksum validation)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<grammar xmlns="http://www.w3.org/2001/06/grammar"
         xml:lang="en-US" version="1.0" root="account_number" mode="voice"
         tag-format="semantics/1.0">

  <rule id="account_number" scope="public">
    <item repeat="10">
      <ruleref uri="#digit"/>
    </item>
    <tag>
      out = "";
      for (var i = 0; i &lt; rules.digit.length; i++) {
        out += rules.digit[i];
      }
    </tag>
  </rule>
  
  <rule id="digit">
    <one-of>
      <item>0<tag>out = "0";</tag></item>
      <item>zero<tag>out = "0";</tag></item>
      <item>oh<tag>out = "0";</tag></item>
      <item>1<tag>out = "1";</tag></item>
      <item>one<tag>out = "1";</tag></item>
      <item>2<tag>out = "2";</tag></item>
      <item>two<tag>out = "2";</tag></item>
      <item>3<tag>out = "3";</tag></item>
      <item>three<tag>out = "3";</tag></item>
      <item>4<tag>out = "4";</tag></item>
      <item>four<tag>out = "4";</tag></item>
      <item>5<tag>out = "5";</tag></item>
      <item>five<tag>out = "5";</tag></item>
      <item>6<tag>out = "6";</tag></item>
      <item>six<tag>out = "6";</tag></item>
      <item>7<tag>out = "7";</tag></item>
      <item>seven<tag>out = "7";</tag></item>
      <item>8<tag>out = "8";</tag></item>
      <item>eight<tag>out = "8";</tag></item>
      <item>9<tag>out = "9";</tag></item>
      <item>nine<tag>out = "9";</tag></item>
    </one-of>
  </rule>
  
</grammar>
```

#### Yes/No Confirmation Grammar

```xml
<?xml version="1.0" encoding="UTF-8"?>
<grammar xmlns="http://www.w3.org/2001/06/grammar"
         xml:lang="en-US" version="1.0" root="yes_no" mode="voice"
         tag-format="semantics/1.0">

  <rule id="yes_no" scope="public">
    <one-of>
      <item>
        <one-of>
          <item>yes</item>
          <item>yeah</item>
          <item>yep</item>
          <item>correct</item>
          <item>right</item>
          <item>affirmative</item>
          <item>that's right</item>
          <item>that is correct</item>
          <item>1</item>
          <item>one</item>
        </one-of>
        <tag>out = "yes";</tag>
      </item>
      
      <item>
        <one-of>
          <item>no</item>
          <item>nope</item>
          <item>negative</item>
          <item>incorrect</item>
          <item>wrong</item>
          <item>that's wrong</item>
          <item>not correct</item>
          <item>2</item>
          <item>two</item>
        </one-of>
        <tag>out = "no";</tag>
      </item>
    </one-of>
  </rule>
  
</grammar>
```

### 5.3 Grammar Performance Metrics

| Grammar Type | Recognition Accuracy | False Accept Rate | Avg. Response Time |
|--------------|---------------------|-------------------|-------------------|
| Menu Navigation | 87.3% | 2.1% | 1.2s |
| Yes/No Confirmation | 94.6% | 1.8% | 0.8s |
| Digit Strings (10-digit) | 82.1% | 3.4% | 2.8s |
| Natural Language (limited) | 71.2% | 5.2% | 1.9s |

**Key Issues Identified:**
- High false rejection rates during peak hours (network latency)
- Poor performance with accented English speakers
- Limited vocabulary expansion capability
- No context carryover between recognition attempts

---

## 6. TTS Configuration

### 6.1 Nuance Vocalizer Setup

| Parameter | Configuration |
|-----------|--------------|
| **Engine** | Nuance Vocalizer 5.2 |
| **Primary Voice** | Samantha (US English, Female) |
| **Secondary Voice** | Tom (US English, Male) |
| **Sample Rate** | 8kHz (telephony optimized) |
| **Audio Format** | μ-law WAV |
| **Speaking Rate** | 1.0x (default) |
| **Volume** | -3dB (normalized) |

### 6.2 SSML Implementation

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
       xml:lang="en-US">
  
  <!-- Standard greeting with emphasis -->
  <prosody rate="95%" volume="loud">
    Thank you for calling Acme Corporation.
  </prosody>
  
  <!-- Phone number formatting -->
  Your callback number is
  <say-as interpret-as="telephone">8005550100</say-as>.
  
  <!-- Currency formatting -->
  Your current balance is
  <say-as interpret-as="currency">$1,234.56</say-as>.
  
  <!-- Date formatting -->
  Your payment is due on
  <say-as interpret-as="date" format="mdy">12/25/2024</say-as>.
  
  <!-- Account number with deliberate pacing -->
  <prosody rate="85%">
    Your account number is
    <say-as interpret-as="digits">1234567890</say-as>.
  </prosody>
  
  <!-- Confirmation with pause -->
  <break time="500ms"/>
  Is this correct?
  
</speak>
```

### 6.3 Dynamic TTS Usage

- **Percentage of prompts using TTS:** 35%
- **Primary use cases:**
  - Account balances
  - Due dates
  - Order numbers
  - Confirmation details
  - Error messages
- **Average TTS latency:** 180ms first byte
- **Cache hit rate:** 62% (common phrases cached)

---

## 7. Audio Prompt Library

### 7.1 Prompt Inventory Summary

| Category | File Count | Total Duration | Format |
|----------|-----------|----------------|--------|
| Welcome/Greeting | 12 | 2:15 | WAV 8kHz μ-law |
| Menu Options | 45 | 8:30 | WAV 8kHz μ-law |
| Instructions | 38 | 12:45 | WAV 8kHz μ-law |
| Confirmations | 28 | 4:20 | WAV 8kHz μ-law |
| Error Messages | 35 | 6:10 | WAV 8kHz μ-law |
| Hold Messages | 22 | 15:00 | WAV 8kHz μ-law |
| Transfer Announcements | 18 | 3:40 | WAV 8kHz μ-law |
| Surveys/Feedback | 15 | 4:15 | WAV 8kHz μ-law |
| Seasonal/Promotional | 12 | 3:50 | WAV 8kHz μ-law |
| System Messages | 22 | 5:25 | WAV 8kHz μ-law |
| **TOTAL** | **247** | **66:10** | - |

### 7.2 Recording Standards

- **Voice Talent:** Professional female voice (consistent across all prompts)
- **Recording Studio:** Certified broadcast quality
- **Background Noise:** < -50dB
- **Normalization:** -3dB peak
- **Compression:** Light limiting applied
- **Update Frequency:** Quarterly review cycle

### 7.3 Prompt Management Challenges

1. **Version Control:** Manual file management without proper versioning
2. **Update Process:** 2-3 week lead time for new recordings
3. **Consistency:** Voice talent availability issues for updates
4. **Storage:** Distributed across application directories
5. **Localization:** English only (no multilingual support)

---

## 8. Performance Metrics

### 8.1 Key Performance Indicators (Last 12 Months)

| Metric | Value | Industry Benchmark | Status |
|--------|-------|-------------------|--------|
| **Overall Containment Rate** | 68% | 75-80% | ⚠️ Below Target |
| **IVR Completion Rate** | 72% | 80% | ⚠️ Below Target |
| **Average Handle Time (IVR)** | 3.2 min | 2.5 min | ⚠️ Above Target |
| **Transfer Rate to Agent** | 32% | 20-25% | ⚠️ Above Target |
| **First Call Resolution (IVR)** | 61% | 70% | ⚠️ Below Target |
| **Customer Satisfaction (IVR)** | 3.2/5 | 3.8/5 | ⚠️ Below Target |
| **System Availability** | 99.2% | 99.9% | ⚠️ Below Target |
| **ASR Recognition Accuracy** | 84% | 90% | ⚠️ Below Target |

### 8.2 Monthly Call Volume Trends

```
Month       Total Calls    Contained    Transferred    Abandoned
─────────────────────────────────────────────────────────────────
Jan 2024    2,380,450      1,618,706    665,246        96,498
Feb 2024    2,245,890      1,527,205    628,847        89,838
Mar 2024    2,412,330      1,640,384    675,452        96,494
Apr 2024    2,398,760      1,631,157    671,653        95,950
May 2024    2,456,220      1,670,230    687,742        98,248
Jun 2024    2,489,100      1,692,588    697,348        99,164
Jul 2024    2,523,890      1,716,245    706,689        100,956
Aug 2024    2,567,450      1,745,866    718,886        102,698
Sep 2024    2,445,670      1,663,056    684,787        97,827
Oct 2024    2,512,340      1,708,391    703,455        100,494
Nov 2024    2,478,900      1,685,652    694,092        99,156
Dec 2024    2,534,230      1,723,276    709,584        101,370
─────────────────────────────────────────────────────────────────
Average     2,453,769      1,668,563    686,815        98,391
```

### 8.3 Peak Hour Analysis

- **Highest Volume:** Monday 9-11 AM ET (18% above average)
- **Lowest Volume:** Sunday 2-4 AM ET (72% below average)
- **Port Utilization Peak:** 87% (Monday 10 AM)
- **ASR Queue Delays:** Up to 2.3s during peaks
- **System Stress Events:** 12 incidents in past year

### 8.4 Application-Specific Performance

| Application | Avg Duration | Success Rate | Top Exit Point |
|------------|--------------|--------------|----------------|
| Main_IVR_Menu | 1.8 min | 45% | Menu timeout |
| Sales_IVR | 4.2 min | 72% | Successful quote |
| Support_IVR | 5.1 min | 65% | Transfer to agent |
| Billing_IVR | 2.9 min | 78% | Balance provided |
| Collections_IVR | 3.8 min | 82% | Payment arranged |
| Payment_IVR | 2.1 min | 91% | Payment confirmed |
| Order_Status | 1.4 min | 85% | Status provided |

---

## 9. Pain Points and Limitations

### 9.1 Technical Limitations

| Issue | Impact | Severity | Workaround Available |
|-------|--------|----------|---------------------|
| **No Natural Language Understanding** | Limited to keyword spotting, no intent recognition | High | None |
| **Rigid Dialog Flows** | Cannot handle conversation deviations | High | Manual reprompting |
| **Single Language Support** | English only, no multilingual capability | Medium | Separate Spanish line |
| **No Context Persistence** | Each interaction starts fresh | High | Database lookups |
| **Limited Analytics** | Basic CDR logs only, no conversation insights | High | Third-party tools |
| **Static Grammars** | Cannot adapt to new terminology | Medium | Manual updates |
| **No Sentiment Detection** | Cannot identify frustrated callers | High | None |
| **Outdated Speech Engine** | 2018 acoustic models | Medium | Engine upgrade required |

### 9.2 Operational Challenges

1. **High Maintenance Overhead**
   - 2 FTE dedicated to IVR maintenance
   - Average 40 hours/month for grammar updates
   - 3-week cycle for prompt recording changes

2. **Poor Self-Service Adoption**
   - 32% of calls transfer to agents unnecessarily
   - Low customer confidence in IVR accuracy
   - Complex authentication requirements

3. **Limited Reporting**
   - No real-time dashboards
   - Manual report generation (weekly)
   - Cannot correlate IVR data with agent interactions

4. **Scalability Constraints**
   - Hardware-bound port limits
   - ASR server bottlenecks during peaks
   - No elastic scaling capability

5. **Integration Complexity**
   - Tight coupling with Oracle database
   - Custom web service adapters required
   - No modern API gateway support

### 9.3 Customer Experience Issues

- **Recognition Frustration:** 15% of callers repeat themselves 3+ times
- **Menu Navigation:** Average 2.3 menu levels before reaching destination
- **Authentication Friction:** 45-second average authentication time
- **Hold Time Messaging:** Static, non-personalized
- **No Callback Option:** Customers must wait in queue
- **No Channel Switching:** Cannot transition to chat/SMS

### 9.4 Business Impact

| Issue | Annual Cost Impact | Calculation |
|-------|-------------------|-------------|
| Unnecessary agent transfers | $2.4M | 780K calls × $3.08/call |
| IVR abandonment | $890K | 1.18M abandoned × $0.75 recovery |
| Extended handle times | $1.2M | 0.7 min excess × 29M minutes |
| System downtime | $425K | 0.8% downtime × revenue impact |
| Maintenance overhead | $680K | 2 FTE + vendor support |
| **Total Annual Impact** | **$5.6M** | - |

---

## 10. Migration Readiness Assessment

### 10.1 Technical Readiness Score

| Category | Score (1-10) | Weight | Weighted Score | Notes |
|----------|--------------|--------|----------------|-------|
| Documentation Quality | 6/10 | 15% | 0.90 | Partial documentation exists |
| Code Modularity | 4/10 | 20% | 0.80 | Tightly coupled components |
| Data Layer Abstraction | 5/10 | 15% | 0.75 | Direct database queries |
| Integration Patterns | 3/10 | 20% | 0.60 | Custom, non-standard |
| Testing Infrastructure | 4/10 | 15% | 0.60 | Limited automation |
| Monitoring/Observability | 5/10 | 15% | 0.75 | Basic logging only |
| **Overall Technical Readiness** | **4.4/10** | 100% | **4.40** | **Significant Effort Required** |

### 10.2 Organizational Readiness

- **Executive Sponsorship:** Strong (CIO and VP Customer Service aligned)
- **Budget Allocation:** Approved for FY2025-2026
- **Team Availability:** 70% dedicated resources identified
- **Change Management:** Moderate (some resistance from legacy team)
- **Training Capacity:** Requires upskilling in cloud technologies

### 10.3 Risk Assessment Matrix

| Risk | Probability | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| Data migration errors | Medium | High | Parallel validation period |
| User adoption resistance | Medium | Medium | Phased rollout with training |
| Integration failures | High | High | Extensive UAT with backends |
| Performance regression | Medium | High | Load testing before cutover |
| Compliance gaps | Low | Critical | Pre-migration compliance audit |
| Budget overrun | Medium | Medium | 20% contingency buffer |
| Timeline delays | High | Medium | Agile methodology with sprints |

### 10.4 Prerequisite Actions

1. ✅ **Complete** - Executive approval for migration budget
2. ✅ **Complete** - Vendor selection (Cisco Webex Contact Center)
3. 🔄 **In Progress** - Network infrastructure assessment
4. 🔄 **In Progress** - Security and compliance review
5. ⏳ **Pending** - Staff training plan development
6. ⏳ **Pending** - Data migration strategy finalization
7. ⏳ **Pending** - Integration architecture design
8. ⏳ **Pending** - Testing framework establishment

---

## 11. Complexity Analysis

### 11.1 Migration Effort Estimation

| Component | Complexity | Hours Estimate | Dependencies |
|-----------|-----------|----------------|--------------|
| **Main_IVR_Menu** | High | 80 | All other apps |
| **Sales_IVR** | High | 60 | CRM, Inventory |
| **Support_IVR** | High | 65 | Ticketing, KB |
| **Billing_IVR** | High | 55 | Payment Gateway |
| **Collections_IVR** | Medium | 35 | Collections DB |
| **Account_Lookup** | Medium | 25 | CRM |
| **Payment_IVR** | High | 45 | PCI Gateway |
| **Order_Status** | Medium | 30 | Order Management |
| **Password_Reset** | Low | 15 | Identity System |
| **Appointment_Scheduler** | Medium | 28 | Calendar API |
| **Survey_Outbound** | Low | 12 | Survey Platform |
| **Emergency_Hotline** | Low | 10 | Incident System |
| **SUBTOTAL: Applications** | - | **460** | - |

### 11.2 Additional Migration Components

| Component | Hours Estimate | Notes |
|-----------|----------------|-------|
| Infrastructure Setup | 40 | WxCC tenant, PSTN connectivity |
| Network Configuration | 35 | SBC, firewall rules, QoS |
| Security Implementation | 45 | SSO, encryption, compliance |
| Data Migration | 55 | Customer data, transaction history |
| Integration Development | 85 | Web services, APIs, middleware |
| Grammar to NLU Conversion | 60 | SRGS to Dialogflow training |
| Audio Prompt Migration | 25 | Format conversion, hosting |
| Testing & Validation | 120 | Unit, integration, UAT, load |
| Documentation | 35 | Technical docs, runbooks |
| Training & Knowledge Transfer | 40 | Operations team enablement |
| **SUBTOTAL: Supporting Work** | **540** | - |

### 11.3 Total Effort Summary

```
Application Migration:        460 hours
Supporting Work:              540 hours
─────────────────────────────────────────
Total Base Estimate:        1,000 hours

Risk Contingency (25%):       250 hours
Scope Buffer (10%):           100 hours
─────────────────────────────────────────
GRAND TOTAL:                1,350 hours

Approximate Duration: 8-10 months (with 3-4 FTE)
```

**Note:** Original estimate of 360 hours represents application conversion only without supporting infrastructure, integrations, and contingency buffers.

### 11.4 Complexity Scoring by Factor

| Factor | Score (1-5) | Justification |
|--------|-------------|---------------|
| Business Logic Complexity | 4.2 | Multiple conditional branches, validation rules |
| Integration Depth | 4.5 | 8+ backend systems, custom protocols |
| Data Transformation | 3.8 | Different data models, type conversions |
| Error Handling | 3.5 | Existing try-catch needs NLU equivalents |
| Security Requirements | 4.0 | PCI-DSS, data encryption, authentication |
| Performance Constraints | 3.7 | <500ms response time requirements |
| Testing Requirements | 4.3 | Regression, load, security testing |
| **Average Complexity Score** | **4.0/5** | **High Complexity Migration** |

---

## 12. Recommendations for Webex Design

### 12.1 Architecture Recommendations

1. **Deploy Cisco CUBE as Session Border Controller**
   - Replace Avaya SBC with Cisco CUBE for PSTN/SIP gateway
   - Implement Local Gateway (LGW) registration to Webex Cloud
   - Configure SIP trunk failover between primary and DR sites
   - Enable SRTP for secure media transport to WxCC
   - Leverage CUBE's advanced call routing and normalization features
   - Support for both premises-based PSTN and Webex Calling PSTN options

2. **Adopt Cloud-Native Design**
   - Leverage Webex Contact Center's microservices architecture
   - Implement API-first integration patterns
   - Use serverless functions for business logic

3. **Implement Conversational AI**
   - Replace SRGS grammars with Google Dialogflow CX
   - Design intent-based dialog management
   - Enable natural language understanding for all interactions

4. **Modernize Integration Layer**
   - Deploy API gateway (Google Apigee recommended)
   - Implement OAuth 2.0 for secure service authentication
   - Use webhook patterns for real-time event handling

5. **Enable Omnichannel Capability**
   - Design flows for voice, chat, SMS, email
   - Implement channel-agnostic business logic
   - Enable seamless channel switching

### 12.2 Specific Migration Strategies

| Current State | Recommended Webex Approach |
|--------------|---------------------------|
| Avaya Session Border Controller | **Cisco CUBE** (Local Gateway to WxCC) |
| VoiceXML static menus | Dialogflow CX pages with intents |
| SRGS grammar files | NLU training phrases with entities |
| Custom Java backend | Webex Flow Designer + Cloud Functions |
| Direct database queries | RESTful API with caching layer |
| Nuance ASR/TTS | Google Cloud Speech-to-Text/Text-to-Speech |
| Manual reporting | Webex Analytics + BigQuery export |
| Hardware-based scaling | Auto-scaling cloud resources |
| Avaya AES CTI | Webex Contact Center Desktop APIs |

### 12.3 Quick Win Opportunities

1. **Payment IVR** (91% containment) - Migrate first as proof of concept
2. **Password Reset** (94% containment) - Simple flow, high automation
3. **Order Status** (85% containment) - Good candidate for AI enhancement

### 12.4 Phased Migration Approach

**Phase 1 (Months 1-3): Foundation**
- Webex Contact Center tenant setup
- **Cisco CUBE deployment and Local Gateway registration**
- SIP trunk configuration to WxCC (primary and DR sites)
- Network connectivity and security (SRTP, firewall rules)
- Basic voice routing configuration
- Training environment establishment

**Phase 2 (Months 4-6): Pilot Applications**
- Payment_IVR migration
- Password_Reset migration
- Order_Status migration
- Initial NLU training and testing

**Phase 3 (Months 7-9): Core Applications**
- Billing_IVR migration
- Support_IVR migration
- Sales_IVR migration
- Advanced Dialogflow CX features

**Phase 4 (Months 10-12): Complete Migration**
- Main_IVR_Menu migration
- Remaining applications
- Performance optimization
- Legacy system decommission

### 12.5 Success Metrics for New Platform

| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| Containment Rate | 68% | 82% | +14% |
| Recognition Accuracy | 84% | 94% | +10% |
| Average Handle Time | 3.2 min | 2.2 min | -31% |
| Customer Satisfaction | 3.2/5 | 4.2/5 | +31% |
| System Availability | 99.2% | 99.95% | +0.75% |
| Agent Transfer Rate | 32% | 18% | -44% |
| First Call Resolution | 61% | 78% | +28% |

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **AEP** | Avaya Experience Portal - IVR platform |
| **ASR** | Automatic Speech Recognition |
| **CCXML** | Call Control eXtensible Markup Language |
| **DNIS** | Dialed Number Identification Service |
| **DTMF** | Dual-Tone Multi-Frequency signaling |
| **IVR** | Interactive Voice Response |
| **NLU** | Natural Language Understanding |
| **SBC** | Session Border Controller |
| **SRGS** | Speech Recognition Grammar Specification |
| **SSML** | Speech Synthesis Markup Language |
| **TTS** | Text-to-Speech |
| **VoiceXML** | Voice Extensible Markup Language |
| **WxCC** | Webex Contact Center |

---

