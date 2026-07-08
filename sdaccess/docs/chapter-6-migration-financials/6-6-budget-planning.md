# 6.6 Budget Planning

### 6.6.1 Capital Expenditure (CapEx) Breakdown

```
+------------------------------------------------------------------+
|                    CAPEX BREAKDOWN BY CATEGORY                    |
+------------------------------------------------------------------+

HARDWARE - SWITCHING                                      $X,XXX+----------------------------------------------------------------+
| Category              | Model          | Qty  | Unit     | Total|
|----------------------|----------------|------|----------|------|
| Border Nodes         | C9500-48Y4C    | 12   | $X,XXX | $X,XXX|
| Control Plane        | C9500-24Y4C    | 12   | $X,XXX | $X,XXX|
| Edge (Hub)           | C9300-48U      | 238  | $X,XXX  | $X,XXX|
| Edge (Branch)        | C9300-24U      | 48   | $X,XXX  | $X,XXX|
| Extended Nodes       | C9200-48P      | 120  | $X,XXX  | $X,XXX|
| Optics/Cables        | Various        | -    | -        | $X,XXX|
+----------------------------------------------------------------+

HARDWARE - WIRELESS                                       $X,XXX+----------------------------------------------------------------+
| Category              | Model          | Qty  | Unit     | Total|
|----------------------|----------------|------|----------|------|
| WLC (Large Sites)    | C9800-80       | 6    | $X,XXX | $X,XXX|
| WLC (Medium Sites)   | C9800-40       | 6    | $X,XXX | $X,XXX|
| APs (High Density)   | C9130AXI       | 350  | $X,XXX    | $X,XXX|
| APs (Standard)       | C9120AXI       | 240  | $X,XXX    | $X,XXX|
| AP Mounts/Cables     | Various        | -    | -        | $X,XXX |
+----------------------------------------------------------------+

HARDWARE - MANAGEMENT                                       $X,XXX+----------------------------------------------------------------+
| Category              | Model          | Qty  | Unit     | Total|
|----------------------|----------------|------|----------|------|
| DNAC (Primary)       | DN2-HW-APL-XL  | 3    | $X,XXX | $X,XXX|
| DNAC (DR)            | DN2-HW-APL-XL  | 3    | $X,XXX | $X,XXX|
| ISE PAN              | SNS-3695-K9    | 2    | $X,XXX | $X,XXX |
| ISE PSN              | SNS-3655-K9    | 12   | $X,XXX  | $X,XXX |
+----------------------------------------------------------------+

IMPLEMENTATION SERVICES                                     $X,XXX+----------------------------------------------------------------+
| Service               | Duration       | Rate      | Total      |
|----------------------|----------------|-----------|------------|
| Cisco Professional   | 800 hours      | $X,XXX/hr   | $X,XXX  |
| Integration Partner  | 500 hours      | $X,XXX/hr   | $X,XXX  |
| Internal PM          | 10 months      | $X,XXX/mo| $X,XXX  |
| Travel & Logistics   | -              | -         | $X,XXX   |
+----------------------------------------------------------------+

TRAINING                                                     $X,XXX+----------------------------------------------------------------+
| Course                | Attendees | Cost/Person  | Total       |
|----------------------|-----------|--------------|-------------|
| DNAC Administrator   | 6         | $X,XXX      | $X,XXX    |
| ISE Administrator    | 4         | $X,XXX      | $X,XXX    |
| SD-Access Design     | 4         | $X,XXX      | $X,XXX    |
| Cisco DESDG          | 4         | $X,XXX      | $X,XXX    |
+----------------------------------------------------------------+

TOTAL CAPEX:                                              $X,XXX==================================================================
```

### 6.6.2 Operating Expenditure (OpEx) - Annual

```
+------------------------------------------------------------------+
|                    ANNUAL OPEX BREAKDOWN                          |
+------------------------------------------------------------------+

LICENSES (Amortized Annual)                                 $X,XXX+----------------------------------------------------------------+
| License Type          | 5-Year Total  | Annual     |
|----------------------|---------------|------------|
| DNA Advantage (Switch)| $X,XXX     | $X,XXX  |
| DNA Advantage (Wireless)| $X,XXX   | $X,XXX   |
| ISE Base + Plus       | $X,XXX     | $X,XXX  |
| DNA Center License    | Included      | $X,XXX        |
+----------------------------------------------------------------+

SUPPORT CONTRACTS                                           $X,XXX+----------------------------------------------------------------+
| Contract Type         | Coverage      | Annual Cost|
|----------------------|---------------|------------|
| DNA Support (Solution)| 8×5×NBD       | $X,XXX   |
| ISE Support          | 24×7×4hr      | $X,XXX   |
| DNAC Appliance       | 24×7×4hr      | $X,XXX   |
+----------------------------------------------------------------+

OPERATIONAL LABOR                                           $X,XXX+----------------------------------------------------------------+
| Role                  | FTE Count | Loaded Cost  | Total      |
|----------------------|-----------|--------------|------------|
| Network Engineer     | 2.5       | $X,XXX    | $X,XXX  |
| Security Analyst     | 1.0       | $X,XXX    | $X,XXX  |
| NOC Allocation       | 0.25      | $X,XXX    | $X,XXX   |
+----------------------------------------------------------------+

CLOUD SERVICES                                               $X,XXX+----------------------------------------------------------------+
| Service               | Type          | Annual Cost|
|----------------------|---------------|------------|
| Cisco Cloud (optional)| ThousandEyes  | $X,XXX   |
+----------------------------------------------------------------+

TRAINING (Ongoing)                                           $X,XXX+----------------------------------------------------------------+
| Type                  | Frequency     | Annual Cost|
|----------------------|---------------|------------|
| Skills refresh       | Annual        | $X,XXX   |
| Certification        | Ongoing       | $X,XXX    |
+----------------------------------------------------------------+

MISCELLANEOUS                                                $X,XXX+----------------------------------------------------------------+
| Item                  | Description   | Annual Cost|
|----------------------|---------------|------------|
| Power & Cooling delta | Incremental   | $X,XXX    |
| Incident resolution  | Reduced       | $X,XXX   |
+----------------------------------------------------------------+

TOTAL ANNUAL OPEX:                                        $X,XXX==================================================================
```

### 6.6.3 Budget by Fiscal Year

| Fiscal Year | CapEx | OpEx | Total | Cumulative |
|-------------|-------|------|-------|------------|
| FY1 Q1-Q2 | $X,XXX| $X,XXX| $X,XXX| $X,XXX|
| FY1 Q3-Q4 | $X,XXX| $X,XXX| $X,XXX| $X,XXX|
| FY2 | $X,XXX| $X,XXX| $X,XXX| $X,XXX|
| FY3 | $X,XXX| $X,XXX| $X,XXX| $X,XXX|
| FY4 | $X,XXX| $X,XXX| $X,XXX| $X,XXX|
| FY5 | $X,XXX| $X,XXX| $X,XXX| $X,XXX|

### 6.6.4 Budget Approval Thresholds

| Amount | Approval Level | Documentation Required |
|--------|----------------|------------------------|
| <$X,XXX| IT Director | Quote, business justification |
| $X,XXX- $X,XXX| VP of IT | Business case, TCO |
| $X,XXX- $X,XXX| CIO | Full business case, ROI |
| >$X,XXX| CFO + Board | Executive summary, multi-year plan |

---
