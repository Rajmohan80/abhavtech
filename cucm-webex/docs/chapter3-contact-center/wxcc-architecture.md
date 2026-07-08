# 3.2 Webex Contact Center Architecture

## 3.2.1 WxCC Platform Selection

```
   WEBEX CONTACT CENTER - PLATFORM SELECTION
   SELECTED PLATFORM: Webex Contact Center (Cloud)
   ALTERNATIVES EVALUATED:
   Option   Pros   Cons

   Webex CC (Cloud)   Cloud-native   Feature limitations
   AI-ready (native)   vs on-prem
   Faster deployment
   Global redundancy
   SELECTED

   Webex CCE   Full UCM integration   Complex deployment
   (Enterprise)   Finesse compatible   Higher cost
   On-prem component

   Third-party CC   Best-of-breed option   Multi-vendor mgmt
   (Genesys, NICE)   Specialized features   Integration effort
   DECISION RATIONALE:
   1. Single-vendor strategy (Webex Calling + Contact Center)
   2. Native AI integration (Webex AI Agent, Agent Assist)
   3. Cloud-first corporate mandate
   4. Reduced operational complexity (no on-prem servers)
   5. Multi-region deployment with regional data residency
   6. Aligns with Abhavtech's AI technology company identity
```

## 3.2.2 WxCC Multi-Region Architecture

```
   ABHAVTECH WEBEX CONTACT CENTER - MULTI-REGION ARCHITECTURE
   WEBEX CONTROL HUB
   (Single Organization)
   Org Region: APAC

         
   WxCC   WxCC   WxCC
   TENANT   TENANT   TENANT
   APAC   EMEA   AMERICAS
   (Mumbai DC)   (UK/EU DC)   (US DC)
         
   SITES:   SITES:   SITES:
   - Mumbai   - London   - New Jersey
   - Chennai
   Agents: 150   Agents: 15   Agents: 10
   DATA RESIDENCY CONFIGURATION:
   Region   WxCC Data Center   Recording Storage   Analytics
   
   India/APAC   Mumbai DC   UK DC   US DC
   UK   UK DC (London)   UK DC   UK DC
   EU   EU DC (Frankfurt)   EU DC   EU DC
   Americas   US DC   US DC   US DC
   CRITICAL: India Contact Center data MUST reside in India DC (Mumbai)
   for DoT/TRAI compliance. This is configurable in Control Hub.
```

## 3.2.3 WxCC Licensing Design

```
   ABHAVTECH WxCC LICENSING REQUIREMENTS
   LICENSE TYPE   QUANTITY   UNIT COST   ANNUAL COST   NOTES
   
   Standard Agent   100   $XXX/mo   $XX,XXX   Voice only
   Premium Agent   75   $XXX/mo   $XX,XXX   Voice+Digital
   Supervisor   10   $XXX/mo   $X,XXX   Monitoring
   
   Webex AI Agent   1   $XXX/mo   $XX,XXX   Virtual Agnt
   Agent Assist   175   Included   Included   In Premium
   
   WFO (Recording)   175   $XXX/mo   $XX,XXX   All agents
   WFO (QM)   50   $XXX/mo   $X,XXX   Evaluation
   WFO (WFM)   175   $XXX/mo   $XX,XXX   Scheduling
   
   ADDON CHANNELS:
   WhatsApp Business: Via CCAI/Partner connector
   Facebook Messenger: Native connector available
   SMS: Via CCPP provider
   LICENSE DISTRIBUTION BY SITE:
   Mumbai HQ:   80 Standard + 40 Premium = 120 agents
   Chennai:   15 Standard + 15 Premium = 30 agents
   London:   5 Standard + 10 Premium = 15 agents
   New Jersey:  0 Standard + 10 Premium = 10 agents
```

## 3.2.4 WxCC to Webex Calling Integration

```
   WxCC - WEBEX CALLING INTEGRATION ARCHITECTURE
   PSTN / TOLL-FREE
   1800-266-1000 (India TF)
   +91-22-4961-1000 (Mumbai)
   +44-20-XXXX-XXXX (London)
   +1-201-XXX-XXXX (NJ)
   PSTN Routing
   (LGW India / CCPP EMEA-US)
   
   WEBEX CALLING
   (PSTN Termination)
   Internal Routing
   (DN to Entry Point Mapping)
   
   WEBEX CONTACT CENTER
   ENTRY POINT
   Sales_Voice_EP
   Support_Voice_EP
   
   FLOW DESIGNER
   (IVR Processing)
   
   QUEUES
   (Skills-Based)
   
   AGENT DESKTOP
   (WebRTC/Webex App)
   INTEGRATION METHOD: Native (Webex Calling to WxCC built-in)
   TELEPHONY OPTION:   Webex Calling (Phase 1 migrated users)
   AGENT ENDPOINT:   Webex App (softphone) or Desk Phone
```

---

