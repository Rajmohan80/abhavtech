# Chapter 10: Advanced AI Integration & Implementation -- 10.8 Webhook & Fulfillment Integration

## 10.8 Webhook & Fulfillment Integration

## 10.8.1 Webhook Architecture

Abhavtech's Dialogflow CX agent uses webhooks to integrate with backend systems for dynamic data retrieval.

### Webhook Specification

```
+-----------------------------------------------------------------------------+
|                    WEBHOOK ARCHITECTURE                                     |
+-----------------------------------------------------------------------------+
|                                                                             |
|  WEBHOOK CONFIGURATION:                                                    |
|  =======================================================================   |
|                                                                             |
|  Name:                abhavtech-fulfillment                                |
|  Base URL:            https://api.abhavtech.com/dialogflow/webhook         |
|  (OR Cloud Function): https://asia-south1-abhavtech-wxcc-ai.               |
|                       cloudfunctions.net/dialogflow-webhook                |
|  Timeout:             10 seconds                                           |
|  Authentication:      API Key (X-API-Key header)                           |
|                                                                             |
|  SUBRESOURCES (Tags):                                                      |
|  =======================================================================   |
|                                                                             |
|  | Tag               | URL Suffix    | Purpose                        |   |
|  |-------------------|---------------|--------------------------------|   |
|  | order_lookup      | /orders       | Order status, tracking         |   |
|  | account_lookup    | /accounts     | Account info, balance          |   |
|  | billing_lookup    | /billing      | Billing inquiries              |   |
|  | product_lookup    | /products     | Product info, pricing          |   |
|  | troubleshoot      | /support      | KB article lookup              |   |
|                                                                             |
|  REQUEST/RESPONSE FLOW:                                                    |
|  =======================================================================   |
|                                                                             |
|  +--------------+    +--------------+    +--------------------------+     |
|  | Dialogflow   |--->| Webhook      |--->| Abhavtech Backend       |     |
|  | CX Agent     |    | (Cloud Func) |    | Systems                 |     |
|  |              |<---|              |<---| * Order Management      |     |
|  |              |    |              |    | * Account Database      |     |
|  +--------------+    +--------------+    | * Billing System        |     |
|                                          | * Product Catalog       |     |
|                                          +--------------------------+     |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.8.2 Webhook Request/Response Format

### Request Format (from Dialogflow CX)

```json
{
  "detectIntentResponseId": "uuid",
  "intentInfo": {
    "lastMatchedIntent": "projects/.../intents/order.status",
    "displayName": "order.status",
    "confidence": 0.95
  },
  "pageInfo": {
    "currentPage": "projects/.../pages/Order Lookup",
    "displayName": "Order Lookup"
  },
  "sessionInfo": {
    "session": "projects/.../sessions/session-id",
    "parameters": {
      "order_number": "ORD-12345"
    }
  },
  "fulfillmentInfo": {
    "tag": "order_lookup"
  },
  "languageCode": "en"
}
```

### Response Format (to Dialogflow CX)

```json
{
  "fulfillmentResponse": {
    "messages": [
      {
        "text": {
          "text": [
            "Your order ORD-12345 has shipped via FedEx and should arrive by January 17th."
          ]
        }
      }
    ]
  },
  "sessionInfo": {
    "parameters": {
      "order_status": "shipped",
      "carrier": "FedEx",
      "tracking_number": "FX123456789",
      "eta": "January 17, 2026",
      "webhook_status": "found"
    }
  }
}
```

## 10.8.3 Python Webhook Implementation

A complete Python webhook reference implementation is planned as a future appendix; key implementation highlights are summarized below:

```python
# Webhook endpoint structure (Python/Flask)
# Full reference implementation: planned future appendix

from flask import Flask, request, jsonify
import os

app = Flask(__name__)

@app.route('/dialogflow/webhook', methods=['POST'])
def webhook():
    req = request.get_json()
    tag = req.get('fulfillmentInfo', {}).get('tag', '')
    
    if tag == 'order_lookup':
        return handle_order_lookup(req)
    elif tag == 'account_lookup':
        return handle_account_lookup(req)
    elif tag == 'billing_lookup':
        return handle_billing_lookup(req)
    else:
        return handle_default(req)

def handle_order_lookup(req):
    """Handle order status lookup"""
    params = req.get('sessionInfo', {}).get('parameters', {})
    order_number = params.get('order_number')
    
    # Call Abhavtech Order Management API
    order_data = order_management_api.get_order(order_number)
    
    if order_data:
        response_text = f"Your order {order_number} is {order_data['status']}. "
        if order_data['status'] == 'shipped':
            response_text += f"It shipped via {order_data['carrier']} "
            response_text += f"and should arrive by {order_data['eta']}."
        
        return jsonify({
            "fulfillmentResponse": {
                "messages": [{"text": {"text": [response_text]}}]
            },
            "sessionInfo": {
                "parameters": {
                    "webhook_status": "found",
                    "order_status": order_data['status'],
                    "carrier": order_data.get('carrier'),
                    "eta": order_data.get('eta')
                }
            }
        })
    else:
        return jsonify({
            "fulfillmentResponse": {
                "messages": [{"text": {"text": [
                    f"I couldn't find order {order_number}. "
                    "Please check the number and try again."
                ]}}]
            },
            "sessionInfo": {
                "parameters": {"webhook_status": "not_found"}
            }
        })
```

---
