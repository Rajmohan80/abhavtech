# UCCX Custom Java Steps -- Flow Designer REST API Migration

> **[!]️ GAP SEVERITY: HIGH | Affects: 3 of 9 IVR Scripts Containing Custom Java**

## 3A.2.1 Problem Statement

UCCX scripts can embed custom Java-based steps that perform database lookups, complex business logic, or third-party API calls. Of Abhavtech's 9 UCCX scripts, **three contain custom Java steps**:

| Script | Java Step Function |
|---|---|
| `SalesQueue.aef` | VIP caller lookup from Salesforce (SOAP API) |
| `BillingQueue.aef` | Account balance check from billing DB (JDBC) |
| `TechSupport.aef` | Product registration lookup from internal DB (JDBC) |

Webex Contact Center Flow Designer has **no concept of embedded Java**. All external integrations must be implemented as **HTTP Request nodes** calling REST APIs. This requires the backend systems to expose RESTful endpoints -- a prerequisite that must be confirmed with the Salesforce and billing system teams before the WxCC migration.

## 3A.2.2 Replacement Architecture -- Per Script

### SalesQueue.aef -- VIP Caller Lookup

**UCCX approach:** Custom Java step calls Salesforce SOAP API with caller ANI, returns VIP flag, routes to priority queue.

**Webex CC approach:** HTTP Request node in Flow Designer calls Salesforce REST API (Salesforce Lightning Platform API v58+). Response variable maps VIP flag to Condition node for priority routing. Salesforce Connected App must be created to provide OAuth2 credentials for the HTTP Request.

```javascript
// WxCC Flow Designer HTTP Request node -- SalesQueue VIP Lookup
URL:    https://api.abhavtech.com/crm/vip-check
Method: POST
Body:   { "ani": "{{NewPhoneContact.ANI}}" }
// Response mapping:
//   $.vip_flag  ->  Flow variable: VIPCustomer (Boolean)
// Then: Condition node
//   VIPCustomer == true  ->  Route to Priority_Queue
//   VIPCustomer == false ->  Route to Standard_Queue
```

### BillingQueue.aef -- Account Balance Check

**UCCX approach:** Custom Java step queries Oracle billing database via JDBC.

**Webex CC approach:** An API gateway (Azure API Management or AWS API Gateway) must be deployed to expose a RESTful endpoint wrapping the Oracle billing DB query. The Flow Designer HTTP Request node calls this gateway.

> **Backend prerequisite:** 4-6 weeks of API development effort by the Abhavtech DevOps team prior to the WxCC cutover.

### TechSupport.aef -- Product Registration Lookup

**UCCX approach:** Custom Java step queries internal product registration database.

**Webex CC approach:** Same API gateway pattern as billing -- expose REST endpoint for product lookup, call from Flow Designer HTTP Request node.

## 3A.2.3 Pre-Migration Prerequisite

> **[!]️ CRITICAL DEPENDENCY**
>
> All three REST API endpoints (Salesforce VIP lookup, Billing balance, Product registration) must be **developed, tested, and live in production BEFORE** the UCCX to WxCC cutover is scheduled. This is a hard dependency on the Abhavtech DevOps and Salesforce teams.
>
> **Estimated effort:** 6-8 weeks
> **Action:** Must begin immediately upon Phase 2 project kickoff

---
