# Calling Search Space / Partition -- Outgoing Calling Plans

> **[!]️ GAP SEVERITY: CRITICAL | Affects: All 3,200 Users -- Dial Plan Access Control**

## 2A.3.1 Problem Statement

CUCM Calling Search Spaces (CSS) and Partitions provide fine-grained call access control. Different users, devices, and lines can have different CSSs determining which destinations they can call. Abhavtech's CUCM deployment contains multiple CSSs for internal/local/long-distance/international access tiers, as well as restricted CSSs for shared lobby phones and analog devices.

Webex Calling replaces this with **Outgoing Calling Plans**, applied at the Location or per-User level, controlling whether that user/location can make local, national, international, or premium-rate calls. This requires deliberate rationalization of all existing CSSs into Webex Calling permission tiers.

## 2A.3.2 CSS Rationalization -- Abhavtech Outgoing Calling Plan Mapping

| Abhavtech User Category | Webex Calling Plan | Permitted Call Types |
|---|---|---|
| Standard Employee (India) | National | Internal + Local PSTN + National (no intl default) |
| Manager / Senior Staff | International | Internal + Local + National + International |
| Contact Center Agent | National (queue-managed) | Internal + Local + National -- international via WxCC only |
| Lobby / Reception Phone | Local Only | Internal + Local PSTN only |
| Analog Device (Fax/Door) | Internal Only | Internal extension dialing only |
| EMEA Employee (UK/DE) | International | Internal + EU Local + International |
| Americas Employee (NJ/Dallas) | National (US) | Internal + US Local + National |
| WFH / Remote (India ITN) | National | Internal + National -- PSTN via ITN only |

## 2A.3.3 Forced Authorization Code (FAC) Replacement

CUCM Forced Authorization Codes require a PIN entry before placing long-distance or international calls. Webex Calling has **no native FAC equivalent**. The Abhavtech approach:

- Default all standard employee profiles to **National calling** -- international calling disabled by default
- International access requires a **ServiceNow request** approved by the user's manager -- Control Hub admin then updates the individual user's Outgoing Calling Plan
- Exception: Senior management and approved travel users receive a permanent International plan

This replaces the per-call FAC model with a per-user permission model manageable at scale through Control Hub bulk provisioning.

**Control Hub API -- set Outgoing Calling Plan per user:**

```json
PATCH /v1/people/{personId}/features/outgoingPermission
{
  "callingPermissions": [
    {"action": "ALLOW", "callType": "INTERNAL_CALL"},
    {"action": "ALLOW", "callType": "LOCAL"},
    {"action": "ALLOW", "callType": "NATIONAL"},
    {"action": "BLOCK", "callType": "INTERNATIONAL"}
  ]
}
```

---
