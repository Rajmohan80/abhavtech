# Routing Strategies

## Overview

This document provides detailed routing strategy configurations for Webex Contact Center, including algorithms, decision logic, optimization techniques, and real-world implementation examples.

---

## Routing Strategy Fundamentals

### What is a Routing Strategy?

A routing strategy is the set of rules and algorithms that determine how incoming contacts are distributed to available agents. The goal is to optimize for:

1. **Customer Experience** - Minimize wait times, match to best agent
2. **Agent Efficiency** - Balance workload, utilize skills effectively
3. **Business Outcomes** - Meet SLAs, reduce costs, maximize revenue

### Key Components

```
┌─────────────────────────────────────────────────────┐
│            ROUTING STRATEGY COMPONENTS              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. ENTRY POINT                                     │
│     └─ Where contacts enter the system             │
│                                                     │
│  2. ROUTING POLICY                                  │
│     └─ Rules for how to route                      │
│                                                     │
│  3. QUEUE SELECTION                                 │
│     └─ Which queue(s) to consider                  │
│                                                     │
│  4. AGENT MATCHING                                  │
│     └─ Skills, availability, proficiency           │
│                                                     │
│  5. PRIORITY & WEIGHTING                            │
│     └─ Contact and agent prioritization            │
│                                                     │
│  6. FALLBACK & OVERFLOW                             │
│     └─ What to do if no match found                │
└─────────────────────────────────────────────────────┘
```

---

## Strategy 1: Skills-Based Routing (SBR)

### Description

Routes contacts to agents based on required skills and proficiency levels. This is the most common and flexible routing strategy.

### Algorithm

```
FUNCTION SkillsBasedRouting(contact, queue):
  
  1. Extract required skills from contact/queue
     required_skills = queue.required_skills
  
  2. Find eligible agents
     eligible_agents = []
     FOR each agent IN queue.agents:
       IF agent.state == "Available" AND
          agent.has_all_skills(required_skills) AND
          agent.proficiency >= minimum_required:
         eligible_agents.add(agent)
  
  3. If no eligible agents, place contact in queue
     IF eligible_agents.empty():
       RETURN queue_contact()
  
  4. Calculate agent score
     FOR each agent IN eligible_agents:
       score = 0
       FOR each skill IN required_skills:
         score += agent.proficiency[skill] × skill.weight
       score += agent.idle_time × idle_weight
       agent.routing_score = score
  
  5. Sort by score (descending) and route to top agent
     eligible_agents.sort_by(routing_score, DESC)
     RETURN route_to(eligible_agents[0])

END FUNCTION
```

### Configuration Example

```json
{
  "routingStrategy": "SKILLS_BASED",
  "queue": "Sales_Spanish_Queue",
  "requiredSkills": [
    {
      "skillId": "skill-spanish",
      "minimumProficiency": 7,
      "weight": 0.4
    },
    {
      "skillId": "skill-sales",
      "minimumProficiency": 5,
      "weight": 0.6
    }
  ],
  "agentSelection": {
    "scoringMethod": "weighted_proficiency",
    "idleTimeBonus": {
      "enabled": true,
      "weight": 0.001
    }
  }
}
```

### Real-World Example

```
Scenario: Spanish-speaking customer calling sales

Contact Details:
├─ ANI: +1-XX5-0100
├─ DNIS: +1-800-XX5-0150 (Spanish sales line)
├─ Language: Spanish (detected from DNIS)
└─ Department: Sales

Required Skills:
├─ Spanish: minimum 7 (weight 40%)
└─ Sales: minimum 5 (weight 60%)

Available Agents:
┌─────────┬─────────┬───────┬──────────┬───────┐
│ Agent   │ Spanish │ Sales │ Idle Time│ Score │
├─────────┼─────────┼───────┼──────────┼───────┤
│ Agent_A │    9    │   6   │   45s    │ 7.25  │
│ Agent_B │    7    │   8   │  180s    │ 7.98  │✅
│ Agent_C │   10    │   5   │   30s    │ 7.03  │
└─────────┴─────────┴───────┴──────────┴───────┘

Calculation for Agent_B:
Score = (7 × 0.4) + (8 × 0.6) + (180 × 0.001)
Score = 2.8 + 4.8 + 0.18 = 7.98 ✅ Highest

Result: Route to Agent_B
```

### Advantages

✅ Matches customer needs to agent expertise  
✅ Improves first call resolution  
✅ Increases customer satisfaction  
✅ Optimizes agent utilization  
✅ Flexible and scalable  

### Disadvantages

⚠️ Requires accurate skill definitions  
⚠️ Needs regular skill assessment  
⚠️ Can lead to uneven workload if skills not balanced  
⚠️ Complex to configure initially  

---

## Strategy 2: Longest Available Agent (LAA)

### Description

Routes contacts to the agent who has been idle (available) for the longest time. Ensures fair distribution of work.

### Algorithm

```
FUNCTION LongestAvailableAgent(contact, queue):
  
  1. Find all available agents in queue
     available_agents = queue.agents.filter(state == "Available")
  
  2. If no agents available, queue the contact
     IF available_agents.empty():
       RETURN queue_contact()
  
  3. Sort agents by idle time (descending)
     available_agents.sort_by(idle_time, DESC)
  
  4. Route to agent with longest idle time
     RETURN route_to(available_agents[0])

END FUNCTION
```

### Configuration Example

```json
{
  "routingStrategy": "LONGEST_AVAILABLE",
  "queue": "Billing_General_Queue",
  "agentSelection": {
    "method": "idle_time",
    "order": "descending"
  },
  "tieBreaker": {
    "method": "round_robin",
    "enabled": true
  }
}
```

### Real-World Example

```
Scenario: Billing inquiry, multiple agents available

Queue: Billing_General_Queue
Available Agents:
┌─────────┬──────────┬───────────────┐
│ Agent   │ Idle Time│ Last Contact  │
├─────────┼──────────┼───────────────┤
│ Agent_A │   45s    │ 10:23:15 AM   │
│ Agent_B │  180s    │ 10:20:00 AM   │✅
│ Agent_C │   30s    │ 10:23:30 AM   │
│ Agent_D │  120s    │ 10:21:00 AM   │
└─────────┴──────────┴───────────────┘

Result: Route to Agent_B (longest idle: 180 seconds)

Benefits:
├─ Agent_B gets next contact (fair distribution)
├─ Prevents "cherry-picking"
└─ Simple, predictable routing
```

### Advantages

✅ Fair work distribution  
✅ Simple to understand and implement  
✅ No complex scoring calculations  
✅ Prevents agent gaming  
✅ Predictable behavior  

### Disadvantages

⚠️ Doesn't consider agent expertise  
⚠️ May route to less-qualified agents  
⚠️ Can reduce FCR if skills not matched  
⚠️ Not ideal for specialized queues  

### Best Use Cases

- General inquiry queues
- Queues where all agents have similar skills
- High-volume, low-complexity contacts
- When fairness is more important than optimization

---

## Strategy 3: Priority-Based Routing

### Description

Routes contacts based on assigned priority levels. Higher priority contacts are served first, regardless of wait time.

### Priority Levels

```
Priority 1 (CRITICAL):
├─ VIP customers
├─ Service outages affecting multiple customers
├─ Escalated complaints
├─ Regulatory/compliance callbacks
└─ Executive requests

Priority 2 (HIGH):
├─ Billing disputes
├─ Payment failures
├─ Aged contacts (waiting >5 minutes)
├─ Scheduled callbacks
└─ Social media complaints (public)

Priority 3 (NORMAL):
├─ Standard customer inquiries
├─ New sales opportunities
├─ Technical support requests
└─ General questions

Priority 4 (LOW):
├─ Internal requests
├─ Training calls
├─ Survey responses
└─ Non-urgent administrative
```

### Algorithm

```
FUNCTION PriorityBasedRouting(queue):
  
  1. Get all contacts in queue
     contacts_in_queue = queue.get_all_contacts()
  
  2. Sort by priority (descending), then by wait time
     contacts_in_queue.sort_by([
       {field: "priority", order: "DESC"},
       {field: "wait_time", order: "DESC"}
     ])
  
  3. Process contacts in sorted order
     FOR each contact IN contacts_in_queue:
       eligible_agents = find_available_agents(contact)
       IF eligible_agents.exists():
         RETURN route_to(best_agent(eligible_agents))
  
  4. If no agents available, keep all contacts in queue
     RETURN queue_all_contacts()

END FUNCTION
```

### Configuration Example

```json
{
  "routingStrategy": "PRIORITY_BASED",
  "queue": "VIP_Support_Queue",
  "priorityRules": [
    {
      "condition": "contact.customer_tier == 'VIP'",
      "priority": 1
    },
    {
      "condition": "contact.wait_time > 300",
      "priority": 2
    },
    {
      "condition": "contact.type == 'callback'",
      "priority": 2
    },
    {
      "condition": "default",
      "priority": 3
    }
  ],
  "agentSelection": {
    "withinPriority": "longest_available"
  }
}
```

### Real-World Example

```
Scenario: Multiple contacts waiting, one agent becomes available

Queue State:
┌──────────┬──────────┬──────────┬─────────────────┐
│ Contact  │ Priority │ Wait Time│ Customer Type   │
├──────────┼──────────┼──────────┼─────────────────┤
│ Call_A   │    3     │   4m 30s │ Standard        │
│ Call_B   │    1     │   1m 15s │ VIP             │✅
│ Call_C   │    2     │   6m 20s │ Aged (>5 min)   │
│ Call_D   │    3     │   2m 45s │ Standard        │
└──────────┴──────────┴──────────┴─────────────────┘

Sorting Logic:
1. Sort by priority: Call_B (1), Call_C (2), Call_A (3), Call_D (3)
2. Within same priority, sort by wait time

Result: Route to Call_B (Priority 1, VIP customer)
Even though Call_C has waited longer (6m 20s vs 1m 15s)

Next available agent will get Call_C (Priority 2)
Then Call_A (Priority 3, longest wait: 4m 30s)
Then Call_D (Priority 3, 2m 45s wait)
```

### Dynamic Priority Assignment

```javascript
// Example: Automatically increase priority for aged contacts
function updateContactPriorities(queue) {
  const contacts = queue.getContacts();
  
  contacts.forEach(contact => {
    const waitTimeMinutes = contact.waitTime / 60;
    
    // Increase priority if waiting too long
    if (waitTimeMinutes > 5 && contact.priority === 3) {
      contact.updatePriority(2);
      logger.info(`Contact ${contact.id} priority increased to HIGH due to wait time`);
    }
    
    if (waitTimeMinutes > 10 && contact.priority === 2) {
      contact.updatePriority(1);
      logger.info(`Contact ${contact.id} priority increased to CRITICAL due to extended wait`);
    }
  });
}

// Run every 30 seconds
setInterval(updateContactPriorities, 30000);
```

---

## Strategy 4: Predictive Routing (AI-Based)

### Description

Uses machine learning to predict which agent is most likely to successfully resolve the contact, based on historical performance data.

### How It Works

```
┌─────────────────────────────────────────────────────┐
│         PREDICTIVE ROUTING ENGINE                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  INPUT DATA:                                        │
│  ├─ Customer profile (history, value, behavior)    │
│  ├─ Contact context (reason, channel, sentiment)   │
│  ├─ Agent profiles (skills, performance history)   │
│  └─ Historical outcomes (FCR, CSAT, handle time)   │
│                                                     │
│  MACHINE LEARNING MODEL:                            │
│  ├─ Predict FCR probability per agent              │
│  ├─ Predict CSAT score per agent                   │
│  ├─ Predict handle time per agent                  │
│  └─ Calculate optimal match score                  │
│                                                     │
│  OUTPUT:                                            │
│  └─ Ranked list of agents by predicted success     │
└─────────────────────────────────────────────────────┘
```

### Prediction Factors

```
Customer Factors:
├─ Previous contact history
├─ Issue complexity (predicted)
├─ Customer sentiment (from IVR/chat)
├─ Customer value/tier
└─ Preferred communication style

Agent Factors:
├─ Historical FCR rate with similar issues
├─ CSAT scores for this customer type
├─ Average handle time for this issue type
├─ Current workload and stress level
└─ Training/certification in relevant area

Contextual Factors:
├─ Time of day
├─ Day of week
├─ Current queue conditions
├─ Agent fatigue (hours worked today)
└─ Recent performance trends
```

### Configuration Example

```json
{
  "routingStrategy": "PREDICTIVE",
  "queue": "Support_Tech_Tier1_Queue",
  "mlModel": {
    "modelId": "fcr-prediction-model-v3",
    "predictionGoals": [
      {
        "metric": "first_call_resolution",
        "weight": 0.5
      },
      {
        "metric": "customer_satisfaction",
        "weight": 0.3
      },
      {
        "metric": "handle_time",
        "weight": 0.2,
        "optimize": "minimize"
      }
    ],
    "minimumConfidence": 0.7,
    "fallbackStrategy": "skills_based"
  }
}
```

### Real-World Example

```
Scenario: Technical support call with sentiment detection

Customer Profile:
├─ Name: Jane Smith
├─ Customer since: 2020
├─ Previous contacts: 8 (in last 6 months)
├─ Most common issue: Software installation
├─ Previous CSAT: 4.2/5
└─ Detected sentiment: Frustrated (IVR tone analysis)

Issue Context:
├─ Reason: Software not working
├─ Complexity: Medium-High (predicted from keywords)
└─ Urgency: High (customer stated "urgent")

ML Model Predictions:
┌─────────┬─────────┬──────────┬─────────┬─────────────┐
│ Agent   │ FCR Prob│ CSAT Pred│ AHT Pred│ Match Score │
├─────────┼─────────┼──────────┼─────────┼─────────────┤
│ Agent_A │   75%   │   4.5    │  15 min │    0.82     │✅
│ Agent_B │   65%   │   4.2    │  18 min │    0.71     │
│ Agent_C │   80%   │   4.0    │  25 min │    0.75     │
└─────────┴─────────┴──────────┴─────────┴─────────────┘

Calculation for Agent_A:
Match Score = (0.75 × 0.5) + (4.5/5 × 0.3) + ((1 - 15/30) × 0.2)
            = 0.375 + 0.27 + 0.1
            = 0.745... normalized to 0.82

Result: Route to Agent_A
Reason: Best balance of FCR, CSAT, and efficiency
```

### Advantages

✅ Data-driven optimal matching  
✅ Improves FCR and CSAT over time  
✅ Self-learning (improves with more data)  
✅ Considers multiple factors simultaneously  
✅ Can identify hidden patterns  

### Disadvantages

⚠️ Requires substantial historical data  
⚠️ Complex to implement and maintain  
⚠️ Model accuracy depends on data quality  
⚠️ May be perceived as "unfair" by agents  
⚠️ Requires ongoing model tuning  

---

## Strategy 5: Geographic Routing

### Description

Routes contacts based on geographic location, matching customers to agents in same region/timezone.

### Use Cases

```
1. Regional Product Knowledge
   └─ Different products/services by region
   
2. Language/Dialect Preferences
   └─ Match regional accents and terminology
   
3. Timezone Alignment
   └─ Route to agents in customer's timezone
   
4. Regulatory Compliance
   └─ State-specific regulations (insurance, finance)
   
5. Local Market Knowledge
   └─ Agents familiar with local conditions
```

### Algorithm

```
FUNCTION GeographicRouting(contact, queue):
  
  1. Determine customer location
     customer_location = get_location_from_ani(contact.ani)
     OR customer_location = contact.geo_data
  
  2. Find agents in same region
     preferred_agents = queue.agents.filter(
       location == customer_location AND
       state == "Available"
     )
  
  3. If regional agents available, use skills-based routing
     IF preferred_agents.exists():
       RETURN skills_based_routing(contact, preferred_agents)
  
  4. Otherwise, fall back to any available agent
     ELSE:
       RETURN skills_based_routing(contact, queue.all_agents)

END FUNCTION
```

### Configuration Example

```json
{
  "routingStrategy": "GEOGRAPHIC",
  "queue": "Sales_Regional_Queue",
  "geoRouting": {
    "enabled": true,
    "locationSource": "ani_area_code",
    "regions": [
      {
        "name": "US_East",
        "areaCodes": ["212", "617", "703", "404"],
        "agentSites": ["Site_NY", "Site_Boston", "Site_Atlanta"]
      },
      {
        "name": "US_West",
        "areaCodes": ["415", "310", "206", "503"],
        "agentSites": ["Site_SF", "Site_LA", "Site_Seattle"]
      },
      {
        "name": "US_Central",
        "areaCodes": ["312", "214", "713", "303"],
        "agentSites": ["Site_Chicago", "Site_Dallas"]
      }
    ],
    "fallbackToAnyRegion": true,
    "fallbackDelay": 30
  }
}
```

### Real-World Example

```
Scenario: Customer calling from California

Contact Details:
├─ ANI: +1-415-XX5-0100
├─ Area Code: 415 (San Francisco)
├─ Detected Region: US_West
└─ Product: Regional auto insurance

Agent Distribution:
┌────────────┬──────────┬───────────┬─────────────┐
│ Agent      │ Location │ Available │ Match Score │
├────────────┼──────────┼───────────┼─────────────┤
│ Agent_SF_1 │ US_West  │    Yes    │   ✅ 1.0   │
│ Agent_SF_2 │ US_West  │    Yes    │   ✅ 1.0   │
│ Agent_NY_1 │ US_East  │    Yes    │     0.7     │
│ Agent_TX_1 │ US_Central│   Yes    │     0.7     │
└────────────┴──────────┴───────────┴─────────────┘

Routing Decision:
1. Prefer agents in US_West region (Agent_SF_1, Agent_SF_2)
2. Apply skills-based routing within preferred agents
3. Route to Agent_SF_1 or Agent_SF_2

Benefits:
├─ Agent knows California insurance regulations
├─ Familiar with local market conditions
├─ Same timezone (no early morning/late night calls)
└─ Better customer rapport
```

---

## Strategy 6: Time-Based Routing

### Description

Routes contacts differently based on time of day, day of week, or special events.

### Common Patterns

```
PATTERN 1: Business Hours vs After Hours
├─ 8 AM - 6 PM: Route to full-service queues
└─ 6 PM - 8 AM: Route to reduced-service or voicemail

PATTERN 2: Peak vs Off-Peak
├─ Peak (10 AM - 2 PM): All agents on phones
└─ Off-Peak: Blended (phone + email/chat)

PATTERN 3: Day-of-Week
├─ Monday (high volume): Extra staffing, simplified routing
├─ Tuesday-Thursday: Standard routing
└─ Friday (lower volume): Cross-training, complex issues

PATTERN 4: Seasonal/Event-Based
├─ Holiday Season: Extended hours, overflow routing
├─ Product Launch: Dedicated support queue
└─ Billing Cycle: Extra billing agents
```

### Configuration Example

```json
{
  "routingStrategy": "TIME_BASED",
  "queue": "Sales_Main_Queue",
  "schedules": [
    {
      "name": "business_hours",
      "active": {
        "daysOfWeek": ["monday", "tuesday", "wednesday", "thursday", "friday"],
        "timeRange": {
          "start": "08:00",
          "end": "18:00",
          "timezone": "America/New_York"
        }
      },
      "routing": {
        "strategy": "skills_based",
        "queueId": "Sales_Main_Queue"
      }
    },
    {
      "name": "after_hours",
      "active": {
        "daysOfWeek": ["monday", "tuesday", "wednesday", "thursday", "friday"],
        "timeRange": [
          {"start": "00:00", "end": "08:00"},
          {"start": "18:00", "end": "23:59"}
        ]
      },
      "routing": {
        "strategy": "voicemail",
        "message": "audio-after-hours-message",
        "createTask": true
      }
    },
    {
      "name": "weekend",
      "active": {
        "daysOfWeek": ["saturday", "sunday"]
      },
      "routing": {
        "strategy": "skills_based",
        "queueId": "Weekend_Support_Queue",
        "message": "audio-weekend-greeting"
      }
    }
  ]
}
```

---

## Strategy 7: Blended Routing (Omnichannel)

### Description

Routes contacts across multiple channels (voice, chat, email, SMS) to the same agent pool, optimizing utilization and customer experience.

### Channel Capacity Management

```
Agent Capacity Model:
┌─────────────────────────────────────────────────────┐
│ Agent: john.doe@company.com                         │
├─────────────────────────────────────────────────────┤
│ Channel          │ Max Concurrent │ Current │ Avail?│
├──────────────────┼────────────────┼─────────┼───────┤
│ Voice            │       1        │    0    │  ✅   │
│ Chat             │       3        │    2    │  ✅   │
│ Email            │       5        │    3    │  ✅   │
│ SMS              │       8        │    5    │  ✅   │
└──────────────────┴────────────────┴─────────┴───────┘

Workload Calculation:
├─ Voice: 0/1 × 1.0 weight = 0.0
├─ Chat: 2/3 × 0.3 weight = 0.2
├─ Email: 3/5 × 0.2 weight = 0.12
├─ SMS: 5/8 × 0.1 weight = 0.0625
└─ Total Workload: 0.3825 (38.25% utilized)

Available For: Voice, Chat, Email, SMS
```

### Algorithm

```
FUNCTION BlendedRouting(contact, agents):
  
  1. Determine contact channel and required capacity
     channel = contact.channel
     capacity_required = CHANNEL_WEIGHTS[channel]
  
  2. Find agents available for this channel
     available_agents = []
     FOR each agent IN agents:
       IF agent.state == "Available" AND
          agent.current[channel] < agent.max[channel] AND
          agent.total_workload < 0.9:
         available_agents.add(agent)
  
  3. Calculate agent scores
     FOR each agent IN available_agents:
       skill_score = calculate_skill_match(agent, contact)
       workload_score = 1 - agent.total_workload
       idle_score = agent.idle_time × 0.001
       
       agent.score = (skill_score × 0.5) + 
                     (workload_score × 0.3) +
                     (idle_score × 0.2)
  
  4. Route to highest scoring agent
     available_agents.sort_by(score, DESC)
     RETURN route_to(available_agents[0])

END FUNCTION
```

### Real-World Example

```
Scenario: Chat contact arrives, multiple agents handling different channels

Contact: Web Chat from customer
Required Skills: Sales (min 5), Chat (min 5)

Available Agents:
┌─────────┬───────┬──────────────────────┬──────────┬───────┐
│ Agent   │Skills │ Current Activity     │ Workload │ Score │
├─────────┼───────┼──────────────────────┼──────────┼───────┤
│ Agent_A │ S:8   │ Voice: 1/1          │   100%   │  N/A  │
│         │ C:7   │ Chat: 0/3           │          │  ❌   │
├─────────┼───────┼──────────────────────┼──────────┼───────┤
│ Agent_B │ S:6   │ Chat: 2/3           │   53%    │ 0.72  │
│         │ C:9   │ Email: 3/5          │          │       │
├─────────┼───────┼──────────────────────┼──────────┼───────┤
│ Agent_C │ S:7   │ Chat: 1/3           │   37%    │ 0.85  │✅
│         │ C:8   │ Email: 2/5          │          │       │
│         │       │ Idle: 45s           │          │       │
└─────────┴───────┴──────────────────────┴──────────┴───────┘

Agent_A: Excluded (on voice call, can't handle chat simultaneously)
Agent_B: Available, but higher workload (53%)
Agent_C: Best choice (lower workload 37%, recently idle)

Result: Route chat to Agent_C
```

---

## Advanced Routing Techniques

### 1. Conditional Routing

```javascript
// Route based on multiple conditions
if (customer.tier === 'VIP' && contact.issue === 'billing') {
  route_to('VIP_Billing_Queue', priority: 'highest');
} else if (contact.wait_time > 300) {
  route_to('Escalation_Queue', priority: 'high');
} else if (current_time.hour >= 20 || current_time.hour < 8) {
  route_to('After_Hours_Queue');
} else {
  route_to('Standard_Queue');
}
```

### 2. Weighted Fair Queuing

```
Multiple queues sharing same agent pool:
├─ VIP_Queue: 50% of agent availability
├─ Sales_Queue: 30% of agent availability
└─ Support_Queue: 20% of agent availability

Algorithm:
1. Calculate tokens for each queue based on weight
2. Serve contacts in round-robin, consuming tokens
3. Queue with most remaining tokens gets next agent
```

### 3. Affinity Routing (Sticky Agent)

```
Route customer back to previous agent if:
├─ Same issue/case as previous contact
├─ Within 24 hours of last contact
├─ Previous agent is available
└─ Previous interaction was successful (CSAT > 4)

Benefits:
├─ No need to repeat information
├─ Faster resolution
├─ Better customer experience
└─ Agent has context
```

### 4. Skill Decay Routing

```
Dynamically adjust agent proficiency based on:
├─ Time since last contact of this type
├─ Recent training/certification
├─ Performance trends

Example:
Agent had Spanish:9, but hasn't taken Spanish call in 90 days
System temporarily reduces to Spanish:7 until refreshed
```

---

## Routing Optimization Tips

### 1. Balance Multiple Objectives

```
Optimization Goals:
├─ Minimize customer wait time (40% weight)
├─ Maximize first call resolution (30% weight)
├─ Balance agent workload (20% weight)
└─ Minimize operational cost (10% weight)

Use weighted scoring to balance competing goals
```

### 2. Monitor and Adjust

```
Weekly Review:
☐ Service level achievement by queue
☐ Agent utilization (target: 80-85%)
☐ FCR rates by routing strategy
☐ Customer satisfaction scores
☐ Routing effectiveness metrics

Quarterly Optimization:
☐ Skill accuracy validation
☐ Queue structure review
☐ Routing algorithm tuning
☐ Capacity planning
```

### 3. A/B Testing

```
Test routing strategies:
├─ Route 80% with Strategy A (current)
├─ Route 20% with Strategy B (new)
├─ Compare metrics after 2 weeks
└─ Roll out winner to 100%

Example Test:
Current: Longest Available Agent
Test: Skills-Based Routing
Hypothesis: SBR will improve FCR by 5%
Duration: 2 weeks
Result: FCR improved 7% → Adopt SBR
```

---

## Routing Performance Metrics

### Key Performance Indicators

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Service Level (80/20) | ≥ 85% | % answered in 20 seconds |
| Average Speed of Answer | ≤ 30s | Mean time from queue to answer |
| Abandonment Rate | ≤ 5% | % callers who hang up |
| First Call Resolution | ≥ 80% | Post-call survey + repeat calls |
| Agent Utilization | 80-85% | Time handling / available time |
| Average Handle Time | Varies | Talk time + hold + wrap-up |
| Transfer Rate | ≤ 8% | % calls transferred |
| Queue Time | ≤ 45s | Time waiting in queue |

### Routing Efficiency Metrics

```
Skill Match Accuracy:
= (Contacts routed to exact skill match / Total contacts) × 100
Target: > 90%

Routing Decision Time:
= Time from "agent available" to "contact delivered"
Target: < 2 seconds

Overflow Rate:
= (Contacts overflowed / Total contacts) × 100
Target: < 10%

Agent Idle Time:
= Total time agents available but not handling contacts
Target: < 15% of available time
```

---

## Troubleshooting Guide

### Problem: Poor Service Level Performance

**Symptoms:**
- Consistently missing 80/20 SLA
- Long average wait times
- High abandonment rates

**Diagnostic Steps:**
```
1. Check agent availability
   ├─ Are enough agents logged in?
   ├─ Are agents stuck in wrap-up?
   └─ Check agent state distribution

2. Review routing effectiveness
   ├─ Are contacts routing to available agents?
   ├─ Is routing strategy too restrictive?
   └─ Check for routing bottlenecks

3. Analyze queue depth patterns
   ├─ When does queue depth spike?
   ├─ Is staffing aligned with volume?
   └─ Review forecasting accuracy

4. Validate skill assignments
   ├─ Do agents have correct skills?
   ├─ Are proficiency levels accurate?
   └─ Are skill requirements too high?
```

**Solutions:**
```
Short-term:
├─ Add more agents to queue
├─ Lower skill proficiency requirements
├─ Enable overflow routing
└─ Offer callback options

Long-term:
├─ Improve forecasting and scheduling
├─ Optimize routing strategy
├─ Cross-train agents on multiple skills
└─ Implement predictive routing
```

### Problem: Uneven Agent Workload

**Symptoms:**
- Some agents consistently busy
- Other agents frequently idle
- Agent complaints about fairness

**Diagnostic Steps:**
```
1. Review skill distribution
   ├─ Are skills evenly distributed?
   ├─ Do some agents have unique skills?
   └─ Check skill proficiency levels

2. Check routing algorithm
   ├─ Is LAA being used properly?
   ├─ Are there routing preferences?
   └─ Review agent selection logic

3. Analyze contact distribution
   ├─ Are certain queues busier?
   ├─ Is there time-of-day imbalance?
   └─ Check priority routing impact
```

**Solutions:**
```
├─ Use Longest Available Agent routing
├─ Cross-train agents to balance skills
├─ Implement workload-based scoring
├─ Review and adjust skill proficiency
└─ Monitor agent utilization reports daily
```

### Problem: Low First Call Resolution

**Symptoms:**
- Customers calling back repeatedly
- High transfer rates
- Poor CSAT scores

**Diagnostic Steps:**
```
1. Analyze skill matching
   ├─ Are contacts routed to right skills?
   ├─ Are proficiency levels sufficient?
   └─ Check transfer reasons

2. Review agent training
   ├─ Do agents have proper training?
   ├─ Are skills accurately assigned?
   └─ Check agent performance data

3. Identify common issues
   ├─ What issues cause repeat calls?
   ├─ Are there systemic problems?
   └─ Review call recordings
```

**Solutions:**
```
├─ Improve skills-based routing
├─ Provide additional agent training
├─ Update skills and proficiency levels
├─ Implement predictive routing
├─ Add knowledge base integration
└─ Review and improve IVR self-service
```

---

## Best Practices Summary

### Do's 

```
✅ Start simple, then optimize
   └─ Begin with basic skills routing, add complexity as needed

✅ Monitor and measure continuously
   └─ Track KPIs daily, review weekly, optimize monthly

✅ Test changes before full rollout
   └─ Use A/B testing or pilot groups

✅ Keep skills up to date
   └─ Regular skill assessments and updates

✅ Balance customer and agent experience
   └─ Optimize for both satisfaction and efficiency

✅ Document routing logic clearly
   └─ Everyone should understand how routing works

✅ Provide fallback options
   └─ Always have overflow and escalation paths

✅ Use appropriate routing for each queue
   └─ Different queues may need different strategies
```

### Don'ts 

```
❌ Don't over-complicate routing logic
   └─ Complex doesn't always mean better

❌ Don't set unrealistic skill requirements
   └─ Too restrictive = long wait times

❌ Don't ignore agent feedback
   └─ Agents know what works in practice

❌ Don't make changes during peak hours
   └─ Test changes during low-volume periods

❌ Don't neglect regular reviews
   └─ Routing effectiveness degrades over time

❌ Don't rely on single metric
   └─ Balance multiple objectives

❌ Don't forget about edge cases
   └─ Handle unusual scenarios gracefully

❌ Don't ignore seasonal patterns
   └─ Adjust routing for holidays, events
```

---

## Implementation Checklist

### Phase 1: Planning

```
☐ Define routing objectives and KPIs
☐ Document current state routing logic
☐ Identify skills taxonomy
☐ Map queues to business requirements
☐ Define service level targets
☐ Create fallback/overflow strategies
☐ Plan for exception handling
☐ Get stakeholder approval
```

### Phase 2: Configuration

```
☐ Create queues in Webex Control Hub
☐ Define and create all skills
☐ Assign skills to agents
☐ Configure routing strategies per queue
☐ Set up priority rules
☐ Configure overflow routing
☐ Set queue treatments (music, messages)
☐ Enable callback options
☐ Configure business hours routing
```

### Phase 3: Testing

```
☐ Unit test each queue individually
☐ Test skills-based routing accuracy
☐ Validate priority routing logic
☐ Test overflow scenarios
☐ Verify business hours routing
☐ Test callback functionality
☐ Load test with simulated volume
☐ Validate reporting accuracy
```

### Phase 4: Monitoring

```
☐ Create real-time dashboards
☐ Set up alerting thresholds
☐ Schedule daily performance reviews
☐ Establish weekly optimization meetings
☐ Create monthly reporting process
☐ Implement continuous improvement cycle
```

---

## Routing Strategy Decision Matrix

### Choosing the Right Strategy

| Use Case | Recommended Strategy | Rationale |
|----------|---------------------|-----------|
| Simple, high-volume queue | Longest Available Agent | Fair distribution, simple |
| Specialized support | Skills-Based Routing | Match expertise to need |
| VIP customers | Priority + Skills-Based | Ensure best service |
| Multi-language support | Skills-Based (Language) | Match language fluency |
| After-hours support | Time-Based Routing | Different service levels |
| Regional products | Geographic Routing | Local knowledge important |
| Complex issues | Predictive Routing | Optimize for FCR |
| Omnichannel contacts | Blended Routing | Maximize utilization |

---

## Future Enhancements

### AI/ML Opportunities

```
1. Predictive Wait Time
   └─ ML model predicts accurate EWT based on patterns

2. Sentiment-Based Routing
   └─ Route frustrated customers to empathy specialists

3. Next-Best-Action Routing
   └─ Route based on predicted customer intent

4. Dynamic Skill Adjustment
   └─ Auto-adjust agent skills based on performance

5. Proactive Callback
   └─ System predicts when customer will need help
```

### Integration Enhancements

```
1. CRM-Driven Routing
   └─ Route based on CRM data (LTV, risk, opportunity)

2. Real-Time Workforce Management
   └─ Adjust routing based on WFM adherence

3. Quality Management Integration
   └─ Consider QM scores in routing decisions

4. Learning Management Integration
   └─ Route to agents recently trained on topic
```


