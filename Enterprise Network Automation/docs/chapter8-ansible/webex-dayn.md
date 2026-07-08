# 8.7 Webex Day-N Automation

Day-N automation for Webex platform.

## User Provisioning

```yaml
---
- name: Provision Webex Users
  hosts: localhost
  tasks:
    - name: Create Webex user
      uri:
        url: "https://webexapis.com/v1/people"
        method: POST
        headers:
          Authorization: "Bearer {{ webex_token }}"
        body_format: json
        body:
          emails: ["user@abhavtech.com"]
          displayName: "John Doe"
          firstName: "John"
          lastName: "Doe"
          licenses: ["webex-calling-professional"]
```

---

**Related Sections**:
- [6.5 Webex Provisioning](../chapter6-terraform/webex.md)
- [Chapter 9: Cloud Integrations](../chapter9-cloud-integrations/README.md)
