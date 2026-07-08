# 7.9 REST API and cURL Examples

## Document Information
| Item | Details |
|------|---------|
| Organization | Abhavtech.com |
| Version | 2.0 |
| Last Updated | December 2025 |

---

## 1. API Authentication

### 1.1 Catalyst Center Authentication

```bash
# Get authentication token
# Token is valid for 1 hour

DNAC_HOST="catalyst.abhavtech.com"
DNAC_USER="api-admin"
DNAC_PASS="<password>"

# Get token
TOKEN=$(curl -s -k -X POST \
  "https://${DNAC_HOST}/dna/system/api/v1/auth/token" \
  -H "Content-Type: application/json" \
  -u "${DNAC_USER}:${DNAC_PASS}" | jq -r '.Token')

echo "Token: ${TOKEN}"

# Use token in subsequent requests
curl -s -k -X GET \
  "https://${DNAC_HOST}/dna/intent/api/v1/network-device" \
  -H "X-Auth-Token: ${TOKEN}" \
  -H "Content-Type: application/json" | jq '.'
```

### 1.2 ISE ERS API Authentication

```bash
# ISE uses Basic Authentication
# ERS API runs on port 9060

ISE_HOST="ise-pan.abhavtech.com"
ISE_USER="api-admin"
ISE_PASS="<password>"

# Test connection
curl -s -k -X GET \
  "https://${ISE_HOST}:9060/ers/config/endpoint" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -u "${ISE_USER}:${ISE_PASS}" | jq '.SearchResult.total'

# Create base64 encoded credentials for scripts
AUTH_HEADER=$(echo -n "${ISE_USER}:${ISE_PASS}" | base64)
echo "Authorization: Basic ${AUTH_HEADER}"
```

---

## 2. Catalyst Center API Examples

### 2.1 Get Network Devices

```bash
# Get all network devices
curl -s -k -X GET \
  "https://${DNAC_HOST}/dna/intent/api/v1/network-device" \
  -H "X-Auth-Token: ${TOKEN}" | jq '.response[] | {hostname, managementIpAddress, platformId, softwareVersion}'

# Get device by IP
DEVICE_IP="10.100.1.11"
curl -s -k -X GET \
  "https://${DNAC_HOST}/dna/intent/api/v1/network-device/ip-address/${DEVICE_IP}" \
  -H "X-Auth-Token: ${TOKEN}" | jq '.response'

# Get devices by family (Switches and Hubs)
curl -s -k -X GET \
  "https://${DNAC_HOST}/dna/intent/api/v1/network-device?family=Switches%20and%20Hubs" \
  -H "X-Auth-Token: ${TOKEN}" | jq '.response | length'

# Get device health
curl -s -k -X GET \
  "https://${DNAC_HOST}/dna/intent/api/v1/device-health" \
  -H "X-Auth-Token: ${TOKEN}" | jq '.response'
```

### 2.2 Site Management

```bash
# Get all sites
curl -s -k -X GET \
  "https://${DNAC_HOST}/dna/intent/api/v1/site" \
  -H "X-Auth-Token: ${TOKEN}" | jq '.response[] | {siteNameHierarchy, siteType}'

# Get specific site by name
SITE_NAME="Global/India/Mumbai"
curl -s -k -X GET \
  "https://${DNAC_HOST}/dna/intent/api/v1/site?name=${SITE_NAME}" \
  -H "X-Auth-Token: ${TOKEN}" | jq '.response'

# Get site health
curl -s -k -X GET \
  "https://${DNAC_HOST}/dna/intent/api/v1/site-health" \
  -H "X-Auth-Token: ${TOKEN}" | jq '.response[] | {siteName, networkHealthAverage, clientHealthWired, clientHealthWireless}'

# Create new site (building)
curl -s -k -X POST \
  "https://${DNAC_HOST}/dna/intent/api/v1/site" \
  -H "X-Auth-Token: ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "building",
    "site": {
      "building": {
        "name": "Building-C",
        "parentName": "Global/India/Mumbai",
        "address": "Building C, Abhavtech Campus, Mumbai 400001"
      }
    }
  }' | jq '.'
```

### 2.3 Fabric Management

```bash
# Get fabric sites
curl -s -k -X GET \
  "https://${DNAC_HOST}/dna/intent/api/v1/business/sda/fabric-site" \
  -H "X-Auth-Token: ${TOKEN}" | jq '.response'

# Get fabric devices in site
SITE_HIERARCHY="Global/India/Mumbai"
curl -s -k -X GET \
  "https://${DNAC_HOST}/dna/intent/api/v1/business/sda/device?siteNameHierarchy=${SITE_HIERARCHY}" \
  -H "X-Auth-Token: ${TOKEN}" | jq '.response'

# Add device to fabric as edge node
curl -s -k -X POST \
  "https://${DNAC_HOST}/dna/intent/api/v1/business/sda/device" \
  -H "X-Auth-Token: ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '[{
    "deviceManagementIpAddress": "10.100.1.50",
    "siteNameHierarchy": "Global/India/Mumbai",
    "deviceRole": "EDGE_NODE"
  }]' | jq '.'

# Get Virtual Networks
curl -s -k -X GET \
  "https://${DNAC_HOST}/dna/intent/api/v1/business/sda/virtual-network" \
  -H "X-Auth-Token: ${TOKEN}" | jq '.response[] | {virtualNetworkName, virtualNetworkContext}'
```

### 2.4 Command Runner

```bash
# Run show command on device
DEVICE_UUID="<device-uuid-from-inventory>"

curl -s -k -X POST \
  "https://${DNAC_HOST}/dna/intent/api/v1/network-device-poller/cli/read-request" \
  -H "X-Auth-Token: ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"commands\": [\"show version\", \"show ip interface brief\"],
    \"deviceUuids\": [\"${DEVICE_UUID}\"]
  }" | jq '.'

# Get task result (use taskId from previous response)
TASK_ID="<task-id>"
curl -s -k -X GET \
  "https://${DNAC_HOST}/dna/intent/api/v1/task/${TASK_ID}" \
  -H "X-Auth-Token: ${TOKEN}" | jq '.'

# Get file output (use fileId from task result)
FILE_ID="<file-id>"
curl -s -k -X GET \
  "https://${DNAC_HOST}/dna/intent/api/v1/file/${FILE_ID}" \
  -H "X-Auth-Token: ${TOKEN}" | jq '.'
```

### 2.5 Client Health and Assurance

```bash
# Get overall client health
curl -s -k -X GET \
  "https://${DNAC_HOST}/dna/intent/api/v1/client-health" \
  -H "X-Auth-Token: ${TOKEN}" | jq '.response'

# Get client details by MAC
CLIENT_MAC="AA:BB:CC:DD:EE:FF"
curl -s -k -X GET \
  "https://${DNAC_HOST}/dna/intent/api/v1/client-detail?macAddress=${CLIENT_MAC}" \
  -H "X-Auth-Token: ${TOKEN}" | jq '.detail'

# Get client enrichment (360 view)
curl -s -k -X GET \
  "https://${DNAC_HOST}/dna/intent/api/v1/client-enrichment-details" \
  -H "X-Auth-Token: ${TOKEN}" \
  -H "entity_type: mac_address" \
  -H "entity_value: ${CLIENT_MAC}" | jq '.'

# Get issue list
curl -s -k -X GET \
  "https://${DNAC_HOST}/dna/intent/api/v1/issues" \
  -H "X-Auth-Token: ${TOKEN}" | jq '.response[] | {name, issueId, priority, deviceRole}'
```

---

## 3. ISE ERS API Examples

### 3.1 Endpoint Operations

```bash
ISE_API="https://${ISE_HOST}:9060/ers/config"

# Get all endpoints (paginated)
curl -s -k -X GET \
  "${ISE_API}/endpoint?size=100&page=1" \
  -H "Accept: application/json" \
  -u "${ISE_USER}:${ISE_PASS}" | jq '.SearchResult'

# Get endpoint by MAC
MAC="AA:BB:CC:DD:EE:FF"
curl -s -k -X GET \
  "${ISE_API}/endpoint?filter=mac.EQ.${MAC}" \
  -H "Accept: application/json" \
  -u "${ISE_USER}:${ISE_PASS}" | jq '.'

# Create new endpoint
curl -s -k -X POST \
  "${ISE_API}/endpoint" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -u "${ISE_USER}:${ISE_PASS}" \
  -d '{
    "ERSEndPoint": {
      "mac": "11:22:33:44:55:66",
      "groupId": "<endpoint-group-id>",
      "staticGroupAssignment": true,
      "description": "Test Device - API Created"
    }
  }' | jq '.'

# Update endpoint (change group)
ENDPOINT_ID="<endpoint-id>"
curl -s -k -X PUT \
  "${ISE_API}/endpoint/${ENDPOINT_ID}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -u "${ISE_USER}:${ISE_PASS}" \
  -d '{
    "ERSEndPoint": {
      "id": "'${ENDPOINT_ID}'",
      "groupId": "<new-group-id>",
      "staticGroupAssignment": true
    }
  }' | jq '.'

# Delete endpoint
curl -s -k -X DELETE \
  "${ISE_API}/endpoint/${ENDPOINT_ID}" \
  -H "Accept: application/json" \
  -u "${ISE_USER}:${ISE_PASS}"
```

### 3.2 Security Group Tag (SGT) Operations

```bash
# Get all SGTs
curl -s -k -X GET \
  "${ISE_API}/sgt" \
  -H "Accept: application/json" \
  -u "${ISE_USER}:${ISE_PASS}" | jq '.SearchResult.resources[] | {name, id}'

# Get SGT by name
SGT_NAME="Employees"
curl -s -k -X GET \
  "${ISE_API}/sgt?filter=name.EQ.${SGT_NAME}" \
  -H "Accept: application/json" \
  -u "${ISE_USER}:${ISE_PASS}" | jq '.'

# Create new SGT
curl -s -k -X POST \
  "${ISE_API}/sgt" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -u "${ISE_USER}:${ISE_PASS}" \
  -d '{
    "Sgt": {
      "name": "Contractors",
      "description": "Contractor devices",
      "value": 50,
      "propogateToApic": false
    }
  }' | jq '.'

# Get SGACL policies (egress matrix)
curl -s -k -X GET \
  "${ISE_API}/egressmatrixcell" \
  -H "Accept: application/json" \
  -u "${ISE_USER}:${ISE_PASS}" | jq '.SearchResult'
```

### 3.3 Network Device Operations

```bash
# Get all Network Access Devices
curl -s -k -X GET \
  "${ISE_API}/networkdevice" \
  -H "Accept: application/json" \
  -u "${ISE_USER}:${ISE_PASS}" | jq '.SearchResult.resources[] | {name, id}'

# Get NAD by IP
NAD_IP="10.100.1.11"
curl -s -k -X GET \
  "${ISE_API}/networkdevice?filter=ipaddress.EQ.${NAD_IP}" \
  -H "Accept: application/json" \
  -u "${ISE_USER}:${ISE_PASS}" | jq '.'

# Create new NAD
curl -s -k -X POST \
  "${ISE_API}/networkdevice" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -u "${ISE_USER}:${ISE_PASS}" \
  -d '{
    "NetworkDevice": {
      "name": "MUM-ED-99",
      "description": "Mumbai Edge Switch 99",
      "authenticationSettings": {
        "radiusSharedSecret": "RadiusSecret123",
        "enableKeyWrap": false
      },
      "NetworkDeviceIPList": [{
        "ipaddress": "10.100.1.99",
        "mask": 32
      }],
      "NetworkDeviceGroupList": [
        "Location#All Locations#Mumbai",
        "Device Type#All Device Types#Cisco"
      ],
      "profileName": "Cisco",
      "coaPort": 1700
    }
  }' | jq '.'
```

### 3.4 Guest User Operations

```bash
# Get all guest users
curl -s -k -X GET \
  "${ISE_API}/guestuser" \
  -H "Accept: application/json" \
  -u "${ISE_USER}:${ISE_PASS}" | jq '.SearchResult'

# Create guest user
curl -s -k -X POST \
  "${ISE_API}/guestuser" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -u "${ISE_USER}:${ISE_PASS}" \
  -d '{
    "GuestUser": {
      "guestType": "Contractor",
      "guestInfo": {
        "userName": "visitor001",
        "firstName": "John",
        "lastName": "Visitor",
        "emailAddress": "john.visitor@example.com",
        "password": "Temp1234!",
        "enabled": true
      },
      "guestAccessInfo": {
        "validDays": 7,
        "fromDate": "01/15/2026 00:00",
        "toDate": "01/22/2026 23:59",
        "location": "Mumbai Office"
      },
      "portalId": "<guest-portal-id>"
    }
  }' | jq '.'
```

---

## 4. ISE MnT API (Monitoring)

### 4.1 Session Queries

```bash
ISE_MNT="https://${ISE_HOST}/admin/API/mnt"

# Get active sessions
curl -s -k -X GET \
  "${ISE_MNT}/Session/ActiveList" \
  -H "Accept: application/xml" \
  -u "${ISE_USER}:${ISE_PASS}"

# Get session by MAC
MAC="AA:BB:CC:DD:EE:FF"
curl -s -k -X GET \
  "${ISE_MNT}/Session/MACAddress/${MAC}" \
  -H "Accept: application/xml" \
  -u "${ISE_USER}:${ISE_PASS}"

# Get session count
curl -s -k -X GET \
  "${ISE_MNT}/Session/ActiveCount" \
  -H "Accept: application/xml" \
  -u "${ISE_USER}:${ISE_PASS}"

# Get posture count
curl -s -k -X GET \
  "${ISE_MNT}/Session/PostureCount" \
  -H "Accept: application/xml" \
  -u "${ISE_USER}:${ISE_PASS}"
```

### 4.2 CoA (Change of Authorization)

```bash
# Send CoA - Disconnect session
MAC="AA:BB:CC:DD:EE:FF"
curl -s -k -X PUT \
  "${ISE_MNT}/CoA/Disconnect/${MAC}/1" \
  -H "Accept: application/xml" \
  -u "${ISE_USER}:${ISE_PASS}"

# Send CoA - Reauthenticate
curl -s -k -X PUT \
  "${ISE_MNT}/CoA/Reauth/${MAC}/1" \
  -H "Accept: application/xml" \
  -u "${ISE_USER}:${ISE_PASS}"

# Send CoA - Bounce port
NAS_IP="10.100.1.11"
curl -s -k -X PUT \
  "${ISE_MNT}/CoA/Bounce/${MAC}/${NAS_IP}/1" \
  -H "Accept: application/xml" \
  -u "${ISE_USER}:${ISE_PASS}"
```

---

## 5. Useful Shell Scripts

### 5.1 Bulk Device Export

```bash
#!/bin/bash
# /opt/abhavtech/scripts/export_devices.sh
# Export all network devices to CSV

DNAC_HOST="catalyst.abhavtech.com"
DNAC_USER="api-admin"
DNAC_PASS="${DNAC_PASSWORD}"
OUTPUT_FILE="/tmp/device_inventory_$(date +%Y%m%d).csv"

# Get token
TOKEN=$(curl -s -k -X POST \
  "https://${DNAC_HOST}/dna/system/api/v1/auth/token" \
  -u "${DNAC_USER}:${DNAC_PASS}" | jq -r '.Token')

# Get devices and format as CSV
echo "Hostname,IP Address,Platform,Software Version,Serial Number,Reachability" > ${OUTPUT_FILE}

curl -s -k -X GET \
  "https://${DNAC_HOST}/dna/intent/api/v1/network-device" \
  -H "X-Auth-Token: ${TOKEN}" | jq -r '.response[] | [.hostname, .managementIpAddress, .platformId, .softwareVersion, .serialNumber, .reachabilityStatus] | @csv' >> ${OUTPUT_FILE}

echo "Export complete: ${OUTPUT_FILE}"
echo "Total devices: $(wc -l < ${OUTPUT_FILE})"
```

### 5.2 Health Check Script

```bash
#!/bin/bash
# /opt/abhavtech/scripts/health_check.sh
# Quick health check for DNAC and ISE

DNAC_HOST="catalyst.abhavtech.com"
ISE_HOST="ise-pan.abhavtech.com"

echo "=== Network Health Check ==="
echo "Date: $(date)"
echo ""

# Check DNAC
echo "Catalyst Center Status:"
TOKEN=$(curl -s -k -X POST \
  "https://${DNAC_HOST}/dna/system/api/v1/auth/token" \
  -u "${DNAC_USER}:${DNAC_PASSWORD}" 2>/dev/null | jq -r '.Token')

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
  HEALTH=$(curl -s -k -X GET \
    "https://${DNAC_HOST}/dna/intent/api/v1/network-health" \
    -H "X-Auth-Token: ${TOKEN}" | jq -r '.response[0].healthScore')
  echo "  ✓ Connected - Health Score: ${HEALTH}%"
else
  echo "  ✗ Cannot connect to Catalyst Center"
fi

# Check ISE
echo ""
echo "ISE Status:"
ISE_RESPONSE=$(curl -s -k -o /dev/null -w "%{http_code}" \
  "https://${ISE_HOST}:9060/ers/config/endpoint?size=1" \
  -H "Accept: application/json" \
  -u "${ISE_USER}:${ISE_PASSWORD}")

if [ "$ISE_RESPONSE" == "200" ]; then
  ENDPOINT_COUNT=$(curl -s -k \
    "https://${ISE_HOST}:9060/ers/config/endpoint" \
    -H "Accept: application/json" \
    -u "${ISE_USER}:${ISE_PASSWORD}" | jq '.SearchResult.total')
  echo "  ✓ Connected - Total Endpoints: ${ENDPOINT_COUNT}"
else
  echo "  ✗ Cannot connect to ISE (HTTP ${ISE_RESPONSE})"
fi

echo ""
echo "=== Check Complete ==="
```

### 5.3 Quarantine Endpoint Script

```bash
#!/bin/bash
# /opt/abhavtech/scripts/quarantine.sh
# Quarantine endpoint by MAC address

if [ -z "$1" ]; then
  echo "Usage: $0 <MAC_ADDRESS> [reason]"
  echo "Example: $0 AA:BB:CC:DD:EE:FF 'Malware detected'"
  exit 1
fi

MAC="$1"
REASON="${2:-Manual quarantine}"
ISE_HOST="ise-pan.abhavtech.com"

echo "Quarantining endpoint: ${MAC}"
echo "Reason: ${REASON}"

# Send CoA disconnect
RESULT=$(curl -s -k -X PUT \
  "https://${ISE_HOST}/admin/API/mnt/CoA/Disconnect/${MAC}/1" \
  -H "Accept: application/xml" \
  -u "${ISE_USER}:${ISE_PASSWORD}")

if echo "$RESULT" | grep -q "success"; then
  echo "✓ Endpoint quarantined successfully"
  
  # Log to file
  echo "$(date),${MAC},${REASON},quarantine,success" >> /var/log/abhavtech/quarantine.log
else
  echo "✗ Quarantine failed"
  echo "$RESULT"
fi
```

---

## 6. Postman Collection Setup

### 6.1 Environment Variables

```json
{
  "name": "Abhavtech SD-Access",
  "values": [
    {
      "key": "dnac_host",
      "value": "catalyst.abhavtech.com",
      "type": "default"
    },
    {
      "key": "dnac_user",
      "value": "api-admin",
      "type": "default"
    },
    {
      "key": "dnac_password",
      "value": "",
      "type": "secret"
    },
    {
      "key": "dnac_token",
      "value": "",
      "type": "default"
    },
    {
      "key": "ise_host",
      "value": "ise-pan.abhavtech.com",
      "type": "default"
    },
    {
      "key": "ise_user",
      "value": "api-admin",
      "type": "default"
    },
    {
      "key": "ise_password",
      "value": "",
      "type": "secret"
    }
  ]
}
```

### 6.2 Pre-request Script (Token Refresh)

```javascript
// Pre-request script for Catalyst Center requests
// Automatically refreshes token if expired

const tokenExpiry = pm.environment.get("dnac_token_expiry");
const currentTime = new Date().getTime();

if (!tokenExpiry || currentTime > tokenExpiry) {
    // Token expired or not set, get new token
    const dnacHost = pm.environment.get("dnac_host");
    const dnacUser = pm.environment.get("dnac_user");
    const dnacPass = pm.environment.get("dnac_password");
    
    pm.sendRequest({
        url: `https://${dnacHost}/dna/system/api/v1/auth/token`,
        method: 'POST',
        header: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(`${dnacUser}:${dnacPass}`)
        }
    }, function (err, response) {
        if (!err) {
            const token = response.json().Token;
            pm.environment.set("dnac_token", token);
            // Token valid for 1 hour, set expiry to 55 minutes
            pm.environment.set("dnac_token_expiry", currentTime + (55 * 60 * 1000));
        }
    });
}
```

---

## 7. API Rate Limits and Best Practices

### 7.1 Rate Limits

| API | Rate Limit | Recommendation |
|-----|-----------|----------------|
| Catalyst Center | 5 requests/second | Use bulk APIs when possible |
| ISE ERS | 10 requests/second | Paginate large queries |
| ISE MnT | 20 requests/second | Cache session data |

### 7.2 Best Practices

```yaml
API_Best_Practices:
  
  Authentication:
    - Store credentials in environment variables
    - Never hardcode passwords in scripts
    - Rotate API credentials quarterly
    - Use service accounts, not personal accounts
    
  Error_Handling:
    - Always check HTTP status codes
    - Implement retry logic with exponential backoff
    - Log all API failures
    - Set appropriate timeouts (30-60 seconds)
    
  Performance:
    - Use pagination for large datasets
    - Cache frequently accessed data
    - Use bulk APIs instead of individual calls
    - Implement connection pooling
    
  Security:
    - Use HTTPS only (verify certificates in production)
    - Limit API access by IP when possible
    - Monitor API usage for anomalies
    - Audit API access logs
```

---

*Document Version: 2.0*
*Abhavtech.com - SD-Access Implementation*
