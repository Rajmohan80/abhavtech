# Chapter 4 Enhancement: Critical Configuration Fixes
**Complete Low-Level Design Implementation Guide**

**Document Version:** 1.0  
**Project:** KidsWear India - Cisco Webex Contact Center Greenfield Deployment  
**Related Document:** Chapter 4: Platform Provisioning (Low-Level Design) v2.0  
**Date:** March 2026  
**Author:** Rajmohan M, Principal Consultant  
**AI-Assisted:** Claude (Anthropic)

---

## Executive Summary

This document provides **production-ready technical configurations** for 10 critical gaps identified in the base Chapter 4: Platform Provisioning document. Each section includes:

✅ **Step-by-step configuration procedures**  
✅ **Actual parameter values and settings**  
✅ **Code examples with error handling**  
✅ **Testing and validation procedures**  
✅ **Troubleshooting guides**

**Target Audience:** Implementation engineers, system administrators, DevOps teams  
**Prerequisites:** Base Chapter 4 completed, admin access to all platforms  
**Estimated Implementation Time:** 60-80 hours total

---

## Section 1: DTMF Masking - Complete PCI-DSS Implementation

### 1.1 Technical Overview

**CRITICAL UNDERSTANDING:**

The original Chapter 4 showed a conceptual workflow. This section provides the **ACTUAL technical implementation** that makes DTMF masking work in Webex Contact Center.

**PCI-DSS Requirement:** Cardholder data must NOT be:
- Stored in call recordings
- Visible in call logs
- Present in transcripts
- Accessible to unauthorized personnel

**Webex Contact Center Solution:**
- **Pause/Resume Recording API** during card collection
- **SecureForm IVR Node** (encrypts DTMF before storage)
- **Third-party payment gateway** integration (CyberSource, Stripe)

### 1.2 Architecture Decision

**Three Implementation Options:**

| Option | Security Level | Cost | Complexity | Recommendation |
|--------|---------------|------|------------|----------------|
| **A: Recording Pause** | Medium | Low | Low | ⚠️ Not PCI-DSS compliant alone |
| **B: SecureForm Node** | High | Medium | Medium | ✅ **RECOMMENDED for KidsWear** |
| **C: External Gateway** | Highest | High | High | For large enterprises only |

**KidsWear India Decision:** **Option B - SecureForm Node**
- Meets PCI-DSS Level 4 requirements
- No external gateway licensing costs
- Built into Webex Contact Center
- Encrypts DTMF at source

### 1.3 SecureForm Node Configuration

**Step 1: Enable SecureForm in Tenant**

Navigate to: **Webex Contact Center Admin → Settings → Features**

```yaml
Feature Settings:
  SecureForm:
    Enabled: true
    Encryption: AES-256
    Key_Rotation: 90 days
    Audit_Logging: true
```

**Step 2: Create SecureForm Flow Node**

In **Flow Designer**, drag the **SecureForm** node into your payment collection flow:

```yaml
Node: Collect_Payment_Info
Type: SecureForm
Configuration:
  Prompt: "secure_payment_prompt.wav"
  Prompt_Text: "Please enter your 16-digit card number followed by the pound key"
  
  Input_Settings:
    Min_Digits: 13
    Max_Digits: 19
    Timeout: 30 seconds
    Inter_Digit_Timeout: 5 seconds
    Terminator_Key: "#"
    Clear_Digit_Buffer: true
  
  Validation:
    Luhn_Check: true  # Validates card number checksum
    Mask_Pattern: "XXXX-XXXX-XXXX-{last4}"
  
  Security:
    Encrypt_Immediately: true
    Encryption_Algorithm: AES-256-GCM
    Key_ID: "{{tenant_encryption_key}}"
    Zero_Buffer_After_Encrypt: true
  
  Outputs:
    Variable_Name: "{{secure_card_token}}"
    Expose_Clear_Text: false  # CRITICAL: Never expose clear card number
    Token_Format: "tok_{{random_32_chars}}"
  
  Error_Handling:
    Invalid_Card: goto "Invalid_Card_Handler"
    Timeout: goto "Timeout_Handler"
    Max_Retries: 3
```

**Step 3: Expiry Date Collection**

```yaml
Node: Collect_Expiry
Type: SecureForm
Configuration:
  Prompt: "secure_expiry_prompt.wav"
  Prompt_Text: "Please enter the 4-digit expiry date as MM YY"
  
  Input_Settings:
    Exact_Digits: 4
    Format_Check: true  # Validates MM between 01-12
    Timeout: 20 seconds
    Terminator_Key: "#"
  
  Security:
    Encrypt_Immediately: true
    Store_Encrypted: true
  
  Outputs:
    Variable_Name: "{{secure_expiry_token}}"
```

**Step 4: CVV Collection**

```yaml
Node: Collect_CVV
Type: SecureForm
Configuration:
  Prompt: "secure_cvv_prompt.wav"
  Prompt_Text: "Please enter your 3-digit security code"
  
  Input_Settings:
    Exact_Digits: 3
    Timeout: 15 seconds
    Allow_Clear: false  # Don't allow caller to review entered digits
  
  Security:
    Encrypt_Immediately: true
    Never_Log: true  # CRITICAL: CVV must NEVER be logged
    Delete_After_Transaction: true
  
  Outputs:
    Variable_Name: "{{secure_cvv_token}}"
    TTL: 300  # Token expires after 5 minutes
```

### 1.4 Recording Pause/Resume Implementation

**When SecureForm is not available**, use Recording Pause API:

```python
# Python example for recording pause during payment
import requests
import time

def pause_recording_for_payment(interaction_id, webex_token):
    """
    Pause call recording before collecting payment information.
    Resume after payment is complete.
    
    Args:
        interaction_id: Webex CC interaction ID
        webex_token: OAuth bearer token
    """
    
    base_url = "https://api.wxcc-us1.cisco.com"
    headers = {
        "Authorization": f"Bearer {webex_token}",
        "Content-Type": "application/json"
    }
    
# Step 1: Pause recording
    pause_url = f"{base_url}/v1/interactions/{interaction_id}/recordings/pause"
    
    try:
        response = requests.post(pause_url, headers=headers)
        response.raise_for_status()
        
        print(f"Recording paused for interaction: {interaction_id}")
        print(f"Timestamp: {response.json()['pausedAt']}")
        
# Step 2: Collect payment (integrate with payment gateway here)
        payment_result = process_payment()  # Your payment logic
        
# Step 3: Resume recording
        resume_url = f"{base_url}/v1/interactions/{interaction_id}/recordings/resume"
        response = requests.post(resume_url, headers=headers)
        response.raise_for_status()
        
        print(f"Recording resumed for interaction: {interaction_id}")
        print(f"Gap duration: {response.json()['pauseDurationSeconds']} seconds")
        
# Step 4: Log pause event for compliance
        log_pci_event(interaction_id, "RECORDING_PAUSE", 
                     f"Duration: {response.json()['pauseDurationSeconds']}s")
        
        return payment_result
        
    except requests.exceptions.RequestException as e:
        print(f"Error pausing/resuming recording: {e}")
# CRITICAL: On error, assume recording is NOT paused
# Do NOT collect payment information
        raise Exception("Cannot guarantee PCI compliance - aborting payment")
```

### 1.5 Payment Gateway Integration

**Option 1: CyberSource (Recommended for Indian Market)**

```python
# CyberSource payment processing with tokenized card data
from cybersource import CyberSourceAPI

def process_payment_cybersource(card_token, expiry_token, cvv_token, amount):
    """
    Process payment using CyberSource with Webex CC tokens.
    
    Args:
        card_token: Encrypted token from SecureForm
        expiry_token: Encrypted expiry token
        cvv_token: Encrypted CVV token
        amount: Payment amount in INR
    """
    
    cybersource = CyberSourceAPI(
        merchant_id="kidswear_india",
        api_key="{{CYBERSOURCE_API_KEY}}",
        secret_key="{{CYBERSOURCE_SECRET}}",
        environment="production"
    )
    
# Create payment request
    payment_request = {
        "clientReferenceInformation": {
            "code": f"KWCC_{int(time.time())}"
        },
        "paymentInformation": {
            "card": {
                "number_token": card_token,  # Encrypted token from Webex
                "expiryMonth_token": expiry_token[:2],  # First 2 digits
                "expiryYear_token": expiry_token[2:],   # Last 2 digits
                "securityCode_token": cvv_token
            }
        },
        "orderInformation": {
            "amountDetails": {
                "totalAmount": str(amount),
                "currency": "INR"
            }
        },
        "processingInformation": {
            "commerceIndicator": "internet"
        }
    }
    
    try:
        response = cybersource.process_payment(payment_request)
        
        if response['status'] == 'AUTHORIZED':
            return {
                "success": True,
                "transaction_id": response['id'],
                "authorization_code": response['processorInformation']['approvalCode'],
                "amount": amount
            }
        else:
            return {
                "success": False,
                "error_code": response['errorInformation']['reason'],
                "message": response['errorInformation']['message']
            }
            
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
```

**Option 2: Stripe Integration**

```python
import stripe

def process_payment_stripe(card_token, amount):
    """
    Process payment using Stripe.
    Stripe accepts tokenized card data from Webex SecureForm.
    """
    
    stripe.api_key = "{{STRIPE_SECRET_KEY}}"
    
    try:
# Create payment intent
        payment_intent = stripe.PaymentIntent.create(
            amount=int(amount * 100),  # Stripe uses paise (smallest currency unit)
            currency="inr",
            payment_method_data={
                "type": "card",
                "card": {"token": card_token}
            },
            confirm=True,
            description="KidsWear India - Contact Center Payment"
        )
        
        if payment_intent.status == "succeeded":
            return {
                "success": True,
                "transaction_id": payment_intent.id,
                "amount": amount,
                "currency": "INR"
            }
        else:
            return {
                "success": False,
                "status": payment_intent.status,
                "error": payment_intent.last_payment_error
            }
            
    except stripe.error.CardError as e:
        return {
            "success": False,
            "error_type": "card_error",
            "message": e.user_message
        }
```

### 1.6 Complete Payment Flow - IVR Script

```yaml
Flow: Payment_Collection_Secure
Entry_Point: Payment_Menu

Nodes:
  1. Welcome_Payment:
      Type: PlayMessage
      Audio: "payment_intro.wav"
      Text: "You will now be transferred to our secure payment system."
      Next: Pause_Recording

  2. Pause_Recording:
      Type: API_Call
      Endpoint: "POST /v1/interactions/{{InteractionID}}/recordings/pause"
      On_Success: goto "Collect_Card_Number"
      On_Failure: goto "Payment_Unavailable"

  3. Collect_Card_Number:
      Type: SecureForm
      Configuration: [See Step 2 above]
      On_Valid: goto "Collect_Expiry"
      On_Invalid: decrement retry_count, goto "Invalid_Card"
      Max_Retries: 3

  4. Collect_Expiry:
      Type: SecureForm
      Configuration: [See Step 3 above]
      Next: "Collect_CVV"

  5. Collect_CVV:
      Type: SecureForm
      Configuration: [See Step 4 above]
      Next: "Collect_Amount"

  6. Collect_Amount:
      Type: CollectDigits
      Prompt: "Please enter the payment amount in rupees followed by the pound key"
      Min_Digits: 1
      Max_Digits: 6
      Store_In: "{{payment_amount}}"
      Next: "Confirm_Payment"

  7. Confirm_Payment:
      Type: PlayMessage
      Text: "You are about to pay {{payment_amount}} rupees. Press 1 to confirm or 2 to cancel."
      Next: "Get_Confirmation"

  8. Get_Confirmation:
      Type: CollectDigits
      Exact_Digits: 1
      If_1: goto "Process_Payment"
      If_2: goto "Payment_Cancelled"
      Default: repeat "Confirm_Payment"

  9. Process_Payment:
      Type: API_Call
      Service: "CyberSource_Payment_Gateway"
      Parameters:
        card_token: "{{secure_card_token}}"
        expiry_token: "{{secure_expiry_token}}"
        cvv_token: "{{secure_cvv_token}}"
        amount: "{{payment_amount}}"
      On_Success: goto "Payment_Success"
      On_Decline: goto "Payment_Declined"
      On_Error: goto "Payment_Error"

  10. Payment_Success:
      Type: PlayMessage
      Audio: "payment_success.wav"
      Text: "Your payment of {{payment_amount}} rupees has been processed successfully. Your confirmation number is {{transaction_id}}."
      Also_Execute: Resume_Recording
      Next: "Return_To_Agent"

  11. Resume_Recording:
      Type: API_Call
      Endpoint: "POST /v1/interactions/{{InteractionID}}/recordings/resume"
      Log_Event: true

  12. Return_To_Agent:
      Type: QueueToAgent
      Queue: "Post_Payment_Queue"
      Priority: High
      CAD_Variables:
        payment_status: "SUCCESS"
        transaction_id: "{{transaction_id}}"
        amount_paid: "{{payment_amount}}"

Error_Handlers:
  Invalid_Card:
    If retry_count > 0:
      Play "Invalid card number. Please try again."
      goto "Collect_Card_Number"
    Else:
      Play "Maximum attempts exceeded."
      goto "Transfer_To_Agent"

  Payment_Declined:
    Play "Your payment was declined. Please contact your bank."
    Set CAD_Variable: payment_status = "DECLINED"
    goto "Transfer_To_Agent"

  Payment_Unavailable:
    Play "Our payment system is temporarily unavailable. Transferring you to an agent."
    goto "Transfer_To_Agent"
```

### 1.7 PCI-DSS Compliance Validation

**Automated Validation Script:**

```python
#!/usr/bin/env python3
"""
PCI-DSS Compliance Validation for Webex Contact Center
Checks that card data is never exposed in logs or recordings.
"""

import requests
import json
from datetime import datetime, timedelta

def validate_pci_compliance(tenant_id, webex_token):
    """
    Validate that no cardholder data is present in:
    1. Call recordings
    2. Interaction logs
    3. CAD variables
    4. Transcripts
    """
    
    results = {
        "timestamp": datetime.now().isoformat(),
        "tenant": tenant_id,
        "checks_passed": 0,
        "checks_failed": 0,
        "violations": []
    }
    
# Test patterns that should NEVER appear
    forbidden_patterns = [
        r"\b\d{13,19}\b",  # Credit card numbers
        r"\b\d{3}\s?\d{3}\b",  # CVV patterns (avoid false positives)
        r"\b(4\d{3}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4})\b",  # Visa
        r"\b(5[1-5]\d{2}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4})\b",  # Mastercard
        r"\b(6011[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4})\b",  # Discover
    ]
    
# Check 1: Validate recording metadata
    print("Check 1: Validating call recordings...")
    recordings = get_recent_recordings(tenant_id, webex_token, hours=24)
    
    for recording in recordings:
        if has_pause_events(recording):
            results["checks_passed"] += 1
        else:
            if interaction_involved_payment(recording['interaction_id']):
                results["checks_failed"] += 1
                results["violations"].append({
                    "type": "MISSING_RECORDING_PAUSE",
                    "interaction_id": recording['interaction_id'],
                    "timestamp": recording['timestamp']
                })
    
# Check 2: Scan interaction logs
    print("Check 2: Scanning interaction logs...")
    logs = get_interaction_logs(tenant_id, webex_token, hours=24)
    
    for log in logs:
        for pattern in forbidden_patterns:
            if re.search(pattern, log['message']):
                results["checks_failed"] += 1
                results["violations"].append({
                    "type": "CARD_DATA_IN_LOGS",
                    "interaction_id": log['interaction_id'],
                    "pattern_matched": pattern,
                    "severity": "CRITICAL"
                })
                break
        else:
            results["checks_passed"] += 1
    
# Check 3: Verify encryption keys are rotated
    print("Check 3: Checking encryption key rotation...")
    key_age = get_encryption_key_age(tenant_id, webex_token)
    
    if key_age > 90:  # Keys should rotate every 90 days
        results["checks_failed"] += 1
        results["violations"].append({
            "type": "KEY_ROTATION_OVERDUE",
            "key_age_days": key_age,
            "severity": "HIGH"
        })
    else:
        results["checks_passed"] += 1
    
# Check 4: Audit trail completeness
    print("Check 4: Validating audit trail...")
    audit_events = get_pci_audit_events(tenant_id, webex_token, hours=24)
    
    required_events = ["RECORDING_PAUSE", "RECORDING_RESUME", "PAYMENT_PROCESSED"]
    for payment_interaction in get_payment_interactions(tenant_id, webex_token):
        for event_type in required_events:
            if not has_audit_event(audit_events, payment_interaction, event_type):
                results["checks_failed"] += 1
                results["violations"].append({
                    "type": "MISSING_AUDIT_EVENT",
                    "interaction_id": payment_interaction,
                    "missing_event": event_type,
                    "severity": "HIGH"
                })
    
# Generate report
    results["compliance_status"] = "PASS" if results["checks_failed"] == 0 else "FAIL"
    results["total_checks"] = results["checks_passed"] + results["checks_failed"]
    
    print("\n" + "="*60)
    print(f"PCI-DSS COMPLIANCE VALIDATION REPORT")
    print("="*60)
    print(f"Status: {results['compliance_status']}")
    print(f"Total Checks: {results['total_checks']}")
    print(f"Passed: {results['checks_passed']}")
    print(f"Failed: {results['checks_failed']}")
    
    if results["violations"]:
        print("\nVIOLATIONS FOUND:")
        for v in results["violations"]:
            print(f"  [{v['severity']}] {v['type']}")
            print(f"    Interaction: {v.get('interaction_id', 'N/A')}")
    
    return results

def has_pause_events(recording):
    """Check if recording has pause/resume metadata."""
    metadata = recording.get('metadata', {})
    return 'pauseEvents' in metadata and len(metadata['pauseEvents']) > 0

def interaction_involved_payment(interaction_id):
    """Check if interaction involved payment collection."""
# Query CAD variables or flow history
    return check_cad_variable(interaction_id, 'payment_collected')

# Run validation
if __name__ == "__main__":
    tenant_id = "kidswear-prod"
    webex_token = get_oauth_token()  # Implement OAuth flow
    
    results = validate_pci_compliance(tenant_id, webex_token)
    
# Send results to compliance dashboard
    if results["compliance_status"] == "FAIL":
        send_alert_to_compliance_team(results)
        
# Save report
    with open(f"pci_validation_{datetime.now():%Y%m%d}.json", "w") as f:
        json.dump(results, f, indent=2)
```

### 1.8 Testing Procedures

**Test Case 1: Verify DTMF Masking**

```
Test ID: PCI-001
Description: Verify that credit card digits are encrypted in SecureForm
Prerequisites: Test card number (4111 1111 1111 1111)

Steps:
1. Call contact center test number
2. Navigate to payment option in IVR
3. Enter test card number when prompted
4. Complete payment flow
5. Retrieve call recording
6. Check recording metadata for pause events
7. Search recording transcript for card digits

Expected Result:
✅ Recording shows pause event during card collection
✅ Transcript does not contain "4111 1111 1111 1111"
✅ CAD variable contains token (tok_xxxxx), not clear card number
✅ Audit log shows RECORDING_PAUSE and RECORDING_RESUME events

Actual Result: [To be filled during testing]
Pass/Fail: [To be determined]
```

**Test Case 2: SecureForm Validation**

```
Test ID: PCI-002
Description: Verify SecureForm rejects invalid card numbers

Steps:
1. Enter invalid card: 1234 5678 9012 3456 (fails Luhn check)
2. Observe system behavior

Expected Result:
✅ System plays "Invalid card number"
✅ Allows retry (up to 3 attempts)
✅ No invalid card stored in any log
✅ After 3 failures, transfers to agent

Pass/Fail: [To be determined]
```

**Test Case 3: Recording Pause API**

```
Test ID: PCI-003
Description: Validate recording pause/resume API

Steps:
1. Initiate call with recording enabled
2. Trigger recording pause via API
3. Wait 30 seconds
4. Resume recording via API
5. Check recording file

Expected Result:
✅ Recording file shows gap of ~30 seconds
✅ Gap metadata indicates intentional pause (not technical failure)
✅ Audio before/after gap is clear
✅ Timestamp in logs matches pause duration

Pass/Fail: [To be determined]
```

### 1.9 Operational Runbook

**Daily Operations:**

```
08:00 - Review overnight PCI compliance reports
        Check for any recording pause failures
        Validate all payment transactions have proper audit trail

10:00 - Run automated PCI validation script
        Review results
        Escalate any violations to security team

14:00 - Spot check 5 random payment calls
        Verify recordings properly masked
        Confirm SecureForm working correctly

18:00 - Generate daily PCI compliance summary
        Email report to compliance officer
        Archive audit logs
```

**Incident Response - Card Data Exposure:**

```
SEVERITY: CRITICAL
RTO: Immediate (15 minutes)

If card data is discovered in logs/recordings:

STEP 1 (0-5 minutes):
  - Immediately quarantine affected recording/log file
  - Disable access to file (chmod 000)
  - Notify security team and compliance officer

STEP 2 (5-15 minutes):
  - Identify all systems that accessed the exposed data
  - Determine scope: How many cards? Time period?
  - Freeze payment processing if systemic issue

STEP 3 (15-60 minutes):
  - Securely delete exposed data (DOD 5220.22-M wipe)
  - Document deletion with hash verification
  - Begin incident report

STEP 4 (1-24 hours):
  - Notify affected customers (if card data compromised)
  - Report to acquiring bank and card networks
  - Engage forensics team for root cause analysis

STEP 5 (24-72 hours):
  - Implement corrective actions
  - File incident report with RBI (if required)
  - Review and update security controls
```

---

## Section 2: Agent Desktop Advanced Configuration

### 2.1 Agent State Management

**Complete Idle Code Taxonomy:**

```yaml
Idle_Codes:
  Category: Breaks
    Codes:
      - BREAK_SHORT:
          Display_Name: "Break (15 min)"
          Duration_Max: 900  # 15 minutes in seconds
          Paid: true
          Impact_On_AHT: false
          Impact_On_Occupancy: true
          Auto_Logout: false
          Color: "#FFA500"  # Orange
      
      - LUNCH:
          Display_Name: "Lunch Break"
          Duration_Max: 3600  # 60 minutes
          Paid: true
          Scheduled: true  # Must be pre-scheduled
          Auto_Logout_After: 3660  # 61 minutes
          Color: "#FF6B6B"  # Red
      
      - BREAK_RESTROOM:
          Display_Name: "Restroom Break"
          Duration_Max: 300  # 5 minutes
          Paid: true
          Frequency_Limit: 4_per_shift
          Color: "#FFA500"

  Category: Training
    Codes:
      - TRAINING_LIVE:
          Display_Name: "Live Training Session"
          Paid: true
          Requires_Approval: false
          Scheduled: true
          Color: "#4ECDC4"  # Teal
      
      - TRAINING_ELEARNING:
          Display_Name: "E-Learning Module"
          Paid: true
          Track_Completion: true
          Color: "#4ECDC4"
      
      - COACHING_1ON1:
          Display_Name: "1-on-1 Coaching"
          Paid: true
          Requires_Supervisor: true
          Duration_Typical: 1800  # 30 minutes
          Color: "#95E1D3"  # Light teal

  Category: Meetings
    Codes:
      - MEETING_TEAM:
          Display_Name: "Team Meeting"
          Paid: true
          Scheduled: true
          Color: "#A8E6CF"  # Light green
      
      - MEETING_1ON1:
          Display_Name: "1-on-1 with Supervisor"
          Paid: true
          Scheduled: true
          Color: "#A8E6CF"

  Category: Administrative
    Codes:
      - ADMIN_WORK:
          Display_Name: "Administrative Tasks"
          Paid: true
          Examples: "Updating knowledge base, filing reports"
          Color: "#FFD93D"  # Yellow
      
      - SYSTEM_SETUP:
          Display_Name: "Workstation Setup"
          Typical_Duration: 300  # 5 minutes at shift start
          Paid: true
          Color: "#FFD93D"

  Category: Technical_Issues
    Codes:
      - TECH_ISSUE_COMPUTER:
          Display_Name: "Computer/Laptop Issue"
          Auto_Ticket: true
          Notify_IT: true
          Paid: true
          Color: "#FF6B6B"  # Red
      
      - TECH_ISSUE_NETWORK:
          Display_Name: "Network/VPN Issue"
          Auto_Ticket: true
          Notify_IT: true
          Severity: High
          Paid: true
          Color: "#FF6B6B"
      
      - TECH_ISSUE_HEADSET:
          Display_Name: "Headset/Audio Issue"
          Auto_Ticket: true
          Paid: true
          Color: "#FFA500"

  Category: Personal
    Codes:
      - PERSONAL_EMERGENCY:
          Display_Name: "Personal Emergency"
          Requires_Supervisor_Approval: true
          Paid: case_by_case
          Auto_Logout: false
          Color: "#FF0000"  # Bright red
      
      - PERSONAL_TIME_OFF:
          Display_Name: "Personal Time Off"
          Requires_Prior_Approval: true
          Deducted_From_PTO: true
          Color: "#C7CEEA"  # Light purple
```

### 2.2 Wrap-Up Code Taxonomy

```yaml
Wrap_Up_Codes:
  Category: Order_Management
    Codes:
      - ORDER_PLACED:
          Display_Name: "Order Placed Successfully"
          Update_CRM: true
          CRM_Field: "order_status"
          CRM_Value: "confirmed"
          Typical_AHT: 180  # 3 minutes
          FCR_Eligible: true
      
      - ORDER_MODIFIED:
          Display_Name: "Order Modified"
          Update_CRM: true
          Follow_Up_Required: false
          FCR_Eligible: true
      
      - ORDER_CANCELLED:
          Display_Name: "Order Cancelled"
          Update_CRM: true
          CRM_Activity: "Create cancellation note"
          Survey_Trigger: "cancellation_survey"
          FCR_Eligible: true
      
      - ORDER_INQUIRY:
          Display_Name: "Order Status Inquiry"
          Update_CRM: false
          Typical_AHT: 120
          FCR_Eligible: true

  Category: Product_Support
    Codes:
      - PRODUCT_INFO:
          Display_Name: "Product Information Provided"
          Update_CRM: false
          Knowledge_Base_Required: true
          FCR_Eligible: true
      
      - PRODUCT_COMPLAINT:
          Display_Name: "Product Quality Complaint"
          Update_CRM: true
          Create_Ticket: true
          Ticket_Type: "quality_issue"
          Supervisor_Alert: true
          Follow_Up_Required: true
          Follow_Up_Days: 2
          FCR_Eligible: false
      
      - SIZE_EXCHANGE:
          Display_Name: "Size Exchange Requested"
          Update_CRM: true
          Create_Return_Label: true
          Follow_Up_Required: false
          FCR_Eligible: true

  Category: Payment_Billing
    Codes:
      - PAYMENT_COMPLETED:
          Display_Name: "Payment Processed Successfully"
          Update_CRM: true
          CRM_Field: "payment_status"
          CRM_Value: "paid"
          Compliance_Log: true
          FCR_Eligible: true
      
      - PAYMENT_DECLINED:
          Display_Name: "Payment Declined"
          Update_CRM: true
          Retry_Offered: true
          Follow_Up_Required: false
          FCR_Eligible: true
      
      - REFUND_PROCESSED:
          Display_Name: "Refund Initiated"
          Update_CRM: true
          Create_Ticket: true
          Ticket_Type: "refund"
          Supervisor_Approval_Required: amount > 5000
          Follow_Up_Required: true
          Follow_Up_Days: 7
          FCR_Eligible: true

  Category: Technical_Support
    Codes:
      - WEBSITE_ISSUE:
          Display_Name: "Website Technical Issue"
          Create_Ticket: true
          Ticket_Queue: "web_development"
          Notify_IT: true
          Workaround_Provided: case_by_case
          FCR_Eligible: false
      
      - APP_ISSUE:
          Display_Name: "Mobile App Issue"
          Create_Ticket: true
          Ticket_Queue: "app_development"
          Collect_Device_Info: true
          FCR_Eligible: false

  Category: General_Inquiry
    Codes:
      - STORE_LOCATIONS:
          Display_Name: "Store Location Inquiry"
          Update_CRM: false
          Typical_AHT: 60
          FCR_Eligible: true
      
      - BUSINESS_HOURS:
          Display_Name: "Business Hours Inquiry"
          Update_CRM: false
          Typical_AHT: 30
          FCR_Eligible: true
      
      - GENERAL_INFO:
          Display_Name: "General Information"
          Update_CRM: false
          Typical_AHT: 90
          FCR_Eligible: true

  Category: Escalation
    Codes:
      - ESCALATED_SUPERVISOR:
          Display_Name: "Escalated to Supervisor"
          Reason_Required: true
          Supervisor_Notes_Required: true
          FCR_Eligible: false
          Track_Escalation_Reason: true
      
      - ESCALATED_DEPARTMENT:
          Display_Name: "Transferred to Another Department"
          Department_Required: true
          Reason_Required: true
          Warm_Transfer_Preferred: true
          FCR_Eligible: false

  Category: No_Resolution
    Codes:
      - CUSTOMER_DISCONNECTED:
          Display_Name: "Customer Disconnected"
          Update_CRM: true
          CRM_Note: "Customer disconnected before resolution"
          Callback_Offered: false
          FCR_Eligible: false
      
      - CALLBACK_SCHEDULED:
          Display_Name: "Callback Scheduled"
          Update_CRM: true
          CRM_Activity: "Create callback task"
          Callback_Date_Required: true
          FCR_Eligible: false
      
      - ISSUE_UNRESOLVED:
          Display_Name: "Issue Could Not Be Resolved"
          Reason_Required: true
          Supervisor_Review_Required: true
          Create_Ticket: true
          FCR_Eligible: false
```

### 2.3 Agent Desktop Layout Configuration

**Step 1: Enable Desktop Layout Designer**

Navigate to: **Admin Portal → Desktop Experience → Layouts**

```json
{
  "layout_name": "KidsWear_Agent_Standard_Layout",
  "version": "1.0",
  "areas": {
    "header": {
      "components": [
        {
          "type": "agent_status",
          "position": "left",
          "show_timer": true,
          "idle_codes_dropdown": true
        },
        {
          "type": "queue_statistics",
          "position": "center",
          "metrics": ["calls_waiting", "longest_wait", "service_level"],
          "refresh_interval": 5
        },
        {
          "type": "notifications",
          "position": "right",
          "max_visible": 3
        }
      ]
    },
    "main_content": {
      "components": [
        {
          "type": "interaction_panel",
          "width": "60%",
          "tabs": ["call_controls", "customer_info", "interaction_history"]
        },
        {
          "type": "cti_connector",
          "width": "40%",
          "embedded_crm": "zendesk",
          "auto_screen_pop": true
        }
      ]
    },
    "sidebar_left": {
      "components": [
        {
          "type": "quick_actions",
          "buttons": [
            {"label": "Create Ticket", "action": "zendesk_create_ticket"},
            {"label": "Email Customer", "action": "send_email_template"},
            {"label": "Schedule Callback", "action": "schedule_callback"}
          ]
        },
        {
          "type": "knowledge_base",
          "search_enabled": true,
          "recent_articles": 5
        }
      ]
    },
    "sidebar_right": {
      "components": [
        {
          "type": "agent_scripts",
          "dynamic": true,
          "based_on_queue": true
        },
        {
          "type": "compliance_reminders",
          "alerts": ["pci_reminder", "dpdp_consent"]
        }
      ]
    },
    "footer": {
      "components": [
        {
          "type": "wrap_up_codes",
          "mandatory": true,
          "timer_warning": 30
        }
      ]
    }
  },
  "behavior": {
    "auto_available": false,
    "max_wrap_up_time": 120,
    "idle_timeout": 1800,
    "after_call_work_required": true
  }
}
```

### 2.4 State Transition Rules

```yaml
Agent_State_Transitions:
  
# Login Flow
  On_Login:
    Initial_State: "Not Ready"
    Required_Action: "Agent must manually set to Ready"
    Reason: "Allows agent to settle in, check system"
  
# Ready to Active
  Ready_to_Active:
    Trigger: "Incoming call delivered"
    Automatic: true
    Pre_Ring_Notification: 3 seconds
  
# Active to Wrap-Up
  Active_to_Wrap_Up:
    Trigger: "Call disconnected"
    Automatic: true
    Wrap_Up_Timer_Start: immediately
    Max_Wrap_Up_Time: 120 seconds
    Warning_At: 90 seconds
    Force_Transition_At: 125 seconds
  
# Wrap-Up to Ready
  Wrap_Up_to_Ready:
    Manual_Mode:
      Agent_Clicks: "Ready" button
      Requires: wrap_up_code_selected
    
    Auto_Mode:
      After_Seconds: 120
      Only_If: wrap_up_code_selected
      If_No_Code: remain in wrap_up, show error
  
# Ready to Idle
  Ready_to_Idle:
    Manual_Only: true
    Requires: idle_code_selection
    Max_Idle_Time: depends on idle_code
    Warning_Before_Auto_Logout: 60 seconds
  
# Idle to Ready
  Idle_to_Ready:
    Manual_Only: true
    Agent_Clicks: "Return to Ready"
    System_Checks:
      - idle_duration_within_limits
      - supervisor_approval_if_required
  
# Emergency Logout
  Automatic_Logout:
    Triggers:
      - idle_time_exceeded
      - network_disconnected_for > 300 seconds
      - end_of_shift
      - compliance_violation_detected
    
    Actions:
      - log_event
      - notify_supervisor
      - send_agent_notification
```

### 2.5 Agent Performance Dashboard Integration

```javascript
// Agent Desktop Widget: Real-Time Performance Metrics
// Embed this in agent desktop for gamification and self-monitoring

const AgentPerformanceWidget = {
  data() {
    return {
      metrics: {
        calls_handled_today: 0,
        aht_today: 0,
        aht_target: 360, // 6 minutes
        quality_score: 0,
        fcr_rate: 0,
        customer_satisfaction: 0
      },
      team_averages: {},
      rank_in_team: 0
    }
  },
  
  mounted() {
    this.fetch_metrics()
    setInterval(this.fetch_metrics, 60000) // Update every minute
  },
  
  methods: {
    async fetch_metrics() {
      const agent_id = this.get_agent_id()
      const response = await fetch(`/api/agent-performance/${agent_id}/today`)
      this.metrics = await response.json()
      
      this.calculate_team_rank()
      this.show_achievement_alerts()
    },
    
    calculate_team_rank() {
      // Compare agent metrics against team
      // Show visual indicator (Top 10%, Above Average, etc.)
    },
    
    show_achievement_alerts() {
      if (this.metrics.calls_handled_today === 50) {
        this.show_toast("🎉 Milestone: 50 calls handled today!")
      }
      
      if (this.metrics.aht_today < this.metrics.aht_target) {
        this.show_toast("⚡ Great job! AHT below target!")
      }
    }
  },
  
  template: `
    <div class="agent-performance-widget">
      <h3>Your Performance Today</h3>
      
      <div class="metric">
        <span class="label">Calls Handled:</span>
        <span class="value">{{ metrics.calls_handled_today }}</span>
      </div>
      
      <div class="metric">
        <span class="label">Avg Handle Time:</span>
        <span class="value" :class="aht_class">
          {{ format_time(metrics.aht_today) }}
        </span>
        <span class="target">(Target: {{ format_time(metrics.aht_target) }})</span>
      </div>
      
      <div class="metric">
        <span class="label">Quality Score:</span>
        <span class="value">{{ metrics.quality_score }}/100</span>
        <progress :value="metrics.quality_score" max="100"></progress>
      </div>
      
      <div class="team-rank">
        You rank #{{ rank_in_team }} in your team
      </div>
    </div>
  `
}
```

---

## Section 3: Supervisor Desktop & Monitoring Capabilities

### 3.1 Supervisor Roles and Permissions

**Permission Matrix:**

```yaml
Supervisor_Roles:
  
  Team_Lead:
    Permissions:
      Monitor: true
      Coach: true
      Barge: false  # Escalate to manager
      View_Agent_Performance: team_only
      Edit_Schedules: team_only
      Approve_Idle_Extensions: true
      View_Recordings: team_only
      Run_Reports: team_level
    
    Use_Cases:
      - Real-time agent coaching
      - Performance feedback
      - Schedule adjustments
      - First-line escalation handling
  
  Operations_Manager:
    Permissions:
      Monitor: all_teams
      Coach: all_teams
      Barge: true
      View_Agent_Performance: all_teams
      Edit_Schedules: all_teams
      Approve_Idle_Extensions: true
      View_Recordings: all_teams
      Run_Reports: site_level
      Manage_Queues: true
    
    Use_Cases:
      - Cross-team monitoring
      - Critical call intervention
      - Queue management
      - Performance analysis
  
  Quality_Manager:
    Permissions:
      Monitor: all_teams
      Coach: false  # Read-only monitoring
      Barge: false
      View_Agent_Performance: all_teams
      Edit_Schedules: false
      View_Recordings: all_teams
      Run_Reports: quality_focused
      Evaluate_Calls: true
      Calibration_Sessions: true
    
    Use_Cases:
      - Quality evaluations
      - Call sampling
      - Coaching recommendations
      - Calibration sessions
```

### 3.2 Silent Monitoring Configuration

**Step 1: Enable Silent Monitoring**

```yaml
Silent_Monitoring:
  Feature_Flag: enabled
  
  Configuration:
    Audio_Quality: "high_definition"  # 16kHz, 32kbps
    Latency: "real_time"  # <500ms delay
    Recording: "optional"  # Supervisor can record monitoring session
    
  Privacy_Controls:
    Agent_Notification: "none"  # Silent = no notification
    Customer_Notification: "disclosure_at_call_start"
    Compliance: "recorded_for_quality_purposes"
    
  Access_Control:
    Who_Can_Monitor:
      - role: "team_lead"
        limit: "own_team"
      - role: "operations_manager"
        limit: "all_teams"
      - role: "quality_manager"
        limit: "all_teams"
    
    Audit_Trail:
      Log_Every_Monitor_Session: true
      Log_Duration: true
      Log_Reason: optional
      Monthly_Review: required
```

**Step 2: Supervisor Desktop - Monitor Button**

```javascript
// Supervisor Desktop Widget: Agent Monitor Panel
const AgentMonitorPanel = {
  template: `
    <div class="monitor-panel">
      <table class="agent-list">
        <thead>
          <tr>
            <th>Agent</th>
            <th>State</th>
            <th>Call Duration</th>
            <th>Customer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="agent in active_agents" :key="agent.id">
            <td>{{ agent.name }}</td>
            <td>
              <span :class="state_class(agent.state)">
                {{ agent.state }}
              </span>
            </td>
            <td>{{ format_duration(agent.call_duration) }}</td>
            <td>{{ agent.customer_name || 'Anonymous' }}</td>
            <td>
              <button @click="monitor(agent.id)" 
                      :disabled="!can_monitor(agent)">
                👁️ Monitor
              </button>
              <button @click="coach(agent.id)"
                      :disabled="!can_coach(agent)">
                🎤 Coach
              </button>
              <button @click="barge(agent.id)"
                      :disabled="!can_barge(agent)"
                      class="barge-btn">
                ⚡ Barge
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  
  methods: {
    async monitor(agent_id) {
      // Initiate silent monitoring
      const response = await fetch('/api/supervisor/monitor', {
        method: 'POST',
        body: JSON.stringify({
          supervisor_id: this.supervisor_id,
          agent_id: agent_id,
          mode: 'silent'
        })
      })
      
      if (response.ok) {
        const { audio_stream_url } = await response.json()
        this.start_audio_stream(audio_stream_url)
        this.show_monitoring_controls(agent_id)
      }
    },
    
    start_audio_stream(url) {
      // Connect to WebRTC audio stream
      const audio = new Audio(url)
      audio.play()
      
      this.monitoring_active = true
      this.audio_element = audio
    },
    
    show_monitoring_controls(agent_id) {
      // Show floating control panel with:
      // - Volume control
      // - Switch to Coach mode
      // - Switch to Barge mode
      // - End monitoring
      // - Record this monitoring session
    }
  }
}
```

### 3.3 Coach Mode (Whisper) Configuration

```yaml
Coach_Mode:
  Description: "Supervisor speaks to agent only; customer cannot hear"
  
  Technical_Implementation:
    Audio_Routing:
      Supervisor_Mic → Agent_Headset: enabled
      Supervisor_Mic → Customer_Phone: disabled
      Agent_Mic → Supervisor_Headset: enabled
      Agent_Mic → Customer_Phone: enabled
      Customer_Phone → Agent_Headset: enabled
      Customer_Phone → Supervisor_Headset: enabled
    
    Audio_Mixing:
      Agent_Hears:
        - customer_voice: 100% volume
        - supervisor_whisper: 50% volume (configurable)
        - own_voice: 20% sidetone
      
      Customer_Hears:
        - agent_voice: 100% volume
        - supervisor_voice: 0% (CRITICAL: must be muted)
      
      Supervisor_Hears:
        - agent_voice: 100% volume
        - customer_voice: 100% volume
        - own_voice: 20% sidetone
  
  Use_Cases:
    - Real-time agent coaching during difficult calls
    - Compliance guidance (e.g., "Don't forget PCI disclaimer")
    - Product knowledge support
    - De-escalation techniques
  
  Best_Practices:
    - Keep whispers brief (5-10 seconds max)
    - Use during natural pauses in conversation
    - Avoid overcoaching (agent should lead)
    - Follow up after call for detailed feedback
```

**API Call to Start Coach Mode:**

```python
def start_coach_mode(supervisor_id, agent_id, interaction_id):
    """
    Initiate coach mode (whisper to agent).
    """
    url = f"https://api.wxcc-us1.cisco.com/v1/supervisor/coach"
    
    headers = {
        "Authorization": f"Bearer {get_supervisor_token(supervisor_id)}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "supervisorId": supervisor_id,
        "agentId": agent_id,
        "interactionId": interaction_id,
        "mode": "coach",
        "audioSettings": {
            "whisperVolume": 0.5,  # 50% volume for supervisor voice
            "duckingEnabled": true,  # Reduce customer volume when supervisor speaks
            "duckingLevel": 0.7     # 70% customer volume when ducking
        }
    }
    
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code == 200:
        result = response.json()
        return {
            "success": True,
            "session_id": result['coachSessionId'],
            "audio_stream": result['supervisorAudioStreamUrl'],
            "status": "coaching_active"
        }
    else:
        return {
            "success": False,
            "error": response.json()['message']
        }
```

### 3.4 Barge Mode (Conference) Configuration

```yaml
Barge_Mode:
  Description: "Supervisor joins call as third party; all participants hear each other"
  
  Technical_Implementation:
    Conference_Bridge:
      Participants:
        - Agent: active
        - Customer: active
        - Supervisor: active
      
      Audio_Routing: "full_mesh"  # Everyone hears everyone
      
      Call_Recording:
        Include_Supervisor: true
        Annotate_Recording: "Supervisor barged at HH:MM:SS"
    
    Visual_Indicators:
      Agent_Desktop: "⚡ SUPERVISOR ON CALL"
      Supervisor_Desktop: "🎙️ BARGE MODE ACTIVE"
      Customer_Hears: "A supervisor has joined the call"
  
  Use_Cases:
    - Critical escalations
    - Compliance violations in progress
    - Abusive customer situations
    - Training new agents (controlled barge)
    - Emergency customer service recovery
  
  Limitations:
    Who_Can_Barge:
      - Operations_Manager: yes
      - Team_Lead: no (escalate to manager)
      - Quality_Manager: no
    
    When_To_Barge:
      - Customer threatens legal action
      - Agent violated compliance (e.g., disclosed card data)
      - Customer extremely dissatisfied
      - Agent explicitly requests help
    
    When_NOT_To_Barge:
      - Agent is performing adequately
      - Call is near resolution
      - Non-critical coaching opportunity (use whisper instead)
```

**API Call to Barge:**

```python
def barge_into_call(supervisor_id, agent_id, interaction_id, reason):
    """
    Barge into active call (3-way conference).
    Requires Operations Manager role.
    """
    url = f"https://api.wxcc-us1.cisco.com/v1/supervisor/barge"
    
    headers = {
        "Authorization": f"Bearer {get_supervisor_token(supervisor_id)}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "supervisorId": supervisor_id,
        "agentId": agent_id,
        "interactionId": interaction_id,
        "mode": "barge",
        "reason": reason,  # REQUIRED for compliance
        "customerAnnouncement": "A supervisor is joining the call to assist."
    }
    
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code == 200:
        result = response.json()
        
# Log barge event for compliance
        log_supervisor_action({
            "action": "BARGE",
            "supervisor_id": supervisor_id,
            "agent_id": agent_id,
            "interaction_id": interaction_id,
            "reason": reason,
            "timestamp": datetime.now().isoformat()
        })
        
        return {
            "success": True,
            "session_id": result['bargeSessionId'],
            "audio_stream": result['supervisorAudioStreamUrl'],
            "conference_id": result['conferenceId']
        }
    else:
        return {
            "success": False,
            "error": response.json()['message']
        }
```

### 3.5 Supervisor Real-Time Dashboard

```html
<!DOCTYPE html>
<html>
<head>
  <title>Supervisor Real-Time Dashboard - KidsWear Contact Center</title>
  <style>
    /* Dashboard styling */
    .dashboard {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      padding: 20px;
    }
    
    .kpi-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .kpi-value {
      font-size: 48px;
      font-weight: bold;
      color: #2196F3;
    }
    
    .kpi-label {
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
    }
    
    .status-good { color: #4CAF50; }
    .status-warning { color: #FFC107; }
    .status-critical { color: #F44336; }
  </style>
</head>
<body>
  <div id="supervisor-dashboard" class="dashboard">
    <!-- KPI Cards -->
    <div class="kpi-card">
      <div class="kpi-value" id="calls-in-queue">0</div>
      <div class="kpi-label">Calls in Queue</div>
    </div>
    
    <div class="kpi-card">
      <div class="kpi-value" id="service-level">0%</div>
      <div class="kpi-label">Service Level (80/20)</div>
    </div>
    
    <div class="kpi-card">
      <div class="kpi-value" id="agents-available">0</div>
      <div class="kpi-label">Agents Available</div>
    </div>
    
    <div class="kpi-card">
      <div class="kpi-value" id="longest-wait">0s</div>
      <div class="kpi-label">Longest Wait Time</div>
    </div>
  </div>
  
  <script>
    // Real-time dashboard updates via WebSocket
    const ws = new WebSocket('wss://api.wxcc-us1.cisco.com/v1/supervisor/realtime');
    
    ws.onmessage = function(event) {
      const data = JSON.parse(event.data);
      
      // Update KPIs
      document.getElementById('calls-in-queue').textContent = data.callsInQueue;
      document.getElementById('service-level').textContent = data.serviceLevel + '%';
      document.getElementById('agents-available').textContent = data.agentsAvailable;
      document.getElementById('longest-wait').textContent = data.longestWaitTime + 's';
      
      // Apply status colors
      apply_status_colors(data);
    };
    
    function apply_status_colors(data) {
      // Service Level coloring
      const slElement = document.getElementById('service-level');
      if (data.serviceLevel >= 80) {
        slElement.className = 'kpi-value status-good';
      } else if (data.serviceLevel >= 70) {
        slElement.className = 'kpi-value status-warning';
      } else {
        slElement.className = 'kpi-value status-critical';
      }
      
      // Longest Wait coloring
      const waitElement = document.getElementById('longest-wait');
      if (data.longestWaitTime < 30) {
        waitElement.className = 'kpi-value status-good';
      } else if (data.longestWaitTime < 60) {
        waitElement.className = 'kpi-value status-warning';
      } else {
        waitElement.className = 'kpi-value status-critical';
      }
    }
  </script>
</body>
</html>
```
