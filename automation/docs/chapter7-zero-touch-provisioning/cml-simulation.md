# 7.4 Simulating ZTP in CML

Test ZTP workflow in CML lab before production deployment.

## CML DHCP Server

```
subnet 10.252.100.0 netmask 255.255.255.0 {
  range 10.252.100.50 10.252.100.100;
  option routers 10.252.100.1;
  option domain-name-servers 10.252.100.1;
  option tftp-server-name "10.252.100.10";
  option bootfile-name "ztp/bootstrap.py";
}
```

## Validation

```bash
# Verify device registered with DNAC
curl -X GET "https://10.252.10.11/dna/intent/api/v1/network-device" \
  -H "X-Auth-Token: ${DNAC_TOKEN}" | jq '.response[] | {hostname, serialNumber, managementIpAddress}'
```

---

**Related Sections**:
- [6.1 CML Lab Provisioning](../chapter6-terraform/cml-lab.md)
- [Chapter 10: Validation & Testing](../chapter10-validation-testing/README.md)
