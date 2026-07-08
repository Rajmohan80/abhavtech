# Chapter 3: Webex Contact Center Design (Phase 2) -- 3.8 Digital Channel Design

## 3.8 Digital Channel Design

## 3.8.1 Digital Channel Strategy

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH DIGITAL CHANNEL DESIGN                                |
+-----------------------------------------------------------------------------+
|                                                                             |
|  CHANNEL          | CURRENT (UCCX) | TARGET (WXCC)  | TIMELINE             |
|  ========================================================================= |
|  Web Chat         | Basic          | Enhanced       | Phase 2 (immediate)  |
|  Email            | Manual inbox   | Integrated     | Phase 2 (immediate)  |
|  WhatsApp         | Not available  | WhatsApp Biz   | Phase 2 (Month 2)    |
|  Facebook         | Not available  | Messenger      | Phase 3 (optional)   |
|  SMS              | Not available  | Via CCPP       | Phase 3 (optional)   |
|  ========================================================================= |
|                                                                             |
|  DIGITAL AGENT CAPACITY:                                                   |
|  =======================                                                   |
|  Current Digital Agents:     25                                            |
|  Post-Migration Target:      50 (add 25 in Phase 3)                        |
|                                                                             |
|  CONCURRENCY LIMITS:                                                       |
|  Channel          | Concurrent Per Agent                                   |
|  Chat             | 3                                                      |
|  WhatsApp         | 3 (shared with Chat limit)                             |
|  Email            | 5                                                      |
|  Voice            | 1                                                      |
|                                                                             |
|  BLENDED AGENT MODEL:                                                      |
|  Digital agents can receive voice overflow during peak times.              |
|  Voice agents do NOT receive digital channels.                             |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.8.2 Web Chat Configuration

```
+-----------------------------------------------------------------------------+
|              WEB CHAT WIDGET CONFIGURATION                                   |
+-----------------------------------------------------------------------------+
|                                                                             |
|  WIDGET DEPLOYMENT:                                                        |
|  ==================                                                        |
|  Widget Type:         Webex Connect Chat Widget                            |
|  Deployment:          JavaScript embed on www.abhavtech.com                |
|  Pages:               Support, Contact Us, Product pages                   |
|                                                                             |
|  WIDGET CODE SNIPPET:                                                      |
|  ====================                                                      |
|  <script>                                                                  |
|    !function(e,t){                                                         |
|      var n=document.createElement("script");                               |
|      n.type="text/javascript",                                             |
|      n.async=!0,                                                           |
|      n.src="https://chat.abhavtech.com/widget.js",                        |
|      n.onload=function(){                                                  |
|        WebexCCWidget.init({                                                |
|          orgId: "{{ABHAVTECH_ORG_ID}}",                                    |
|          entryPointId: "{{DIGITAL_CHAT_EP_ID}}",                          |
|          theme: {                                                          |
|            primaryColor: "#0066CC",                                        |
|            headerText: "Chat with Abhavtech",                              |
|            logo: "https://abhavtech.com/logo.png"                         |
|          },                                                                |
|          features: {                                                       |
|            fileUpload: true,                                               |
|            emoji: true,                                                    |
|            typing: true                                                    |
|          }                                                                 |
|        });                                                                 |
|      };                                                                    |
|      e.getElementsByTagName("head")[0].appendChild(n)                      |
|    }(document);                                                            |
|  </script>                                                                 |
|                                                                             |
|  PRE-CHAT FORM:                                                            |
|  ==============                                                            |
|  Required Fields:                                                          |
|    - Name (text)                                                           |
|    - Email (email, validated)                                              |
|    - Topic (dropdown: Sales, Support, Billing, Other)                      |
|  Optional Fields:                                                          |
|    - Order Number (if Support selected)                                    |
|    - Phone (for callback)                                                  |
|                                                                             |
|  BUSINESS HOURS BEHAVIOR:                                                  |
|  ========================                                                  |
|  During Hours:       Chat widget active, route to Digital_Chat_Queue       |
|  After Hours:        Show message: "Our team is offline. Please email      |
|                      support@abhavtech.com or call back during business    |
|                      hours."                                               |
|  Alternative:        Enable Virtual Agent "Abhi" 24x7 for basic queries    |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.8.3 WhatsApp Business Integration

```
+-----------------------------------------------------------------------------+
|              WHATSAPP BUSINESS INTEGRATION DESIGN                            |
+-----------------------------------------------------------------------------+
|                                                                             |
|  INTEGRATION METHOD:    Webex Connect (IMI) WhatsApp Connector             |
|  WHATSAPP NUMBER:       +91-22-XXXX-XXXX (dedicated business number)       |
|  BUSINESS ACCOUNT:      Verified Abhavtech Business Account                |
|                                                                             |
|  MESSAGE TYPES SUPPORTED:                                                  |
|  =======================                                                   |
|  [OK] Text messages                                                           |
|  [OK] Image attachments (customer sends)                                      |
|  [OK] Document attachments (PDF, invoice)                                     |
|  [OK] Location sharing                                                        |
|  [OK] Quick reply buttons                                                     |
|  [OK] List messages (menu selection)                                          |
|  [OK] Template messages (proactive notifications)                             |
|                                                                             |
|  TEMPLATE MESSAGES (Pre-approved):                                         |
|  ==================================                                        |
|  1. Order Confirmation:                                                    |
|     "Hi {{customer_name}}, your order #{{order_id}} has been confirmed.   |
|     Expected delivery: {{delivery_date}}. Track: {{tracking_link}}"       |
|                                                                             |
|  2. Shipping Update:                                                       |
|     "Your order #{{order_id}} has shipped! Track your package:            |
|     {{tracking_link}}"                                                     |
|                                                                             |
|  3. Appointment Reminder:                                                  |
|     "Reminder: Your appointment with Abhavtech is scheduled for           |
|     {{date}} at {{time}}. Reply YES to confirm or NO to reschedule."      |
|                                                                             |
|  4. Survey Request:                                                        |
|     "How was your experience with Abhavtech? Rate us 1-5:                 |
|     1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣"                                                      |
|                                                                             |
|  ROUTING FLOW:                                                             |
|  =============                                                             |
|  1. Customer sends WhatsApp message                                        |
|  2. Webex Connect receives message                                         |
|  3. Virtual Agent "Abhi" attempts to handle (if enabled)                   |
|  4. If handoff needed -> Route to Digital_Chat_Queue                        |
|  5. Agent receives in unified Agent Desktop                                |
|  6. Agent responds (appears as WhatsApp message to customer)               |
|                                                                             |
|  24-HOUR SESSION WINDOW:                                                   |
|  =======================                                                   |
|  [!]️ WhatsApp limits business-initiated messages outside 24-hour window.   |
|  After 24 hours of customer inactivity, only Template messages allowed.   |
|  Solution: Send proactive Template if follow-up needed after 24 hours.    |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---
