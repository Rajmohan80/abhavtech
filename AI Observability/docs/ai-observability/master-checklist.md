# AI-Enabled Observability Master Implementation Checklist
## Abhavtech Enterprise Network Transformation

---

## Document Purpose
This master checklist provides implementation tracking for AI-Enabled Observability based on **ABHAVTECH-DOCUMENT-2** and **ABHAVTECH-DOCUMENT-2B**. All tasks are derived from actual documented requirements.

**Target Architecture:**
- 6 Hub Sites (Mumbai, Chennai, London, Frankfurt, New Jersey, Dallas)
- 13 Branch Sites across APAC, EMEA, and Americas
- Three-platform observability: Splunk + ThousandEyes + AppDynamics
- Webex Calling (3,200 users) and WxCC (175 agents) monitoring
- AI-powered analytics with MLTK, Cognition Engine, Deep Network Model

**Core Components (As Documented):**
- **Splunk Enterprise** - AI/ML analytics with Machine Learning Toolkit (MLTK)
- **ThousandEyes** - Network intelligence with Path Optimization AI
- **AppDynamics** - Application monitoring with Cognition Engine (AIOps)
- **OpenTelemetry** - Data pipeline for unified telemetry
- **Webex Observability** - First-class monitoring for Webex Calling/Contact Center

**Critical AI/ML Requirement:**
- **14-30 day baseline collection** MANDATORY before AI engine enablement
- **90-day comprehensive baseline** recommended for seasonal patterns

---

## Phase 2A: Splunk Foundation (Weeks 1-6)

### Week 1-2: Splunk Licensing & Cluster Setup
**Tasks:**
- [ ] Procure Splunk Enterprise licenses (150 GB/day + MLTK add-on)
- [ ] Provision VMs for Splunk cluster (NJ primary site)
- [ ] Install Splunk Enterprise on all nodes
- [ ] Configure indexer cluster (replication factor 3, search factor 2)
- [ ] Configure search head cluster (3 nodes)
- [ ] Install Splunk apps: MLTK, ES (Enterprise Security), App for Cisco ISE
- [ ] Configure SSL/TLS for cluster communication
- [ ] Set up license manager and slave nodes

**Exit Criteria:**
- [ ] Splunk indexer cluster healthy (3 nodes)
- [ ] Search head cluster operational (3 nodes)
- [ ] License utilization <80%
- [ ] Test data ingestion: 10 GB/day successfully indexed

### Week 3-4: Heavy Forwarders & Universal Forwarders
**Tasks:**
- [ ] Deploy Heavy Forwarders at Mumbai, London (2 per site = 4 total)
- [ ] Configure Heavy Forwarders with SSL certificates
- [ ] Deploy Universal Forwarders on:
  - [ ] DNAC (3 nodes)
  - [ ] ISE (14 nodes - selected nodes for forwarding)
  - [ ] vManage (3 nodes)
  - [ ] FMC (1 node)
- [ ] Configure syslog inputs on Heavy Forwarders (port 514, 6514 for TLS)
- [ ] Configure data routing and filtering
- [ ] Create 6 Splunk indexes with retention policies:
  - [ ] cisco_network_index (90 days)
  - [ ] cisco_security_index (1 year)
  - [ ] cisco_ucapps_index (90 days)
  - [ ] cisco_ai_events_index (2 years)
  - [ ] cisco_compliance_index (7 years)
  - [ ] cisco_debug_index (7 days)

**Exit Criteria:**
- [ ] 4 Heavy Forwarders operational
- [ ] 21 Universal Forwarders deployed
- [ ] Data flow verified: Source  to  UF  to  HF  to  Indexer
- [ ] 6 indexes created with correct retention

### Week 5-6: OpenTelemetry Collectors
**Tasks:**
- [ ] Deploy OTel Collectors at 6 hub sites (containerized)
- [ ] Configure OTel receivers:
  - [ ] Syslog receiver (RFC 5424, RFC 3164)
  - [ ] OTLP gRPC receiver
  - [ ] Prometheus receiver
- [ ] Configure OTel processors:
  - [ ] Batch processor
  - [ ] Resource detection
  - [ ] Attributes processor
- [ ] Configure OTel exporters:
  - [ ] Splunk HEC exporter
  - [ ] Logging exporter (debugging)
- [ ] Configure authentication (HEC token)
- [ ] Validate telemetry flow: Source  to  OTel  to  Splunk
- [ ] Monitor OTel Collector health metrics

**Exit Criteria:**
- [ ] 6 OTel Collectors deployed and healthy
- [ ] 100 GB/day ingestion via OTel + direct methods
- [ ] Zero data loss verified
- [ ] OTel health metrics visible in Splunk

**Phase 2A Overall Exit Criteria:**
- [ ] Splunk cluster operational (NJ + London DR)
- [ ] 100 GB/day data ingestion
- [ ] 6 indexes created with retention policies
- [ ] All forwarders and collectors operational
- [ ] MLTK add-on installed (ready for Phase 2D)

---

## Phase 2B: ThousandEyes (Weeks 7-12)

### Week 7-8: Agent Deployment (Mumbai, NJ)
**Tasks:**
- [ ] Procure ThousandEyes Enterprise licenses (6 agents)
- [ ] Deploy Enterprise Agents at Mumbai and New Jersey data centers
- [ ] Configure agent network access (outbound 443, 49152-65535)
- [ ] Configure initial tests:
  - [ ] HTTP test: Mumbai  to  New Jersey (MPLS path)
  - [ ] Office 365 test: Mumbai  to  outlook.office365.com
  - [ ] Webex test: Mumbai  to  webex.com
- [ ] Configure alert rules (latency >100ms, packet loss >1%)
- [ ] Validate agent reporting and data collection

**Exit Criteria:**
- [ ] 2 agents registered and reporting
- [ ] 3 tests configured and running
- [ ] Alerts triggering correctly
- [ ] Baseline data collection started

### Week 9-10: Complete Agent Deployment
**Tasks:**
- [ ] Deploy agents at Chennai, Dallas, London, Frankfurt (4 sites)
- [ ] Expand test coverage to 25 tests total:
  - [ ] 12 MPLS path tests (site-to-site)
  - [ ] 8 SaaS tests (M365, Salesforce, Zoom, Webex, AWS, Azure, Google Workspace, ServiceNow)
  - [ ] 5 Voice/RTP tests (Webex Calling quality)
- [ ] Configure test intervals (MPLS: 5 min, SaaS: 10 min, Voice: 2 min)
- [ ] Configure advanced alert rules (multi-metric)
- [ ] Create custom dashboards per region

**Exit Criteria:**
- [ ] 6 agents operational across all hub sites
- [ ] 25 tests configured with appropriate intervals
- [ ] Alerts configured for all tests
- [ ] Custom dashboards created

### Week 11-12: DNAC/vManage Integration & OTel Export
**Tasks:**
- [ ] Configure ThousandEyes integration with DNAC:
  - [ ] Enable DNAC Assurance ThousandEyes connector
  - [ ] Configure API credentials
  - [ ] Validate test results in DNAC dashboard
- [ ] Configure ThousandEyes integration with vManage:
  - [ ] Enable vManage ThousandEyes integration
  - [ ] Configure API credentials
  - [ ] Validate test results in vManage dashboard
- [ ] Configure ThousandEyes webhook to OTel Collector
- [ ] Configure webhook payload transformation
- [ ] Validate data flow: ThousandEyes  to  OTel  to  Splunk
- [ ] Create Splunk dashboard for ThousandEyes data
- [ ] Create correlation searches (ThousandEyes + DNAC + vManage)

**Exit Criteria:**
- [ ] DNAC integration operational
- [ ] vManage integration operational
- [ ] ThousandEyes data flowing to Splunk
- [ ] Correlation searches operational

**Phase 2B Overall Exit Criteria:**
- [ ] 6 ThousandEyes agents deployed
- [ ] 25 tests operational (MPLS, SaaS, Voice)
- [ ] DNAC and vManage integrations complete
- [ ] Data flowing to Splunk for unified observability
- [ ] Minimum 14-day baseline collected for AI enablement

---

## Phase 2C: AppDynamics (Weeks 13-18)

### Week 13-14: AppDynamics Controller & Agent Deployment
**Tasks:**
- [ ] Provision AppDynamics SaaS Controller
- [ ] Configure SSO (Duo for admin access)
- [ ] Define application structure:
  - [ ] 8 business applications to monitor
  - [ ] Define tiers per application
  - [ ] Define nodes per tier
- [ ] Deploy Java APM agents on application servers
- [ ] Deploy .NET agents on Windows application servers
- [ ] Configure agent authentication (controller key)
- [ ] Validate application discovery
- [ ] Configure automatic tier/node detection

**Exit Criteria:**
- [ ] AppDynamics Controller operational
- [ ] 8 applications discovered
- [ ] APM agents deployed (Java, .NET)
- [ ] Application topology visible

### Week 15-16: Business Transaction Mapping & Baselining
**Tasks:**
- [ ] Define 30 critical business transactions:
  - [ ] Order Processing (e-commerce)
  - [ ] Quote Generation (CRM)
  - [ ] Inventory Check
  - [ ] Payment Processing
  - [ ] User Login
  - [ ] Search/Browse
  - [ ] (plus 24 more application-specific)
- [ ] Configure business transaction detection rules
- [ ] Configure transaction naming rules
- [ ] Configure snapshot policies (errors, slow transactions)
- [ ] Enable Business iQ for revenue correlation
- [ ] Start 14-day baseline collection for normal behavior
- [ ] Define Apdex thresholds per transaction type:
  - [ ] Critical transactions: <500ms
  - [ ] Standard transactions: <1000ms
  - [ ] Batch processes: <5000ms

**Exit Criteria:**
- [ ] 30 business transactions defined
- [ ] Transaction detection working
- [ ] Apdex thresholds configured
- [ ] 14-day baseline collection started

### Week 17-18: Database Visibility & Cognition Engine
**Tasks:**
- [ ] Deploy database agents:
  - [ ] Oracle databases (4 instances)
  - [ ] SQL Server databases (6 instances)
  - [ ] PostgreSQL databases (2 instances)
- [ ] Configure database visibility:
  - [ ] Enable SQL query collection
  - [ ] Configure wait state collection
  - [ ] Enable explain plan collection
- [ ] Configure AppDynamics  to  Splunk integration:
  - [ ] Configure HTTP Event Collector (HEC) in Splunk
  - [ ] Configure AppDynamics webhook for events
  - [ ] Validate event flow: AppDynamics  to  Splunk
- [ ] Enable Cognition Engine (AIOps):
  - [ ] Enable anomaly detection (requires 7-day minimum baseline)
  - [ ] Configure business impact analysis
  - [ ] Enable root cause analysis
  - [ ] Configure health rules with dynamic baselines
- [ ] Configure synthetic monitoring (optional):
  - [ ] 5 synthetic tests for critical user journeys

**Exit Criteria:**
- [ ] Database agents deployed and reporting
- [ ] AppDynamics data flowing to Splunk
- [ ] Cognition Engine enabled
- [ ] Minimum 7-day baseline collected for Cognition Engine

**Phase 2C Overall Exit Criteria:**
- [ ] AppDynamics monitoring 8 applications
- [ ] 30 business transactions tracked
- [ ] Database visibility operational
- [ ] Cognition Engine enabled with 7+ day baseline
- [ ] AppDynamics integrated with Splunk

---

## Phase 2D: AI/ML Model Training & Webex Observability (Weeks 19-20)

### Week 19: MLTK Model Training & Deployment
**Tasks:**
- [ ] Validate minimum 30-day baseline collected for all platforms
- [ ] Install Python for Scientific Computing (PSC) add-on
- [ ] Configure Splunk MLTK compute resources
- [ ] Train 12 AI detection models:
  - [ ] **Model 1:** Bandwidth Anomaly Detection (network interfaces)
  - [ ] **Model 2:** Authentication Failure Spike (ISE logs)
  - [ ] **Model 3:** VPN Tunnel Instability (SD-WAN)
  - [ ] **Model 4:** DNS Query Anomaly (Umbrella)
  - [ ] **Model 5:** Application Response Time Anomaly (AppDynamics)
  - [ ] **Model 6:** Database Query Slowdown (AppDynamics DB)
  - [ ] **Model 7:** MPLS Path Degradation (ThousandEyes)
  - [ ] **Model 8:** SaaS Application Reachability (ThousandEyes)
  - [ ] **Model 9:** Webex Call Quality Degradation (RTP metrics)
  - [ ] **Model 10:** WxCC Agent Availability Anomaly
  - [ ] **Model 11:** Device Health Score Anomaly (DNAC)
  - [ ] **Model 12:** Security Event Clustering (UEBA-style)
- [ ] Configure model retraining schedules (weekly)
- [ ] Create alerts based on model predictions
- [ ] Validate model accuracy (false positive rate <5%)
- [ ] Create dashboards showing model outputs

**Exit Criteria:**
- [ ] 12 ML models trained and deployed
- [ ] Model accuracy validated (>90% detection, <5% false positives)
- [ ] Automated retraining scheduled
- [ ] AI-driven alerts operational

### Week 20: Webex Observability & Unified Dashboards
**Webex Observability Tasks:**
- [ ] Configure ThousandEyes tests for Webex:
  - [ ] Webex Calling signaling tests (6 tests, one per hub site)
  - [ ] Webex Calling media tests (RTP)
  - [ ] WxCC agent desktop reachability tests
- [ ] Configure Webex Control Hub API integration with Splunk:
  - [ ] Extract call quality metrics (MOS, packet loss, jitter)
  - [ ] Extract WxCC queue metrics
  - [ ] Extract agent availability metrics
- [ ] Create Webex-specific QoE thresholds:
  - [ ] MOS score <3.5 = Poor
  - [ ] Packet loss >1% = Warning
  - [ ] Jitter >30ms = Warning
  - [ ] Latency >150ms = Warning
- [ ] Deploy WF-001 workflow: Webex-Branch-Optimize
  - [ ] Trigger: Branch MOS <3.5 for 5+ consecutive calls
  - [ ] Action: Create ServiceNow ticket, notify network team
- [ ] Create Webex observability dashboard in Splunk

**Unified Dashboard Tasks:**
- [ ] Create executive dashboard (three-platform summary)
- [ ] Create NOC dashboard (real-time health status)
- [ ] Create application operations dashboard (AppDynamics + Splunk)
- [ ] Create network operations dashboard (ThousandEyes + DNAC + vManage)
- [ ] Create Webex operations dashboard (Calling + Contact Center)
- [ ] Create AI insights dashboard (MLTK + Cognition Engine predictions)
- [ ] Configure dashboard refresh intervals (30 sec to 5 min)
- [ ] Configure role-based access to dashboards

**Exit Criteria:**
- [ ] Webex observability operational (Calling + WxCC)
- [ ] Webex QoE thresholds enforced
- [ ] WF-001 workflow tested and operational
- [ ] 6 unified dashboards deployed

**Phase 2D Overall Exit Criteria:**
- [ ] 12 AI/ML models operational in production
- [ ] Webex observability fully integrated
- [ ] Unified dashboards operational
- [ ] AI-driven alerts reducing manual monitoring
- [ ] Mean time to detect (MTTD) reduced by 60%+

---

## Phase 2 Overall Exit Criteria (20 Weeks)

### Splunk Platform
- [ ] Cluster operational (NJ + London DR)
- [ ] 150 GB/day ingestion capacity
- [ ] 6 indexes with correct retention
- [ ] MLTK operational with 12 models
- [ ] OpenTelemetry pipeline functional

### ThousandEyes
- [ ] 6 Enterprise Agents deployed
- [ ] 25 tests operational (MPLS, SaaS, Voice)
- [ ] DNAC and vManage integrations complete
- [ ] Webex-specific tests operational
- [ ] Data flowing to Splunk

### AppDynamics
- [ ] 8 applications monitored
- [ ] 30 business transactions tracked
- [ ] Database visibility operational
- [ ] Cognition Engine enabled
- [ ] Splunk integration complete

### AI/ML Capabilities
- [ ] Minimum 30-day baseline collected
- [ ] 12 ML models trained and operational
- [ ] Anomaly detection accuracy >90%
- [ ] False positive rate <5%
- [ ] Predictive alerts operational

### Webex Observability
- [ ] Webex Calling monitored (3,200 users)
- [ ] WxCC monitored (175 agents)
- [ ] QoE thresholds enforced
- [ ] WF-001 workflow operational
- [ ] Dedicated Webex dashboard

### Integration & Correlation
- [ ] Three-platform data flowing to Splunk
- [ ] Cross-platform correlation searches operational
- [ ] Unified dashboards deployed
- [ ] API integrations functional
- [ ] Alert routing to ServiceNow

### Business Outcomes
- [ ] Mean time to detect (MTTD) reduced by 60%
- [ ] Mean time to resolve (MTTR) reduced by 40%
- [ ] Proactive issue detection (before user impact)
- [ ] Executive visibility into service health

---

## Appendix: Reference Documents

### Document Cross-Reference
| Document | Content |
|----------|---------|
| ABHAVTECH-DOCUMENT-2-AI-ENABLED-OBSERVABILITY | Architecture, implementation phases |
| ABHAVTECH-DOCUMENT-2B-DETAILED-IMPLEMENTATION-GUIDE | Detailed configurations, Splunk searches |
| DNAC-ISE-MASTER-CHECKLIST | DNAC/ISE integration points |
| SDWAN-MASTER-CHECKLIST | vManage integration points |
| ZERO-TRUST-MASTER-CHECKLIST | SecureX/XDR integration |

### Detailed Implementation Guides (Document 2B)
- Section 1: Splunk Deployment Details
- Section 2: ThousandEyes Configuration
- Section 3: AppDynamics Setup
- Section 4: MLTK Model Training Procedures
- Section 5: Real-World Scenarios
- Appendices: Index design, test templates, BT definitions, dashboard JSON

### Key Appendices from Document 2
- Appendix A: Splunk Index Design & Retention Policies
- Appendix B: ThousandEyes Test Configuration Templates
- Appendix C: AppDynamics Business Transaction Definitions
- Appendix D: MLTK Model Training Procedures
- Appendix E: Dashboard JSON Templates
- Appendix F: Alert Routing & Escalation Matrix
- Appendix G: API Integration Reference
- Appendix H: Capacity Planning Calculator
- Appendix I: Webex/WxCC Observability Configuration

---

## Critical Reminder: Baseline Collection

**⚠️ CRITICAL: AI/ML engines CANNOT function without adequate baseline data!**

| Platform | Minimum Baseline | Recommended Baseline | Purpose |
|----------|-----------------|---------------------|---------|
| Splunk MLTK | 30 days | 90 days | Seasonal pattern detection |
| AppDynamics Cognition Engine | 7 days | 14 days | Normal behavior modeling |
| ThousandEyes Path AI | 14 days | 30 days | Network path patterns |
| Overall AI System | 30 days | 90 days | Cross-platform correlation |

**Do NOT enable AI features before baseline collection is complete!**

---

## Sign-Off

### Phase 2 Completion Checklist
- [ ] All 4 phases (2A, 2B, 2C, 2D) complete
- [ ] All exit criteria met
- [ ] Minimum 30-day baseline collected
- [ ] 12 AI/ML models operational
- [ ] Zero critical issues outstanding
- [ ] Documentation complete
- [ ] Training delivered
- [ ] Operations team handover complete

### Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| IT Director | | | |
| Network Operations Manager | | | |
| Application Operations Manager | | | |
| NOC Manager | | | |
| Project Manager | | | |

---

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Organization:** Abhavtech.com  
**Classification:** Internal Use  
**Based On:** ABHAVTECH-DOCUMENT-2 and ABHAVTECH-DOCUMENT-2B

---

*End of Checklist*
