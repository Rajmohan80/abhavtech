# Chapter 1 — Foundations

This chapter explains how to use the workbook, the sequence of the nine design steps, and why each calculation is mandatory before any AI workload is introduced to enterprise infrastructure.

## In this chapter

- [How to Use This Workbook](how-to-use.md) — Design gate methodology, step sequence, and when to run each calculation
- [Formula Overview](formula-overview.md) — All formulas on one page with variable definitions and enterprise adaptations

## The design gate principle

Every formula in this workbook is a gate, not a guideline. If the IS gate fails (IS > 10), no further AI deployment proceeds until infrastructure is corrected. This is not a recommendation — it is a hard project risk boundary.

```
Step 1: U_eff  →  Step 2: AIW  →  Step 3: CS  →  Step 4: LL
                                                        |
Step 9: Upgrade  ←  Step 8: MCP  ←  Step 7: PUO  ←  Step 5: B
                                                        |
                                                   Step 6: IS gate
```

## Who should use this workbook

| Role | Primary chapters |
|------|-----------------|
| Network architect | All — primary user |
| WAN / SD-WAN engineer | Chapters 4, 7 |
| Security engineer | Chapter 3 (CS scoring) |
| Contact centre architect | Chapters 2, 5, 6 |
| AI/ML infrastructure engineer | Chapters 2, 4, 6 |
| Project manager | Chapter 1, IS thresholds, Chapter 9 |
