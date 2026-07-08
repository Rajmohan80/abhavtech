# SD-Access Deployment Planning Guide

<span class="ai-badge">AI-Assisted Documentation</span>
### Introduction

This is a comprehensive guide for planning and designing Cisco SD-Access fabric deployments. It provides:

✅ **Greenfield deployments** (new network from scratch)  
✅ **Migration scenarios** (traditional network → SD-Access)  
✅ **Hardware selection methodology** (formulas and decision trees)  
✅ **Capacity planning frameworks** (traffic analysis, growth projection)  
✅ **Traffic flow analysis** (5 patterns, latency, bandwidth)  
✅ **Firewall integration design** (placement, SGT via SXP)  
✅ **Reusable templates** (fill-in-the-blank planning worksheets)

---

### Quick Start Guide

#### For New Deployments:
1. Read **Package Overview** (Part 2) — 30 minutes
2. Review **Critical Formulas** (Part 3) — 1 hour
3. Gather your requirements (users, sites, square footage)
4. Use formulas to size Border, CP, Edge, WLC
5. Document in template spreadsheets

#### For Learning/Study:
1. **Quick Reference Guide** (Part 3) — Start with formulas
2. **Hardware Selection Guide** — Platform comparisons
3. Practice with hypothetical deployments

#### For Design Validation:
1. Use **Decision Trees** (Part 3)
2. Verify calculations against formulas
3. Check **Common Design Mistakes** section

**Estimated time for complete planning**: 2-5 days (depending on complexity)

---

### Package Overview

This documentation package provides everything needed to plan, design, and deploy Cisco SD-Access fabric in enterprise environments.

#### What's Covered:

**Planning & Design**
- Business objectives and scope definition
- Site profiling and classification
- Architecture pattern selection
- Hardware selection methodology
- Capacity planning frameworks

**Implementation**
- Migration strategies (traditional → SD-Access)
- Firewall integration (placement, SGT via SXP)
- Traffic flow analysis and optimization
- QoS, monitoring, operational design

**Validation**
- Pre-deployment checklists
- Post-deployment validation
- Common mistakes and how to avoid them
- Troubleshooting guides

---

### Document Inventory

#### PRIMARY DOCUMENTS

| # | Document | Type | Purpose | Use When |
|---|----------|------|---------|----------|
| **1** | **Deployment Planning Template** | Workbook | Planning any deployment | Starting new project |
| **2** | **Hardware/Capacity Design Guide** | Reference | Methodology with formulas | Need detailed explanations |
| **3** | **Quick Reference Guide** | Cheat Sheet | Formulas, decision trees, FAQ | Quick lookups during design |

#### SUPPORTING DOCUMENTS

| # | Document | Type | Purpose | Use When |
|---|----------|------|---------|----------|
| **4** | **Site Infrastructure Inventory** | Template | Hardware BoM by site | Creating BoM |
| **5** | **DNAC/ISE Capacity Details** | Template | Management sizing | Planning DNAC/ISE |
| **6** | **Traffic Flow Matrix** | Template | Traffic documentation | Traffic analysis |
| **7** | **SGT Policy Matrix** | Template | TrustSec policies | Security design |
| **8** | **Firewall Integration Design** | Guide | Firewall placement | Firewall planning |
| **9** | **Additional Design Elements** | Guide | Monitoring, QoS, ops | Operational design |
| **10** | **Project Executive Summary** | Template | Costs, timeline, risks | Executive presentations |

---

### Usage Scenarios

#### SCENARIO 1: Starting a New Greenfield Deployment

**You are**: Planning a brand new SD-Access network (new campus or building)

**Workflow**:

**Step 1: Define Requirements** (2-4 hours)
- Document #1: Deployment Planning Template → Section 1
- Define business objectives and scope
- Identify success criteria
- Determine budget and timeline constraints

**Step 2: Profile Sites** (4-8 hours)
- Document #1 → Section 3
- List all sites with user counts, buildings, square footage
- Classify sites by size (Small/Medium/Large)
- Identify special requirements (high-density, outdoor coverage)

**Step 3: Size Hardware** (1-2 days)
- Document #3: Quick Reference Guide → Critical Formulas
- Calculate Border load (exclude edge-to-edge traffic!)
- Determine CP port requirements (check for intermediate nodes)
- Size Edge switches (ports + PoE)
- Calculate WLC capacity (square footage / coverage)

**Step 4: Select Platforms** (2-4 hours)
- Document #3 → Hardware Selection Guide
- Choose Border platform (4× border load)
- Select CP platform (port count, not throughput)
- Pick Edge model (PoE requirements)
- Choose WLC model (AP capacity + headroom)

**Step 5: Create BoM** (1 day)
- Document #4: Site Infrastructure Inventory
- List all hardware with quantities
- Obtain pricing from vendor
- Calculate total cost (CapEx + OpEx)

**Step 6: Executive Summary** (4 hours)
- Document #10: Project Executive Summary
- Present costs, timeline, resources
- Document risks and mitigation
- Get approval

**Output**: Completed planning package ready for procurement

**Total Time**: 2-3 days for medium deployment

---

#### SCENARIO 2: Migrating from Traditional Network to SD-Access

**You are**: Replacing existing campus network with SD-Access fabric

**Workflow**:

**Step 1: Current State Assessment** (1-2 days)
- Document #1 → Section 2.2
- Inventory existing infrastructure
- Document current VLANs and IP addressing
- Assess routing protocols (OSPF, EIGRP)
- Evaluate 802.1X readiness
- Identify reusable equipment

**Step 2: Gap Analysis** (4-8 hours)
- Compare current vs. SD-Access requirements
- Document IP address strategy (reuse or renumber)
- Assess security posture (SGT readiness)
- Identify training needs

**Step 3: Migration Strategy** (1 day)
- Document #1 → Section 8: Migration Planning
- Choose approach:
  - **Forklift**: Complete replacement (fastest, highest cost)
  - **Phased**: Building-by-building (gradual, lower risk)
  - **Parallel**: Run side-by-side (most complex, safest)
- Document coexistence design
- Plan rollback procedures

**Step 4: Phasing Plan** (1-2 days)
- Define migration phases (pilot, production, completion)
- Identify pilot site/building
- Schedule user migrations
- Plan communication strategy

**Step 5: Prerequisites** (ongoing)
- Complete prerequisite checklist:
  - [ ] IS-IS underlay configured
  - [ ] DNAC deployed and accessible
  - [ ] ISE deployed with 802.1X
  - [ ] IP addressing finalized
  - [ ] SGT policies designed
  - [ ] Firewall integration tested

**Step 6: Execute Migration** (weeks to months)
- Follow phase plan
- Validate each phase before proceeding
- Monitor closely during cutover
- Be ready to rollback if needed

**Output**: Migration plan with phasing, coexistence, rollback procedures

**Total Time**: 4-5 days for planning (execution varies)

---

#### SCENARIO 3: Preparing for Architecture Interview or Presentation

**You are**: Presenting SD-Access design to stakeholders or interviewing

**Study Plan**:

**Week 1: Fundamentals** (10 hours)
- Document #3: Quick Reference Guide → Complete read
- Memorize critical formulas:
  - Border load calculation
  - CP port requirements
  - Intermediate node decision
  - WLC sizing
- Understand 5 traffic patterns
- Learn SGT enforcement points

**Week 2: Common Mistakes** (8 hours)
- Document #3 → Common Design Mistakes section
- Understand why each mistake happens
- Practice correcting mistakes in sample designs
- Review decision trees

**Week 3: Practice** (12 hours)
- Design 3 hypothetical deployments:
  - Small branch (300 users)
  - Medium hub (2,000 users)
  - Large campus (5,000 users)
- Validate designs using decision trees
- Practice explaining decisions

**Key Topics to Master**:
- Why border load ≠ total site traffic
- When intermediate nodes are required
- Why always 2× CP nodes
- Centralized vs distributed DNAC
- SGT enforcement architecture
- Migration strategies

**Practice Questions**:
1. "Why can't we use a single CP node to save cost?"
2. "How do you size the Border platform?"
3. "When do you need intermediate nodes?"
4. "How is SGT passed to the firewall?"
5. "Centralized or distributed DNAC for 800 devices?"

**Output**: Confidence to explain design decisions and answer questions

**Total Time**: 30 hours over 3 weeks

---

#### SCENARIO 4: Validating an Existing Design

**You are**: Reviewing a proposed SD-Access design for correctness

**Validation Checklist**:

**Architecture Validation** (30 minutes)
- [ ] Architecture pattern appropriate for site size
- [ ] All required components present (Border, CP, Edge, WLC)
- [ ] Intermediate nodes where required
- [ ] HA pairs for CP, Border, WLC

**Border Sizing Validation** (15 minutes)
- [ ] Border load calculated correctly
- [ ] Edge-to-edge same-VN traffic excluded
- [ ] 3-year growth factor applied (×1.6)
- [ ] Platform throughput ≥ 4× border load
- [ ] Current utilization <30%

**Control Plane Validation** (20 minutes)
- [ ] Port count calculated: Edge stacks × 2
- [ ] Available CP ports: Platform ports - 6
- [ ] Intermediate nodes if required > available
- [ ] Always 2× CP nodes (not single)
- [ ] Current port utilization <80%

**Edge Validation** (20 minutes)
- [ ] Port count: (Devices × 1.2) / 48
- [ ] PoE budget sufficient for all devices
- [ ] Stack size: 3-5 switches
- [ ] Uplinks: 2× to CP or Intermediate
- [ ] Current utilization 60-80%

**WLC Validation** (15 minutes)
- [ ] AP count: Square footage / coverage per AP
- [ ] WLC capacity ≥ APs × 2.5
- [ ] Platform supports client count
- [ ] Throughput adequate
- [ ] Current utilization <40%

**Traffic Flow Validation** (20 minutes)
- [ ] Edge-to-edge same-VN bypasses Border ✓
- [ ] Inter-VN routed at Border ✓
- [ ] To-DC via Border ✓
- [ ] To-Internet via Border + Firewall ✓

**DNAC Placement Validation** (10 minutes)
- [ ] Device count appropriate for centralized/distributed
- [ ] Latency tolerance acceptable
- [ ] Operations model (batch vs real-time)
- [ ] WAN reliability considered

**Common Mistakes Check** (15 minutes)
- [ ] Border load doesn't include edge-to-edge
- [ ] Intermediate nodes calculated correctly
- [ ] Not using single CP node
- [ ] WLC sized from square footage
- [ ] Growth planning included

**Output**: Validation report with findings and recommendations

**Total Time**: 2-3 hours

---

#### SCENARIO 5: Creating Bill of Materials and Cost Estimate

**You are**: Generating hardware list and budget for approval

**Workflow**:

**Step 1: Complete Hardware Selection** (4-8 hours)
- Document #1: Planning Template → Section 4
- Use formulas to calculate quantities for each site:
  - Border nodes (platform + quantity)
  - CP nodes (always 2×)
  - Intermediate nodes (if required)
  - Edge switches (by stack)
  - WLC (platform + quantity)
  - APs (indoor + outdoor)

**Step 2: Create Inventory Spreadsheet** (2-4 hours)
- Document #4: Site Infrastructure Inventory
- List all hardware by site
- Include:
  - Device type and model
  - Quantity
  - Role/purpose
  - Port count
  - Throughput/capacity
  - Current utilization %
  - Headroom %

**Step 3: Obtain Pricing** (varies)
- Work with Cisco partner/VAR
- Request quotes for:
  - Hardware (switches, WLC, APs)
  - DNAC licenses (Network Essentials/Advantage)
  - ISE licenses (Base/Plus/Apex)
  - DNA subscriptions (3 or 5 year)
  - Support contracts (SmartNet, SWSS)

**Step 4: Calculate Total Cost** (2 hours)
- Document #10: Executive Summary
- **CapEx** (one-time):
  - All hardware
  - Installation/deployment services
  - Training
- **OpEx** (annual):
  - DNA subscriptions
  - Support contracts
  - Maintenance
- **3-Year TCO**: CapEx + (OpEx × 3)

**Step 5: Cost Optimization** (optional, 2-4 hours)
- Review for opportunities:
  - Reuse existing equipment where possible
  - Right-size platforms (avoid over-provisioning)
  - Consider term licensing vs perpetual
  - Negotiate volume discounts
  - Phase deployment to spread costs

**Step 6: Executive Presentation** (2-4 hours)
- Document #10 → Complete all sections:
  - Project overview and scope
  - Total costs (CapEx, OpEx, TCO)
  - Timeline and phases
  - Resource requirements
  - Risks and mitigation
  - Success criteria

**Output**: Complete BoM with costs, TCO, and executive summary

**Total Time**: 1-2 days (plus vendor quoting time)

---

### Document Relationships

```
┌─────────────────────────────────────────────────┐
│  START: Deployment Planning Template           │
│  • Business objectives                          │
│  • Site profiling                               │
│  • Hardware selection worksheets                │
│  • Migration planning (if applicable)           │
└────────────┬────────────────────────────────────┘
             │
             ├──────────────────────────┐
             │                          │
             ▼                          ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│ Hardware/Capacity Guide  │  │ Quick Reference Guide    │
│ • Detailed methodology   │  │ • Formulas               │
│ • Traffic patterns       │  │ • Decision trees         │
│ • Formulas + examples    │  │ • FAQ                    │
│                          │  │ • Common mistakes        │
└────────┬─────────────────┘  └────────┬─────────────────┘
         │                              │
         └──────────┬───────────────────┘
                    │
        ┌───────────┴────────────┐
        │                        │
        ▼                        ▼
┌──────────────────┐   ┌──────────────────┐
│ Templates        │   │ Design Guides    │
│ • Site inventory │   │ • Firewall       │
│ • DNAC/ISE       │   │ • Monitoring     │
│ • Traffic flows  │   │ • QoS            │
│ • SGT policies   │   │ • Operations     │
│ • Exec summary   │   │                  │
└──────────────────┘   └──────────────────┘
```

---

### Who Should Use This

#### Network Architects
**Primary Documents**: All
**Focus**: Design validation, capacity planning, architecture selection
**Time Investment**: 20-30 hours for full proficiency

#### Project Managers
**Primary Documents**: Planning Template, Executive Summary
**Focus**: Timeline, budget, resources, risk management
**Time Investment**: 4-8 hours

#### Implementation Engineers
**Primary Documents**: Quick Reference, Hardware Guide, Design Guides
**Focus**: Configuration, deployment, validation
**Time Investment**: 10-15 hours

#### Network Engineers (Learning)
**Primary Documents**: Quick Reference, Common Mistakes, FAQ
**Focus**: Understanding concepts, passing interviews
**Time Investment**: 15-20 hours

---

### Common Pitfalls (Detailed)

#### Pitfall 1: Not Excluding Edge-to-Edge from Border Load

**Symptom**: Border platform too expensive or over-sized

**Root Cause**: Misunderstanding traffic flows
- Edge-to-edge traffic in same VN uses direct VXLAN tunnels
- This traffic never touches the Border
- Typically 25-30% of total site traffic

**Wrong Calculation**:
```
Total site traffic: 40 Gbps
Border platform needed: 40 × 1.6 × 4 = 256 Gbps
Selected: C9500-48Y4C (880 Gbps) - over-provisioned!
Cost: $X,XXX (too expensive)
```

**Correct Calculation**:
```
Total traffic: 40 Gbps
├─ Edge-to-edge same-VN: 10 Gbps (25%) → bypasses Border
├─ Inter-VN: 3 Gbps (7%) → via Border
├─ To-DC: 15 Gbps (38%) → via Border
└─ To-WAN: 10 Gbps (25%) → via Border

Border load: 3 + 15 + 10 = 28 Gbps
Required: 28 × 1.6 × 4 = 179 Gbps
Selected: C9500-24Y4C (440 Gbps) - right-sized ✓
Cost: $X,XXX (saves $X,XXX)
```

**Solution**: Always exclude edge-to-edge same-VN traffic from border load

---

#### Pitfall 2: Forgetting Intermediate Nodes for Medium Sites

**Symptom**: Cannot connect all edge nodes to CP (port shortage)

**Root Cause**: Assuming intermediate is only for "very large" sites

**Wrong Analysis**:
```
Site has 18 edge stacks
18 < 40 (not a huge site)
Architecture: Standard (Border + CP + Edge)
Intermediate: No
```

**Reality Check**:
```
Edge stacks: 18
Required connections: 18 × 2 = 36 ports
CP platform: C9500-24Y4C
Total ports: 24
Reserved for uplinks: 6
Available for edges: 24 - 6 = 18 ports

36 > 18 → INTERMEDIATE NODES REQUIRED! ✓
```

**Correct Design**:
- Add 2× Intermediate nodes
- Each intermediate connects to ~9 edge stacks
- Intermediate-1: Stacks 1-9 (18 connections)
- Intermediate-2: Stacks 10-18 (18 connections)
- Both intermediates connect to both CPs (4 connections total)
- Cost increase: $X,XXX (but necessary!)

**Solution**: Always calculate port count, don't assume based on site size

---

#### Pitfall 3: Single CP Node to Save Cost

**Symptom**: Total fabric outage when CP fails

**Temptation**:
```
CP-1 platform: C9500-24Y4C = $X,XXX
Traffic: <1 Gbps (control plane is minimal)
Utilization: <5% (seems wasteful)
Decision: Deploy only 1 CP to save $X,XXX
```

**Reality**:
```
LISP control plane is single point of failure
If CP-1 fails:
├─ LISP map-server unavailable
├─ Endpoints cannot register
├─ EID-to-RLOC mappings lost
├─ Edge nodes cannot resolve destinations
└─ ENTIRE FABRIC DOWN (total outage)

Downtime cost:
├─ Revenue loss: $X,XXX-500K/hour (depending on business)
├─ SLA penalties
├─ Customer trust damage
└─ Emergency deployment cost

$X,XXX savings << cost of outage
```

**Correct Design**:
- Always deploy 2× CP nodes (CP-1, CP-2)
- Active-active configuration
- Endpoint registrations to both
- Automatic failover if one fails
- Cost: $X,XXX (mandatory, not optional)

**Solution**: HA for CP is non-negotiable

---

#### Pitfall 4: WLC Under-Sizing Based on Current AP Count

**Symptom**: Cannot add APs for coverage gaps, network outages

**Wrong Approach**:
```
Current deployment: 120 APs
Expected growth: 10% = 132 APs
Selected WLC: C9800-40 (2,000 AP capacity)
Utilization: 132 / 2,000 = 6.6%
Analysis: Looks good! ✓
```

**Problem Discovered Later**:
```
Site: 600,000 sq ft office space
Standard office coverage: 1,500 sq ft per AP
Required APs: 600,000 / 1,500 = 400 APs

Gap: 400 - 120 = 280 APs missing!

Result:
├─ Dead zones in coverage
├─ User complaints about WiFi
├─ Emergency AP deployments
└─ Still fits on C9800-40, but design was wrong
```

**Correct Approach**:
```
Calculate from square footage:
├─ Total area: 600,000 sq ft
├─ Coverage per AP: 1,500 sq ft (standard office)
├─ Required APs: 600,000 / 1,500 = 400
├─ With 20% headroom: 400 × 1.2 = 480 APs
└─ Selected: C9800-40 (2,000 capacity)
    Utilization: 480 / 2,000 = 24% ✓
```

**Solution**: Always calculate WLC from square footage and coverage requirements

---

#### Pitfall 5: No Migration Plan for Traditional Networks

**Symptom**: Failed cutover, extended downtime, rollback required

**Wrong Approach** (Forklift without planning):
```
Weekend cutover:
├─ Friday 5 PM: Shutdown old network
├─ Friday 6 PM - Sunday 10 PM: Install SD-Access
├─ Monday 6 AM: Turn on new network
└─ Hope everything works ✗
```

**What Goes Wrong**:
```
Sunday 9 PM - Issues discovered:
├─ IP addressing conflicts (didn't document old subnets)
├─ SGT policies too restrictive (users can't access servers)
├─ LISP registration failing (misconfigured templates)
├─ 802.1X not working (certificates expired)
├─ Firewall not passing SGT (SXP not configured)
└─ DNAC discovery failing (NETCONF not enabled)

Result:
├─ Cannot complete cutover
├─ Rollback to old network Sunday 11 PM
├─ Monday: Users on old network, angry management
└─ Re-plan migration for next month
```

**Correct Approach** (Phased Migration):
```
Phase 0: Preparation (4 weeks)
├─ Document current state completely
├─ Test SD-Access in lab
├─ Train staff on new architecture
├─ Prepare rollback procedures
└─ Get approvals

Phase 1: Pilot (2 weeks)
├─ Select low-risk building/floor
├─ Deploy SD-Access for pilot users
├─ Run parallel with old network
├─ Validate all functionality
└─ Fix issues before scaling

Phase 2: Production (8-12 weeks)
├─ Building-by-building migration
├─ Validate each building before next
├─ Keep old network available
├─ Clear rollback criteria
└─ Monitor closely

Phase 3: Decommission (2 weeks)
├─ Remove old equipment
├─ Update documentation
└─ Final validation
```

**Solution**: Complete Section 8 of Planning Template (Migration Planning)

---

#### Pitfall 6: Not Planning for Growth

**Symptom**: Equipment at capacity within 1 year, costly upgrades needed

**Wrong Approach** (Current-state sizing):
```
Current user count: 2,000
Current traffic: 15 Gbps
Border load: 10 Gbps (after excluding edge-to-edge)
Platform selection: 10 × 4 = 40 Gbps minimum
Selected: C9500-16X (80 Gbps) ✓

Year 1:
├─ Users grow to 2,500 (+25%)
├─ Traffic grows to 19 Gbps (+27%)
├─ Border load: 13 Gbps
└─ Utilization: 13/80 = 16% (still OK)

Year 2:
├─ Users grow to 3,100 (+55% from start)
├─ Traffic grows to 24 Gbps (+60%)
├─ Border load: 16 Gbps
└─ Utilization: 16/80 = 20% (still OK)

Year 3:
├─ Users grow to 3,800 (+90%)
├─ Traffic grows to 30 Gbps (+100%)
├─ Border load: 20 Gbps
└─ Utilization: 20/80 = 25% (getting tight)

Problem: No headroom for spikes, approaching limits
```

**Correct Approach** (3-year projection):
```
Current border load: 10 Gbps
3-year projection: 10 × 1.6 = 16 Gbps
With safety margin: 16 × 4 = 64 Gbps minimum
Selected: C9500-24Y4C (440 Gbps) ✓

Year 3 reality:
├─ Border load: 20 Gbps (grew more than expected)
├─ Utilization: 20/440 = 4.5%
└─ Still plenty of headroom ✓
```

**Solution**: Use 3-year growth projection (multiply current by 1.6)

---

#### Pitfall 7: Wrong DNAC Placement Decision

**Symptom**: Over-spending on distributed DNAC or performance issues with centralized

**Wrong Scenario 1** (Unnecessary distributed):
```
Deployment:
├─ Sites: 5 (US: 3, Europe: 2)
├─ Devices: 450 total (US: 300, EU: 150)
├─ Operations: Weekly config changes
├─ WAN: 99.9% uptime, <50ms latency
└─ NOC: Centralized in US

Decision: Deploy distributed DNAC
├─ US DNAC: 3× DN2-HW-APL-XL = $X,XXX
├─ EU DNAC: 3× DN2-HW-APL-XL = $X,XXX
└─ Total cost: $X,XXX

Problem: Wasted $X,XXX!
450 devices << 3,000 threshold
Centralized would have been fine
```

**Wrong Scenario 2** (Centralized when distributed needed):
```
Deployment:
├─ Sites: 25 (Global: Americas, EMEA, APAC)
├─ Devices: 4,500 total (1,500 per region)
├─ Operations: Daily device changes (50+ per month)
├─ WAN: 95% uptime, 200-400ms latency to APAC
└─ NOC: Regional teams (24×7 follow-the-sun)

Decision: Deploy centralized DNAC in US
Cost: $X,XXX (seems cost-effective)

Problems:
├─ APAC operations slow (400ms latency)
├─ Network provisioning takes 2× longer
├─ Device discovery timeouts
├─ Cannot operate during WAN outages
└─ Regional teams frustrated

Solution: Should have deployed distributed
Cost: $X,XXX (3× regional), but necessary
```

**Correct Decision Framework**:
```
Centralized when:
✓ <3,000 devices total
✓ Batch operations (scheduled, non-urgent)
✓ WAN reliable (99.9%+)
✓ Latency <200ms to all sites
✓ Centralized NOC model
✓ Cost-sensitive

Distributed when:
✓ >3,000 devices per region
✓ Real-time operations (>50 changes/month)
✓ WAN unreliable (<99%)
✓ High latency (>200ms)
✓ Regional NOCs
✓ Compliance (data residency)
```

**Solution**: Evaluate all criteria, not just device count

---

### Learning Path

#### Beginner → Intermediate (2 weeks)

**Week 1: Fundamentals** (10 hours)
- Read Quick Reference Guide completely
- Memorize critical formulas
- Understand 5 traffic patterns
- Learn architecture selection criteria

**Week 2: Practice** (10 hours)
- Complete hypothetical sizing exercise
- Use decision trees
- Review common mistakes
- Validate sample design

**Skills Acquired**:
- Can size Border, CP, Edge, WLC
- Understand when intermediate nodes needed
- Know traffic flow patterns
- Can validate basic designs

---

#### Intermediate → Advanced (4 weeks)

**Week 1-2: Deep Methodology** (16 hours)
- Read complete Hardware/Capacity Guide
- Understand all traffic flow patterns in detail
- Study firewall integration (SGT via SXP)
- Learn DNAC placement strategies

**Week 3: Migration Planning** (8 hours)
- Read migration strategies section
- Understand forklift vs phased vs parallel
- Study coexistence patterns
- Learn rollback procedures

**Week 4: Practice Designs** (16 hours)
- Design 3 complete deployments:
  - Small branch (300 users, 1 building)
  - Medium hub (2,000 users, 3 buildings)
  - Large campus (5,000 users, 8 buildings)
- Create complete BoM for each
- Document all decisions

**Skills Acquired**:
- Can design complete SD-Access fabric
- Understand migration complexity
- Can explain all design decisions
- Ready to lead small deployments

---

#### Advanced → Expert (8 weeks)

**Week 1-2: Real Deployment** (40 hours)
- Lead actual SD-Access deployment
- Make real design decisions
- Handle unexpected issues
- Document lessons learned

**Week 3-4: Advanced Topics** (32 hours)
- Multi-site fabric (inter-site transit)
- Advanced SGT policies (matrix design)
- DNAC automation (templates, workflows)
- Performance tuning

**Week 5-6: Troubleshooting** (32 hours)
- IS-IS underlay issues
- LISP resolution failures
- SGT propagation problems
- DNAC discovery issues

**Week 7-8: Mentoring** (32 hours)
- Customize templates for organization
- Train team members
- Review others' designs
- Share best practices

**Skills Acquired**:
- Expert-level SD-Access architect
- Can handle complex multi-site deployments
- Troubleshoot any fabric issue
- Mentor and train others

---

### Recommended Reading Order

1. **Quick Start & Overview** (Part 1) - 30 minutes
2. **Usage Scenarios** (Part 2) - 1 hour
3. **Critical Formulas** (Part 3) - 1 hour
4. **Hardware Selection Guide** (Part 3) - 1 hour
5. **Traffic Flow Patterns** (Part 3) - 30 minutes
6. **Common Design Mistakes** (Part 3) - 1 hour
7. **Decision Trees & FAQ** (Part 3) - 1 hour

**Total Time to Working Knowledge**: 6-8 hours

**Total Time to Proficiency**: 20-30 hours (with practice)

---
---

## Implementation Reference

### Implementation Checklist

#### Pre-Deployment

**Design Validation** (1 week before)
- [ ] Border load calculated (exclude edge-to-edge)
- [ ] 3-year growth projection applied (×1.6)
- [ ] Platform selection validated (4× border load)
- [ ] CP port count verified (intermediate if needed)
- [ ] Edge ports and PoE validated per floor
- [ ] WLC capacity validated (square footage method)
- [ ] DNAC placement decision documented and approved

**Preparation** (1 week before)
- [ ] All equipment received and staged
- [ ] Software versions validated (compatibility matrix)
- [ ] Licenses purchased and registered
- [ ] DNAC cluster deployed and accessible
- [ ] ISE deployed with policies configured
- [ ] SGT policies designed and tested
- [ ] IP addressing scheme finalized
- [ ] Naming conventions documented

**Testing** (3 days before)
- [ ] Lab validation complete
- [ ] IS-IS underlay tested
- [ ] LISP registration tested
- [ ] SGT propagation tested
- [ ] Firewall integration tested (SXP)
- [ ] Rollback procedure documented and tested

**Change Management** (1 day before)
- [ ] Change request approved
- [ ] Stakeholders notified
- [ ] Maintenance window scheduled
- [ ] Support escalation contacts identified
- [ ] Rollback criteria defined

---

#### Deployment

**Day 1: Underlay**
- [ ] Physical installation complete
- [ ] IS-IS underlay configured on all nodes
- [ ] IS-IS adjacencies verified (`show isis neighbors`)
- [ ] Loopback reachability tested (ping)
- [ ] Underlay routing stable

**Day 2: Control Plane**
- [ ] CP nodes configured (LISP MS/MR)
- [ ] CP peering established
- [ ] LISP site configuration created in DNAC
- [ ] PxTR configured

**Day 3: Overlay**
- [ ] Border nodes configured (fabric edge + fusion)
- [ ] Intermediate nodes configured (if applicable)
- [ ] Edge nodes configured (fabric edge)
- [ ] LISP registrations verified (`show lisp site`)
- [ ] BFD sessions up (`show bfd neighbors`)

**Day 4: Segmentation**
- [ ] Virtual networks created in DNAC
- [ ] SGT policies configured in ISE
- [ ] SGACL applied to Border
- [ ] SXP configured (Border to firewall)
- [ ] Test traffic flows and enforcement

**Day 5: Wireless**
- [ ] WLC deployed and configured
- [ ] APs joined to WLC
- [ ] SSIDs mapped to virtual networks
- [ ] Wireless client testing complete

**Day 6-7: Validation & Optimization**
- [ ] All post-deployment checks complete (see below)
- [ ] Performance baseline established
- [ ] Issues documented and resolved
- [ ] Handoff to operations team

---

#### Post-Deployment

**Capacity Validation**
- [ ] Border utilization <30%
- [ ] CP port utilization <80%
- [ ] Edge port utilization 60-80%
- [ ] WLC AP count <40% of capacity
- [ ] All platforms within target ranges

**Traffic Flow Validation**
- [ ] Pattern 1: Edge-to-edge same-VN (bypasses Border) ✓
- [ ] Pattern 2: Inter-VN (via Border) ✓
- [ ] Pattern 3: Edge-to-DC (via Border) ✓
- [ ] Pattern 4: Edge-to-Internet (via Border + FW) ✓
- [ ] Pattern 5: Control plane (to CP nodes) ✓

**Security Validation**
- [ ] SGT assignment working (802.1X)
- [ ] SGT enforcement at Border tested
- [ ] SGT propagation to firewall verified (SXP)
- [ ] Critical denies working (Guest→Server)
- [ ] Default deny policy active

**Performance Validation**
- [ ] Latency <5ms intra-site
- [ ] Latency <2ms to DC
- [ ] No packet loss
- [ ] QoS markings preserved
- [ ] Throughput meets requirements

**Failover Testing**
- [ ] CP failover (shutdown CP-1, verify CP-2 takes over)
- [ ] Border failover (shutdown Border-1, traffic shifts)
- [ ] WLC failover (shutdown WLC-1, APs rejoin WLC-2)
- [ ] Edge stack failover (shutdown stack member, SVL recovers)

**Documentation**
- [ ] As-built documentation complete
- [ ] IP addressing updated
- [ ] VLAN/VN mappings documented
- [ ] SGT policies documented
- [ ] Operational runbook created
- [ ] Knowledge transfer to operations complete

---

### Decision Trees

#### "Do I Need Intermediate Nodes?"

```
START
  │
  ├─> Count edge stacks at site
  │
  ├─> Calculate: Edge_Stacks × 2
  │
  ├─> CP platform ports: 24 (typical)
  │   Reserved for uplinks: 6
  │   Available: 18
  │
  ├─> Is (Edge_Stacks × 2) > 18?
  │     │
  │     ├─ YES → DEPLOY INTERMEDIATE NODES ✓
  │     │         • Cost: +$X,XXX
  │     │         • Deployment: 2× nodes (HA)
  │     │
  │     └─ NO → Direct connection to CP ✓
  │              • No intermediate needed
  │              • Lower cost
  │
END
```

**Examples**:
- 5 edge stacks: 5 × 2 = 10 < 18 → **No intermediate**
- 10 edge stacks: 10 × 2 = 20 > 18 → **Intermediate required**
- 18 edge stacks: 18 × 2 = 36 > 18 → **Intermediate required** (common mistake!)

---

#### "Which Border Platform?"

```
START
  │
  ├─> Calculate total site traffic
  │
  ├─> Identify edge-to-edge same-VN traffic (~25%)
  │
  ├─> Border_Load = Total - Edge_to_Edge
  │
  ├─> Apply 3-year growth: Border_Load × 1.6
  │
  ├─> Apply safety margin: Result × 4
  │
  ├─> Is result <200 Gbps?
  │     │
  │     ├─ YES → C9500-24Y4C (440 Gbps) ✓
  │     │         • Cost: ~$X,XXX
  │     │         • Most common choice
  │     │
  │     └─ NO → Is result <400 Gbps?
  │               │
  │               ├─ YES → C9500-48Y4C (880 Gbps)
  │               │         • Cost: ~$X,XXX
  │               │
  │               └─ NO → C9600 Series (1.2+ Tbps)
  │                        • Cost: $X,XXX
  │                        • Data center scale
  │
END
```

---

#### "Centralized or Distributed DNAC?"

```
START
  │
  ├─> Count devices per region
  │
  ├─> Is count <1,000 per region?
  │     │
  │     ├─ NO → DISTRIBUTED recommended
  │     │        (>1,000 devices)
  │     │
  │     └─ YES → Continue evaluation
  │
  ├─> Are operations batch/scheduled?
  │     │
  │     ├─ NO → DISTRIBUTED recommended
  │     │        (real-time operations)
  │     │
  │     └─ YES → Continue
  │
  ├─> Is WAN reliable (99.9%+)?
  │     │
  │     ├─ NO → DISTRIBUTED recommended
  │     │        (WAN unreliable)
  │     │
  │     └─ YES → Continue
  │
  ├─> Is latency <200ms to all sites?
  │     │
  │     ├─ NO → DISTRIBUTED recommended
  │     │        (high latency)
  │     │
  │     └─ YES → CENTRALIZED ✓
  │              • Cost: $X,XXX (incl DR)
  │              • Single pane of glass
  │              • Simpler operations
  │
END
```

**Key Insight**: If 2+ factors favor distributed, go distributed

---

#### "Which WLC Platform?"

```
START
  │
  ├─> Calculate square footage
  │
  ├─> Determine coverage per AP:
  │   • Open office: 2,500 sq ft/AP
  │   • Standard office: 1,500 sq ft/AP
  │   • High density: 500 sq ft/AP
  │
  ├─> Required_APs = Square_Feet / Coverage
  │
  ├─> With headroom: Required_APs × 2.5
  │
  ├─> Is headroom count <200 APs?
  │     │
  │     ├─ YES → Is this a branch?
  │     │         │
  │     │         ├─ YES → Embedded WLC ✓
  │     │         │         • Cost: $X,XXX(included)
  │     │         │
  │     │         └─ NO → C9800-L (200 APs)
  │     │                  • Cost: ~$X,XXX
  │     │
  │     └─ NO → Is headroom count <2,000 APs?
  │               │
  │               ├─ YES → C9800-40 (2,000 APs) ✓
  │               │         • Cost: ~$X,XXX
  │               │         • Most common
  │               │
  │               └─ NO → C9800-80 (6,000 APs)
  │                        • Cost: ~$X,XXX
  │                        • Large hub
  │
END
```

---

### FAQ

#### Q: Why is border load typically only 70-75% of total site traffic?

**A**: Because edge-to-edge traffic within the same Virtual Network (VN) bypasses the Border entirely and uses direct VXLAN tunnels between edge nodes. This represents about 25-30% of typical site traffic.

**Example**:
```
Total site traffic: 40 Gbps
├─ Edge-to-edge same-VN: 10 Gbps (25%) → Direct VXLAN
├─ Inter-VN: 3 Gbps (7%) → Via Border
├─ To DC: 15 Gbps (38%) → Via Border
└─ To WAN: 10 Gbps (25%) → Via Border

Border load = 3 + 15 + 10 = 28 Gbps (70% of total)
```

---

#### Q: How do I know if I need intermediate nodes?

**A**: Calculate: Edge_Stacks × 2 = required connections

Compare to CP available ports (typically 24 - 6 = 18 ports)

If required > available → Intermediate nodes required

**It's about port count, not site size!**

**Example**:
- 18 edge stacks × 2 = 36 connections
- CP available: 18 ports
- 36 > 18 → Intermediate required

---

#### Q: Can I collapse Border + CP into single device to save cost?

**A**: Technically possible using FIAB architecture, but:

**Only acceptable for**:
- Small branches (<500 users)
- <10 edge nodes
- <10 Gbps WAN traffic

**NOT recommended for**:
- Sites >30 edge nodes
- >10 Gbps WAN traffic
- Mission-critical deployments

**Reason**: Operational complexity, limited scalability, single point of failure

**Savings**: ~$X,XXX  
**Risk**: High

**Decision**: For branches → FIAB OK. For hubs → Use dedicated Border/CP.

---

#### Q: Why always 2× CP nodes? Can't I save $X,XXX?

**A**: **NO**. LISP control plane is a single point of failure.

**If single CP fails**:
1. LISP map-server unavailable
2. Endpoints cannot register
3. EID-to-RLOC mappings lost
4. Fabric cannot resolve destinations
5. **Entire fabric DOWN** (total outage)

**Outage cost**: $X,XXX-500K/hour (depending on business)

**$X,XXX savings << cost of single hour outage**

**Always deploy 2× CP nodes** (non-negotiable)

---

#### Q: How is SGT passed to the firewall if VXLAN terminates at the Border?

**A**: Via **SXP** (SGT eXchange Protocol)

**Process**:
1. Border learns IP-to-SGT mappings from LISP control plane
2. Border sends mappings to firewall via SXP (TCP 64999)
3. Firewall receives native IP packets (no SGT in packet)
4. Firewall looks up source IP in SXP table to get SGT
5. Firewall applies policies based on SGT

**Why SXP**:
- VXLAN encapsulation removed at Border
- SGT not in IP packet that firewall sees
- SXP provides out-of-band SGT information

**Configuration**:
- Border: SXP speaker (sends mappings)
- Firewall: SXP listener (receives mappings)

---

#### Q: What triggers migration from centralized to distributed DNAC?

**A**: Evaluate these factors:

1. **Device count** >1,000 per region
2. **Operations frequency** >50 changes/month
3. **WAN reliability** <99%
4. **Latency** >200ms to remote sites
5. **Regional NOCs** separate teams established
6. **Compliance** data residency requirements

**Decision rule**:
- 0-1 factors → Stay centralized
- 2 factors → Evaluate with stakeholders
- 3+ factors → Go distributed

**Example - Stay Centralized**:
```
Devices: 800 (below threshold) ✓
Operations: Weekly changes ✓
WAN: 99.9% reliable ✓
Latency: 150ms ✓
NOC: Centralized ✓
Compliance: None ✓

Decision: CENTRALIZED ✓
Cost: $X,XXX (vs $X,XXX distributed)
```

---

#### Q: Do I need to size for WiFi 6E if I only have WiFi 5 APs today?

**A**: **Yes**, if planning multi-year deployment.

**Reasoning**:
- WiFi 6E APs require mGig (2.5G/5G/10G) switch ports
- Standard 1G ports bottleneck WiFi 6E performance
- Upgrading switches later = expensive forklift

**Recommendation**:
- Use C9300-48UXM (mGig) in high-density areas
- Use C9300-48U (1G) in low-density areas
- Plan for phased AP upgrades to WiFi 6E

**Cost impact**:
- C9300-48U: $X,XXX (1G ports)
- C9300-48UXM: $X,XXX (mGig ports)
- Delta: $X,XXX per switch

**Worth it?** Yes, for 3+ year deployments

---

#### Q: How do I calculate PoE budget for a floor?

**A**: Use this method:

**Step 1**: Inventory devices
```
Device type    | Count | Wattage | Total
---------------|-------|---------|-------
IP Phones      | 80    | 15W     | 1,200W
WiFi APs       | 5     | 30W     | 150W
Cameras (PTZ)  | 12    | 60W     | 720W
IoT sensors    | 20    | 10W     | 200W
---------------|-------|---------|-------
Total required |       |         | 2,270W
```

**Step 2**: Add 20% headroom
```
2,270W × 1.2 = 2,724W required
```

**Step 3**: Select switch platform
```
C9300-48U: 1,440W per switch
Stack of 3: 3 × 1,440W = 4,320W total

4,320W > 2,724W → Sufficient ✓
```

**Common mistake**: Forgetting 20% headroom for adds/moves/changes

---

#### Q: What's the difference between VN (Virtual Network) and VLAN?

**A**: 

**VLAN** (Traditional):
- Layer 2 construct
- Flat forwarding domain
- Limited to 4,094 VLANs
- Tied to physical topology
- Spanning-tree constraints

**VN (Virtual Network)** in SD-Access:
- Layer 3 construct (VRF-based)
- Overlay abstraction
- Not limited by VLAN count
- Independent of physical topology
- No spanning-tree (VXLAN uses MAC-in-IP)

**Relationship**:
```
VN (Overlay) ──maps to─→ VRF (Routing)
VN (Edge)    ──maps to─→ VLAN (Local)

Example:
VN_CORPORATE → VRF_CORPORATE
             → VLAN 10 (at Edge-1)
             → VLAN 20 (at Edge-2)
             (Different VLANs, same VN)
```

---

### Troubleshooting

#### Issue: Underlay Not Converging

**Symptoms**:
- IS-IS neighbors not forming
- Loopbacks not reachable
- Fabric not coming up

**Checks**:
```bash
# Verify IS-IS is enabled
show isis neighbors
# Should see all adjacent nodes

# Verify loopback reachability
ping <loopback-ip>

# Check interface status
show ip interface brief

# Verify IS-IS configuration
show run | section isis
```

**Common causes**:
- IS-IS not enabled on interfaces
- Interface MTU mismatch (needs 9100+)
- Wrong IS-IS area
- Passive-interface on fabric links

**Solution**:
1. Enable IS-IS on all fabric interfaces
2. Set MTU to 9100 on all fabric interfaces
3. Verify IS-IS area matches on all nodes
4. Remove passive-interface from fabric links

---

#### Issue: LISP Not Resolving EIDs

**Symptoms**:
- Endpoints not registering
- Cannot ping across fabric
- EID-to-RLOC resolution failing

**Checks**:
```bash
# On CP nodes
show lisp site
# Should see all sites registered

# On Edge nodes
show lisp session
# Should see active sessions to both CP nodes

show lisp database
# Should see local endpoint registrations

# Verify LISP configuration
show run | section lisp
```

**Common causes**:
- CP nodes not configured as MS/MR
- Edge nodes not pointing to CP loopbacks
- LISP instance-ID mismatch
- Firewall blocking UDP 4341/4342

**Solution**:
1. Verify CP configuration (MS/MR role)
2. Confirm Edge points to both CP loopbacks
3. Match instance-IDs across site
4. Allow UDP 4341/4342 through firewalls

---

#### Issue: SGT Not Propagating

**Symptoms**:
- SGT policies not enforced
- Traffic not being tagged
- Firewall not receiving SGT

**Checks**:
```bash
# On Edge nodes
show cts role-based sgt-map all
# Should see endpoint-to-SGT mappings

# On Border nodes
show cts role-based permissions
# Should see SGACL entries

# On Firewall
show cts sxp connections
# Should see active SXP session to Border
```

**Common causes**:
- Inline tagging not enabled on Edge
- SGACL not applied to Border
- SXP not configured (Border to firewall)
- TCP 64999 blocked between Border and firewall

**Solution**:
1. Enable inline tagging on Edge nodes
2. Apply SGACL to Border interfaces
3. Configure SXP speaker on Border
4. Configure SXP listener on firewall
5. Allow TCP 64999

---

#### Issue: DNAC Cannot Discover Devices

**Symptoms**:
- Devices show "unreachable" in DNAC
- Discovery fails
- Cannot push templates

**Checks**:
```bash
# On devices
show ip interface brief
# Verify management IP reachable

# Verify NETCONF enabled
show netconf-yang status
# Should show "enabled"

# Check if port 830 open
telnet <device-ip> 830
```

**Common causes**:
- NETCONF not enabled (port 830)
- Firewall blocking TCP 830
- Wrong credentials in DNAC
- Device not reachable from DNAC

**Solution**:
1. Enable NETCONF on all devices
2. Allow TCP 830 through firewalls
3. Verify credentials match in DNAC
4. Test connectivity from DNAC to devices

---

#### Issue: High Border Utilization

**Symptoms**:
- Border CPU high
- Latency spikes
- Packet drops

**Checks**:
```bash
show platform hardware fed switch active qos queue stats
show processes cpu sorted
show interfaces stats
```

**Root causes**:
- Border undersized (forgot to exclude edge-to-edge)
- Traffic growth exceeded projections
- Microburst traffic

**Short-term solution**:
- Implement QoS to prioritize critical traffic
- Add policing to limit non-critical flows

**Long-term solution**:
- Upgrade Border to higher-capacity platform
- Add additional Border pair for load distribution

---

#### Issue: WLC at Capacity

**Symptoms**:
- Cannot add more APs
- APs failing to join
- Client connection issues

**Checks**:
```bash
show ap summary
# Count current APs

show license summary
# Verify AP licenses available

show ap config general <ap-name>
# Check why AP not joining
```

**Solutions**:
- Add WLC to cluster (scale-out)
- Upgrade WLC to higher-capacity model (scale-up)
- Purchase additional AP licenses

---

**END OF TECHNICAL GUIDE**

---

**Document Information**:
- **Title**: SD-Access Deployment Planning Guide
- **Version**: 2.0
- **Last Updated**: March 2026
- **Pages**: ~150 (estimated)
- **Maintained by**: Network Architecture Team

---

**GOOD LUCK WITH YOUR SD-ACCESS DEPLOYMENT!** 🚀

---

## Additional Planning Guidance

The following orientation material—role-based quick starts, key design insights, and a project-at-a-glance summary—supports planning and design decisions.

#### SCENARIO 5: Creating a Bill of Materials (BoM) and Cost Estimate

**You are**: Generating hardware list and budget for approval

**Start with**:
1. **SD-ACCESS-DEPLOYMENT-PLANNING-TEMPLATE.md** (Document #1)
   - Complete Section 4 (Hardware Selection) for each site
   - Use formulas to calculate quantities

2. **01-Site_Infrastructure_Inventory.csv** (Document #4)
   - Use as template for your BoM
   - Reference Abhavtech costs as baseline
   - Adjust quantities and costs for your sites

3. **07-PROJECT_EXECUTIVE_SUMMARY.csv** (Document #10)
   - Use "Complete Project Costs" section as template
   - Include CapEx (hardware) + OpEx (licensing, support)
   - Calculate 3-year TCO

**Output**: Excel spreadsheet with complete BoM, costs, and TCO

**Time Required**: 1-2 days (with pricing from vendor)

---

### QUICK START GUIDES

#### For Network Architects (New to SD-Access)

**Day 1: Learn Concepts** (4 hours)
1. Read **APPENDIX-QUICK-REFERENCE-GUIDE.md** completely
2. Understand 5 traffic patterns
3. Learn critical formulas (Border load, CP ports)

**Day 2: Study Real Example** (4 hours)
1. Review Abhavtech deployment in **APPENDIX-HARDWARE-CAPACITY-TRAFFIC-DESIGN.md**
2. Trace traffic flows in **03-Traffic_Flow_Matrix.csv**
3. Understand why Mumbai needs intermediate nodes

**Day 3: Practice Sizing** (4 hours)
1. Take a hypothetical site (e.g., 2,000 users, 3 buildings)
2. Use **SD-ACCESS-DEPLOYMENT-PLANNING-TEMPLATE.md** to size it
3. Validate with formulas from quick reference guide

**Day 4: Deep Dive** (4 hours)
1. Read **05-FIREWALL_DESIGN_COMPLETE.txt** (SGT integration)
2. Read **06-ADDITIONAL_DESIGN_ELEMENTS.txt** (monitoring, backup)
3. Review migration strategies in template

**Day 5: Test Knowledge** (2 hours)
1. Answer questions in FAQ section
2. Explain Abhavtech design decisions to a colleague
3. Create a sample BoM for a new site

**Total**: 5 days → SD-Access proficient ✓

---

#### For Project Managers (Overseeing SD-Access Deployment)

**Focus on**:
1. **07-PROJECT_EXECUTIVE_SUMMARY.csv**
   - Timeline (38 weeks typical)
   - Resource requirements (10-15 engineers)
   - Risk assessment
   - Budget ($X,XXX-7M typical for large enterprise)

2. **SD-ACCESS-DEPLOYMENT-PLANNING-TEMPLATE.md**
   - Section 1: Business objectives (align with stakeholders)
   - Section 9: Implementation roadmap (project plan)
   - Section 10: Validation checklists (track progress)

3. **Migration planning** (if applicable):
   - Section 8 of template
   - Understand phasing strategy
   - Know rollback procedures

**Time Required**: 1-2 days to understand scope and manage project

---

#### For Engineers (Implementing SD-Access)

**Pre-Deployment** (Study):
1. **APPENDIX-HARDWARE-CAPACITY-TRAFFIC-DESIGN.md** → Complete methodology
2. **APPENDIX-QUICK-REFERENCE-GUIDE.md** → Quick reference during work

**During Deployment** (Reference):
1. **SD-ACCESS-DEPLOYMENT-PLANNING-TEMPLATE.md** → Section 10 checklists
2. **05-FIREWALL_DESIGN_COMPLETE.txt** → SXP configuration
3. **06-ADDITIONAL_DESIGN_ELEMENTS.txt** → Monitoring setup

**Post-Deployment** (Validation):
1. Complete all checklists in Section 10.2 (post-deployment)
2. Validate capacity utilization targets
3. Test failover scenarios

---

### KEY INSIGHTS FROM ABHAVTECH EXAMPLE

#### Insight 1: Border Load ≠ Total Site Traffic

**Common Mistake**: Sizing Border for 40 Gbps (total site traffic)

**Correct Approach**:
```
Total Site Traffic = 40 Gbps
├─ Edge-to-Edge (same VN): 10 Gbps → BYPASSES Border
├─ Inter-VN: 3 Gbps → LOADS Border
├─ To-DC: 15 Gbps → LOADS Border
└─ To-WAN: 10 Gbps → LOADS Border

Border Load = 3 + 15 + 10 = 28 Gbps (NOT 40!)
```

**Impact**: Over-sizing Border wastes $X,XXX-15K per site

---

#### Insight 2: "Standard" Architecture May Need Intermediate

**Common Mistake**: Assuming Chennai (2,400 users, 3 buildings) doesn't need intermediate

**Correct Analysis**:
```
Edge Stacks = 18
Port Requirement = 18 × 2 = 36 connections
CP Available Ports = 24 - 6 = 18 ports
36 > 18 → INTERMEDIATE REQUIRED ✓
```

**Lesson**: Port count matters more than site size for intermediate decision

---

#### Insight 3: WLC Capacity Often Under-Estimated

**Original Error**: Mumbai estimated at 120 APs

**Correct Calculation**:
```
Square Footage = 600,000 sq ft
Coverage = 1,500 sq ft per AP (standard office)
Required APs = 600,000 / 1,500 = 400 APs (not 120!)
```

**Impact**: Under-sizing by 3× → network outages when actual APs deployed

---

#### Insight 4: Centralized DNAC Works for Global Deployments

**Abhavtech Decision**: Centralized DNAC in New Jersey for all sites (including APAC)

**Reasoning**:
- Operations are batch/scheduled (not real-time)
- 200ms latency to Mumbai is tolerable
- Saves $X,XXX vs distributed architecture
- 638 devices << 3,000 threshold

**Lesson**: Don't assume distributed is always needed for global deployments

---

#### Insight 5: Always Deploy 2 × CP Nodes

**Temptation**: Deploy single CP node to save $X,XXX

**Reality**: LISP is single point of failure
- If single CP fails → entire fabric cannot resolve EIDs
- Result: Total network outage
- Cost of outage >> $X,XXX savings

**Lesson**: HA for CP is non-negotiable

---

### ABHAVTECH PROJECT AT A GLANCE

| Metric | Value |
|--------|-------|
| **Sites** | 3 (Mumbai, Chennai, Noida) |
| **Total Users** | 7,500 |
| **Total Devices** | 21,000 (users + IoT) |
| **Architecture Patterns** | Full (Mumbai), Standard w/ Intermediate (Chennai), Collapsed FIAB (Noida) |
| **Total CapEx** | $X,XXX |
| **Annual OpEx** | $X,XXX |
| **3-Year TCO** | $X,XXX |
| **Timeline** | 38 weeks |
| **Edge Switches** | 106 devices |
| **Access Points** | 532 APs |
| **DNAC Model** | Centralized (New Jersey + London DR) |
| **Savings** | $X,XXX (centralized DNAC vs distributed) |

---

