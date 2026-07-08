# Outbound Dialing -- TRAI DNC Compliance

> **[!]️ GAP SEVERITY: MEDIUM | Affects: Sales and Collections Teams**

## 3A.4.1 Problem Statement

If Abhavtech uses the UCCX Outbound module for predictive or progressive dialing campaigns, the equivalent in Webex Contact Center is the **Outbound Campaign** feature -- a licensed add-on requiring the Webex Contact Center Outbound Campaign SKU. Campaign configuration, list management, and compliance settings are managed through Control Hub and the WxCC Campaign Manager portal.

## 3A.4.2 India TRAI Compliance for Outbound

India TRAI regulations require outbound commercial communications to check the **National Do Not Call (DNC) registry** before dialing. WxCC Outbound Campaign supports DNC list integration via the Campaign Manager portal.

**Abhavtech TRAI DNC compliance steps:**
1. Obtain TRAI-registered DNC scrubbing API credentials from an approved service provider
2. Configure DNC scrub in Campaign Manager: **Settings > Compliance > DNC Integration**
3. Test campaign with a 10-record list -- verify DNC numbers are excluded before dialing
4. Load first production campaign **only after** DNC test passes and legal sign-off received

> **License Requirement:** WxCC Outbound Campaign requires a separate license (Webex Contact Center Outbound SKU). Confirm with the Cisco account team whether this SKU is included in the Abhavtech WxCC agreement. If outbound dialing is not currently used in UCCX, this section is not applicable.

---
