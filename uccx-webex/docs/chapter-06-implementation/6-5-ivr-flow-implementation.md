# Chapter 6: Webex Contact Center Implementation -- 6.5 IVR Flow Implementation

## 6.5 IVR Flow Implementation

## 6.5.1 Flow Migration Overview

```
+-----------------------------------------------------------------------------+
|              UCCX -> FLOW DESIGNER MIGRATION                                 |
+-----------------------------------------------------------------------------+
|                                                                             |
|  [!]️ CRITICAL: NO automated migration tool exists.                          |
|     All flows must be MANUALLY RECREATED in Flow Designer.                 |
|     This is a RE-BUILD, not a CONVERSION.                                  |
|                                                                             |
|  UCCX SCRIPT          | WXCC FLOW                   | COMPLEXITY | STATUS  |
|  ---------------------+-----------------------------+------------+---------|
|  MainMenu_EN.aef      | India_MainMenu_Flow_v1      | MEDIUM     | Build   |
|  MainMenu_HI.aef      | (merged with EN flow)       | MEDIUM     | Build   |
|  SalesQueue.aef       | Sales_QueueTreatment_v1     | LOW        | Build   |
|  SupportQueue.aef     | Support_QueueTreatment_v1   | MEDIUM     | Build   |
|  BillingQueue.aef     | Billing_QueueTreatment_v1   | MEDIUM     | Build   |
|  TechSupport.aef      | TechSupport_Flow_v1         | MEDIUM     | Build   |
|  AfterHours.aef       | AfterHours_Subflow_v1       | LOW        | Build   |
|  Callback.aef         | Callback_Flow_v1            | HIGH       | Build   |
|  Survey.aef           | Survey_PostCall_v1          | MEDIUM     | Build   |
|  ---------------------+-----------------------------+------------+---------|
|                                                                             |
|  TOTAL: 9 UCCX Scripts -> 9 WxCC Flows                                     |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 6.5.2 India Main Menu Flow - Detailed Node Structure

Per Chapter 3.6.3:

```
+-----------------------------------------------------------------------------+
|              INDIA_MAINMENU_FLOW_V1 - NODE-BY-NODE DESIGN                   |
+-----------------------------------------------------------------------------+
|                                                                             |
|  NODE | TYPE              | CONFIGURATION                      | OUTPUT    |
|  ========================================================================= |
|                                                                             |
|  1    | Start             | Entry Point trigger                | -> Node 2  |
|       |                   | Auto-accepts call                  |           |
|  -----+-------------------+------------------------------------+-----------|
|  2    | Set Variable      | Initialize variables:              | -> Node 3  |
|       |                   | consent_status = "pending"         |           |
|       |                   | selected_language = "en"           |           |
|       |                   | callback_requested = false         |           |
|  -----+-------------------+------------------------------------+-----------|
|  3    | HTTP Request      | Business Hours Check               | -> Node 4  |
|       |                   | URL: {{API}}/business-hours        |   or 3A   |
|       |                   | Parse: business_hours = response   |           |
|  -----+-------------------+------------------------------------+-----------|
|  3A   | GoTo              | IF business_hours = FALSE          | -> After   |
|       |                   | GoTo: AfterHours_Subflow           |   Hours   |
|  -----+-------------------+------------------------------------+-----------|
|  4    | Play Message      | Welcome + Recording Consent        | -> Node 5  |
|       |                   | "Welcome to Abhavtech. This call   |           |
|       |                   | may be recorded for quality.       |           |
|       |                   | Press 1 for English.               |           |
|       |                   | Hindi ke liye 2 dabaiye."          |           |
|       |                   | Audio: welcome_bilingual.wav       |           |
|  -----+-------------------+------------------------------------+-----------|
|  5    | Collect Digits    | Language Selection                 | -> Node 6  |
|       |                   | Variable: language_choice          |   or 6A   |
|       |                   | Min: 1, Max: 1, Timeout: 5s        |           |
|       |                   | No Input: Default to "1" (English) |           |
|  -----+-------------------+------------------------------------+-----------|
|  6    | Condition         | IF language_choice = "1"           | -> Node 7  |
|       |                   |   THEN: Set language = "en"        |           |
|  6A   | Condition         | IF language_choice = "2"           | -> Node 7  |
|       |                   |   THEN: Set language = "hi"        |           |
|  -----+-------------------+------------------------------------+-----------|
|  7    | Virtual Agent V2  | AI Intent Detection (Optional)     | -> Node 8  |
|       |                   | Agent: Abhi_VA                     |   or 8A   |
|       |                   | Timeout: 5s                        |           |
|       |                   | ON Handled: -> End (contained)      |           |
|       |                   | ON Escalate: -> Node 8              |           |
|       |                   | ON No Intent: -> Node 8             |           |
|  -----+-------------------+------------------------------------+-----------|
|  8    | Play Message      | Main Menu (language-specific)      | -> Node 9  |
|       |                   | IF language = "en":                |           |
|       |                   |   "Press 1 for Sales.              |           |
|       |                   |    Press 2 for Support.            |           |
|       |                   |    Press 3 for Billing.            |           |
|       |                   |    Press 4 for Technical Support.  |           |
|       |                   |    Press 0 to speak with agent."   |           |
|       |                   | Audio: main_menu_en.wav            |           |
|       |                   | IF language = "hi":                |           |
|       |                   | Audio: main_menu_hi.wav            |           |
|  -----+-------------------+------------------------------------+-----------|
|  9    | Menu              | Main Selection                     | -> Per     |
|       |                   | Variable: menu_selection           |   option  |
|       |                   | Options: 1, 2, 3, 4, 0             |           |
|       |                   | Invalid: Replay (max 3x)           |           |
|       |                   | 1 -> Sales Queue (Node 10)          |           |
|       |                   | 2 -> Support Queue (Node 11)        |           |
|       |                   | 3 -> Billing Queue (Node 12)        |           |
|       |                   | 4 -> TechSupport Queue (Node 13)    |           |
|       |                   | 0 -> General Queue (Node 14)        |           |
|  -----+-------------------+------------------------------------+-----------|
|  10   | Set Variable      | Set skill requirements:            | -> Node 15 |
|       |                   | skill_sales = TRUE                 |           |
|       |                   | queue_name = "Sales_India_Queue"   |           |
|  -----+-------------------+------------------------------------+-----------|
|  11   | Set Variable      | skill_support = TRUE               | -> Node 15 |
|       |                   | queue_name = "Support_India_Queue" |           |
|  -----+-------------------+------------------------------------+-----------|
|  12   | Set Variable      | skill_billing = TRUE               | -> Node 15 |
|       |                   | queue_name = "Billing_Queue"       |           |
|  -----+-------------------+------------------------------------+-----------|
|  13   | Set Variable      | skill_techsupport = TRUE           | -> Node 15 |
|       |                   | queue_name = "TechSupport_Queue"   |           |
|  -----+-------------------+------------------------------------+-----------|
|  14   | Set Variable      | Direct to agent                    | -> Node 15 |
|       |                   | queue_name = "Support_India_Queue" |           |
|  -----+-------------------+------------------------------------+-----------|
|  15   | Queue Contact     | Route to selected queue            | -> Agent   |
|       |                   | Queue: {{queue_name}}              |   or      |
|       |                   | Skills: Per variables set          |   Node 16 |
|       |                   | ON No Agent: -> Node 16             |           |
|  -----+-------------------+------------------------------------+-----------|
|  16   | Play Message      | Callback Offer                     | -> Node 17 |
|       |                   | "All agents busy. Press 1 for      |           |
|       |                   | callback, 2 to continue waiting."  |           |
|  -----+-------------------+------------------------------------+-----------|
|  17   | Menu              | Callback Selection                 |           |
|       |                   | 1 -> Callback_Flow (Subflow)        |           |
|       |                   | 2 -> Return to Queue (Node 15)      |           |
|  -----+-------------------+------------------------------------+-----------|
|  18   | Disconnect        | End Call                           | END       |
|       |                   | Play: goodbye.wav                  |           |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 6.5.3 Flow Creation Procedure

**Navigation:** Control Hub -> Contact Center -> Flows

**Step 1: Create New Flow**

1. Click **"Create Flow"**
2. Select Type: **Inbound Voice Flow**
3. Name: **India_MainMenu_Flow_v1**
4. Description: **Primary India IVR - English/Hindi main menu**

**Step 2: Build Flow Canvas**

1. Drag **"Start"** node (auto-placed)
2. Add nodes per design (Section 6.5.2)
3. Connect nodes with edges
4. Configure each node properties

**Step 3: Configure Virtual Agent Node (Node 7)**

```
+-----------------------------------------------------------------------------+
|  VIRTUAL AGENT V2 NODE CONFIGURATION                                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  FIELD                      | VALUE                                        |
|  ---------------------------+--------------------------------------------|
|  Virtual Agent              | Abhi (select from dropdown)                  |
|  Input Audio                | {{NewPhoneContact.MediaResourceId}}          |
|  Language                   | {{selected_language}}                        |
|  Welcome Event              | WELCOME                                      |
|  Timeout Per Turn           | 30 seconds                                   |
|  Max No Input               | 3                                            |
|  ---------------------------+--------------------------------------------|
|                                                                             |
|  OUTPUT VARIABLE MAPPING:                                                  |
|  VirtualAgent.TranscriptSummary -> {{va_summary}}                          |
|  VirtualAgent.LastIntent -> {{va_intent}}                                  |
|  VirtualAgent.EscalationReason -> {{va_reason}}                            |
|                                                                             |
+-----------------------------------------------------------------------------+
```

**Step 4: Validate Flow**

1. Click **"Validate"** button
2. Review all errors/warnings
3. Fix any issues

**Step 5: Publish Flow**

1. Click **"Publish"**
2. Add version note: "Initial release"
3. Confirm publication

## 6.5.4 Audio Prompt Migration

### 6.5.4.1 Prompt Inventory (Per Chapter 3.1.4)

```
+-----------------------------------------------------------------------------+
|              AUDIO PROMPT INVENTORY - 87 FILES                              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  ENGLISH PROMPTS (62 files):                                               |
|  ===========================                                               |
|  Category             | Count | Examples                                   |
|  ---------------------+-------+--------------------------------------------|
|  Welcome/Greeting     |     5 | welcome_main.wav, welcome_support.wav      |
|  Main Menu            |     8 | menu_options.wav, press_1_sales.wav        |
|  Queue Messages       |    12 | queue_position.wav, hold_music.wav         |
|  Error Messages       |     6 | invalid_option.wav, timeout.wav            |
|  Transfer Messages    |     4 | transfer_agent.wav, please_hold.wav        |
|  After Hours          |     3 | after_hours.wav, leave_message.wav         |
|  Holiday              |     8 | holiday_general.wav, diwali.wav            |
|  Survey               |     5 | survey_intro.wav, rate_experience.wav      |
|  Callback             |     4 | callback_offer.wav, callback_confirm.wav   |
|  System               |     7 | goodbye.wav, thankyou.wav                  |
|                                                                             |
|  HINDI PROMPTS (25 files):                                                 |
|  =========================                                                 |
|  Category             | Count | Examples                                   |
|  ---------------------+-------+--------------------------------------------|
|  Welcome/Greeting     |     3 | swagat_main.wav                            |
|  Main Menu            |     8 | menu_hindi.wav, ek_dabaye.wav              |
|  Queue Messages       |     5 | pratiksha.wav, dhanyawad.wav               |
|  Error Messages       |     3 | galat_chunav.wav                           |
|  After Hours          |     2 | office_band.wav                            |
|  System               |     4 | namaste.wav, alvida.wav                    |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 6.5.4.2 Audio Format Conversion

**WxCC Audio Requirements:**

| Parameter | Specification |
|-----------|--------------|
| Format | WAV (RIFF) |
| Sample Rate | 8000 Hz |
| Bit Depth | 16-bit |
| Channels | Mono |
| Max File Size | 10 MB |
| Max Duration | 5 minutes |

**Conversion Command (FFmpeg):**

```bash
# Single file conversion
ffmpeg -i input.wav -ar 8000 -ac 1 -acodec pcm_s16le output.wav

# Bulk conversion script
for file in *.wav; do
  ffmpeg -i "$file" -ar 8000 -ac 1 -acodec pcm_s16le "converted/${file}"
done
```

### 6.5.4.3 Audio Upload Procedure

**Navigation:** Control Hub -> Contact Center -> Resources -> Audio Files

1. Click **"Upload Audio"**
2. Select converted file
3. Enter Name (e.g., `welcome_main_en`)
4. Select Language: **English** or **Hindi**
5. Click **"Upload"**

**REPEAT for all 87 audio files.**

---
