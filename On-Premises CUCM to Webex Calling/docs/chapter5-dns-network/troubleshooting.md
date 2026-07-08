# Network Troubleshooting

## 5.8 Network Validation Checklist

### 5.8.1 Pre-Deployment Validation

| Test | Command/Method | Expected Result | Pass |
|------|----------------|-----------------|------|
| DNS resolution | `nslookup webex.com` | Public IP returned | [ ] |
| DNS resolution | `nslookup wbx2.com` | Public IP returned | [ ] |
| HTTPS connectivity | `curl -I https://admin.webex.com` | HTTP 200/301 | [ ] |
| Media ports | `nc -u webex-media-test 19560` | Connection open | [ ] |
| No SSL intercept | Browser -> webex.com -> Certificate | DigiCert CA | [ ] |
| QoS marking | `show policy-map interface` | EF queue active | [ ] |
| Bandwidth test | `iperf3` to cloud endpoint | >50 Mbps sustained | [ ] |

### 5.8.2 Webex Network Test Tool

```
# Run Webex network test from client
# URL: https://mediatest.webex.com

# Expected Results:
# - UDP connectivity: PASS
# - TCP fallback: PASS  
# - Bandwidth: >2 Mbps
# - Latency: <150ms
# - Jitter: <30ms
# - Packet loss: <1%
```

### 5.8.3 LGW Connectivity Validation (India)

| Test | Command | Expected Result |
|------|---------|-----------------|
| Webex registration | `show voice register status` | Registered |
| TLS certificate | `show crypto pki certificate` | Valid, not expired |
| SIP trunk to PSTN | `show sip-ua status` | Active |
| Test call | Dial PSTN from Webex user | Completes via LGW |

---

