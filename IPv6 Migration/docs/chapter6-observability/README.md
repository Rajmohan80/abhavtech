# Chapter 6: Observability

## IPv6-Enabled Monitoring and Analytics Stack

This chapter covers the deployment of a comprehensive observability platform for dual-stack IPv6/IPv4 infrastructure, providing end-to-end visibility across SD-WAN, SD-Access, multi-cloud, and unified communications environments. The observability stack integrates network monitoring, application performance management, log aggregation, flow analytics, and AI-driven anomaly detection to ensure optimal performance and rapid troubleshooting.

---

## Chapter Contents

### [Phase 5: Observability Deployment](phase5-observability-deployment.md)

**Unified Monitoring and Analytics Platform**

Phase 5 deploys the complete observability stack across all infrastructure layers, covering Weeks 29-36:

**Network Monitoring:**

**ThousandEyes:**

- **Cloud and Enterprise Agent Deployment:** Agents at all 19 sites plus Azure/GCP
- **IPv6 Network Tests:** HTTP server tests, DNS tests, BGP route monitoring
- **Path Visualization:** End-to-end path tracing with dual-stack hop-by-hop analysis
- **Voice Call Tests:** Synthetic SIP call testing to Webex Calling endpoints
- **Alerts and Dashboards:** Custom thresholds for latency, packet loss, availability

**Cisco Catalyst Center Assurance:**

- **SD-Access Fabric Monitoring:** LISP endpoint counts, VXLAN tunnel health, fabric device status
- **Client Health Scoring:** Per-device health metrics (authentication, DHCP, connectivity)
- **Network Health Dashboard:** Site-level KPIs, top issues, trending analysis
- **AI-Driven Insights:** Anomaly detection for endpoint behavior, traffic patterns

**Application Performance:**

**Cisco AppDynamics:**

- **Application Topology Mapping:** Auto-discovery of application dependencies (web/app/DB tiers)
- **Business Transaction Monitoring:** End-user transaction tracing across dual-stack infrastructure
- **IPv6 Instrumentation:** APM agents with IPv6-aware metric collection
- **Database Monitoring:** Query performance analysis for Azure SQL, GCP Cloud SQL

**Custom Application Monitoring:**

- **Vertex AI Workloads:** Model training job metrics, inference API latency
- **Webex Contact Center:** Queue wait times, agent handle times, abandonment rates
- **Multi-Cloud Apps:** Cross-cloud transaction tracing (Azure-to-GCP flows)

**Log Aggregation:**

**Splunk Enterprise:**

- **Universal Forwarders:** Deployed on all network devices, servers, cloud VMs
- **IPv6 Log Collection:** Syslog over IPv6, HTTP Event Collector (HEC) with dual-stack
- **Custom Dashboards:** Network device logs, SD-WAN tunnel events, ISE authentication logs
- **Correlation Searches:** Automated incident detection (link flap + high CPU + BGP down)
- **SIEM Integration:** Security event correlation, threat intelligence enrichment

**Log Sources:**

- **SD-WAN:** vManage alarms, OMP route changes, BFD session flaps
- **SD-Access:** LISP registration logs, VXLAN tunnel state, ISE authentication events
- **Firewalls:** Cisco Secure Firewall, Azure Firewall, GCP Cloud Armor logs
- **Cloud Platforms:** Azure Activity Logs, GCP Cloud Audit Logs, VPC Flow Logs

**Flow Analytics:**

**NetFlow/IPFIX Collection:**

- **Flexible NetFlow (FNF):** Configured on all Catalyst switches and WAN edge routers
- **IPv6 Flow Records:** Dual-stack flow export (source/dest IPv6 addresses, ports, protocols)
- **Flow Collectors:** Stealthwatch (Cisco Secure Network Analytics) or open-source (nfdump)
- **Traffic Analysis:** Top talkers, application mix, inter-site traffic patterns

**Use Cases:**

- **Capacity Planning:** Identify bandwidth-constrained links, predict growth
- **Security Monitoring:** Detect scanning, DDoS, data exfiltration patterns
- **Application Visibility:** Per-app bandwidth consumption (Office 365, Salesforce, Webex)

**Metrics and Telemetry:**

**Prometheus + Grafana:**

- **Network Device Exporters:** SNMP exporters for interface stats, CPU, memory
- **Custom Metrics:** SD-WAN tunnel latency, LISP endpoint counts, BGP peer state
- **IPv6-Specific Metrics:** IPv6 traffic volume, NAT64 session counts, DHCPv6 leases
- **Grafana Dashboards:** Real-time visualization with drill-down capabilities

**Streaming Telemetry:**

- **Model-Driven Telemetry (MDT):** gRPC dial-out from IOS-XE devices to collectors
- **gNMI Subscriptions:** YANG model-based configuration and operational data
- **High-Frequency Telemetry:** Sub-second granularity for CPU, memory, interface counters

**AI-Driven Analytics:**

**Cisco AI Network Analytics:**

- **Baseline Learning:** Normal traffic patterns, endpoint behavior, application flows
- **Anomaly Detection:** Automated detection of deviations (unusual traffic spikes, new endpoints)
- **Predictive Insights:** Proactive alerts for potential failures (CPU trending toward 100%, disk space)
- **Root Cause Analysis:** Automated correlation of events to identify issue source

**Machine Learning Integration:**

- **Vertex AI Models:** Train custom models on network telemetry data
- **Time-Series Forecasting:** Predict bandwidth utilization, link saturation
- **Classification Models:** Identify application types from flow data without DPI

**Alerting and Incident Management:**

**Multi-Tool Integration:**

- **PagerDuty:** Escalation workflows for critical alerts (site down, fabric offline)
- **ServiceNow:** Automated incident creation with context from monitoring tools
- **Slack/Webex Teams:** Real-time notifications for network events
- **Email/SMS:** Fallback alerting for tool failures

**Alert Rationalization:**

- **Deduplication:** Suppress redundant alerts (same device, same symptom)
- **Correlation:** Group related alerts into single incident (link down → BGP peer down)
- **Suppression Windows:** Maintenance mode to pause alerting during changes

---

## Deployment Architecture

**Observability Platform Stack:**

```
┌──────────────────────────────────────────────────────────────┐
│                   MONITORING DASHBOARDS                      │
│  Grafana │ Splunk │ AppDynamics │ ThousandEyes │ DNAC       │
└────────────────────┬─────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──────┐ ┌──▼─────┐ ┌────▼────────┐
│ Prometheus   │ │ Splunk │ │ThousandEyes │
│ (Metrics)    │ │ (Logs) │ │ (Synthetic) │
└───────┬──────┘ └──┬─────┘ └────┬────────┘
        │           │            │
        │ ◄─────────┼────────────┘
        │           │
┌───────▼───────────▼──────────────────────────────────────────┐
│              DATA COLLECTION LAYER                           │
│  Exporters │ Forwarders │ Agents │ Telemetry Streams        │
└───────┬──────────────────────────────────────────────────────┘
        │
┌───────▼──────────────────────────────────────────────────────┐
│                INFRASTRUCTURE TARGETS                        │
│  SD-WAN Edges │ SD-Access Fabric │ ISE │ Cloud (Az/GCP)    │
│  NetFlow Exporters │ Syslog Sources │ SNMP Targets         │
└──────────────────────────────────────────────────────────────┘
```

**IPv6 Monitoring Coverage:**

- **Network Layer:** ICMPv6 reachability, NDP neighbor discovery, RA/RS messages
- **Routing Layer:** OSPFv3 adjacencies, BGP IPv6 peer state, route table size
- **Application Layer:** Dual-stack HTTP tests, DNS64 resolution, NAT64 sessions
- **Security Layer:** IPv6 firewall hits, IPsec tunnel state, IDS/IPS signatures

---

## Deliverables

By the end of Chapter 6, you will have:

✅ **ThousandEyes Deployed** — Synthetic tests for network, DNS, voice, HTTP across all sites

✅ **Splunk Operational** — Centralized log aggregation with 90-day retention

✅ **AppDynamics Monitoring** — Application topology mapped, business transactions traced

✅ **Catalyst Center Assurance** — SD-Access fabric health dashboards, client scoring

✅ **NetFlow Collection** — Flow analytics for bandwidth, applications, security

✅ **Prometheus + Grafana** — Real-time metrics dashboards with IPv6-specific views

✅ **AI Anomaly Detection** — Baseline established, automated alerting configured

✅ **Incident Management** — PagerDuty/ServiceNow integration, alert correlation

---

## Prerequisites

Before starting Chapter 6:

- **Chapters 2-5 complete** — Full infrastructure operational (SD-WAN, SDA, cloud, UC)
- **Monitoring tool licenses** — ThousandEyes, Splunk, AppDynamics, Catalyst Center subscriptions
- **Dedicated monitoring VMs** — Servers for Prometheus, Grafana, flow collectors
- **Network access** — Monitoring tools can reach all devices via IPv6 management addresses

---

## Key Concepts

**Observability vs. Monitoring:**

- **Monitoring:** "Is the system up?" — availability checks, threshold alerts
- **Observability:** "Why did the system fail?" — logs, metrics, traces for root cause analysis

**Three Pillars of Observability:**

- **Logs:** Event records with timestamps (syslog, application logs, audit logs)
- **Metrics:** Time-series data (interface counters, CPU %, latency measurements)
- **Traces:** Transaction flow across distributed systems (APM, distributed tracing)

**Synthetic Monitoring:**

- **Proactive Testing:** Simulate user transactions before real users encounter issues
- **ThousandEyes:** HTTP tests, DNS tests, voice call tests from multiple vantage points
- **Baseline Comparison:** Detect degradation by comparing to historical performance

**AI-Driven Insights:**

- **Anomaly Detection:** Machine learning models identify unusual patterns automatically
- **Predictive Analytics:** Forecast future issues based on trending data
- **Correlation:** Group related events to reduce alert noise and accelerate troubleshooting

---

## Next Steps

After completing Chapter 6:

1. **Proceed to [Chapter 7: Security, Edge & AI](../chapter7-security-edge-ai/README.md)** — Final phase covering SASE, zero-trust, WiFi 7, and AI optimization
2. **Dashboard optimization** — Refine Grafana/Splunk dashboards based on operations team feedback
3. **Alert tuning** — Adjust thresholds to reduce false positives while maintaining coverage

---

**Ready to deploy observability?** Start with **[Phase 5: Observability Deployment →](phase5-observability-deployment.md)**
