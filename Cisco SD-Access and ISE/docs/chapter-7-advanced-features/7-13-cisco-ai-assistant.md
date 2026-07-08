# 7.13 Cisco AI Assistant for Networking

## Document Information
| Item | Details |
|------|---------|
| Organization | Abhavtech.com |
| Version | 2.0 |
| Last Updated | December 2025 |

---

## 1. Overview

### 1.1 What is Cisco AI Assistant?

Cisco AI Assistant is a natural language interface integrated into Catalyst Center that allows network administrators to interact with the network using conversational queries instead of navigating complex menus.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Cisco AI Assistant Architecture                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  User Interface                     Backend Services                │
│  ┌─────────────────────┐           ┌─────────────────────┐         │
│  │   Natural Language  │           │  Cisco AI Cloud     │         │
│  │   Query Input       │──────────►│  (NLP Processing)   │         │
│  │                     │           │                     │         │
│  │  "Show me unhealthy │           │  • Intent parsing   │         │
│  │   devices in Mumbai"│           │  • Context mapping  │         │
│  └─────────────────────┘           │  • Query generation │         │
│           │                        └──────────┬──────────┘         │
│           │                                   │                     │
│           │                                   ▼                     │
│           │                        ┌─────────────────────┐         │
│           │                        │  Catalyst Center    │         │
│           │                        │  API Execution      │         │
│           │                        │                     │         │
│           │                        │  • Device inventory │         │
│           │                        │  • Assurance data   │         │
│           │                        │  • Configuration    │         │
│           ▼                        └──────────┬──────────┘         │
│  ┌─────────────────────┐                      │                    │
│  │   Response Display  │◄─────────────────────┘                    │
│  │                     │                                           │
│  │  "Found 3 unhealthy │   Formatted results with                  │
│  │   devices..."       │   actionable insights                     │
│  └─────────────────────┘                                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Key Capabilities

| Capability | Description | Example Query |
|------------|-------------|---------------|
| **Network Health** | Query device and client health | "What's the health of Mumbai site?" |
| **Troubleshooting** | Identify and diagnose issues | "Why is client AA:BB:CC having issues?" |
| **Inventory** | Search devices and clients | "Show all switches running 17.9" |
| **Configuration** | Query configurations | "Which ports have PoE enabled?" |
| **Assurance** | Get insights and recommendations | "What issues need attention today?" |

---

## 2. Enabling AI Assistant

### 2.1 Prerequisites

```yaml
Prerequisites:
  
  Catalyst_Center:
    Version: 2.3.5.x or later
    License: DNA Advantage
    
  Cloud_Connectivity:
    - Outbound HTTPS to Cisco Cloud
    - DNS resolution required
    - Firewall rules for *.cisco.com
    
  User_Requirements:
    - Admin role or appropriate RBAC
    - Enabled AI Assistant access
```

### 2.2 Configuration Steps

```
Catalyst Center → System → Settings → Cisco AI Analytics

1. Enable Cloud Connectivity
   ☑ Enable Cisco AI Analytics
   ☑ Share data with Cisco Cloud (anonymized)
   
2. Configure Data Sharing
   Data Types to Share:
     ☑ Network topology
     ☑ Device inventory
     ☑ Assurance metrics
     ☑ Issue data
     ☐ Configuration details (optional)
     
3. Enable AI Assistant
   ☑ Enable AI Assistant for users
   
4. User Access Control
   Roles with AI Assistant Access:
     ☑ SUPER-ADMIN-ROLE
     ☑ NETWORK-ADMIN-ROLE
     ☐ OBSERVER-ROLE
     
5. Save and Apply
```

### 2.3 Verify Cloud Connectivity

```
System → Settings → Cloud Connectivity

Status: Connected ✓
Last Sync: [timestamp]
Data Uploaded: [size]

Connectivity Test:
  ✓ DNS resolution
  ✓ HTTPS connection
  ✓ Certificate validation
  ✓ Authentication
```

---

## 3. Using AI Assistant

### 3.1 Accessing AI Assistant

```
Catalyst Center Dashboard → Click AI Assistant icon (top right)

Or use keyboard shortcut: Ctrl + Shift + A

AI Assistant Panel opens on right side of screen
```

### 3.2 Query Examples by Category

#### Network Health Queries

```
User: "What is the overall network health?"
AI: "The overall network health is 94%. Here's the breakdown:
     - Device Health: 97% (3 devices with issues)
     - Client Health: 92% (125 clients with poor experience)
     - Application Health: 93%
     Click here to see details..."

User: "Show me unhealthy devices"
AI: "Found 3 unhealthy devices:
     1. MUM-ED-05 (Critical - Unreachable since 10:15 AM)
     2. CHE-AP-12 (Warning - High CPU 89%)
     3. LON-ED-08 (Warning - Memory 85%)
     Would you like to troubleshoot any of these?"

User: "What's wrong with Mumbai site?"
AI: "Mumbai site health is 89%. Issues detected:
     - 2 switches with high CPU utilization
     - 15 clients with poor wireless experience
     - 1 AP with channel interference
     Recommended actions: [View Details]"
```

#### Client Troubleshooting Queries

```
User: "Why is client AA:BB:CC:DD:EE:FF having connectivity issues?"
AI: "Analyzing client AA:BB:CC:DD:EE:FF...
     
     Issues Found:
     1. Poor RSSI (-78 dBm) - Client is far from AP
     2. High roaming (12 roams in last hour)
     3. Authentication delays (avg 2.1 seconds)
     
     Root Cause: Client is in coverage hole area
     
     Recommendation: 
     - Add AP coverage in Building A, Floor 2
     - Or move client closer to existing AP
     
     [View Client 360]"

User: "Show clients with authentication failures today"
AI: "Found 23 clients with authentication failures:
     - 15 failures: Wrong password
     - 5 failures: Certificate expired
     - 3 failures: User not in database
     
     Top affected users:
     1. jsmith@abhavtech.com (5 failures)
     2. mwilliams@abhavtech.com (3 failures)
     
     [View ISE Reports]"
```

#### Device Queries

```
User: "List all switches running IOS-XE 17.9"
AI: "Found 45 switches running IOS-XE 17.9.x:
     - 17.9.4a: 30 devices
     - 17.9.3: 10 devices
     - 17.9.2: 5 devices
     
     Recommendation: 15 devices should upgrade to 17.9.4a
     [View Device List] [Schedule Upgrade]"

User: "Which devices have high CPU?"
AI: "Found 5 devices with CPU > 80%:
     1. MUM-ED-05: 92% (Spanning Tree reconvergence)
     2. CHE-BN-01: 85% (High LISP activity)
     3. LON-ED-12: 83% (ACL processing)
     4. NJ-CP-01: 81% (Map-cache updates)
     5. DAL-ED-03: 80% (PoE negotiations)
     
     [View Details] [Create Incident]"
```

#### Configuration Queries

```
User: "Show ports with PoE disabled"
AI: "Found 127 ports with PoE disabled:
     - 45 uplink ports (expected)
     - 62 unused ports (expected)
     - 20 access ports (review recommended)
     
     Access ports with PoE disabled:
     Site: Mumbai - 12 ports
     Site: Chennai - 5 ports
     Site: London - 3 ports
     
     [View Port List]"

User: "What VLANs are configured on MUM-ED-01?"
AI: "VLANs on MUM-ED-01:
     - VLAN 10: Corporate (42 ports)
     - VLAN 20: Voice (38 ports)
     - VLAN 30: Guest (4 ports)
     - VLAN 40: IoT (8 ports)
     - VLAN 999: Quarantine (0 ports)
     
     Total: 5 VLANs, 92 assigned ports"
```

---

## 4. AI-Powered Insights

### 4.1 Proactive Recommendations

```
AI Assistant proactively surfaces:

┌─────────────────────────────────────────────────────────────────────┐
│                    AI Insights Panel                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🔴 Critical (2)                                                    │
│  ├── Device MUM-ED-05 unreachable - Immediate action required       │
│  └── Certificate expires in 7 days on ISE-PSN-01                    │
│                                                                     │
│  🟡 Warning (5)                                                     │
│  ├── 3 devices approaching memory threshold (>80%)                  │
│  ├── Wireless interference detected in Building A                   │
│  └── 15 clients experiencing poor DNS resolution                    │
│                                                                     │
│  💡 Optimization (3)                                                │
│  ├── 12 APs could benefit from RRM channel adjustment               │
│  ├── 5 switches have unused PoE capacity                            │
│  └── Network segmentation can be improved in Guest VN               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Trend Analysis

```
User: "Show network trends for the past month"
AI: "Network Trend Analysis (Last 30 Days):

     📈 Improving:
     - Client onboarding time: 2.8s → 2.1s (-25%)
     - Authentication success rate: 98.5% → 99.2%
     - AP health score: 91% → 95%
     
     📉 Declining:
     - Switch CPU average: 45% → 52%
     - Wireless client capacity: 78% → 85%
     
     ⚠️ Attention Needed:
     - Endpoint growth rate suggests capacity planning
       needed in Q2 2026
     - 3 switches approaching end of support
     
     [View Detailed Report]"
```

---

## 5. Integration with Workflows

### 5.1 Ticket Creation

```
User: "Create a ticket for the unreachable device"
AI: "Creating ServiceNow incident...
     
     Incident Details:
     - Short Description: Device Unreachable - MUM-ED-05
     - Priority: P2
     - Assignment Group: Network Operations
     - Description: [Auto-populated with diagnostic data]
     
     Incident INC0012345 created successfully.
     [View in ServiceNow]"
```

### 5.2 Remediation Actions

```
User: "Reboot the problematic AP"
AI: "⚠️ Confirmation Required
     
     Action: Reboot AP CHE-AP-12
     Impact: 23 connected clients will be disconnected
     
     Are you sure you want to proceed?
     [Confirm] [Cancel]"

User: "Confirm"
AI: "Initiating reboot of CHE-AP-12...
     ✓ Reboot command sent
     ✓ AP is restarting
     
     Estimated recovery: 3-5 minutes
     I'll notify you when the AP is back online."
```

---

## 6. Best Practices

### 6.1 Effective Query Patterns

```yaml
Effective_Queries:
  
  Be_Specific:
    Good: "Show unhealthy switches in Mumbai"
    Bad: "What's wrong?"
    
  Include_Context:
    Good: "Why did client jsmith@abhavtech.com fail authentication at 10:15 AM?"
    Bad: "Why did authentication fail?"
    
  Use_Actionable_Language:
    Good: "List devices that need software upgrade"
    Bad: "Tell me about software"
    
  Time_Bound_Queries:
    Good: "Show authentication failures in the last 24 hours"
    Bad: "Show authentication failures"
```

### 6.2 Query Limitations

| What AI Can Do | What AI Cannot Do |
|----------------|-------------------|
| Query device health | Make configuration changes |
| Search inventory | Deploy new configurations |
| Analyze trends | Access external systems directly |
| Provide recommendations | Execute privileged commands |
| Create tickets (with integration) | Bypass RBAC permissions |

---

## 7. Security and Privacy

### 7.1 Data Handling

```yaml
Data_Privacy:
  
  Data_Sent_to_Cloud:
    - Anonymized topology
    - Device types (not hostnames by default)
    - Aggregated metrics
    - Issue patterns
    
  Data_NOT_Sent:
    - User credentials
    - Configuration secrets
    - IP addresses (optional)
    - Client PII
    
  Compliance:
    - Data encrypted in transit (TLS 1.3)
    - Data encrypted at rest
    - GDPR compliant
    - SOC 2 certified
```

### 7.2 Audit Logging

```
All AI Assistant queries are logged:

System → Audit Logs → Filter: AI Assistant

Log Entry:
  Timestamp: 2025-12-28 10:15:23
  User: admin@abhavtech.com
  Query: "Show unhealthy devices in Mumbai"
  Response: "[Device list returned]"
  Duration: 1.2 seconds
```

---

## 8. Abhavtech-Specific Configurations

### 8.1 Custom Query Templates

```
Site-specific queries saved as templates:

Template: "Daily Mumbai Check"
Query: "Show health summary for Mumbai site including 
        devices, clients, and top 5 issues"

Template: "Pre-Change Validation"  
Query: "List all active sessions on [device] and 
        show any critical dependencies"

Template: "Post-Incident Review"
Query: "Show all events related to [incident] 
        in the last 24 hours"
```

### 8.2 Scheduled Reports via AI

```
AI can generate scheduled insights:

Daily: "Executive summary of network health"
Weekly: "Top 10 issues and recommendations"
Monthly: "Capacity planning report"

Delivery: Email to noc@abhavtech.com
```

---

*Document Version: 2.0*
*Abhavtech.com - SD-Access Implementation*
