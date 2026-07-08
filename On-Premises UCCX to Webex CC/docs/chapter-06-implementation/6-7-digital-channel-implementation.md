# Chapter 6: Webex Contact Center Implementation -- 6.7 Digital Channel Implementation

## 6.7 Digital Channel Implementation

## 6.7.1 Web Chat Widget Configuration (Per Chapter 3.8.2)

**Navigation:** Control Hub -> Contact Center -> Channels -> Chat

### Step 1: Create Chat Asset

1. Click **"Create Chat Asset"**
2. Configure:

| Field | Value |
|-------|-------|
| Name | Abhavtech_WebChat_Widget |
| Description | Customer support chat widget |
| Entry Point | Global_Chat_EP |

### Step 2: Widget Branding

| Setting | Value |
|---------|-------|
| Primary Color | #1F4E79 (Abhavtech blue) |
| Logo | Upload abhavtech_logo.png |
| Widget Title | Chat with Abhavtech |
| Subtitle | We're here to help |

### Step 3: Pre-Chat Form

| Field | Required | Type |
|-------|----------|------|
| Name | Yes | Text |
| Email | Yes | Email |
| Query Type | Yes | Dropdown (Sales/Support/Billing/Other) |

### Step 4: Generate Embed Code

```html
<!-- Abhavtech Chat Widget -->
<script>
  !function(e,t){
    var n=document.createElement("script");
    n.type="text/javascript",
    n.async=!0,
    n.src="https://wxcc-connect.webex.com/bundle/abhavtech_widget.js",
    (document.getElementsByTagName("head")[0]||
    document.getElementsByTagName("body")[0]).appendChild(n)
  }(window,document);
</script>
```

### Step 5: Deploy to Website

1. Provide embed code to web development team
2. Deploy to: www.abhavtech.com/support
3. Test widget functionality

## 6.7.2 WhatsApp Business Configuration

**Prerequisites:**
- WhatsApp Business Account (verified)
- Meta Business Suite access
- Approved message templates

**Navigation:** Control Hub -> Contact Center -> Channels -> Social Messaging

### Step 1: Connect WhatsApp Business

1. Click **"Add Channel"** -> **"WhatsApp"**
2. Authenticate with Meta Business Suite
3. Select WhatsApp Business number: +91-XXXXXXXXXX
4. Accept WhatsApp Business terms

### Step 2: Configure Channel

| Setting | Value |
|---------|-------|
| Entry Point | Global_Chat_EP |
| Queue | Digital_Chat_Queue |
| Auto-Response | Enabled (outside business hours) |
| Response Time SLA | 15 seconds |

## 6.7.3 Email Channel Configuration

**Navigation:** Control Hub -> Contact Center -> Channels -> Email

### Step 1: Connect Mailbox

1. Click **"Add Email Channel"**
2. Email Address: **support@abhavtech.com**
3. Mailbox Type: **Microsoft 365** (OAuth)
4. Authenticate with Microsoft 365

### Step 2: Configure Settings

| Setting | Value |
|---------|-------|
| Polling Interval | 30 seconds |
| Entry Point | Global_Email_EP |
| Default Queue | Digital_Email_Queue |
| Auto-Acknowledgment | Enabled |
| Service Level | 4 hours |

---
