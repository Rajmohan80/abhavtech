# ACD Routing Design

## Overview

This section provides comprehensive documentation for Automatic Call Distribution (ACD) routing design, covering the transition from Avaya ACD to Webex Contact Center's skills-based routing engine.

---

## What is ACD Routing?

**Automatic Call Distribution (ACD)** is the intelligent routing system that distributes incoming contacts to the most appropriate available agents based on predefined rules, agent skills, and business priorities.

### Key ACD Components

```
┌─────────────────────────────────────────────────────┐
│              INCOMING CONTACT                       │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│           ENTRY POINT (DNIS/Channel)                │
│  Identifies the contact source and initial routing  │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│             QUEUE SELECTION                         │
│  Directs to appropriate queue based on criteria     │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│           ROUTING ENGINE                            │
│  ┌──────────────────────────────────────────────┐  │
│  │  • Skills matching                           │  │
│  │  • Proficiency scoring                       │  │
│  │  │  • Priority weighting                      │  │
│  │  • Agent availability check                  │  │
│  │  • Load balancing                            │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│            AGENT SELECTION                          │
│  Best available agent receives contact              │
└─────────────────────────────────────────────────────┘
```

---

## Design Goals

### Primary Objectives

1. **Optimal Customer Experience**
   - Minimize wait times
   - Route to most qualified agent
   - First call resolution focus
   - Consistent service quality

2. **Agent Efficiency**
   - Match skills to contact requirements
   - Balanced workload distribution
   - Minimize idle time
   - Support agent development

3. **Business Outcomes**
   - Meet service level targets (80/20)
   - Maximize revenue opportunities
   - Reduce operational costs
   - Enable data-driven decisions

### Success Metrics

| Metric | Current (Avaya) | Target (Webex) |
|--------|-----------------|----------------|
| Service Level (80/20) | 78% | 85% |
| Average Speed of Answer | 45 seconds | 30 seconds |
| Abandonment Rate | 8% | < 5% |
| First Call Resolution | 72% | 80% |
| Agent Utilization | 75% | 82% |
| Transfer Rate | 12% | < 8% |

---

## Document Structure

### [Current Avaya ACD](current-avaya-acd.md)
Complete documentation of existing Avaya ACD configuration:
- Vector programming and logic
- Hunt groups and skills configuration
- Agent profiles and skill assignments
- Current routing performance metrics
- Pain points and limitations

### [Target Webex ACD](target-webex-acd.md)
Webex Contact Center routing design:
- Queue architecture and hierarchy
- Skills framework and proficiency levels
- Routing strategy configuration
- Performance optimization
- Enhanced capabilities

### [Routing Strategies](routing-strategies.md)
Detailed routing algorithms and decision logic:
- Skills-based routing
- Longest available agent
- Priority-based routing
- Business hours routing
- Overflow and failover strategies

### [Migration Guide](migration-guide.md)
Step-by-step migration procedures:
- Pre-migration assessment
- Configuration mapping
- Testing and validation
- Cutover procedures
- Post-migration optimization

---

## ACD Routing Comparison

### Avaya vs. Webex Capabilities

| Feature | Avaya (Current) | Webex (Target) | Improvement |
|---------|-----------------|----------------|-------------|
| Skills per Agent | 10 max | Unlimited | ✅ More flexibility |
| Proficiency Levels | 1-16 | 1-10 (configurable) | ✅ Simplified |
| Real-time Updates | Manual reload | Immediate | ✅ Faster changes |
| Reporting | CMS (delayed) | Real-time analytics | ✅ Better insights |
| Multi-channel | Voice only | Voice + Digital | ✅ Omnichannel |
| Agent Desktop | Separate app | Integrated browser | ✅ User experience |
| Routing Flexibility | Vector programming | Visual flow designer | ✅ Easier management |
| Geo-routing | Limited | Global capability | ✅ Worldwide support |

---

## Key Concepts

### Skills-Based Routing

**Definition**: Routing contacts to agents based on their specific abilities and expertise levels.

**Example Scenario:**
```
Customer Call: Spanish-speaking customer with billing inquiry

Required Skills:
├─ Language: Spanish (minimum level 7)
├─ Department: Billing (minimum level 5)
└─ Channel: Voice (minimum level 5)

Agent Pool:
├─ Agent A: Spanish(9), Billing(8), Voice(10) ← Best match
├─ Agent B: Spanish(7), Billing(9), Voice(8) ← Second best
└─ Agent C: Spanish(10), Sales(9), Voice(10) ← No billing skill

Result: Routed to Agent A (highest combined proficiency)
```

### Queue Priority

**Definition**: The order in which contacts are processed within a queue.

**Priority Levels:**
```
Priority 1 (Highest): VIP customers, escalations
Priority 2 (High): Callbacks, aged contacts
Priority 3 (Normal): Standard inbound contacts
Priority 4 (Low): Internal requests, training calls
```

### Service Level Agreement (SLA)

**Definition**: Target percentage of contacts answered within a specified time.

**Standard SLA: 80/20**
- 80% of contacts answered within 20 seconds
- Measured per queue over reporting period

**Example Calculation:**
```
Total Calls: 1,000
Answered within 20 seconds: 850
Service Level = (850 / 1,000) × 100 = 85% ✅ Target met
```

---

## Routing Architecture Layers

### Layer 1: Entry Points

```
Entry Point Configuration:
├─ Name: Sales_Inbound_TF
├─ DNIS: 1-800-XX5-0100
├─ Channel: Voice
├─ Business Hours: 8 AM - 8 PM ET
└─ Default Destination: Sales_Main_Queue
```

### Layer 2: Queues

```
Queue Hierarchy:
Sales Organization
├─ Sales_Main_Queue (General inquiries)
│   ├─ Sales_New_Business_Queue (New customers)
│   ├─ Sales_Existing_Queue (Account management)
│   └─ Sales_Spanish_Queue (Spanish language)
│
└─ Sales_VIP_Queue (High-value customers)
```

### Layer 3: Routing Policies

```
Routing Policy: Sales_Skills_Routing
├─ Primary: Match required skills with proficiency
├─ Secondary: Longest available agent
├─ Tertiary: Any available agent in queue
└─ Timeout: Overflow after 5 minutes
```

### Layer 4: Agent Assignment

```
Agent Selection Criteria:
1. Agent state = Available
2. Agent has required skills at minimum proficiency
3. Agent capacity < maximum concurrent contacts
4. Calculate agent score:
   Score = (Skill1_Proficiency × 0.4) + 
           (Skill2_Proficiency × 0.3) +
           (Idle_Time_Seconds × 0.3)
5. Select agent with highest score
```

---

## Best Practices

### Queue Design

✅ **Do:**
- Keep queue structure simple (max 3 levels deep)
- Use descriptive naming conventions
- Document business logic for each queue
- Set realistic service level targets
- Monitor queue performance daily

❌ **Don't:**
- Create queues for every minor variation
- Use cryptic or unclear queue names
- Set unrealistic SLA targets (99/10)
- Neglect to review queue performance
- Create circular routing dependencies

### Skills Management

✅ **Do:**
- Define clear skill categories (Language, Product, Function)
- Use proficiency levels consistently (1=Basic, 10=Expert)
- Review and update agent skills quarterly
- Validate skills through testing/certification
- Document skill definitions

❌ **Don't:**
- Create overlapping or redundant skills
- Use proficiency levels inconsistently
- Assign skills without validation
- Let skills become stale (outdated)
- Over-complicate skill requirements

### Routing Strategy

✅ **Do:**
- Start with simple routing logic
- Test routing changes in non-production first
- Monitor impact of routing changes
- Document routing decisions and rationale
- Provide overflow and failover paths

❌ **Don't:**
- Over-engineer routing with complex rules
- Make routing changes during peak hours
- Ignore routing performance metrics
- Create routing loops or dead ends
- Forget to account for edge cases

---

## Common Routing Scenarios

### Scenario 1: Simple Skills Routing

```
Contact Requirements:
├─ Skill: Technical_Support
└─ Minimum Proficiency: 5

Available Agents:
├─ Agent A: Technical_Support(8), Available
├─ Agent B: Technical_Support(6), Available
└─ Agent C: Technical_Support(9), Wrap-up

Selection: Agent C (highest proficiency, but not available)
Result: Route to Agent A (next highest, available)
```

### Scenario 2: Multi-Skill Routing

```
Contact Requirements:
├─ Skill 1: Spanish (minimum 7)
└─ Skill 2: Billing (minimum 5)

Available Agents:
├─ Agent A: Spanish(9), Billing(6) ← Score: 9×0.5 + 6×0.5 = 7.5
├─ Agent B: Spanish(8), Billing(8) ← Score: 8×0.5 + 8×0.5 = 8.0 ✅ Selected
└─ Agent C: Spanish(10), Sales(9) ← Missing required skill (Billing)

Result: Route to Agent B (highest combined score with all required skills)
```

### Scenario 3: Priority-Based Routing

```
Queue State:
├─ VIP Contact (Priority 1): Waiting 30 seconds
├─ Standard Contact (Priority 3): Waiting 2 minutes
└─ Internal Call (Priority 4): Waiting 5 minutes

Agent Available: 1 agent becomes available

Selection: VIP Contact (Priority 1) is routed first, regardless of wait time
```

### Scenario 4: Overflow Routing

```
Primary Queue: Sales_Queue
├─ Service Level: 80/20 (target)
├─ Current State: 75/20 (below target)
├─ Queue Depth: 25 contacts waiting
└─ Average Wait: 4 minutes

Overflow Condition: Average wait > 3 minutes
Overflow Action: Route next 5 contacts to → Sales_Overflow_Queue
Overflow Queue: Different agent group with lower skill requirements
```

---

## Performance Monitoring

### Key Reports

1. **Service Level by Queue**
   - Real-time and historical SL%
   - Trend analysis
   - Alert on SL violations

2. **Agent Performance**
   - Contacts handled per agent
   - Average handle time
   - Agent utilization percentage

3. **Queue Statistics**
   - Contacts offered vs. handled
   - Abandonment rate
   - Average wait time

4. **Routing Efficiency**
   - First contact resolution
   - Transfer rate
   - Skill match accuracy

### Sample Dashboard

```
┌─────────────────────────────────────────────────────┐
│            ACD ROUTING DASHBOARD                    │
├─────────────────────────────────────────────────────┤
│  Service Level Performance (Today)                  │
│  ┌──────────────────┬─────────┬────────┬─────────┐ │
│  │ Queue            │ Target  │ Actual │ Status  │ │
│  ├──────────────────┼─────────┼────────┼─────────┤ │
│  │ Sales_Main       │  80/20  │  85/20 │ ✅      │ │
│  │ Support_Tech     │  80/20  │  76/20 │ ⚠️      │ │
│  │ Billing          │  80/20  │  89/20 │ ✅      │ │
│  │ VIP_Queue        │  90/15  │  92/15 │ ✅      │ │
│  └──────────────────┴─────────┴────────┴─────────┘ │
│                                                     │
│  Agent Utilization                                  │
│  ├─ Active Contacts: 47 / 100 agents               │
│  ├─ Average Utilization: 78%                        │
│  └─ Agents in Wrap-up: 12                          │
│                                                     │
│  Queue Depth (Real-time)                            │
│  ├─ Sales_Main: 3 waiting (avg wait: 25s)         │
│  ├─ Support_Tech: 8 waiting (avg wait: 1m 45s) ⚠️  │
│  └─ Billing: 1 waiting (avg wait: 10s)            │
└─────────────────────────────────────────────────────┘
```

---

## Next Steps

1. **Review Current State**: [Current Avaya ACD](current-avaya-acd.md)
2. **Understand Target Design**: [Target Webex ACD](target-webex-acd.md)
3. **Study Routing Logic**: [Routing Strategies](routing-strategies.md)
4. **Plan Migration**: [Migration Guide](migration-guide.md)

---

