# 3.6 Flow Designer -- IVR Migration

## 3.6.1 Flow Migration Strategy

```
   UCCX TO FLOW DESIGNER - MIGRATION STRATEGY
   CRITICAL UNDERSTANDING:
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   There is NO automated migration tool from UCCX scripts to Flow Designer.
   All flows must be MANUALLY RECREATED in Flow Designer.
   This is a RE-BUILD, not a CONVERSION.
   MIGRATION APPROACH:
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   PHASE 1: DOCUMENT
   1. Export all UCCX scripts (.aef files)
   2. Document each script's business logic as flowcharts
   3. Identify all dependencies (DB, external systems)
   4. Catalog all prompts and audio files
   5. Map UCCX variables to WxCC flow variables
   PHASE 2: DESIGN
   1. Design equivalent flows in Flow Designer
   2. Identify WxCC-native alternatives for UCCX features
   3. Plan API integrations for database operations
   4. Design Virtual Agent integration points
   PHASE 3: BUILD
   1. Create flows in Flow Designer (dev environment)
   2. Upload and configure audio prompts
   3. Configure HTTP Request nodes for integrations
   4. Integrate with Dialogflow CX for AI capabilities
   PHASE 4: TEST
   1. Unit test each flow independently
   2. Integration test with backend systems
   3. User acceptance testing (UAT)
   4. Parallel operation with UCCX
   PHASE 5: CUTOVER
   1. Publish flows to production
   2. Update Entry Point routing
   3. Monitor and validate
   4. Decommission UCCX scripts
```

## 3.6.2 UCCX Step to Flow Designer Activity Mapping

```
   UCCX STEP   FLOW DESIGNER ACTIVITY - COMPLETE MAPPING
   UCCX STEP   FLOW DESIGNER ACTIVITY   MIGRATION NOTES
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   CALL HANDLING

   Accept   NewPhoneContact (implicit)   Auto on entry
   Terminate   Disconnect Contact   Direct equivalent
   Call Redirect   Blind Transfer   Transfer to DN
   Consult Transfer   Consult Transfer (Agent)   Agent-initiated
   MEDIA OPERATIONS

   Play Prompt   Play Message   Upload audio to
   Audio Files library
   Get Digit String   Collect Digits   Similar config
   Menu   Menu   DTMF menu
   Record   Record   Built-in activity
   Play Prompt (TTS)   Play Message (TTS)   Text-to-Speech
   ROUTING

   Select Resource   Queue Contact   Queue-based routing
   (CSQ selection)
   Get Contact Info   Built-in Variables   ANI, DNIS, etc.
   Get Call Contact Info   Contact Info Variables   Session data
   VARIABLES

   Set Enterprise Info   Set Variable   Flow variables
   Set Session Info   Set Variable   Global variables
   Get/Set variable   Set Variable   Local/global
   LOGIC & FLOW CONTROL

   If   Condition   Same logic
   Switch   Case / Multiple Conditions   Branch logic
   Goto   Connect nodes   Visual connection
   Label   Node naming   Not needed
   On Exception Goto   Error Handling   Global error path
   Delay   Wait   Timed delay
   DATABASE OPERATIONS

   DB Read   HTTP Request   REST API call
   DB Write   HTTP Request   REST API call
   DB Get   HTTP Request   API middleware
   (JDBC/ODBC)   (JSON/REST)   required
   NOT SUPPORTED / ALTERNATIVES
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   UCCX FEATURE   WXCC ALTERNATIVE

   Finesse Gadget   WxCC Agent Desktop widgets
   JTAPI Controls   Not applicable (cloud)
   Custom Java Steps   HTTP Request to external service
   Outbound Preview Dialer   WxCC Campaign Manager
   Send Email (script)   HTTP Request to email API (SendGrid, etc.)
   CTI Port monitoring   WxCC Real-time reporting APIs
```

## 3.6.3 Flow Design: India Main Menu (Detailed)

This section provides the complete Flow Designer configuration for the primary India IVR, migrated from UCCX MainMenu_EN.aef and MainMenu_HI.aef scripts.

```
   FLOW: India_MainMenu_Flow_v1
   FLOW METADATA:
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Flow Name:   India_MainMenu_Flow_v1
   Description:   Primary India IVR - Sales, Support, Billing, Tech
   Entry Point:   India_Main_Voice_EP
   Languages:   English (en-IN), Hindi (hi-IN)
   Source Scripts:   MainMenu_EN.aef, MainMenu_HI.aef (UCCX)
   Version:   1.0
   Author:   Abhavtech CC Migration Team
   FLOW VARIABLES:
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   selected_language   String   "en" or "hi"   Language choice
   menu_selection   String   "1","2","3","4"   Main menu choice
   customer_id   String   Customer ID   From ANI lookup
   customer_tier   String   "standard","vip"   CRM lookup
   consent_status   String   "pending","yes","no"   Recording consent
   transfer_target   String   Queue name   Routing decision
   detected_intent   String   AI detected intent   From Dialogflow
   sentiment_score   Number   -1 to 1   Sentiment value
   business_hours   Boolean   true/false   Hours check
   callback_requested   Boolean   true/false   Callback flag
```

### Flow Diagram: India Main Menu

```
   INDIA_MAINMENU_FLOW_V1 - VISUAL FLOW DIAGRAM
   START
   
   1. NewPhoneContact
   (Automatic - Call arrives)
   
   2. Set Variable: Initialize
   consent_status = "pending"
   selected_language = "en"
   callback_requested = false
   
   3. HTTP Request: Business Hours Check
   URL: {{ABHAVTECH_API}}/business-hours
   Method: GET
   Parse: business_hours = response.open
      
   [business_hours   [business_hours
   = TRUE]   = FALSE]
   
   GOTO: AfterHours_Subflow
   (Closed message, callback, voicemail)
   
   4. Play Message: Welcome
   "Welcome to Abhavtech. This call
   may be recorded for quality.
   Press 1 to continue in English.
   Hindi ke liye 2 dabaiye."
   Audio: welcome_bilingual.wav
   
   5. Collect Digits: Language Selection
   Variable: language_choice
   Min Digits: 1
   Max Digits: 1
   Timeout: 5 seconds
   No Input: Default to English (1)
      
   [1 pressed]   [2 pressed]
      
   Set Variable:   Set Variable:
   language="en"   language="hi"
   
   6. Condition: Check Language
   IF language = "en"
   THEN: English prompts
   ELSE: Hindi prompts
   
   7. Virtual Agent: Intent Detection <-> AI INTEGRATION
   (Optional - can be DTMF-only)
   Dialogflow CX Agent: Abhi_VA
   Timeout: 5 seconds
   Fallback: DTMF Menu
      
   [Intent Detected]  [No Intent / DTMF]
   
   8. Play Message: Main Menu
   [English Version]
   "Press 1 for Sales.
   Press 2 for Support.
   Press 3 for Billing.
   Press 4 for Technical Support.
   Press 0 to speak with an agent."
   Audio: main_menu_en.wav
   
   9. Menu: Main Selection
   Variable: menu_selection
   Options: 1, 2, 3, 4, 0
   Invalid: Replay menu (max 3x)
   
   10. Condition: Route by Selection
   SWITCH (menu_selection OR intent)
   CASE "1" / "sales":
   Queue: Sales_India_Queue
   CASE "2" / "support":
   GOTO: Support_Submenu
   CASE "3" / "billing":
   Queue: Billing_Queue
   CASE "4" / "tech_support":
   GOTO: TechSupport_Submenu
   CASE "0" / "agent":
   Queue: Support_India_Queue (direct)
   DEFAULT:
   Replay menu / Transfer to agent

         
   [Sales]   [Support_SM]   [Queue]
         
   11. Queue Contact
   Queue: {{transfer_target}}
   Priority: {{customer_tier=="vip"
   ? "high" : "normal"}}
   Skills: Per queue configuration
   
   12. Play Music: Hold
   Music: abhavtech_hold.wav
   Comfort: Every 60 seconds
   EWT Announcement: Yes
   
   END FLOW (Agent Answers or Overflow)
```

## 3.6.4 Prompt Migration Specifications

```
   ABHAVTECH PROMPT MIGRATION - AUDIO FILE SPECIFICATIONS
   AUDIO FORMAT REQUIREMENTS:
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   UCCX FORMAT   WXCC FORMAT   ACTION

   .wav (G.711  1/4-law, 8kHz)   .wav (PCM, 8kHz,   Convert codec
   16-bit, mono)
   .wav (G.711 A-law, 8kHz)   .wav (PCM, 8kHz,   Convert codec
   16-bit, mono)
   .au files   .wav   Convert format

   CONVERSION COMMANDS (FFmpeg):
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   # Single file conversion
   ffmpeg -i input.wav -acodec pcm_s16le -ar 8000 -ac 1 output.wav
   # Batch conversion (Linux/Mac)
   for f in *.wav; do
   ffmpeg -i "$f" -acodec pcm_s16le -ar 8000 -ac 1 "converted_$f"
   done
   PROMPT INVENTORY:
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   CATEGORY   COUNT   LANGUAGE   UCCX FILE   WXCC FILE
   
   Welcome   2   EN, HI   welcome_en.wav   welcome_en.wav
   welcome_hi.wav   welcome_hi.wav
   Main Menu   2   EN, HI   mainmenu_en.wav   mainmenu_en.wav
   Sales Menu   2   EN, HI   sales_menu_*.wav   sales_menu_*.wav
   Support Menu   2   EN, HI   support_menu_*.*   support_menu_*.*
   Billing Menu   2   EN, HI   billing_menu_*.*   billing_menu_*.*
   Tech Support   2   EN, HI   tech_menu_*.wav   tech_menu_*.wav
   Queue Messages   12   EN, HI   queue_*.wav   queue_*.wav
   Hold Music   4   N/A   hold_*.wav   hold_*.wav
   After Hours   4   EN, HI   afterhours_*.wav   afterhours_*.wav
   Error Messages   6   EN, HI   error_*.wav   error_*.wav
   Callback   4   EN, HI   callback_*.wav   callback_*.wav
   Survey   6   EN, HI   survey_*.wav   survey_*.wav
   
   TOTAL   48
   + System   39   (platform)
   GRAND TOTAL   87
   UPLOAD PROCEDURE:
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   1. Navigate: Control Hub > Contact Center > Resources > Audio Files
   2. Click: "Upload Audio Files"
   3. Select converted .wav files (bulk upload supported)
   4. Organize in folders: /prompts/en/, /prompts/hi/, /music/
   5. Reference in Flow Designer by path
```

---

