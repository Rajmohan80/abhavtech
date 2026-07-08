# Chapter 10: Advanced AI Integration & Implementation -- 10.7 Conversational Flow Design

## 10.7 Conversational Flow Design

## 10.7.1 Flow Architecture

Abhavtech's Dialogflow CX agent uses a modular flow architecture where each major conversation domain has its own flow.

### Flow Inventory

```
+-----------------------------------------------------------------------------+
|                    DIALOGFLOW CX FLOW ARCHITECTURE                          |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                     DEFAULT START FLOW                              |   |
|  |                     (Entry point for all conversations)             |   |
|  |                                                                     |   |
|  |  +---------+    +--------------+    +-------------------------+   |   |
|  |  |  START  |--->|   Welcome    |--->|   Intent Detection      |   |   |
|  |  |  Page   |    |   Page       |    |   & Routing             |   |   |
|  |  +---------+    +--------------+    +-----------+-------------+   |   |
|  |                                                 |                 |   |
|  |                 +-------------------------------+-----------------+   |
|  |                 |               |               |               | |   |
|  |                 v               v               v               v |   |
|  |          +----------+   +----------+   +----------+   +--------+ |   |
|  |          |  Order   |   | Account  |   | Support  |   | Billing| |   |
|  |          |  Flow    |   | Flow     |   | Flow     |   | Flow   | |   |
|  |          +----------+   +----------+   +----------+   +--------+ |   |
|  |                                                                   |   |
|  +-------------------------------------------------------------------+   |
|                                                                             |
|  FLOW INVENTORY:                                                           |
|  =======================================================================   |
|                                                                             |
|  | Flow Name              | Pages | Purpose                         |     |
|  |------------------------|-------|---------------------------------|     |
|  | Default Start Flow     | 3     | Entry, welcome, routing         |     |
|  | Order Flow             | 5     | Order status, tracking          |     |
|  | Account Flow           | 4     | Account info, balance           |     |
|  | Support Flow           | 6     | Troubleshooting, general help   |     |
|  | Billing Flow           | 4     | Billing inquiries               |     |
|  | Product Flow           | 3     | Product info, pricing           |     |
|  | Escalation Flow        | 2     | Agent handoff                   |     |
|  | -----------------------------------------------------------------|     |
|  | TOTAL                  | 27    |                                 |     |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.7.2 Order Flow Design

```
+-----------------------------------------------------------------------------+
|                    ORDER FLOW - DETAILED DESIGN                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                         ORDER FLOW                                  |   |
|  |                                                                     |   |
|  |   +-------------------------------------------------------------+   |   |
|  |   |                    PAGE: Start                              |   |   |
|  |   |  Entry: "I can help you with your order."                   |   |   |
|  |   |                                                             |   |   |
|  |   |  Routes:                                                    |   |   |
|  |   |  * order.status -> Collect Order Number page                 |   |   |
|  |   |  * order.track  -> Collect Order Number page                 |   |   |
|  |   +--------------------------+----------------------------------+   |   |
|  |                              |                                      |   |
|  |                              v                                      |   |
|  |   +-------------------------------------------------------------+   |   |
|  |   |              PAGE: Collect Order Number                     |   |   |
|  |   |  Entry: "What is your order number? It starts with ORD     |   |   |
|  |   |          followed by numbers."                              |   |   |
|  |   |                                                             |   |   |
|  |   |  Parameter: $session.params.order_number                    |   |   |
|  |   |  Entity:    @order_number                                   |   |   |
|  |   |  Required:  Yes                                             |   |   |
|  |   |                                                             |   |   |
|  |   |  Reprompt (no-match):                                       |   |   |
|  |   |  "I didn't catch that. Please say your order number,       |   |   |
|  |   |   like ORD-12345, or press the digits on your keypad."     |   |   |
|  |   |                                                             |   |   |
|  |   |  Routes:                                                    |   |   |
|  |   |  * $page.params.order_number (filled) -> Lookup page         |   |   |
|  |   |  * no-match (3x) -> Escalation Flow                          |   |   |
|  |   +--------------------------+----------------------------------+   |   |
|  |                              |                                      |   |
|  |                              v                                      |   |
|  |   +-------------------------------------------------------------+   |   |
|  |   |              PAGE: Order Lookup                             |   |   |
|  |   |  Entry Fulfillment:                                         |   |   |
|  |   |  * Webhook: abhavtech-fulfillment                          |   |   |
|  |   |  * Tag: order_lookup                                        |   |   |
|  |   |  * Partial: "Let me look that up..."                       |   |   |
|  |   |                                                             |   |   |
|  |   |  Routes (based on webhook response):                        |   |   |
|  |   |  * $webhook.status = "found" -> Order Status page            |   |   |
|  |   |  * $webhook.status = "not_found" -> Order Not Found page     |   |   |
|  |   |  * webhook.error -> Escalation Flow                          |   |   |
|  |   +--------------------------+----------------------------------+   |   |
|  |                              |                                      |   |
|  |              +---------------+---------------+                      |   |
|  |              |                               |                      |   |
|  |              v                               v                      |   |
|  |   +-----------------------+      +-----------------------+         |   |
|  |   | PAGE: Order Status    |      | PAGE: Order Not Found |         |   |
|  |   |                       |      |                       |         |   |
|  |   | Entry:                |      | Entry:                |         |   |
|  |   | "Your order           |      | "I couldn't find an   |         |   |
|  |   |  $webhook.order_num   |      |  order with that      |         |   |
|  |   |  is $webhook.status.  |      |  number. Would you    |         |   |
|  |   |  It shipped via       |      |  like to try again    |         |   |
|  |   |  $webhook.carrier     |      |  or speak to an       |         |   |
|  |   |  and should arrive    |      |  agent?"              |         |   |
|  |   |  $webhook.eta."       |      |                       |         |   |
|  |   |                       |      | Routes:               |         |   |
|  |   | Routes:               |      | * "try again" ->       |         |   |
|  |   | * "track" ->           |      |   Collect Order #     |         |   |
|  |   |   Tracking Details    |      | * "agent" ->           |         |   |
|  |   | * "anything else" ->   |      |   Escalation Flow     |         |   |
|  |   |   End Session         |      |                       |         |   |
|  |   | * "agent" ->           |      +-----------------------+         |   |
|  |   |   Escalation Flow     |                                        |   |
|  |   +-----------------------+                                        |   |
|  |                                                                     |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.7.3 Troubleshooting Flow Design

```
+-----------------------------------------------------------------------------+
|                    SUPPORT FLOW - TROUBLESHOOTING PATH                      |
+-----------------------------------------------------------------------------+
|                                                                             |
|  This flow implements a guided diagnostic conversation for technical        |
|  issues, demonstrating multi-turn capability.                               |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                       SUPPORT FLOW                                  |   |
|  |                                                                     |   |
|  |  +-------------+                                                   |   |
|  |  |    Start    |                                                   |   |
|  |  |             | support.troubleshoot                              |   |
|  |  +------+------+                                                   |   |
|  |         |                                                           |   |
|  |         v                                                           |   |
|  |  +-------------------------------------------------------------+   |   |
|  |  |  PAGE: Collect Product                                      |   |   |
|  |  |  "Which product are you having issues with?"                |   |   |
|  |  |  Parameter: @product_name (required)                        |   |   |
|  |  +--------------------------+----------------------------------+   |   |
|  |                             | product collected                    |   |
|  |                             v                                      |   |
|  |  +-------------------------------------------------------------+   |   |
|  |  |  PAGE: Describe Issue                                       |   |   |
|  |  |  "Can you describe what's happening with your               |   |   |
|  |  |   $session.params.product_name?"                            |   |   |
|  |  |  Parameter: @issue_type (optional - extracted from speech)  |   |   |
|  |  +--------------------------+----------------------------------+   |   |
|  |                             |                                      |   |
|  |    +------------------------+------------------------+            |   |
|  |    |                        |                        |            |   |
|  |    v                        v                        v            |   |
|  |  [Connectivity]      [Not Working]            [Other Issue]      |   |
|  |    |                        |                        |            |   |
|  |    v                        v                        v            |   |
|  |  +-------------+    +-------------+          +-------------+    |   |
|  |  | PAGE:       |    | PAGE:       |          | PAGE:       |    |   |
|  |  | Check       |    | Power       |          | General     |    |   |
|  |  | Network     |    | Cycle       |          | Diagnostics |    |   |
|  |  |             |    |             |          |             |    |   |
|  |  | "First,     |    | "Let's try  |          | "Let me     |    |   |
|  |  |  check if   |    |  restarting |          |  gather     |    |   |
|  |  |  other      |    |  your       |          |  some       |    |   |
|  |  |  devices    |    |  device.    |          |  info..."   |    |   |
|  |  |  connect."  |    |  Turn it    |          |             |    |   |
|  |  |             |    |  off..."    |          +------+------+    |   |
|  |  +------+------+    +------+------+                 |           |   |
|  |         |                  |                        |           |   |
|  |         v                  v                        |           |   |
|  |  +-------------+    +-------------+                |           |   |
|  |  | PAGE:       |    | PAGE:       |                |           |   |
|  |  | Network     |    | Power       |                |           |   |
|  |  | Result      |    | Result      |                |           |   |
|  |  |             |    |             |                |           |   |
|  |  | "Did that   |    | "Is it      |                |           |   |
|  |  |  help?"     |    |  working    |                |           |   |
|  |  |             |    |  now?"      |                |           |   |
|  |  +------+------+    +------+------+                |           |   |
|  |         |                  |                        |           |   |
|  |    +----+----+        +----+----+                  |           |   |
|  |    |         |        |         |                  |           |   |
|  |   YES       NO       YES       NO                  |           |   |
|  |    |         |        |         |                  |           |   |
|  |    v         |        v         |                  |           |   |
|  | [Resolved]   |     [Resolved]   |                  |           |   |
|  |    |         |        |         |                  |           |   |
|  |    |         +--------+---------+------------------+           |   |
|  |    |                            |                               |   |
|  |    |                            v                               |   |
|  |    |                  +-----------------+                       |   |
|  |    |                  |  PAGE: Escalate |                       |   |
|  |    |                  |                 |                       |   |
|  |    |                  |  "I understand  |                       |   |
|  |    |                  |   this is       |                       |   |
|  |    |                  |   frustrating.  |                       |   |
|  |    |                  |   Let me        |                       |   |
|  |    |                  |   connect you   |                       |   |
|  |    |                  |   with a        |                       |   |
|  |    |                  |   specialist."  |                       |   |
|  |    |                  |                 |                       |   |
|  |    |                  |  -> Escalation   |                       |   |
|  |    |                  |    Flow         |                       |   |
|  |    |                  +-----------------+                       |   |
|  |    |                                                             |   |
|  |    v                                                             |   |
|  |  +-------------------------------------------------------------+ |   |
|  |  |  PAGE: Resolution                                           | |   |
|  |  |  "Great! I'm glad we could resolve that.                    | |   |
|  |  |   Is there anything else I can help you with?"              | |   |
|  |  |                                                             | |   |
|  |  |  Routes:                                                    | |   |
|  |  |  * "no" / smalltalk.goodbye -> End Session (contained)       | |   |
|  |  |  * Other -> Default Start Flow                               | |   |
|  |  +-------------------------------------------------------------+ |   |
|  |                                                                   |   |
|  +-------------------------------------------------------------------+   |
|                                                                             |
|  CONTEXT PASSED TO AGENT ON ESCALATION:                                    |
|  =======================================================================   |
|                                                                             |
|  * product_name: Which product customer has                                |
|  * issue_type: What kind of issue                                          |
|  * steps_attempted: List of troubleshooting steps tried                    |
|  * customer_responses: Results of each diagnostic                          |
|  * conversation_summary: AI-generated summary                              |
|  * sentiment_score: Customer frustration level                             |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---
