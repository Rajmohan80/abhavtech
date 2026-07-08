# Appendix 10-F: Deferred Items Register

## Overview

This appendix documents items that have been intentionally deferred from the initial Phase 2B AI implementation documentation. Each item includes the rationale for deferral and the trigger/timeline for completion.

**Deferral Principle:** Items are deferred when they either:
1. Depend on outputs from implementation (cannot be created until system is live)
2. Require data collection over time before meaningful content can be produced
3. Are better suited for a specific implementation phase

---

## Deferred Documentation Items

### Appendix 10-A: Dialogflow CX Agent Export (JSON)

| Attribute | Details |
|-----------|---------|
| **Item** | Complete Dialogflow CX agent configuration export |
| **Format** | JSON blob (agent.json, intents/*.json, flows/*.json, etc.) |
| **Reason for Deferral** | Export can only be generated from a live GCP agent |
| **Completion Trigger** | After Dialogflow CX agent is built in GCP |
| **Owner** | AI Operations Team |
| **Estimated Effort** | 30 minutes (export + documentation) |

**What Will Be Included:**
- `agent.json` - Agent settings and configuration
- `intents/*.json` - All 10 intent definitions with training phrases
- `entityTypes/*.json` - Custom entity definitions
- `flows/*.json` - All 7 flow definitions
- `pages/*.json` - All 27 page configurations
- `webhooks/*.json` - Webhook configurations

**Storage Location:** Git repository (encrypted for sensitive data)

---

### Appendix 10-B: Webhook Code (Python)

| Attribute | Details |
|-----------|---------|
| **Item** | Complete Python Flask webhook implementation |
| **Format** | Python file (.py) with full endpoint code |
| **Reason for Deferral** | Full implementation requires API specifications from Abhavtech backend team |
| **Completion Trigger** | During implementation phase when backend APIs are finalized |
| **Owner** | Development Team |
| **Estimated Effort** | 4-8 hours |

**What Will Be Included:**
```
abhavtech-fulfillment-webhook/
+-- main.py                 # Flask application entry point
+-- handlers/
|   +-- order_handler.py    # /orders endpoint
|   +-- account_handler.py  # /accounts endpoint
|   +-- billing_handler.py  # /billing endpoint
|   +-- product_handler.py  # /products endpoint
|   +-- support_handler.py  # /support endpoint
+-- utils/
|   +-- api_client.py       # Abhavtech API integration
|   +-- response_builder.py # Dialogflow response formatting
|   +-- auth.py             # Authentication utilities
+-- requirements.txt        # Python dependencies
+-- README.md               # Deployment instructions
```

**Current Status:** Code snippets provided in Chapter 10 Section 10.8

---

### Appendix 10-C: Training Phrase Library

| Attribute | Details |
|-----------|---------|
| **Item** | Complete training phrase list for all intents |
| **Format** | CSV/Excel with phrases in English and Hindi |
| **Reason for Deferral** | Complete list requires SME review and Hindi translation verification |
| **Completion Trigger** | During implementation phase, before Dialogflow CX agent build |
| **Owner** | AI Operations + Business SMEs |
| **Estimated Effort** | 8-12 hours |

**Summary from Chapter 10:**

| Intent | English Phrases | Hindi Phrases | Total |
|--------|-----------------|---------------|-------|
| order.status | 20 | 10 | 30 |
| order.track | 15 | 8 | 23 |
| product.inquiry | 20 | 10 | 30 |
| product.pricing | 15 | 8 | 23 |
| account.balance | 18 | 10 | 28 |
| account.info | 15 | 8 | 23 |
| support.general | 20 | 10 | 30 |
| support.troubleshoot | 25 | 10 | 35 |
| billing.inquiry | 20 | 10 | 30 |
| agent.handoff | 25 | 10 | 35 |
| **TOTAL** | **193** | **94** | **287** |

**Deliverable Format:**
```
training_phrases.csv:
intent_name,phrase,language,category
order.status,"Where is my order",en,direct_query
order.status,"मेरा ऑर्डर कहाँ है",hi,direct_query
...
```

---

### Appendix 10-D: Test Case Matrix

| Attribute | Details |
|-----------|---------|
| **Item** | Complete test case matrix for AI features |
| **Format** | Excel workbook with multiple sheets |
| **Reason for Deferral** | Detailed test cases require finalized flow designs and UAT planning |
| **Completion Trigger** | During UAT planning phase |
| **Owner** | QA Team + AI Operations |
| **Estimated Effort** | 16-24 hours |

**Summary from Chapter 10:**

| Category | Test Cases | Description |
|----------|------------|-------------|
| Intent Recognition | 50 | Verify correct intent detection for all phrases |
| Entity Extraction | 30 | Verify data capture (order numbers, products, etc.) |
| Conversation Flow | 25 | Multi-turn navigation and context retention |
| Escalation Paths | 15 | Handoff to agents with context preservation |
| Error Handling | 20 | Fallback, timeout, and recovery scenarios |
| Hindi Language | 20 | Hindi-specific interactions |
| **TOTAL** | **160** | |

**Deliverable Structure:**
```
AI_Test_Case_Matrix.xlsx:
+-- Sheet 1: Intent Recognition Tests
+-- Sheet 2: Entity Extraction Tests
+-- Sheet 3: Conversation Flow Tests
+-- Sheet 4: Escalation Tests
+-- Sheet 5: Error Handling Tests
+-- Sheet 6: Hindi Language Tests
+-- Sheet 7: Test Execution Tracker
+-- Sheet 8: Defect Log
```

---

## Deferred Implementation Items

### Predictive Routing

| Attribute | Details |
|-----------|---------|
| **Feature** | WxCC Predictive Routing with ML-based agent matching |
| **Reason for Deferral** | Requires minimum 6 months of historical interaction data |
| **Completion Trigger** | Phase 3 (Month 7+) after sufficient data collection |
| **Owner** | Contact Center Operations + IT |
| **Prerequisites** | Phase 2A + 2B operational, data collection enabled |

**Data Collection (Starting Phase 2A):**
- Call outcomes (wrap-up codes)
- Handle time per agent
- FCR by agent/queue
- Customer intent (from VA)
- Sentiment scores
- CSAT survey responses

**Expected Benefits (When Enabled):**
- FCR improvement: 82% -> 88%
- CSAT improvement: 4.3 -> 4.5
- AHT reduction: 5.5 min -> 5.0 min

---

### Custom Speech Model Training

| Attribute | Details |
|-----------|---------|
| **Feature** | Custom-trained speech recognition model for Abhavtech terminology |
| **Reason for Deferral** | Evaluate need based on baseline accuracy metrics |
| **Completion Trigger** | If intent recognition accuracy < 90% after 3 months |
| **Owner** | AI Operations + Google Cloud Support |
| **Prerequisites** | 3 months of interaction data, accuracy metrics below threshold |

**Evaluation Criteria:**

| Metric | Threshold | Action |
|--------|-----------|--------|
| Intent Recognition | ≥ 90% | No custom training needed |
| Intent Recognition | 85-90% | Add training phrases, re-evaluate |
| Intent Recognition | < 85% | Initiate custom model training |
| Entity Extraction | ≥ 95% | No changes needed |
| Entity Extraction | < 95% | Review entity patterns, add synonyms |

**If Custom Training Required:**
1. Export conversation logs from Dialogflow CX
2. Prepare training dataset (minimum 10,000 utterances)
3. Engage Google Cloud professional services
4. Train and validate custom model
5. Deploy to production environment
6. Monitor accuracy improvement

---

## Completion Tracking

| Item | Target Date | Actual Date | Status | Notes |
|------|-------------|-------------|--------|-------|
| Appendix 10-A | Phase 2B Week 2 | - | ⏳ Pending | After agent build |
| Appendix 10-B | Phase 2B Week 1 | - | ⏳ Pending | During implementation |
| Appendix 10-C | Phase 2B Week 1 | - | ⏳ Pending | Before agent build |
| Appendix 10-D | Phase 2B Week 3 | - | ⏳ Pending | During UAT planning |
| Predictive Routing | Phase 3 (Month 7) | - | ⏳ Deferred | Data collection ongoing |
| Custom Speech Model | TBD | - | ⏳ Conditional | If accuracy < 90% |

---

## Document Update History

| Date | Author | Changes |
|------|--------|---------|
| Jan 2026 | Collaboration Architecture Team | Initial creation |
| | | |
| | | |

---

## Notes

1. **Living Document:** This appendix should be updated as deferred items are completed
2. **Ownership:** Each item has a designated owner responsible for completion
3. **Dependencies:** Some items depend on others (e.g., 10-C must be done before 10-A)
4. **Quality Gate:** Deferred items should go through the same review process as original documentation

---

*© 2026 Abhavtech.com - Internal Use Only*
*Document Code: ABV-COLLAB-MIG-2026-P2-CH10-APP-F*
