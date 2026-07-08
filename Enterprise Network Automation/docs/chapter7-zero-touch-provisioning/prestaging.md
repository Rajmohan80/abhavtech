# 7.2 Pre-Staging Requirements

Pre-stage devices and network infrastructure for successful ZTP.

## Pre-Requisites Checklist

- [ ] DHCP scope configured with option 67
- [ ] TFTP/HTTP server reachable from management subnet
- [ ] Bootstrap script uploaded to server
- [ ] DNAC reachable from management subnet
- [ ] Device serial number added to DNAC inventory

## DNAC Device Pre-Staging

```bash
# Add device to DNAC inventory via API
curl -X POST "https://10.252.10.11/dna/intent/api/v1/onboarding/pnp-device" \
  -H "X-Auth-Token: ${DNAC_TOKEN}" \
  -d '{
    "deviceInfo": {
      "serialNumber": "FCW2304XXXX",
      "hostname": "fabric-edge-01",
      "siteId": "global/north-america/hq"
    }
  }'
```

---

**Related Sections**:
- [7.1 How ZTP Works](ztp-flow.md)
- [7.3 ZTP Flow Per Device Type](device-types.md)
