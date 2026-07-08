# Chapter 10: Advanced AI Integration & Implementation -- 10.6 NLU Design & Intent Development

## 10.6 NLU Design & Intent Development

## 10.6.1 Intent Architecture for Abhavtech

Abhavtech's Dialogflow CX agent implements 10 complex intents designed to handle multi-turn conversations requiring API integration.

### Intent Inventory

```
+-----------------------------------------------------------------------------+
|                    DIALOGFLOW CX INTENT INVENTORY                           |
+-----------------------------------------------------------------------------+
|                                                                             |
|  COMPLEX INTENTS (10) - Handled by Dialogflow CX:                          |
|  =======================================================================   |
|                                                                             |
|  | #  | Intent Name           | Category  | Complexity | API Required |    |
|  |----|-----------------------|-----------|------------|--------------|    |
|  | 1  | order.status          | Order     | Medium     | Yes          |    |
|  | 2  | order.track           | Order     | Medium     | Yes          |    |
|  | 3  | product.inquiry       | Product   | Medium     | Yes          |    |
|  | 4  | product.pricing       | Product   | Medium     | Yes          |    |
|  | 5  | account.balance       | Account   | High       | Yes (secure) |    |
|  | 6  | account.info          | Account   | High       | Yes (secure) |    |
|  | 7  | support.general       | Support   | Low        | No           |    |
|  | 8  | support.troubleshoot  | Support   | High       | Yes          |    |
|  | 9  | billing.inquiry       | Billing   | High       | Yes (secure) |    |
|  | 10 | agent.handoff         | Transfer  | Low        | No           |    |
|                                                                             |
|  SYSTEM INTENTS (Auto-created):                                            |
|  =======================================================================   |
|                                                                             |
|  | Intent Name                    | Purpose                            |   |
|  |--------------------------------|------------------------------------|   |
|  | Default Welcome Intent         | Initial greeting                   |   |
|  | Default Negative Intent        | "No" responses                     |   |
|  | Default Fallback Intent        | Unrecognized input                 |   |
|                                                                             |
|  SHARED INTENTS (Used across flows):                                       |
|  =======================================================================   |
|                                                                             |
|  | Intent Name                    | Purpose                            |   |
|  |--------------------------------|------------------------------------|   |
|  | confirmation.yes               | Positive confirmation              |   |
|  | confirmation.no                | Negative confirmation              |   |
|  | navigation.back                | Return to previous                 |   |
|  | navigation.main_menu           | Return to main menu                |   |
|  | smalltalk.thanks               | Gratitude expressions              |   |
|  | smalltalk.goodbye              | Farewell expressions               |   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.6.2 Intent Specifications

### Intent: order.status

```
+-----------------------------------------------------------------------------+
|                    INTENT SPECIFICATION: order.status                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  INTENT DETAILS:                                                           |
|  =======================================================================   |
|                                                                             |
|  Display Name:        order.status                                         |
|  Description:         Customer checking order status                       |
|  Priority:            Normal                                               |
|  ML Enabled:          Yes                                                  |
|                                                                             |
|  TRAINING PHRASES - ENGLISH (20):                                          |
|  =======================================================================   |
|                                                                             |
|  Basic queries:                                                            |
|  1.  What is my order status                                               |
|  2.  Check my order                                                        |
|  3.  Where is my order                                                     |
|  4.  Order status                                                          |
|  5.  Track my order                                                        |
|                                                                             |
|  Detailed queries:                                                         |
|  6.  I want to check my order                                              |
|  7.  What happened to my order                                             |
|  8.  Has my order shipped                                                  |
|  9.  When will my order arrive                                             |
|  10. I placed an order and want to know the status                         |
|                                                                             |
|  With order number (annotate @order_number):                               |
|  11. Check order [ORD-12345]                                               |
|  12. Status of order number [12345]                                        |
|  13. Where is order [ORD-67890]                                            |
|  14. What's the status of [ORD-11111]                                      |
|  15. Order [12345] status                                                  |
|                                                                             |
|  Variations:                                                               |
|  16. My order hasn't arrived                                               |
|  17. Order inquiry                                                         |
|  18. I need to track a package                                             |
|  19. Did my order ship yet                                                 |
|  20. Is my order on the way                                                |
|                                                                             |
|  TRAINING PHRASES - HINDI (10):                                            |
|  =======================================================================   |
|                                                                             |
|  1.  मेरे ऑर्डर का स्टेटस क्या है                                               |
|  2.  मेरा ऑर्डर कहाँ है                                                        |
|  3.  ऑर्डर स्टेटस चेक करो                                                      |
|  4.  मेरा ऑर्डर ट्रैक करो                                                      |
|  5.  ऑर्डर कब आएगा                                                            |
|  6.  मेरा पार्सल कहाँ है                                                       |
|  7.  ऑर्डर नंबर [बारह तीन चार पाँच] का स्टेटस                                   |
|  8.  शिपमेंट का स्टेटस                                                         |
|  9.  डिलीवरी कब होगी                                                          |
|  10. ऑर्डर अभी तक नहीं आया                                                    |
|                                                                             |
|  PARAMETERS:                                                               |
|  =======================================================================   |
|                                                                             |
|  | Parameter        | Entity Type     | Required | Prompt if Missing    |  |
|  |------------------|-----------------|----------|----------------------|  |
|  | order_number     | @order_number   | Yes      | "What is your order  |  |
|  |                  |                 |          |  number?"            |  |
|                                                                             |
|  FULFILLMENT:                                                              |
|  =======================================================================   |
|                                                                             |
|  Webhook:           abhavtech-fulfillment                                  |
|  Tag:               order_lookup                                           |
|  Timeout:           10 seconds                                             |
|  Partial Response:  "Let me look that up for you..."                       |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Intent: support.troubleshoot

```
+-----------------------------------------------------------------------------+
|                    INTENT SPECIFICATION: support.troubleshoot               |
+-----------------------------------------------------------------------------+
|                                                                             |
|  INTENT DETAILS:                                                           |
|  =======================================================================   |
|                                                                             |
|  Display Name:        support.troubleshoot                                 |
|  Description:         Technical troubleshooting requests                   |
|  Priority:            High (complex multi-turn)                            |
|  ML Enabled:          Yes                                                  |
|                                                                             |
|  TRAINING PHRASES - ENGLISH (25):                                          |
|  =======================================================================   |
|                                                                             |
|  General troubleshooting:                                                  |
|  1.  I need help with a problem                                            |
|  2.  Something isn't working                                               |
|  3.  I'm having issues with my product                                     |
|  4.  Technical support please                                              |
|  5.  Help me troubleshoot                                                  |
|                                                                             |
|  Product-specific (annotate @product_name):                                |
|  6.  [Product A] is not working                                            |
|  7.  My [Product B] has a problem                                          |
|  8.  Issues with [Product C]                                               |
|  9.  [Product A] won't turn on                                             |
|  10. Having trouble with my [Product B]                                    |
|                                                                             |
|  Specific issues (annotate @issue_type):                                   |
|  11. It's showing an [error message]                                       |
|  12. I'm getting a [connection error]                                      |
|  13. The [screen is frozen]                                                |
|  14. [Battery not charging]                                                |
|  15. [App keeps crashing]                                                  |
|                                                                             |
|  Urgency indicators:                                                       |
|  16. It stopped working suddenly                                           |
|  17. This is urgent, I need it fixed now                                   |
|  18. I've tried everything and it still doesn't work                       |
|  19. This has been broken for days                                         |
|  20. I'm very frustrated with this issue                                   |
|                                                                             |
|  Previous attempts:                                                        |
|  21. I already tried restarting                                            |
|  22. Reboot didn't help                                                    |
|  23. I followed the manual but still not working                           |
|  24. Already reinstalled but same problem                                  |
|  25. Tech support told me to call back                                     |
|                                                                             |
|  TRAINING PHRASES - HINDI (10):                                            |
|  =======================================================================   |
|                                                                             |
|  1.  मुझे एक समस्या में मदद चाहिए                                              |
|  2.  कुछ काम नहीं कर रहा                                                      |
|  3.  मेरे प्रोडक्ट में दिक्कत है                                                |
|  4.  टेक्निकल सपोर्ट चाहिए                                                    |
|  5.  [प्रोडक्ट ए] काम नहीं कर रहा                                              |
|  6.  एरर मैसेज आ रहा है                                                       |
|  7.  यह अचानक बंद हो गया                                                      |
|  8.  मैंने रीस्टार्ट किया लेकिन ठीक नहीं हुआ                                     |
|  9.  बहुत परेशान हूँ इस प्रॉब्लम से                                            |
|  10. कृपया मेरी मदद करें                                                       |
|                                                                             |
|  PARAMETERS:                                                               |
|  =======================================================================   |
|                                                                             |
|  | Parameter        | Entity Type     | Required | Prompt if Missing    |  |
|  |------------------|-----------------|----------|----------------------|  |
|  | product_name     | @product_name   | Yes      | "Which product are   |  |
|  |                  |                 |          |  you having issues   |  |
|  |                  |                 |          |  with?"              |  |
|  | issue_type       | @issue_type     | No       | (collected in flow)  |  |
|  | troubleshoot_step| @sys.number     | No       | (flow-managed)       |  |
|                                                                             |
|  NOTE: This intent triggers a multi-turn troubleshooting flow with         |
|  step-by-step diagnostic questions managed by page transitions.            |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.6.3 Entity Definitions

### Custom Entities for Abhavtech

```
+-----------------------------------------------------------------------------+
|                    CUSTOM ENTITY DEFINITIONS                                |
+-----------------------------------------------------------------------------+
|                                                                             |
|  ENTITY: @order_number                                                     |
|  =======================================================================   |
|                                                                             |
|  Type:              Regexp                                                 |
|  Pattern:           (ORD[-]?\d{5,10}|\d{5,10})                            |
|  Fuzzy Matching:    Enabled                                                |
|  Examples:          ORD-12345, ORD12345, 12345, 1234567890                 |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  ENTITY: @product_name                                                     |
|  =======================================================================   |
|                                                                             |
|  Type:              Map (with synonyms)                                    |
|                                                                             |
|  | Value           | Synonyms                                         |   |
|  |-----------------|------------------------------------------------|   |
|  | Product A       | product a, ProductA, prod a, first product     |   |
|  | Product B       | product b, ProductB, prod b, second product    |   |
|  | Product C       | product c, ProductC, prod c, third product     |   |
|  | Service X       | service x, ServiceX, srv x, main service       |   |
|  | Service Y       | service y, ServiceY, srv y, premium service    |   |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  ENTITY: @issue_type                                                       |
|  =======================================================================   |
|                                                                             |
|  Type:              Map (with synonyms)                                    |
|                                                                             |
|  | Value           | Synonyms                                         |   |
|  |-----------------|------------------------------------------------|   |
|  | not_working     | doesn't work, won't work, stopped working      |   |
|  | error_message   | error, showing error, error code               |   |
|  | connectivity    | can't connect, connection issue, network       |   |
|  | performance     | slow, freezing, lagging, hangs                 |   |
|  | display         | screen issue, display problem, blank screen    |   |
|  | battery         | battery, charging, power issue                 |   |
|  | login           | can't login, password, authentication          |   |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  ENTITY: @account_number                                                   |
|  =======================================================================   |
|                                                                             |
|  Type:              Regexp                                                 |
|  Pattern:           (ACC[-]?\d{6,10}|\d{6,10})                            |
|  Examples:          ACC-123456, ACC123456, 123456789                       |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  ENTITY: @region                                                           |
|  =======================================================================   |
|                                                                             |
|  Type:              Map                                                    |
|                                                                             |
|  | Value           | Synonyms                                         |   |
|  |-----------------|------------------------------------------------|   |
|  | India           | india, IN, indian, mumbai, delhi, bangalore    |   |
|  | EMEA            | europe, uk, london, germany, emea              |   |
|  | Americas        | usa, us, america, new jersey, americas         |   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---
