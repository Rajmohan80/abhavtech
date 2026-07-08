# CS — Cybersecurity Risk Factor

CS is a dimensionless score from 1 to 5 representing the combined security and compliance overhead applied to your AI traffic. Every point above 1 maps to real, measurable bandwidth consumption by encryption inspection, DLP scanning, micro-segmentation headers, and audit logging systems.

## The formula

```
CS = BASE(1.0)
   + PII_handling (0–1.0)
   + Regulatory_scope (0–1.0)
   + Public_exposure (0–1.0)
   + AI_model_sensitivity (0–1.0)
   + Financial_payment_data (0–1.0)

Maximum CS = 5.0
```

In the IS formula, CS is used directly as a multiplier. CS = 4 makes the network stress four times higher than CS = 1 for the same load and bandwidth.

---

## CS levels and bandwidth overhead

| CS level | Score | Scenario | BW overhead | Controls active |
|----------|-------|---------|------------|----------------|
| Low risk | 1.0 | Internal telemetry, non-PII analytics | +5–10% | TLS 1.3 only |
| Standard | 2.0 | Enterprise apps, internal AI tools | +15–20% | TLS inspect, basic DLP |
| Elevated | 3.0 | AI with PII processing, partner data | +25–30% | NGFW inspect, DLP, RBAC |
| High | 4.0 | Financial / healthcare AI workloads | +35–45% | Full DLP, micro-seg, ZTNA |
| Critical | 5.0 | Regulated AI (DPDP, HIPAA, PCI DSS) | +50–70% | All above + data residency + audit |

---

## CS component scoring matrix

Score each of the five components based on your deployment. Sum for your final CS.

### Component 1 — PII handling

Does the AI system process personally identifiable information such as names, phone numbers, Aadhaar numbers, financial account details, or health records?

| Condition | Score |
|-----------|-------|
| AI processes no PII — only aggregated or anonymised data | 0.0 |
| AI processes limited PII — names and contact details only | 0.5 |
| AI processes full PII — financial, health, or identity data | 1.0 |

### Component 2 — Regulatory scope

Is the AI deployment subject to any data protection regulation?

| Condition | Score |
|-----------|-------|
| No regulatory requirements — internal tool, non-sensitive data | 0.0 |
| Internal policy only — corporate data governance, no external mandate | 0.5 |
| External regulation — DPDP Act, GDPR, HIPAA, or PCI DSS in scope | 1.0 |

### Component 3 — Public or partner exposure

Does AI traffic cross a trust boundary to a public network, external partner, or internet-facing API?

| Condition | Score |
|-----------|-------|
| Fully internal — AI APIs are internal only, no external exposure | 0.0 |
| Partner-facing — AI traffic crosses to a managed partner network | 0.5 |
| Public API — AI calls traverse the public internet or a public cloud endpoint | 1.0 |

### Component 4 — AI model sensitivity

How sensitive is the AI model itself? A compromised model prompt or exfiltrated model weight is a business risk.

| Condition | Score |
|-----------|-------|
| Open source model, no proprietary training data | 0.0 |
| Fine-tuned open model — custom weights on open foundation | 0.5 |
| Proprietary model — in-house trained or licensed, IP-sensitive weights | 1.0 |

### Component 5 — Financial or payment data

Is any financial transaction data, card data, or payment instrument information in scope?

| Condition | Score |
|-----------|-------|
| No financial data in AI traffic | 0.0 |
| Partial — AI accesses account summaries but not card data | 0.5 |
| PCI DSS in scope — AI processes card data or is in the cardholder data environment | 1.0 |

---

## Your CS scoring worksheet

| Component | Your condition | Score |
|-----------|--------------|-------|
| PII handling | ___ | ___ |
| Regulatory scope | ___ | ___ |
| Public / partner exposure | ___ | ___ |
| AI model sensitivity | ___ | ___ |
| Financial / payment data | ___ | ___ |
| **Total CS** | | **= ___** |

---

## CS overhead — bandwidth calculation

Once you have your CS score, calculate the adjusted AIW:

```
CS_overhead_fraction:
  CS = 1.0  →  +0.08 (8%)
  CS = 2.0  →  +0.18 (18%)
  CS = 3.0  →  +0.28 (28%)
  CS = 4.0  →  +0.40 (40%)
  CS = 5.0  →  +0.60 (60%)

Adjusted_AIW = AIW × (1 + CS_overhead_fraction)
```

### Worked example

**Site:** DPDP-regulated bank with PCI in scope.  
**CS scoring:** PII = 1.0, regulatory = 1.0, public exposure = 0.5, model sensitivity = 0.5, financial = 1.0  
**CS total:** 4.0

```
Base AIW:      12.0 Mbps (from AIW calculation)
CS overhead:   CS = 4.0 → +40%
Adjusted AIW:  12.0 × 1.40 = 16.8 Mbps per load unit
```

!!! danger "Always use CS-adjusted AIW in bandwidth calculations"
    Failing to account for CS = 4 overhead causes 40% bandwidth underprovisioning. On a 500-agent site at U_eff = 1,390, this translates to a 6.7 Gbps shortfall on a 10G WAN link.

---

## CS impact on infrastructure selection

CS also determines what security infrastructure you must deploy, independent of bandwidth:

| CS level | Firewall requirement | DLP requirement | Segmentation |
|----------|---------------------|----------------|-------------|
| CS = 1–2 | Standard NGFW | Optional | VLAN |
| CS = 3 | NGFW with TLS 1.3 inspection | Required | VLAN + ACL |
| CS = 4 | High-throughput NGFW (PA-3400 class) | Required + AI-aware | VXLAN micro-seg |
| CS = 5 | Dedicated hardware + HSM | Required + audit | VXLAN + SGT + ZTNA |

For CS = 4 or 5, the firewall itself becomes a throughput bottleneck if undersized. An ASA 5500 inspecting TLS 1.3 at 2 Gbps throughput cannot handle a 10 Gbps AI flow. Firewall sizing must match the CS-adjusted AIW × U_eff.

```
Firewall_throughput_required = U_eff × Adjusted_AIW (CS-adjusted)
```
