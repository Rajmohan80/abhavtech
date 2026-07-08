# 8.6 SD-WAN Day-N Automation

Day-N configuration changes for SD-WAN devices.

## Template Attachment

```yaml
---
- name: Attach SD-WAN Device Template
  hosts: localhost
  tasks:
    - name: Attach template to cEdge
      uri:
        url: "https://{{ vmanage_ip }}/dataservice/template/device/config/attachfeature"
        method: POST
        headers:
          X-XSRF-TOKEN: "{{ vmanage_token }}"
        body_format: json
        body:
          deviceTemplateList:
            - templateId: "template-id-here"
              device:
                - deviceId: "device-uuid"
                  deviceIP: "10.1.1.1"
```

---

**Related Sections**:
- [6.4 SD-WAN vManage Provisioning](../chapter6-terraform/sdwan.md)
- [8.7 Webex Day-N Automation](webex-dayn.md)
