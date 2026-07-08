# CUCM to Webex Calling Migration Master Checklist 
## Abhavtech Enterprise Collaboration Transformation - Phase 1
### On-Premises CUCM to Cloud Webex Calling | Multi-Region Deployment

---

## Document Purpose
This master checklist provides a comprehensive roadmap for migrating from on-premises Cisco Unified Communications Manager (CUCM) to cloud-based Webex Calling. Use this as a sequential guide to ensure all critical discovery, design, implementation, and migration activities are completed for a successful enterprise voice transformation.

**Target Architecture:**
- 12 Global Sites (7 India + 2 EMEA + 2 Americas + Remote Workers)
- 3,200 Enterprise Users migrating to Webex Calling
- Multi-Region PSTN Strategy: Local Gateway (India) + Cloud Connected PSTN (EMEA/Americas)
- Integration: SD-WAN QoS (ABV-SDWAN-2024), DNA Center (ABV-SDA-ISE-2025)
- Phase Dependency: Required for Phase 2 (UCCX to WxCC Migration)

**Software & Platform Versions:**
- Webex Calling: Latest Cloud Platform (Auto-updated)
- Current CUCM: 12.5(1)SU7
- Current Unity Connection: 12.5(1)SU4
- Local Gateway: Cisco CUBE IOS-XE 17.9.x
- Webex App: Latest (Windows/Mac/Mobile)

---

## Phase 1: Discovery & Current State Assessment

### 1.1 Infrastructure Inventory
- [ ] Document CUCM cluster topology (Publisher + 4 Subscribers)
- [ ] Inventory all CUCM servers (hostname, IP, version, roles)
- [ ] Document Unity Connection deployment (HA pair)
- [ ] Inventory UCCX contact center infrastructure (dependency check)
- [ ] Document IM&P cluster architecture
- [ ] Document Expressway C&E infrastructure (MRA)
- [ ] Identify all CUBE SBC deployments
- [ ] Document integration points (CRM, recording, billing)

### 1.2 User & Device Inventory
- [ ] Export complete user inventory from CUCM (3,200 users)
- [ ] Document user distribution across 12 sites
- [ ] Inventory endpoint types (desk phones, Jabber, softphones)
- [ ] Identify video endpoints and conference room systems
- [ ] Document mobile and remote users
- [ ] Identify executive assistants and admin support users
- [ ] Document contact center agents (175 agents - Phase 2 dependency)
- [ ] Create user-to-site mapping spreadsheet

### 1.3 PSTN & DID Inventory
- [ ] Document PSTN connectivity per region (India, EMEA, Americas)
- [ ] Inventory DID ranges per site
- [ ] Document toll-free numbers (India 1800 series)
- [ ] Identify emergency services configuration (E911/E112)
- [ ] Document PSTN providers and contracts by region
- [ ] Verify number portability eligibility
- [ ] Document SIP trunk configurations
- [ ] Identify geographical restrictions (India DoT/TRAI compliance)

### 1.4 Feature Utilization Analysis
- [ ] Analyze hunt group usage and membership
- [ ] Document call park configurations
- [ ] Inventory busy lamp field (BLF) usage
- [ ] Document shared line appearances
- [ ] Analyze call pickup groups
- [ ] Document intercom and paging configurations
- [ ] Inventory speed dial and abbreviated dialing
- [ ] Document extension mobility usage
- [ ] Analyze mobile connect and single number reach
- [ ] Document voicemail features (Unity Connection)

### 1.5 Dial Plan Analysis
- [ ] Document internal extension plan (4-digit, 5-digit)
- [ ] Analyze route patterns and route lists
- [ ] Document translation patterns
- [ ] Inventory calling search spaces and partitions
- [ ] Document forced authorization codes (FAC)
- [ ] Analyze least cost routing rules
- [ ] Document abbreviated dialing and speed dials
- [ ] Identify dial plan complexities and overlaps

### 1.6 Call Flow & Dependencies
- [ ] Map call flows for inbound calls per site
- [ ] Document outbound call routing per region
- [ ] Analyze hunt group dependencies
- [ ] Document shared line dependencies
- [ ] Identify integration dependencies (CTI, TAPI, JTAPI)
- [ ] Document recording requirements by user group
- [ ] Analyze call center agent call flows (UCCX dependency)
- [ ] Map emergency call routing per site

### 1.7 Integration Assessment
- [ ] Document CRM integration (CTI pop, click-to-dial)
- [ ] Assess recording system integration (Verint, NICE)
- [ ] Document directory integration (LDAP, Active Directory)
- [ ] Analyze billing system integration
- [ ] Document wallboard and real-time displays
- [ ] Assess paging and overhead speaker integration
- [ ] Identify analog integrations (fax, door phones)
- [ ] Document third-party application dependencies

### 1.8 Network Readiness
- [ ] Assess Internet bandwidth per site
- [ ] Validate DIA (Direct Internet Access) circuits
- [ ] Document SD-WAN infrastructure (ABV-SDWAN-2024)
- [ ] Verify QoS configurations on network infrastructure
- [ ] Assess firewall rules and security policies
- [ ] Document DNS infrastructure
- [ ] Validate NTP synchronization
- [ ] Perform network latency and jitter testing

### 1.9 Compliance Requirements
- [ ] Document India DoT/TRAI toll bypass requirements
- [ ] Identify data residency requirements per region
- [ ] Document GDPR compliance for EMEA users
- [ ] Assess recording consent requirements by region
- [ ] Document emergency services compliance (E911/E112)
- [ ] Identify industry-specific compliance (PCI-DSS for contact center)
- [ ] Document data retention policies
- [ ] Assess cross-border data transfer requirements

### 1.10 Business Requirements
- [ ] Define migration timeline and business constraints
- [ ] Identify business-critical users and blackout dates
- [ ] Document feature parity requirements
- [ ] Define success criteria and KPIs
- [ ] Establish rollback thresholds
- [ ] Document training requirements
- [ ] Define support model post-migration
- [ ] Establish change management process

---

## Phase 2: Webex Calling Architecture Design

### 2.1 Tenant & Organization Design
- [ ] Design Webex organization structure
- [ ] Plan Control Hub administrative model
- [ ] Define delegated administration roles
- [ ] Design multi-geo tenant strategy
- [ ] Plan licensing allocation per user type
- [ ] Document authentication strategy (SSO, directory sync)
- [ ] Design domain verification approach
- [ ] Plan user import methodology

### 2.2 Location Design
- [ ] Create location hierarchy (12 sites)
- [ ] Assign users to locations
- [ ] Define location-specific settings per site
- [ ] Plan calling behavior per location
- [ ] Design location-based call routing
- [ ] Document location timezone settings
- [ ] Plan location-based emergency services
- [ ] Design announcement language per location

### 2.3 PSTN Design - India (Local Gateway)
- [ ] Design Local Gateway architecture for India sites
- [ ] Plan CUBE placement (Mumbai + Chennai hubs)
- [ ] Design SIP trunk configuration to Webex
- [ ] Plan trunk groups per location
- [ ] Design route groups and route lists
- [ ] Document dial plan translation rules
- [ ] Plan emergency call routing (E112)
- [ ] Design toll bypass compliance (DoT/TRAI)
- [ ] Plan failover and redundancy

### 2.4 PSTN Design - EMEA/Americas (Cloud Connected PSTN)
- [ ] Select Cloud Connected PSTN provider per region
- [ ] Design CCPP integration architecture
- [ ] Plan DID assignment per location
- [ ] Design inbound call routing
- [ ] Plan outbound call routing and restrictions
- [ ] Document emergency services configuration
- [ ] Design international calling policies
- [ ] Plan trunk capacity per location

### 2.5 Dial Plan Design
- [ ] Design enterprise dial plan (extension length)
- [ ] Plan site codes and location-based routing
- [ ] Design internal extension assignment
- [ ] Plan outbound dial permissions per user class
- [ ] Design abbreviated dialing and speed dials
- [ ] Plan international dialing format
- [ ] Design emergency services dialing
- [ ] Document dial plan migration approach

### 2.6 Calling Features Design
- [ ] Design call queue replacement for hunt groups
- [ ] Plan virtual line implementation for shared lines
- [ ] Design call park alternatives (group paging)
- [ ] Plan receptionist console solution
- [ ] Design music on hold strategy
- [ ] Plan call recording solution
- [ ] Design voicemail replacement (Cloud Voicemail)
- [ ] Plan executive assistant call handling

### 2.7 Integration Design
- [ ] Design Webex Calling API integrations
- [ ] Plan CRM connector implementation (CTI)
- [ ] Design recording platform integration
- [ ] Plan directory integration (Azure AD sync)
- [ ] Design analytics and reporting platform
- [ ] Plan presence integration with M365/Google Workspace
- [ ] Design wallboard integration
- [ ] Plan billing system integration

### 2.8 Coexistence Design
- [ ] Design CUCM-Webex Calling coexistence architecture
- [ ] Plan SIP trunk between CUCM and Webex Calling
- [ ] Design dial plan during coexistence phase
- [ ] Plan call routing between platforms
- [ ] Design shared line behavior during migration
- [ ] Plan hunt group behavior during migration
- [ ] Document coexistence testing procedures
- [ ] Design rollback strategy

### 2.9 Quality of Service Design
- [ ] Design media QoS markings (DSCP values)
- [ ] Plan signaling QoS markings
- [ ] Integrate with SD-WAN QoS policies (ABV-SDWAN-2024)
- [ ] Design Call Admission Control (CAC)
- [ ] Plan bandwidth reservation per site
- [ ] Document QoS testing procedures
- [ ] Design network monitoring for voice quality
- [ ] Plan troubleshooting tools and access

### 2.10 Security Design
- [ ] Design authentication and authorization model
- [ ] Plan MFA (Multi-Factor Authentication) rollout
- [ ] Design call encryption strategy
- [ ] Plan secure SIP trunk configuration (Local Gateway)
- [ ] Design fraud prevention policies
- [ ] Plan international calling restrictions
- [ ] Document security compliance requirements
- [ ] Design audit logging and retention

### 2.11 User Provisioning Design
- [ ] Design automated user provisioning workflow
- [ ] Plan directory sync approach (Azure AD, Okta)
- [ ] Design user attribute mapping
- [ ] Plan phone number assignment automation
- [ ] Design user template structure
- [ ] Plan bulk import methodology
- [ ] Document manual exception process
- [ ] Design de-provisioning workflow

### 2.12 Endpoint Design
- [ ] Select target endpoint models (MPP firmware)
- [ ] Design Webex App deployment strategy
- [ ] Plan soft client vs. desk phone allocation
- [ ] Design mobile app deployment
- [ ] Plan video endpoint migration
- [ ] Document device provisioning process
- [ ] Design device replacement program
- [ ] Plan endpoint licensing strategy

### 2.13 Emergency Services Design
- [ ] Design E911/E112 configuration per region
- [ ] Plan emergency location information database (ELIN)
- [ ] Document emergency callback procedures
- [ ] Design emergency notification workflow
- [ ] Plan emergency services testing procedures
- [ ] Document compliance with local regulations
- [ ] Design emergency services for remote workers
- [ ] Plan emergency services for mobile users

### 2.14 Monitoring & Analytics Design
- [ ] Design Control Hub monitoring dashboards
- [ ] Plan call quality analytics approach
- [ ] Design capacity monitoring and alerting
- [ ] Plan troubleshooting tools and access
- [ ] Document KPI tracking methodology
- [ ] Design user adoption dashboards
- [ ] Plan performance baseline establishment
- [ ] Document escalation procedures

### 2.15 Compliance & Data Residency
- [ ] Document data center selection per region
- [ ] Design data residency compliance (India, EMEA, US)
- [ ] Plan call recording storage location
- [ ] Document GDPR compliance measures (EMEA)
- [ ] Design India DoT/TRAI compliance architecture
- [ ] Plan cross-border data transfer controls
- [ ] Document audit trail requirements
- [ ] Design compliance reporting dashboards

---

## Phase 3: Pre-Deployment Preparation

### 3.1 Webex Tenant Setup
- [ ] Activate Webex organization
- [ ] Complete domain verification
- [ ] Configure SSO/SAML integration
- [ ] Set up directory synchronization
- [ ] Import initial user list (test batch)
- [ ] Configure organization settings
- [ ] Set up administrative roles
- [ ] Configure security policies

### 3.2 Licensing Procurement
- [ ] Procure Webex Calling licenses (3,200 users)
- [ ] Procure Webex Suite licenses (if bundled)
- [ ] Procure additional app licenses (Webex App)
- [ ] Procure Local Gateway licenses (India)
- [ ] Assign licenses to user accounts
- [ ] Document license allocation per site
- [ ] Configure license usage alerts
- [ ] Set up license renewal tracking

### 3.3 Network Preparation
- [ ] Update firewall rules for Webex Calling
- [ ] Configure DNS records for Webex services
- [ ] Validate Internet bandwidth per site
- [ ] Update QoS policies on network infrastructure
- [ ] Configure SD-WAN policies (ABV-SDWAN-2024)
- [ ] Test connectivity to Webex cloud services
- [ ] Validate media path routing
- [ ] Perform network baseline testing

### 3.4 Local Gateway Deployment (India)
- [ ] Deploy CUBE servers (Mumbai + Chennai)
- [ ] Configure SIP trunk to Webex Calling
- [ ] Configure SIP trunk to PSTN provider
- [ ] Configure dial plan translation rules
- [ ] Configure emergency call routing
- [ ] Configure toll bypass compliance
- [ ] Test inbound/outbound call routing
- [ ] Document Local Gateway configuration

### 3.5 Cloud Connected PSTN Setup (EMEA/Americas)
- [ ] Engage CCPP provider (EMEA)
- [ ] Engage CCPP provider (Americas)
- [ ] Configure CCPP integration with Webex
- [ ] Assign DIDs to locations
- [ ] Configure inbound call routing
- [ ] Configure outbound call permissions
- [ ] Test emergency services routing
- [ ] Validate international calling

### 3.6 Endpoint Preparation
- [ ] Procure Multiplatform firmware (MPP) phones
- [ ] Deploy Webex App to pilot users
- [ ] Configure device templates in Control Hub
- [ ] Set up device provisioning workflow
- [ ] Test device registration and calling
- [ ] Document endpoint deployment procedures
- [ ] Create user guides and quick reference cards
- [ ] Set up help desk support materials

### 3.7 Integration Development
- [ ] Configure CRM connector (Salesforce, Dynamics)
- [ ] Set up recording platform integration
- [ ] Configure directory sync (Azure AD, Okta)
- [ ] Deploy analytics and reporting platform
- [ ] Configure billing system integration
- [ ] Set up wallboard integration
- [ ] Test all integrations end-to-end
- [ ] Document integration support procedures

### 3.8 Coexistence Configuration
- [ ] Configure SIP trunk from CUCM to Webex Calling
- [ ] Configure route patterns for coexistence
- [ ] Set up translation patterns
- [ ] Configure calling search spaces for coexistence
- [ ] Test call routing between platforms
- [ ] Validate shared line behavior
- [ ] Test hunt group behavior
- [ ] Document coexistence troubleshooting

### 3.9 Training Materials Development
- [ ] Create user training curriculum
- [ ] Develop Webex App training materials
- [ ] Create desk phone quick reference guides
- [ ] Develop admin training materials
- [ ] Create help desk training program
- [ ] Record training videos and webinars
- [ ] Set up training environment (sandbox tenant)
- [ ] Schedule training sessions per migration batch

### 3.10 Testing & Validation
- [ ] Test inbound calls to pilot users
- [ ] Test outbound calls from pilot users
- [ ] Test internal calling between platforms
- [ ] Test emergency services calling
- [ ] Test call recording functionality
- [ ] Test voicemail functionality
- [ ] Test mobile app functionality
- [ ] Validate call quality and performance
- [ ] Test integration points (CRM, recording)
- [ ] Conduct user acceptance testing (UAT)

---

## Phase 4: Migration Batch Planning

### 4.1 Migration Batch Strategy
- [ ] Define migration batch groups (6 batches)
- [ ] Batch 1: IT pilot users (50 users)
- [ ] Batch 2: Non-critical business users (500 users)
- [ ] Batch 3: Regional offices - branches (800 users)
- [ ] Batch 4: Regional offices - hubs (600 users)
- [ ] Batch 5: Contact center agents (175 users) - **PHASE 2 DEPENDENCY**
- [ ] Batch 6: Executive and VIP users (1,075 users + remaining)
- [ ] Document batch sequencing and timeline
- [ ] Identify dependencies between batches
- [ ] Define go/no-go criteria per batch

### 4.2 Batch 1 Planning - IT Pilot (50 Users)
- [ ] Select IT pilot users
- [ ] Schedule pilot migration window
- [ ] Prepare pilot user communication
- [ ] Configure pilot user accounts in Webex
- [ ] Assign pilot user phone numbers
- [ ] Provision pilot user devices
- [ ] Schedule pilot user training
- [ ] Define pilot success criteria

### 4.3 Batch 2 Planning - Non-Critical Users (500 Users)
- [ ] Identify non-critical business users
- [ ] Schedule batch 2 migration window
- [ ] Prepare batch 2 user communication
- [ ] Configure batch 2 user accounts
- [ ] Assign batch 2 phone numbers
- [ ] Provision batch 2 devices
- [ ] Schedule batch 2 training
- [ ] Define batch 2 success criteria

### 4.4 Batch 3 Planning - Branch Sites (800 Users)
- [ ] Identify branch site users (Bangalore, Delhi, Noida, Pune, Hyderabad)
- [ ] Schedule batch 3 migration windows per site
- [ ] Prepare batch 3 user communication
- [ ] Configure batch 3 user accounts
- [ ] Assign batch 3 phone numbers
- [ ] Provision batch 3 devices
- [ ] Schedule batch 3 training
- [ ] Define batch 3 success criteria

### 4.5 Batch 4 Planning - Hub Sites (600 Users)
- [ ] Identify hub site users (Chennai, London, Frankfurt, New Jersey, Dallas)
- [ ] Schedule batch 4 migration windows per site
- [ ] Prepare batch 4 user communication
- [ ] Configure batch 4 user accounts
- [ ] Assign batch 4 phone numbers
- [ ] Provision batch 4 devices
- [ ] Schedule batch 4 training
- [ ] Define batch 4 success criteria

### 4.6 Batch 5 Planning - Contact Center Agents (175 Users)
- [ ] Identify contact center agents (Mumbai, Chennai, London, New Jersey)
- [ ] **CRITICAL: Coordinate with Phase 2 WxCC Migration**
- [ ] Schedule batch 5 migration window (Weekend cutover)
- [ ] Prepare batch 5 user communication
- [ ] Configure batch 5 user accounts
- [ ] Assign batch 5 phone numbers
- [ ] Provision batch 5 devices
- [ ] Schedule batch 5 training (separate CC-specific training)
- [ ] Define batch 5 success criteria
- [ ] **DEPENDENCY: 48-hour stability required before Phase 2 WxCC cutover**

### 4.7 Batch 6 Planning - Executive & Remaining Users (1,075 Users)
- [ ] Identify executive and VIP users (Mumbai HQ)
- [ ] Identify remaining users not in previous batches
- [ ] Schedule batch 6 migration window (Final cutover)
- [ ] Prepare batch 6 user communication
- [ ] Configure batch 6 user accounts
- [ ] Assign batch 6 phone numbers
- [ ] Provision batch 6 devices
- [ ] Schedule batch 6 training
- [ ] Define batch 6 success criteria

### 4.8 Rollback Planning
- [ ] Define rollback triggers per batch
- [ ] Document rollback procedures
- [ ] Test rollback process in lab environment
- [ ] Prepare rollback communication templates
- [ ] Assign rollback decision authority
- [ ] Document rollback testing procedures
- [ ] Define rollback time window per batch
- [ ] Prepare rollback resource allocation

### 4.9 Communication Planning
- [ ] Develop migration communication plan
- [ ] Create user notification templates
- [ ] Schedule pre-migration town halls
- [ ] Prepare FAQs and support documentation
- [ ] Set up migration status dashboards
- [ ] Create help desk escalation procedures
- [ ] Prepare executive briefing materials
- [ ] Schedule post-migration feedback sessions

### 4.10 Support Planning
- [ ] Define hypercare support model
- [ ] Schedule 24/7 support coverage during migration
- [ ] Set up war room for migration coordination
- [ ] Prepare help desk scripts and call flows
- [ ] Configure help desk ticketing system
- [ ] Schedule vendor TAC engagement (Cisco)
- [ ] Prepare on-site support resources
- [ ] Define issue escalation procedures

---

## Phase 5: Migration Execution

### 5.1 Batch 1 - IT Pilot Migration (50 Users)
- [ ] **Pre-Migration (T-7 days)**
  - [ ] Validate all prerequisites for Batch 1
  - [ ] Confirm pilot user training completion
  - [ ] Verify endpoint provisioning readiness
  - [ ] Complete pre-migration testing
  - [ ] Send final notification to pilot users

- [ ] **Migration Day (T-0)**
  - [ ] Activate war room support
  - [ ] Migrate pilot user accounts to Webex Calling
  - [ ] Provision Webex App and desk phones
  - [ ] Test inbound/outbound calls for all pilot users
  - [ ] Validate voicemail functionality
  - [ ] Test integration points (CRM, recording)
  - [ ] Monitor call quality and performance
  - [ ] Document all issues and resolutions

- [ ] **Post-Migration (T+1 to T+7)**
  - [ ] Provide 24/7 hypercare support
  - [ ] Monitor pilot user call quality
  - [ ] Collect pilot user feedback
  - [ ] Resolve all reported issues
  - [ ] Conduct lessons learned session
  - [ ] Update migration procedures based on feedback
  - [ ] Obtain business sign-off for Batch 2
  - [ ] Validate 7-day stability before proceeding

### 5.2 Batch 2 - Non-Critical Users (500 Users)
- [ ] **Pre-Migration (T-7 days)**
  - [ ] Validate Batch 1 stability (7 days minimum)
  - [ ] Confirm Batch 2 user training completion
  - [ ] Verify endpoint provisioning for 500 users
  - [ ] Complete pre-migration testing
  - [ ] Send final notification to Batch 2 users

- [ ] **Migration Day (T-0)**
  - [ ] Activate war room support
  - [ ] Migrate 500 user accounts to Webex Calling
  - [ ] Provision Webex App and desk phones
  - [ ] Test sample calls for each department
  - [ ] Validate voicemail functionality
  - [ ] Monitor call quality across all sites
  - [ ] Document all issues and resolutions

- [ ] **Post-Migration (T+1 to T+5)**
  - [ ] Provide extended hypercare support
  - [ ] Monitor user call quality
  - [ ] Resolve all reported issues
  - [ ] Validate 5-day stability before proceeding
  - [ ] Obtain business sign-off for Batch 3

### 5.3 Batch 3 - Branch Sites (800 Users)
- [ ] **Pre-Migration (T-7 days)**
  - [ ] Validate Batch 2 stability (5 days minimum)
  - [ ] Confirm Batch 3 user training completion (per site)
  - [ ] Verify endpoint provisioning for 800 users
  - [ ] Validate branch site network readiness
  - [ ] Complete pre-migration testing per branch
  - [ ] Send final notification to Batch 3 users

- [ ] **Migration Approach**
  - [ ] Staggered approach: One branch per weekend
  - [ ] Week 1: Bangalore (200 users)
  - [ ] Week 2: Delhi (150 users)
  - [ ] Week 3: Noida (150 users)
  - [ ] Week 4: Pune (150 users)
  - [ ] Week 5: Hyderabad (150 users)

- [ ] **Per-Branch Migration Day (T-0)**
  - [ ] Activate war room support
  - [ ] Migrate branch user accounts to Webex Calling
  - [ ] Provision Webex App and desk phones
  - [ ] Test inbound/outbound calls from branch
  - [ ] Validate branch-to-hub calling
  - [ ] Monitor call quality
  - [ ] Document all issues and resolutions

- [ ] **Post-Migration Per Branch (T+1 to T+3)**
  - [ ] Provide on-site support (2 days)
  - [ ] Monitor branch call quality
  - [ ] Resolve all reported issues
  - [ ] Validate 3-day stability before next branch
  - [ ] Obtain business sign-off before proceeding

### 5.4 Batch 4 - Hub Sites (600 Users)
- [ ] **Pre-Migration (T-7 days)**
  - [ ] Validate all Batch 3 branches stable
  - [ ] Confirm Batch 4 user training completion (per hub)
  - [ ] Verify endpoint provisioning for 600 users
  - [ ] Validate hub site network readiness
  - [ ] Complete pre-migration testing per hub
  - [ ] Send final notification to Batch 4 users

- [ ] **Migration Approach**
  - [ ] Staggered approach: One hub per weekend
  - [ ] Week 1: Chennai (150 users)
  - [ ] Week 2: London (100 users)
  - [ ] Week 3: Frankfurt (50 users)
  - [ ] Week 4: New Jersey (150 users)
  - [ ] Week 5: Dallas (150 users)

- [ ] **Per-Hub Migration Day (T-0)**
  - [ ] Activate war room support
  - [ ] Migrate hub user accounts to Webex Calling
  - [ ] Provision Webex App and desk phones
  - [ ] Test inbound/outbound calls from hub
  - [ ] Validate hub-to-branch calling
  - [ ] Validate PSTN connectivity (Local Gateway for India)
  - [ ] Monitor call quality
  - [ ] Document all issues and resolutions

- [ ] **Post-Migration Per Hub (T+1 to T+5)**
  - [ ] Provide on-site support (3 days)
  - [ ] Monitor hub call quality
  - [ ] Resolve all reported issues
  - [ ] Validate 5-day stability before next hub
  - [ ] Obtain business sign-off before proceeding

### 5.5 Batch 5 - Contact Center Agents (175 Users)
- [ ] **CRITICAL: Phase 2 WxCC Dependency**
  - [ ] **This batch is a HARD GATE for Phase 2 UCCX-to-WxCC migration**
  - [ ] **Once CC agents move to Webex Calling, they cannot receive UCCX calls**
  - [ ] **WxCC must be ready for cutover immediately after Batch 5 stability**

- [ ] **Pre-Migration (T-14 days)**
  - [ ] Validate all Batch 4 hubs stable
  - [ ] Confirm Phase 2 WxCC implementation complete (Chapter 6)
  - [ ] Confirm Batch 5 user training completion (CC-specific)
  - [ ] Verify endpoint provisioning for 175 agents
  - [ ] Validate agent desk network readiness
  - [ ] Complete pre-migration testing for CC agents
  - [ ] Coordinate with WxCC implementation team
  - [ ] Send final notification to Batch 5 users

- [ ] **Migration Day (T-0) - Weekend Cutover**
  - [ ] Activate 24/7 war room support
  - [ ] Migrate 175 CC agent accounts to Webex Calling
  - [ ] Provision Webex App and desk phones for agents
  - [ ] Test inbound calls to agent numbers
  - [ ] Test outbound calls from agent numbers
  - [ ] Validate voicemail functionality for agents
  - [ ] **DO NOT cut over to WxCC yet - agents on basic Webex Calling only**
  - [ ] Monitor call quality for all agents
  - [ ] Document all issues and resolutions

- [ ] **Post-Migration Stability Period (T+1 to T+2)**
  - [ ] **CRITICAL: 48-hour stability required before WxCC cutover**
  - [ ] Provide 24/7 hypercare support for CC agents
  - [ ] Monitor agent call quality continuously
  - [ ] Resolve all P1/P2 issues immediately
  - [ ] Validate agent-to-supervisor calling
  - [ ] Confirm zero call quality degradation
  - [ ] Obtain CC Operations Manager sign-off
  - [ ] **GATE: If stable, proceed to Phase 2 WxCC cutover**
  - [ ] **If unstable, delay Phase 2 until resolved**

- [ ] **Handoff to Phase 2 WxCC Migration (T+3)**
  - [ ] Confirm all Batch 5 agents stable on Webex Calling
  - [ ] Provide agent list to WxCC migration team
  - [ ] Coordinate WxCC cutover timing
  - [ ] Maintain war room support during WxCC cutover
  - [ ] Monitor voice quality during WxCC activation
  - [ ] Document all integration issues

### 5.6 Batch 6 - Executive & Remaining Users (1,075 Users)
- [ ] **Pre-Migration (T-7 days)**
  - [ ] Validate Batch 5 + Phase 2 WxCC stability
  - [ ] Confirm Batch 6 user training completion
  - [ ] Verify endpoint provisioning for 1,075 users
  - [ ] Validate Mumbai HQ network readiness
  - [ ] Complete pre-migration testing
  - [ ] Schedule executive white-glove support
  - [ ] Send final notification to Batch 6 users

- [ ] **Migration Approach**
  - [ ] Phased approach within Mumbai HQ
  - [ ] Week 1: Non-executive users (500 users)
  - [ ] Week 2: Middle management (300 users)
  - [ ] Week 3: Senior management (200 users)
  - [ ] Week 4: C-level executives (75 users + VIPs)

- [ ] **Per-Phase Migration Day (T-0)**
  - [ ] Activate war room support
  - [ ] Migrate phase user accounts to Webex Calling
  - [ ] Provision Webex App and premium desk phones
  - [ ] Test inbound/outbound calls for all users
  - [ ] Provide white-glove executive support
  - [ ] Monitor call quality
  - [ ] Document all issues and resolutions

- [ ] **Post-Migration Per Phase (T+1 to T+3)**
  - [ ] Provide dedicated executive support
  - [ ] Monitor call quality for all users
  - [ ] Resolve all reported issues
  - [ ] Validate 3-day stability before next phase
  - [ ] Obtain business sign-off before proceeding

- [ ] **Final Cutover Completion**
  - [ ] Verify all 3,200 users migrated successfully
  - [ ] Validate zero users remaining on CUCM
  - [ ] Confirm all integrations functional
  - [ ] Complete final migration report
  - [ ] Obtain executive sign-off for project completion

### 5.7 Per-Batch Validation Checklist
**Execute this checklist after each batch migration:**
- [ ] Verify all users in batch successfully migrated
- [ ] Test inbound calls to all users
- [ ] Test outbound calls from all users
- [ ] Validate internal calling between platforms
- [ ] Test voicemail functionality
- [ ] Verify call recording (if applicable)
- [ ] Test CRM integration (CTI pop)
- [ ] Validate emergency services calling
- [ ] Monitor call quality metrics
- [ ] Resolve all P1/P2 issues
- [ ] Collect user feedback
- [ ] Update migration runbook with lessons learned
- [ ] Obtain business sign-off before next batch

### 5.8 Issue Management
- [ ] Establish issue tracking system
- [ ] Define issue severity levels (P1/P2/P3/P4)
- [ ] Create issue escalation matrix
- [ ] Schedule daily issue review meetings
- [ ] Document all issues and resolutions
- [ ] Track issue trends and root causes
- [ ] Implement preventive measures
- [ ] Conduct lessons learned sessions

### 5.9 Go/No-Go Decision Points
**Execute this checklist before each batch migration:**
- [ ] Previous batch stable for minimum duration
- [ ] All prerequisites complete for current batch
- [ ] Training completion >95% for current batch
- [ ] Endpoint provisioning 100% complete
- [ ] Network readiness validated
- [ ] Integration testing passed
- [ ] No open P1/P2 issues from previous batch
- [ ] Business owner approval obtained
- [ ] Support resources confirmed available
- [ ] Rollback plan validated

### 5.10 Rollback Execution (If Required)
- [ ] Activate rollback decision authority
- [ ] Notify all stakeholders of rollback
- [ ] Execute rollback procedures per batch
- [ ] Revert users to CUCM platform
- [ ] Restore original dial plan
- [ ] Validate call functionality post-rollback
- [ ] Conduct root cause analysis
- [ ] Document lessons learned
- [ ] Plan remediation before retry
- [ ] Schedule new migration attempt

---

## Phase 6: Post-Migration Optimization

### 6.1 Performance Monitoring (First 30 Days)
- [ ] Monitor call quality metrics daily
- [ ] Track call completion rates
- [ ] Monitor call setup time
- [ ] Analyze codec usage
- [ ] Monitor bandwidth utilization
- [ ] Track PSTN trunk utilization
- [ ] Monitor emergency services calls
- [ ] Generate daily performance reports

### 6.2 User Adoption
- [ ] Monitor Webex App adoption rates
- [ ] Track feature utilization (voicemail, call forwarding)
- [ ] Analyze mobile app usage
- [ ] Monitor video calling adoption
- [ ] Track help desk ticket volume and trends
- [ ] Conduct user satisfaction surveys
- [ ] Identify additional training needs
- [ ] Schedule follow-up training sessions

### 6.3 Integration Optimization
- [ ] Monitor CRM integration performance
- [ ] Optimize recording platform settings
- [ ] Tune directory sync frequency
- [ ] Optimize analytics and reporting
- [ ] Fine-tune wallboard integration
- [ ] Validate billing system accuracy
- [ ] Monitor API usage and throttling
- [ ] Document integration best practices

### 6.4 Cost Optimization
- [ ] Analyze PSTN usage and costs
- [ ] Optimize trunk capacity per site
- [ ] Review licensing allocation
- [ ] Identify unused licenses
- [ ] Optimize calling policies to reduce costs
- [ ] Review CCPP provider invoices
- [ ] Analyze international calling costs
- [ ] Generate cost savings report

### 6.5 Capacity Planning
- [ ] Analyze trunk capacity utilization
- [ ] Monitor concurrent call peaks
- [ ] Assess bandwidth utilization trends
- [ ] Plan for seasonal call volume increases
- [ ] Identify capacity constraints
- [ ] Plan trunk capacity upgrades (if needed)
- [ ] Document capacity planning procedures
- [ ] Schedule quarterly capacity reviews

### 6.6 Feature Enhancements
- [ ] Identify additional features to enable
- [ ] Plan executive assistant features rollout
- [ ] Enable advanced call queue features
- [ ] Activate Webex Calling analytics
- [ ] Enable voicemail transcription
- [ ] Activate call history search
- [ ] Enable advanced dial plan features
- [ ] Plan Webex Suite feature adoption

### 6.7 Security Hardening
- [ ] Review and harden calling policies
- [ ] Enable fraud detection alerts
- [ ] Implement toll fraud prevention
- [ ] Review international calling restrictions
- [ ] Enable MFA for all admin accounts
- [ ] Conduct security audit
- [ ] Implement least privilege access
- [ ] Schedule periodic security reviews

### 6.8 Documentation Updates
- [ ] Update as-built documentation
- [ ] Document final dial plan
- [ ] Update network diagrams
- [ ] Document all integrations
- [ ] Update user guides and FAQs
- [ ] Create admin runbooks
- [ ] Document troubleshooting procedures
- [ ] Archive migration project documentation

### 6.9 Knowledge Transfer
- [ ] Conduct admin training for BAU team
- [ ] Train help desk on common issues
- [ ] Document operational procedures
- [ ] Create troubleshooting decision trees
- [ ] Schedule knowledge transfer sessions
- [ ] Provide access to Control Hub
- [ ] Document vendor escalation procedures
- [ ] Complete knowledge transfer sign-off

### 6.10 Hypercare Transition
- [ ] Transition from hypercare to BAU support
- [ ] Reduce war room support hours
- [ ] Establish regular support coverage
- [ ] Define SLA for issue resolution
- [ ] Establish change management process
- [ ] Schedule weekly operations reviews
- [ ] Document support escalation procedures
- [ ] Close hypercare support activities

---

## Phase 7: CUCM Decommissioning

### 7.1 CUCM Decommissioning Prerequisites
- [ ] **CRITICAL: Verify all 3,200 users successfully migrated**
- [ ] **CRITICAL: Verify Phase 2 WxCC migration complete and stable**
- [ ] Confirm zero users remain on CUCM
- [ ] Validate all PSTN trunks migrated or disconnected
- [ ] Confirm all integrations migrated
- [ ] Verify all phone numbers ported or assigned
- [ ] Confirm all recordings migrated (if applicable)
- [ ] Obtain business sign-off for decommissioning

### 7.2 CUCM Decommission Plan
- [ ] Document current CUCM configuration (final backup)
- [ ] Identify dependent systems (UCCX, Unity, IM&P)
- [ ] Plan CUCM shutdown sequence
- [ ] **Coordinate with Phase 2: UCCX decommission after WxCC stable**
- [ ] Plan Unity Connection decommissioning
- [ ] Plan IM&P decommissioning (if not migrated)
- [ ] Plan Expressway decommissioning (if not needed)
- [ ] Document rollback window and procedures

### 7.3 CUCM Shutdown Procedure
- [ ] **GATE: Minimum 30 days post-migration stability required**
- [ ] Final validation: Zero active registrations on CUCM
- [ ] Disable auto-registration on CUCM
- [ ] Disable TFTP services on CUCM
- [ ] Disable SIP/SCCP services on CUCM
- [ ] Shutdown CUCM subscriber nodes
- [ ] Shutdown CUCM publisher node
- [ ] Disconnect PSTN trunks from CUBE
- [ ] Document shutdown completion

### 7.4 Dependent System Decommissioning
- [ ] **Unity Connection**
  - [ ] Verify all voicemails migrated to Cloud Voicemail
  - [ ] Disable Unity Connection services
  - [ ] Archive Unity Connection data (if required)
  - [ ] Shutdown Unity Connection servers
  
- [ ] **IM&P (Presence)**
  - [ ] Verify users migrated to Webex App messaging
  - [ ] Disable IM&P services
  - [ ] Shutdown IM&P servers (if not retained)
  
- [ ] **Expressway (MRA)**
  - [ ] Verify Webex App mobile access functional
  - [ ] Disable Expressway services (if not retained for other apps)
  - [ ] Archive Expressway configuration

### 7.5 Hardware Disposition
- [ ] Power down all CUCM servers
- [ ] Power down Unity Connection servers
- [ ] Power down IM&P servers
- [ ] Remove servers from data center racks
- [ ] Sanitize server hard drives (secure erase)
- [ ] Return leased hardware to vendor
- [ ] Dispose of owned hardware per IT policy
- [ ] Update asset inventory

### 7.6 License Management
- [ ] Return CUCM licenses to Cisco (if applicable)
- [ ] Cancel CUCM SmartNet contracts
- [ ] Cancel Unity Connection licenses
- [ ] Cancel IM&P licenses
- [ ] Cancel PSTN provider contracts (if migrated)
- [ ] Document license cost savings
- [ ] Update license inventory

### 7.7 Data Archival
- [ ] Archive final CUCM configuration files
- [ ] Archive CUCM CDR (Call Detail Records)
- [ ] Archive Unity Connection voicemail data
- [ ] Archive IM&P chat history (if required)
- [ ] Archive all system logs
- [ ] Document archival location and retention period
- [ ] Verify archived data accessibility

### 7.8 Final Documentation
- [ ] Create decommissioning completion report
- [ ] Document lessons learned
- [ ] Update network architecture diagrams
- [ ] Update IT asset inventory
- [ ] Archive project documentation
- [ ] Obtain final sign-off from business owners
- [ ] Close project formally

---

## Phase 8: Steady-State Operations

### 8.1 Operational Dashboards
- [ ] Configure Control Hub monitoring dashboards
- [ ] Set up call quality analytics dashboards
- [ ] Create capacity utilization dashboards
- [ ] Configure user adoption dashboards
- [ ] Set up PSTN trunk utilization monitoring
- [ ] Create compliance monitoring dashboards
- [ ] Configure security and fraud detection dashboards
- [ ] Schedule regular dashboard reviews

### 8.2 Alerting & Notifications
- [ ] Configure critical service alerts
- [ ] Set up call quality degradation alerts
- [ ] Configure trunk capacity threshold alerts
- [ ] Set up emergency services failure alerts
- [ ] Configure fraud detection alerts
- [ ] Set up integration failure alerts
- [ ] Configure license usage alerts
- [ ] Test all alert notifications

### 8.3 Incident Management
- [ ] Establish incident management process
- [ ] Define incident severity levels
- [ ] Create incident response procedures
- [ ] Document escalation matrix
- [ ] Set up on-call rotation
- [ ] Define SLA for incident resolution
- [ ] Conduct incident response drills
- [ ] Track incident metrics (MTTR, MTBF)

### 8.4 Change Management
- [ ] Establish change management process
- [ ] Define change approval workflow
- [ ] Create change request templates
- [ ] Schedule maintenance windows
- [ ] Document change procedures
- [ ] Conduct post-change reviews
- [ ] Track change success rate
- [ ] Maintain change calendar

### 8.5 Capacity Management
- [ ] Monitor trunk capacity utilization
- [ ] Track concurrent call peaks
- [ ] Analyze bandwidth utilization trends
- [ ] Plan for business growth
- [ ] Schedule capacity planning reviews
- [ ] Document capacity expansion procedures
- [ ] Forecast license requirements
- [ ] Plan infrastructure scaling

### 8.6 Performance Management
- [ ] Track call quality metrics (MOS, latency, jitter, packet loss)
- [ ] Monitor call completion rates
- [ ] Track call setup time
- [ ] Analyze codec distribution
- [ ] Monitor PSTN trunk performance
- [ ] Track emergency services call success rate
- [ ] Generate monthly performance reports
- [ ] Conduct quarterly performance reviews

### 8.7 User Support
- [ ] Establish help desk procedures
- [ ] Create support knowledge base
- [ ] Document common issues and resolutions
- [ ] Train help desk staff
- [ ] Set up ticketing system
- [ ] Define support SLA
- [ ] Monitor support ticket trends
- [ ] Conduct user satisfaction surveys

### 8.8 Compliance Monitoring
- [ ] Monitor India DoT/TRAI toll bypass compliance
- [ ] Validate emergency services functionality
- [ ] Monitor call recording consent compliance
- [ ] Track data residency compliance
- [ ] Conduct periodic compliance audits
- [ ] Generate compliance reports
- [ ] Document compliance evidence
- [ ] Schedule annual compliance reviews

### 8.9 Security Operations
- [ ] Monitor fraud detection alerts
- [ ] Review international calling patterns
- [ ] Audit admin access logs
- [ ] Validate MFA usage
- [ ] Conduct security audits
- [ ] Review security policies quarterly
- [ ] Track security incidents
- [ ] Update security documentation

### 8.10 Continuous Improvement
- [ ] Collect user feedback regularly
- [ ] Analyze support ticket trends
- [ ] Identify process improvement opportunities
- [ ] Evaluate new Webex features
- [ ] Plan feature adoption roadmap
- [ ] Optimize calling policies
- [ ] Conduct quarterly operations reviews
- [ ] Document best practices

---

## Appendix: Critical Success Factors

### Technical Requirements
- [ ] All 3,200 users successfully migrated to Webex Calling
- [ ] All PSTN connectivity operational (Local Gateway + CCPP)
- [ ] Call quality metrics meet baseline (MOS >4.0)
- [ ] All integrations functional (CRM, recording, directory)
- [ ] Emergency services calling validated per region
- [ ] Zero open P1/P2 issues post-migration
- [ ] CUCM decommissioned successfully
- [ ] Phase 2 WxCC dependency satisfied (Batch 5 agents stable)

### Business Requirements
- [ ] Zero unplanned business downtime during migration
- [ ] User adoption >90% for Webex App
- [ ] Help desk ticket volume <5% of user base
- [ ] Cost savings targets achieved
- [ ] Migration completed within timeline
- [ ] Business owner sign-off obtained
- [ ] User satisfaction score >80%
- [ ] All compliance requirements met

### Compliance Requirements
- [ ] India DoT/TRAI toll bypass compliance validated
- [ ] GDPR compliance validated (EMEA)
- [ ] Emergency services compliance validated (all regions)
- [ ] Call recording consent compliance validated
- [ ] Data residency requirements met
- [ ] Audit trail complete and accessible
- [ ] Compliance reports generated
- [ ] Annual compliance reviews scheduled

### Risk Mitigation
- [ ] Rollback procedures tested and documented
- [ ] 24/7 support coverage during migration
- [ ] Vendor escalation paths established
- [ ] All critical incidents documented
- [ ] Lessons learned captured
- [ ] Backup configurations preserved
- [ ] Disaster recovery plan validated
- [ ] Business continuity plan updated

---

## Sign-Off

### Project Completion Checklist
- [ ] All 6 migration batches completed successfully
- [ ] All 3,200 users migrated to Webex Calling
- [ ] Phase 2 dependency satisfied (CC agents stable on Webex Calling)
- [ ] All testing passed (functional, integration, performance)
- [ ] CUCM decommissioned (post-Phase 2 WxCC stability)
- [ ] Documentation complete (as-built, runbooks, procedures)
- [ ] Training delivered (users, admins, help desk)
- [ ] Knowledge transfer complete
- [ ] Operations team handover complete
- [ ] Project closure report submitted
- [ ] Lessons learned documented

### Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Manager | | | |
| Collaboration Architect | | | |
| Network Architect | | | |
| Security Architect | | | |
| IT Director | | | |
| Operations Manager | | | |
| Business Owner | | | |

---

## Document Cross-Reference

### Related CUCM-Webex Calling Documentation
| Chapter | Document | Reference |
|---------|----------|-----------|
| Chapter 1 | Discovery & Current State | Section 1.1 - 1.5 |
| Chapter 2 | Webex Calling Design | Section 2.1 - 2.6 |
| Chapter 4 | Security & Compliance | Section 4.1 - 4.6 |
| Chapter 5 | DNS & Network Architecture | Section 5.1 - 5.7 |
| Chapter 6 | Implementation & Deployment | Section 6.1 - 6.3 |
| Chapter 7 | Migration Execution | Section 7.1 - 7.4 |
| Chapter 8 | Operations & Day 2 | Section 8.1 - 8.5 |
| Appendices | Reference Materials | Appendix A - L |

### Related Infrastructure Projects
| Project | Integration Point | Reference |
|---------|------------------|-----------|
| ABV-SDWAN-2024 | QoS and Media Routing | SD-WAN Master Checklist Phase 4 |
| ABV-SDA-ISE-2025 | Network Policy and SGT | DNAC-ISE Master Checklist Phase 5 |
| ABV-COLLAB-MIG-2026-P2 | WxCC Migration Dependency | UCCX-WxCC Master Checklist Phase 1 |

### Phase 2 UCCX-to-WxCC Dependency
| Dependency | Description | Checklist Reference |
|-----------|-------------|---------------------|
| **Batch 5 Completion** | 175 CC agents migrated to Webex Calling | Phase 5.5 |
| **48-Hour Stability** | Mandatory stability before WxCC cutover | Phase 5.5 Post-Migration |
| **Hard Gate** | Phase 2 cannot start until Batch 5 stable | UCCX-WxCC Checklist Phase 1.1 |
| **No Parallel Operation** | UCCX requires CUCM CTI connectivity | UCCX-WxCC Checklist Phase 1.1 |

---

## Quick Reference: Phase Summary

| Phase | Focus Area | Key Deliverables | Duration |
|-------|------------|------------------|----------|
| 1 | Discovery & Assessment | Infrastructure inventory, feature analysis | 2-3 weeks |
| 2 | Architecture Design | Webex Calling design, PSTN strategy, dial plan | 3-4 weeks |
| 3 | Pre-Deployment | Tenant setup, licensing, network prep, Local Gateway | 4-6 weeks |
| 4 | Batch Planning | 6 migration batches defined, training materials | 2-3 weeks |
| 5 | Migration Execution | All 6 batches migrated, 3,200 users on Webex | 14-16 weeks |
| 6 | Post-Migration | Performance optimization, user adoption | 4 weeks |
| 7 | CUCM Decommission | CUCM/Unity/IM&P shutdown, hardware disposition | 2 weeks |
| 8 | Steady-State Operations | BAU handover, monitoring, continuous improvement | Ongoing |

---

## Quick Reference: Migration Batch Summary

| Batch | Users | User Type | Timeline | Dependencies |
|-------|-------|-----------|----------|--------------|
| Batch 1 | 50 | IT Pilot | Week 1 | None |
| Batch 2 | 500 | Non-Critical Users | Week 3-4 | Batch 1 stable 7 days |
| Batch 3 | 800 | Branch Sites | Week 6-10 (1 branch/week) | Batch 2 stable 5 days |
| Batch 4 | 600 | Hub Sites | Week 12-16 (1 hub/week) | Batch 3 stable 5 days |
| **Batch 5** | **175** | **Contact Center Agents** | **Week 18** | **Batch 4 stable + Phase 2 WxCC ready** |
| Batch 6 | 1,075 | Executive & Remaining | Week 20-23 | **Batch 5 + Phase 2 WxCC stable** |

**CRITICAL GATE:** Batch 5 must achieve 48-hour stability before Phase 2 UCCX-to-WxCC migration can proceed.

---

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Organization:** Abhavtech  
**Classification:** Internal Use  
**Cross-Reference:** UCCX-WxCC Master Checklist (Phase 2)

---

*End of CUCM-to-Webex Calling Migration Checklist*
