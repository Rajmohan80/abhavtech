# 6.5 ROI Analysis

### 6.5.1 Quantifiable Benefits

| Benefit Category | Annual Value | 5-Year Value | Calculation Basis |
|------------------|--------------|--------------|-------------------|
| **Operational Efficiency** ||||
| Reduced FTE (2 positions) | $X,XXX| $X,XXX| 2 × $X,XXX fully loaded |
| Automation savings | $X,XXX| $X,XXX| 1,500 hours × $X,XXX/hr |
| Faster troubleshooting | $X,XXX| $X,XXX| 50% MTTR reduction |
| **Security Improvements** ||||
| Breach prevention | $X,XXX| $X,XXX| Industry breach cost avg |
| Compliance automation | $X,XXX| $X,XXX| Audit preparation savings |
| Reduced security tools | $X,XXX| $X,XXX| Consolidated tooling |
| **Business Enablement** ||||
| Faster onboarding | $X,XXX| $X,XXX| 75% reduction × volume |
| Reduced downtime | $X,XXX| $X,XXX| 99.99% vs 99.9% SLA |
| **Total Annual Benefits** | **$X,XXX** | **$X,XXX** | |

### 6.5.2 ROI Calculation

```
+------------------------------------------------------------------+
|                    ROI CALCULATION                                |
+------------------------------------------------------------------+

INVESTMENT (Total CapEx + Year 1 OpEx):
  Hardware:                    $X,XXX  Implementation:                $X,XXX  Year 1 Licenses:              $X,XXX  Year 1 Operations:            $X,XXX  ------------------------------------------
  TOTAL INVESTMENT:           $X,XXX
ANNUAL NET BENEFIT (Year 2 onwards):
  Quantified Benefits:        $X,XXX  Legacy Cost Avoidance:        $X,XXX  ------------------------------------------
  NET ANNUAL BENEFIT:         $X,XXX
ROI FORMULA:
  ROI = (Net Benefits - Investment) / Investment × 100

  5-Year ROI:
  Net Benefits (Years 2-5):   $X,XXX  Total Investment:           $X,XXX  ------------------------------------------
  5-Year ROI:                     -0.3%

  7-Year ROI:
  Net Benefits (Years 2-7):   $X,XXX  Total Investment:           $X,XXX  ------------------------------------------
  7-Year ROI:                    +49.5%

  10-Year ROI:
  Net Benefits (Years 2-10): $X,XXX  Total Investment:           $X,XXX  ------------------------------------------
  10-Year ROI:                  +124.3%
==================================================================
```

### 6.5.3 Payback Period Analysis

```
+------------------------------------------------------------------+
|                    PAYBACK PERIOD ANALYSIS                        |
+------------------------------------------------------------------+

CUMULATIVE CASH FLOW:
                              Investment    Benefits    Cumulative
------------------------------------------------------------------
Year 0 (Implementation)      -$X,XXX         $X,XXX  -$X,XXXYear 1 (First year ops)      -$X,XXX   $X,XXX  -$X,XXXYear 2                               $X,XXX  $X,XXX  -$X,XXXYear 3                               $X,XXX  $X,XXX  -$X,XXXYear 4                               $X,XXX  $X,XXX  -$X,XXXYear 5                               $X,XXX  $X,XXX    +$X,XXXYear 6 (License renewal)     -$X,XXX $X,XXX    -$X,XXXYear 7                               $X,XXX  $X,XXX  +$X,XXX------------------------------------------------------------------

PAYBACK PERIOD: 4.7 years (simple payback)
DISCOUNTED PAYBACK (8% rate): 5.8 years
==================================================================
```

### 6.5.4 Non-Quantifiable Benefits

| Benefit | Impact | Strategic Value |
|---------|--------|-----------------|
| Zero Trust architecture | Improved security posture | Critical for compliance |
| Micro-segmentation | Reduced lateral movement | Industry best practice |
| Intent-based networking | Simplified operations | Future-proof architecture |
| AI/ML-driven assurance | Proactive issue detection | Reduced business impact |
| Consistent policy | Unified security model | Reduced complexity |
| Automated compliance | Continuous validation | Audit readiness |
| Scalability | Support for growth | Business enablement |
| Agility | Faster changes | Competitive advantage |

### 6.5.5 WAN Cost Savings (SD-WAN Migration)

**Note**: The SD-WAN migration runs in parallel with SD-Access. WAN savings are realized from replacing expensive MPLS circuits with Internet + 5G/LTE at branch sites.

**Current WAN Costs (Monthly)**

| Site Type | Sites | Circuit Type | Avg Cost/Site | Total Monthly |
|-----------|-------|--------------|---------------|---------------|
| Hub Sites | 6 | MPLS 500M-1G | $X,XXX| $X,XXX|
| Hub Sites (backup) | 6 | Internet 500M | $X,XXX| $X,XXX|
| Large Branches | 3 | MPLS 150-200M | $X,XXX| $X,XXX|
| Medium Branches | 10 | MPLS 100M | $X,XXX| $X,XXX|
| Small Branches | 20 | MPLS 50M | $X,XXX| $X,XXX|
| EMEA Branches | 12 | MPLS 50-200M | $X,XXX| $X,XXX|
| **Total Current WAN** | | | | **$X,XXX/month** |

**Target WAN Costs (Monthly) - Post SD-WAN Migration**

| Site Type | Sites | Primary | Secondary | Avg Cost/Site | Total Monthly |
|-----------|-------|---------|-----------|---------------|---------------|
| Hub Sites | 6 | MPLS 500M-1G | Internet 500M | $X,XXX| $X,XXX|
| Large Branches | 3 | Internet 200M | 5G 100M | $X,XXX| $X,XXX|
| Medium Branches | 10 | Internet 100M | LTE 50M | $X,XXX| $X,XXX|
| Small Branches | 20 | Internet 50M | LTE 30M | $X,XXX| $X,XXX|
| EMEA Branches | 12 | Internet 50-100M | LTE 30M | $X,XXX| $X,XXX|
| **Total Target WAN** | | | | | **$X,XXX/month** |

**WAN Cost Savings Summary**

```
+------------------------------------------------------------------+
|                    WAN COST SAVINGS ANALYSIS                      |
+------------------------------------------------------------------+

MONTHLY SAVINGS:
  Current WAN spend:         $X,XXX  Target WAN spend:          $X,XXX  ----------------------------------------
  MONTHLY SAVINGS:            $X,XXX
ANNUAL SAVINGS:              $X,XXX
5-YEAR WAN SAVINGS:          $X,XXX
MPLS CIRCUIT TERMINATION COSTS (One-Time):
  Early termination fees:     $X,XXX  (Contracts ending Dec 2026, minimal ETF)

NET 5-YEAR WAN SAVINGS:      $X,XXX==================================================================
```

**WAN Savings Impact on ROI**

| Metric | Without WAN Savings | With WAN Savings |
|--------|---------------------|------------------|
| Annual Net Benefit | $X,XXX| $X,XXX|
| 5-Year Payback | 4.7 years | 2.8 years |
| 5-Year ROI | -0.3% | +113% |
| 10-Year ROI | +124% | +340% |

**Note**: WAN savings are contingent on successful SD-WAN migration running in parallel with SD-Access deployment. SD-WAN investment costs are covered in the separate SD-WAN project documentation.

---
