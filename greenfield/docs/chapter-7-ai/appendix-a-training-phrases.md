# Appendix A: Dialogflow CX Training Phrase Examples

**Project:** KidsWear India - Cisco Webex Contact Center Deployment  
**Document Type:** Technical Appendix - AI/CCAI Implementation  
**Version:** 1.0  
**Date:** March 2026  
**Related Chapter:** Chapter 7: AI/CCAI & Advanced Features

---

## Purpose

This appendix provides comprehensive training phrase examples for all 30+ intents in the KidsWear India Dialogflow CX virtual agent. These training phrases are specifically designed for the Indian retail market, including Hinglish variations and culturally appropriate expressions.

---

## 1. Greeting & Navigation Intents

### Intent: `greeting.hello`

**Purpose:** Welcome customers and establish rapport

**Training Phrases (20):**

```
# English
- Hello
- Hi
- Good morning
- Good afternoon
- Good evening
- Hey there
- Greetings

# Hinglish (Hindi + English)
- Namaste
- Hello, kaise hain aap?
- Hi, how are you?
- Namaste, main help chahiye
- Hello, mujhe kuch puchna hai

# Regional variations
- Vanakkam (Tamil)
- Namaskar (Marathi)
- Sat Sri Akal (Punjabi)
- Nomoskar (Bengali)

# Casual/informal
- Hey
- Hii
- Hlo
```

**Response Template:**
```
Hello! Welcome to KidsWear India. I'm here to help you with:
• Order tracking and status
• Product information and availability
• Returns and exchanges
• Account management

How can I assist you today?
```

**Follow-up Intents:** `order.status`, `product.inquiry`, `return.request`, `agent.handoff`

---

### Intent: `greeting.goodbye`

**Purpose:** Polite conversation closure

**Training Phrases (15):**

```
# English
- Goodbye
- Bye
- Thank you, bye
- Thanks for your help
- That's all I needed
- I'm done
- Exit
- End chat

# Hinglish
- Bye, dhanyavaad
- Thank you, bye bye
- Bas itna hi chahiye tha
- Shukriya, ab main jaata/jaati hoon

# Casual
- Byee
- Tata
- Cya
```

**Response Template:**
```
Thank you for contacting KidsWear India! We hope we've been helpful today.

• Your order number: {ORDER_NUMBER} (if applicable)
• Support ticket: {TICKET_ID} (if created)
• Rate this conversation: [1-5 stars]

Have a wonderful day! 👶👧👦
```

---

### Intent: `greeting.help`

**Purpose:** Show available options when customer is unsure

**Training Phrases (18):**

```
# Direct help requests
- Help
- Help me
- I need help
- Can you help
- What can you do
- What can I ask
- Show options
- Main menu

# Hinglish
- Mujhe help chahiye
- Aap kya kar sakte ho
- Options dikhao
- Menu

# Confused/frustrated
- I don't know what to do
- I'm stuck
- Where do I start
- This is confusing
- Nothing is working
```

**Response Template:**
```
I can help you with:

🛍️ Orders
• Track my order
• Modify or cancel order
• Order status

👕 Products
• Size guide
• Product availability
• Price information
• Product recommendations

🔄 Returns & Exchanges
• Return policy
• Initiate return
• Exchange for different size/color

👤 Account
• Update address
• Reset password
• Loyalty points

💳 Payments
• Payment methods
• Refund status
• Apply coupon code

📞 Talk to Agent
• Speak with customer service

What would you like help with?
```

---

## 2. Order Management Intents

### Intent: `order.status`

**Purpose:** Check order delivery status and tracking

**Training Phrases (30):**

```
# Direct queries
- Where is my order
- Track my order
- Order status
- Check order status
- What is my order status
- Is my order shipped
- Has my order shipped
- When will my order arrive
- Delivery status
- Package location

# With order number
- Order 12345 status
- Track order 12345
- Where is order number 12345
- Status of ORD-12345
- Check ORD-12345

# Hinglish
- Mera order kahan hai
- Order ka status kya hai
- Delivery kab hogi
- Package kahan pohoncha
- Mera saman kab aayega

# Time-based concerns
- I ordered last week, where is it
- It's been 5 days, still waiting
- Order hasn't arrived yet
- When will I get my delivery
- Expected delivery date

# Frustrated
- My order is late
- Why is my order delayed
- This is taking too long
- I want to know where my order is
```

**Required Entities:**
- `@order_number` (system entity: `@sys.any`)
- `@customer_email` (optional, for lookup)
- `@customer_phone` (optional, for lookup)

**Response Template:**
```
Let me check your order status for you.

Order Number: {ORDER_NUMBER}
Status: {ORDER_STATUS}
Current Location: {LOCATION}
Expected Delivery: {DELIVERY_DATE}
Tracking Link: {TRACKING_URL}

{If delayed}
We apologize for the delay. Your order is currently:
• {DELAY_REASON}
• Revised delivery: {NEW_DELIVERY_DATE}
• Compensation: {COMPENSATION_OFFER} (if applicable)

Would you like me to:
1. Send tracking details via SMS/email
2. Connect you with our delivery team
3. Process a cancellation
```

**Webhook Integration:**
```python
# API Endpoint: POST /api/orders/track
# Request Body:
{
  "order_number": "ORD-12345",
  "email": "customer@example.com" # optional
}

# Response:
{
  "order_id": "ORD-12345",
  "status": "in_transit",
  "current_location": "Mumbai Distribution Center",
  "estimated_delivery": "2025-11-25",
  "tracking_url": "https://track.kidswear.com/ORD-12345",
  "carrier": "BlueDart",
  "awb_number": "BD123456789"
}
```

---

### Intent: `order.modify`

**Purpose:** Change order details before shipment

**Training Phrases (25):**

```
# Change requests
- Change my order
- Modify order
- Update my order
- I want to change something
- Can I modify my order

# Specific changes
- Change delivery address
- Update address
- Change phone number
- Modify shipping address
- Update contact details

# Add/remove items
- Add item to order
- Remove item from order
- Can I add more items
- Delete one product from order

# Hinglish
- Order mein change karna hai
- Address change karo
- Ek item add karna hai
- Kuch modify karna hai

# Urgent/worried
- I entered wrong address
- Wrong phone number
- Need to change address urgently
- Mistake in order
- Ordered by accident
```

**Required Entities:**
- `@order_number`
- `@modification_type` (address, phone, items, quantity)
- `@new_value` (depends on modification type)

**Response Template:**
```
I can help you modify order {ORDER_NUMBER}.

Current Order Details:
• Status: {ORDER_STATUS}
• Items: {ITEM_LIST}
• Delivery Address: {ADDRESS}

⚠️ Modification Eligibility:
{IF status = "pending" or "confirmed"}
✅ You can modify: Address, phone number, items
🕐 Modification deadline: {DEADLINE_TIME}

{IF status = "shipped"}
❌ Order already shipped. You can:
• Refuse delivery (full refund)
• Contact delivery partner for address change
• Process return after delivery

What would you like to modify?
1. Delivery address
2. Contact phone number
3. Add/remove items
4. Cancel entire order
```

---

### Intent: `order.cancel`

**Purpose:** Cancel pending order

**Training Phrases (20):**

```
# Direct cancellation
- Cancel my order
- I want to cancel
- Cancel order 12345
- Stop my order
- Don't send my order

# Hinglish
- Order cancel karo
- Main order cancel karna chahta/chahti hoon
- Mera order cancel ho sakta hai
- Order raddh karo

# Reasons (optional context)
- Ordered by mistake
- Don't need it anymore
- Found better price elsewhere
- Delivery taking too long
- Wrong items ordered

# Urgent
- Cancel immediately
- Urgent cancellation
- Need to cancel now
- Stop the order right now
```

**Required Entities:**
- `@order_number`
- `@cancellation_reason` (optional, for analytics)

**Response Template:**
```
I'll help you cancel order {ORDER_NUMBER}.

Order Details:
• Order Date: {ORDER_DATE}
• Total Amount: ₹{AMOUNT}
• Payment Method: {PAYMENT_METHOD}
• Items: {ITEM_COUNT} items

Cancellation Eligibility:
{IF status = "pending" or "confirmed"}
✅ You can cancel with full refund
💰 Refund: ₹{AMOUNT} to {PAYMENT_METHOD}
⏱️ Refund timeline: 5-7 business days

{IF status = "shipped"}
❌ Cannot cancel (already shipped)
Alternative: Refuse delivery or initiate return

Proceed with cancellation?
[Yes, Cancel Order] [No, Keep Order]

{If confirmed}
✅ Order {ORDER_NUMBER} cancelled successfully!
📧 Confirmation email sent to {EMAIL}
💰 Refund of ₹{AMOUNT} will be processed in 5-7 days
```

**Webhook Integration:**
```python
# API Endpoint: POST /api/orders/cancel
# Request Body:
{
  "order_number": "ORD-12345",
  "reason": "customer_request",
  "initiated_by": "customer"
}

# Response:
{
  "success": true,
  "order_id": "ORD-12345",
  "cancellation_id": "CAN-67890",
  "refund_amount": 2499.00,
  "refund_method": "original_payment",
  "refund_timeline": "5-7 business days",
  "confirmation_email": "customer@example.com"
}
```

---

## 3. Product Information Intents

### Intent: `product.inquiry`

**Purpose:** Answer product-related questions

**Training Phrases (35):**

```
# General product info
- Tell me about this product
- Product details
- What is this product
- Product information
- Describe this item
- Product specifications

# Specific products (with entity)
- Tell me about blue jeans
- Information about red dress
- Details for school uniform
- What's special about organic cotton clothes

# Hinglish
- Is product ke baare mein batao
- Yeh kya hai
- Product details do
- Ismein kya special hai

# Comparisons
- Difference between product A and B
- Which one is better
- Compare these two products
- Should I buy this or that

# Features/materials
- What material is this
- Is this organic cotton
- Washing instructions
- Size chart
- Age group for this product

# Brand/quality
- Which brand is this
- Is this good quality
- Customer reviews
- Rating for this product
```

**Required Entities:**
- `@product_name` or `@product_id`
- `@product_category` (optional: clothes, footwear, accessories)
- `@age_range` (optional: newborn, infant, toddler, etc.)

**Response Template:**
```
Product Information:

📦 {PRODUCT_NAME}
🏷️ Price: ₹{PRICE} (₹{ORIGINAL_PRICE} - {DISCOUNT}% off)
⭐ Rating: {RATING}/5 ({REVIEW_COUNT} reviews)

Key Features:
• Material: {MATERIAL}
• Available Sizes: {SIZE_OPTIONS}
• Available Colors: {COLOR_OPTIONS}
• Age Group: {AGE_RANGE}
• Care Instructions: {CARE_INSTRUCTIONS}

Stock Status:
{IF in_stock}
✅ In Stock - Delivery in {DELIVERY_DAYS} days
{ELSE}
⏳ Out of Stock - Next restock: {RESTOCK_DATE}

Customer Reviews Highlight:
"{TOP_REVIEW}"

Would you like to:
1. Add to cart
2. Check size guide
3. See similar products
4. Talk to expert
```

---

### Intent: `product.availability`

**Purpose:** Check if product is in stock

**Training Phrases (25):**

```
# Availability checks
- Is this available
- In stock
- Do you have this product
- Available or not
- Can I buy this now
- Is this product available

# Size-specific
- Do you have size 2T
- Available in size 6
- Stock for XL size
- Size 4 available hai kya

# Color-specific
- Available in blue
- Do you have red color
- Blue color stock hai
- Red mein available hai

# Hinglish
- Yeh milega kya
- Stock mein hai
- Is size mein available hai
- Kab milega yeh

# Location-specific
- Available in Mumbai
- Stock in Delhi
- Can I get this in Bangalore
```

**Required Entities:**
- `@product_id` or `@product_name`
- `@size` (optional)
- `@color` (optional)
- `@location` (optional, for store pickup)

**Response Template:**
```
Availability for {PRODUCT_NAME}:

{IF available}
✅ In Stock!
• Available Sizes: {SIZE_LIST}
• Available Colors: {COLOR_LIST}
• Delivery: {DELIVERY_DAYS} days
• Price: ₹{PRICE}

{IF limited_stock}
⚠️ Limited Stock - Only {QUANTITY} left!
Hurry! This item is in high demand.

{IF out_of_stock}
❌ Currently Out of Stock
• Next Restock: {RESTOCK_DATE}
• Notify me when available? [Yes] [No]

Similar Products You May Like:
1. {ALT_PRODUCT_1} - ₹{PRICE_1}
2. {ALT_PRODUCT_2} - ₹{PRICE_2}

Would you like to:
• Reserve this item (available for 24 hours)
• Add to wishlist
• See similar products
```

---

### Intent: `product.size_guide`

**Purpose:** Help customers choose correct size

**Training Phrases (20):**

```
# Size questions
- What size should I buy
- Size guide
- Size chart
- How to choose size
- Which size fits my child

# Age-based sizing
- Size for 2 year old
- What size for 5 year old
- Newborn size guide
- Toddler sizing

# Measurement-based
- My child is 3 feet tall
- Height 100 cm, which size
- Weight 15 kg, what size

# Hinglish
- Size kaise pata kare
- Mera bacha 3 saal ka hai
- Size chart dikhao
```

**Response Template:**
```
KidsWear India Size Guide:

Age-Based Quick Guide:
• 0-3 months: Newborn
• 3-12 months: 0-1 Year
• 1-3 years: Toddler (2T, 3T)
• 3-5 years: Preschool (4, 5)
• 6-12 years: School Age (6-12)

Detailed Size Chart:
[TABLE showing height, weight, chest, waist measurements]

💡 Pro Tips:
• If between sizes, size up for comfort
• Check product-specific sizing notes
• Cotton items may shrink 3-5%

Need help choosing?
• Enter child's age: ___
• Enter height (cm): ___
• Enter weight (kg): ___

I'll recommend the perfect size!
```

---

## 4. Returns & Refunds Intents

### Intent: `return.policy`

**Purpose:** Explain return and exchange policy

**Training Phrases (18):**

```
# Policy questions
- What is your return policy
- Can I return this
- Return policy
- How to return
- Return rules
- Exchange policy

# Time-based
- How many days to return
- Return window
- Last date to return
- Can I return after 15 days

# Hinglish
- Return policy kya hai
- Main return kar sakta hoon
- Kitne din mein return ho sakta hai
- Exchange kaise kare
```

**Response Template:**
```
KidsWear India Return & Exchange Policy:

✅ Hassle-Free Returns Within 15 Days
• Full refund if product defective/wrong
• Exchange available for size/color
• Store credit option available

Return Eligibility:
✅ Product unused with tags intact
✅ Original packaging maintained
✅ Receipt/invoice available
✅ Purchased within last 15 days

❌ Non-Returnable Items:
• Undergarments & innerwear
• Products marked "Final Sale"
• Used/washed items
• Items without tags

Return Process:
1. Initiate return (online or phone)
2. Schedule pickup (free)
3. Quality check (1-2 days)
4. Refund processed (5-7 days)

Refund Options:
💳 Original payment method (5-7 days)
💰 Store credit (instant, 10% bonus)
🔄 Exchange (free, instant processing)

Ready to initiate a return?
[Start Return] [View My Orders]
```

---

### Intent: `return.request`

**Purpose:** Initiate return/exchange request

**Training Phrases (30):**

```
# Return requests
- I want to return
- Return this product
- Initiate return
- Start return process
- Return my order
- Send back this item

# Reasons
- Product is defective
- Wrong size delivered
- Wrong color received
- Damaged product
- Not as described
- Don't like it

# Exchange requests
- Exchange for different size
- Change size
- Exchange for bigger size
- Get smaller size
- Different color please

# Hinglish
- Return karna hai
- Exchange chahiye
- Galat product aaya
- Size badalna hai
- Defective product mila
```

**Required Entities:**
- `@order_number`
- `@return_reason`
- `@return_type` (refund, exchange, store_credit)
- `@item_id` (if partial return)

**Response Template:**
```
I'll help you with the return for order {ORDER_NUMBER}.

Order Details:
• Order Date: {ORDER_DATE}
• Items: {ITEM_LIST}
• Total: ₹{AMOUNT}

Which item(s) would you like to return?
[Display items with checkboxes]

Return Reason:
[ ] Defective/damaged
[ ] Wrong size
[ ] Wrong item delivered
[ ] Not as described
[ ] Changed mind
[ ] Other: _______

Preferred Resolution:
( ) Full Refund (₹{AMOUNT} to original payment)
( ) Store Credit (₹{AMOUNT + BONUS} - get 10% extra!)
( ) Exchange (for different size/color)

Return Method:
✅ Free Pickup from your address
📅 Pickup Date: [Select date]
🕐 Pickup Time: [Select time slot]

Pickup Address:
{DELIVERY_ADDRESS}
[Edit Address]

Proceed with return?
[Confirm Return] [Cancel]

{If confirmed}
✅ Return Request #{RETURN_ID} Created!
📧 Email confirmation sent
📦 Pickup scheduled for {DATE}
💰 Refund: 5-7 days after quality check
```

**Webhook Integration:**
```python
# API Endpoint: POST /api/returns/initiate
# Request Body:
{
  "order_number": "ORD-12345",
  "items": ["ITEM-1", "ITEM-2"],
  "reason": "wrong_size",
  "resolution_type": "refund",
  "pickup_date": "2025-11-25",
  "pickup_time": "10:00-12:00",
  "pickup_address": {...}
}

# Response:
{
  "return_id": "RET-67890",
  "status": "pending_pickup",
  "pickup_date": "2025-11-25",
  "refund_amount": 2499.00,
  "refund_timeline": "5-7 business days after quality check",
  "tracking_url": "https://return.kidswear.com/RET-67890"
}
```

---

## 5. Account Management Intents

### Intent: `account.balance`

**Purpose:** Check loyalty points and rewards

**Training Phrases (15):**

```
# Points inquiry
- Check my points
- How many points do I have
- Loyalty points
- Reward balance
- My account balance

# Hinglish
- Mere points kitne hain
- Loyalty points check karo
- Balance dikhao
```

**Response Template:**
```
Your KidsWear Rewards Account:

💎 Current Points: {POINTS}
💰 Cash Value: ₹{CASH_VALUE}

Points Breakdown:
• Earned from purchases: {PURCHASE_POINTS}
• Bonus points: {BONUS_POINTS}
• Referral rewards: {REFERRAL_POINTS}
• Expiring soon: {EXPIRING_POINTS} on {EXPIRY_DATE}

Rewards Tier: {TIER} (Silver/Gold/Platinum)
• Current benefits: {BENEFITS_LIST}
• Next tier: {NEXT_TIER} ({POINTS_NEEDED} more points)

Redeem Your Points:
✅ ₹{VOUCHER_500} voucher for {POINTS_500} points
✅ ₹{VOUCHER_1000} voucher for {POINTS_1000} points
✅ ₹{VOUCHER_2000} voucher for {POINTS_2000} points

Would you like to:
• Redeem points now
• View points history
• Learn how to earn more
```

---

### Intent: `account.password`

**Purpose:** Reset forgotten password

**Training Phrases (12):**

```
# Password reset
- Forgot password
- Reset password
- Can't login
- Password reset kaise kare
- I don't remember my password
- Change password
```

**Response Template:**
```
I'll help you reset your password.

Account Verification:
• Email: {EMAIL}
• Phone: {PHONE}

Reset Method:
( ) Send reset link via email
( ) Send OTP via SMS

{If email selected}
✅ Password reset link sent to {EMAIL}
• Check your inbox and spam folder
• Link valid for 24 hours
• Click link to create new password

{If SMS selected}
✅ OTP sent to {PHONE}
• Enter 6-digit OTP: [______]
• OTP valid for 10 minutes

Security Tips:
• Use 8+ characters
• Mix letters, numbers, symbols
• Don't reuse old passwords
```

---

## 6. Payment & Billing Intents

### Intent: `payment.methods`

**Purpose:** Explain available payment options

**Training Phrases (15):**

```
# Payment questions
- What payment methods do you accept
- How can I pay
- Payment options
- Can I pay cash on delivery
- Credit card accepted
- UPI available

# Hinglish
- Payment kaise kare
- COD available hai
- Card se pay kar sakte hain
```

**Response Template:**
```
KidsWear India Payment Options:

💳 Credit/Debit Cards
✅ Visa, Mastercard, RuPay, Amex
✅ No extra charges
✅ 100% secure (PCI-DSS compliant)

📱 UPI
✅ PhonePe, Google Pay, Paytm
✅ Instant confirmation
✅ No charges

🏦 Net Banking
✅ All major banks
✅ NEFT/RTGS/IMPS

📦 Cash on Delivery (COD)
✅ Pay when you receive
⚠️ ₹50 COD fee for orders < ₹500
⚠️ Not available for orders > ₹25,000

💰 Wallets & EMI
✅ Paytm, Mobikwik, Amazon Pay
✅ EMI options on orders > ₹3,000

🎁 Other Options
✅ Gift cards
✅ Loyalty points redemption
✅ Corporate accounts

Choose payment at checkout!
```

---

### Intent: `payment.refund_status`

**Purpose:** Track refund status after return

**Training Phrases (20):**

```
# Refund inquiries
- Where is my refund
- Refund status
- Has my refund been processed
- When will I get my money back
- Refund not received

# With return ID
- Refund for return 12345
- Check refund status RET-12345

# Hinglish
- Mera refund kab aayega
- Paise wapas kab milenge
- Refund ka status kya hai
```

**Response Template:**
```
Refund Status for Return #{RETURN_ID}:

📦 Return Status: {STATUS}
💰 Refund Amount: ₹{AMOUNT}
💳 Refund Method: {METHOD}

Timeline:
✅ Return picked up: {PICKUP_DATE}
✅ Quality check completed: {QC_DATE}
{IF approved}
✅ Refund initiated: {REFUND_DATE}
⏳ Expected in account: {EXPECTED_DATE}

{IF pending}
⏳ Refund will be processed within 5-7 business days

{IF rejected}
❌ Return rejected
Reason: {REJECTION_REASON}
• Item shows signs of use
• Tags removed
• Original packaging damaged

Contact Details:
📧 Email: {EMAIL}
📱 Phone: {PHONE}

Need help? Talk to refunds team?
[Contact Support]
```

---

## 7. Shipping & Delivery Intents

### Intent: `shipping.estimate`

**Purpose:** Estimate delivery time for pincode

**Training Phrases (18):**

```
# Delivery questions
- How long for delivery
- Delivery time
- When will I get my order
- Shipping duration
- How many days for delivery

# Pincode-specific
- Delivery to pincode 400001
- Shipping to Mumbai
- How long to Bangalore
- Delivery time for Delhi

# Hinglish
- Kitne din mein delivery hogi
- Delivery time kya hai
- Mumbai mein kitne din
```

**Required Entities:**
- `@pincode`
- `@city` (optional)

**Response Template:**
```
Delivery Estimate for Pincode {PINCODE}:

📍 Location: {CITY}, {STATE}
✅ Serviceable Area

Standard Delivery:
📦 5-7 business days
💰 FREE for orders > ₹499
💰 ₹50 for orders < ₹499

Express Delivery:
⚡ 2-3 business days
💰 ₹150 (₹100 for orders > ₹999)

Same Day Delivery:
🚀 Available in select metro areas
💰 ₹250
⏰ Order before 12 PM for same-day

Note: Delivery times may vary during:
• Festivals (Diwali, Christmas)
• Sale periods
• Weather disruptions

Add items to cart to see exact delivery date!
```

---

### Intent: `shipping.change_address`

**Purpose:** Update delivery address after order placed

**Training Phrases (15):**

```
# Address change
- Change delivery address
- Update address
- Wrong address entered
- Modify shipping address
- Address change karna hai
```

**Response Template:**
```
Address Change Request:

Order: {ORDER_NUMBER}
Current Status: {STATUS}

Current Address:
{CURRENT_ADDRESS}

{IF status = "pending" or "confirmed"}
✅ You can update the address

New Delivery Address:
[Address Form]
• Address Line 1: ________
• Address Line 2: ________
• City: ________
• State: ________
• Pincode: ________
• Phone: ________

[Update Address]

{IF status = "shipped"}
❌ Order already shipped

Options:
1. Contact delivery partner (details below)
2. Refuse delivery (full refund)
3. Arrange re-delivery to new address (+₹100)

Delivery Partner: {CARRIER}
Contact: {CARRIER_PHONE}
Tracking: {TRACKING_URL}
```

---

## 8. Customer Support Intents

### Intent: `agent.request`

**Purpose:** Transfer to human agent

**Training Phrases (25):**

```
# Direct agent requests
- Talk to agent
- Speak to human
- Connect me to customer service
- I want to talk to someone
- Transfer to agent
- Live agent please

# Frustrated/escalation
- This bot is not helping
- I need real help
- Connect me to your manager
- Speak to supervisor
- This is not working

# Hinglish
- Agent se baat karni hai
- Kisi se baat karo
- Insaan chahiye, bot nahi
- Customer care se connect karo

# Polite
- May I speak with an agent
- Could you transfer me
- I'd like to talk to support
```

**Response Template:**
```
I'll connect you with our customer service team.

Before I transfer you:
• Topic: {CONVERSATION_TOPIC}
• Issue: {ISSUE_SUMMARY}
• Order: {ORDER_NUMBER} (if applicable)

Agent Availability:
{IF agents_available}
✅ Agent available now
⏱️ Average wait time: {WAIT_TIME} minutes

{IF agents_busy}
⏳ All agents busy
⏱️ Estimated wait: {WAIT_TIME} minutes

Alternative: Get instant help via:
📧 Email: support@kidswear.com (24hr response)
💬 WhatsApp: +91-98765-43210
📞 Call Back: Request callback?

Proceed with live agent transfer?
[Yes, Connect Now] [Request Callback] [Continue with Bot]

{If confirmed}
🔄 Transferring to next available agent...
Your conversation history has been shared with the agent.

Conversation Summary for Agent:
• Customer: {NAME}
• Phone: {PHONE}
• Email: {EMAIL}
• Issue: {ISSUE}
• Order: {ORDER_NUMBER}
• Previous Actions: {ACTION_HISTORY}
```

---

### Intent: `complaint.register`

**Purpose:** Register formal complaint

**Training Phrases (20):**

```
# Complaint registration
- I want to file a complaint
- Register complaint
- Make a complaint
- I'm not satisfied
- This is unacceptable
- Poor service

# Specific issues
- Rude delivery person
- Damaged product
- Wrong item delivered
- Delayed delivery
- Poor quality

# Hinglish
- Complaint register karna hai
- Main satisfied nahi hoon
- Bahut bura experience
```

**Response Template:**
```
I'm sorry to hear about your experience. I'll register your complaint immediately.

Complaint Registration:

Order/Reference: {ORDER_NUMBER}
Issue Category:
[ ] Product quality issue
[ ] Wrong item delivered
[ ] Damaged product received
[ ] Delayed delivery
[ ] Delivery executive behavior
[ ] Customer service issue
[ ] Other: _______

Please describe your issue:
[Text box - max 500 characters]

Your Contact Preference:
( ) Email: {EMAIL}
( ) Phone: {PHONE}
( ) WhatsApp: {WHATSAPP}

Priority Level:
• High: Urgent resolution needed
• Medium: Important but not urgent
• Low: General feedback

✅ Complaint Registered Successfully!

Complaint ID: {COMPLAINT_ID}
• Assigned to: Senior Support Team
• Response within: 24 hours
• Resolution timeline: 3-5 business days

Immediate Actions:
{IF refund_eligible}
💰 Refund of ₹{AMOUNT} initiated
{IF replacement_eligible}
📦 Replacement order created
{IF compensation_eligible}
🎁 Compensation: {COMPENSATION}

We take complaints seriously and will:
1. Investigate thoroughly
2. Contact you within 24 hours
3. Provide resolution within 5 days
4. Follow up to ensure satisfaction

Escalation Path:
If not satisfied with resolution:
• Email: escalations@kidswear.com
• Call: 1800-XXX-XXXX (toll-free)
• Customer Relations Manager

Confirmation email sent to {EMAIL}
```

---

## 9. Entity Definitions

### Custom Entities

#### Entity: `@product_category`

**Type:** Enumeration

**Values:**
```
- baby-clothing (newborn, infant)
- toddler-clothing (1-3 years)
- kids-clothing (4-12 years)
- footwear (shoes, sandals, boots)
- accessories (hats, bags, belts)
- winter-wear (jackets, sweaters)
- ethnic-wear (kurtas, lehengas)
- school-uniforms
- innerwear (vests, underwear)
```

**Synonyms:**
```
baby-clothing:
  - baby clothes
  - infant wear
  - newborn dress
  - bachon ke kapde

footwear:
  - shoes
  - chappals
  - jutte
  - footwear items
```

---

#### Entity: `@age_range`

**Type:** Enumeration

**Values:**
```
- newborn (0-3 months)
- infant (3-12 months)
- toddler (1-3 years)
- preschool (3-5 years)
- school-age (6-12 years)
- teen (13+ years)
```

---

#### Entity: `@order_status`

**Type:** Enumeration

**Values:**
```
- pending (payment pending)
- confirmed (payment received)
- processing (being prepared)
- packed (ready to ship)
- shipped (in transit)
- out-for-delivery (with delivery executive)
- delivered (successfully delivered)
- cancelled (customer cancelled)
- returned (return in progress)
- refunded (refund completed)
```

---

#### Entity: `@size`

**Type:** Enumeration

**Values:**
```
- NB (Newborn)
- 0-3M, 3-6M, 6-9M, 9-12M (Months)
- 1Y, 2Y, 3Y, 4Y, 5Y (Years)
- 2T, 3T, 4T, 5T (Toddler)
- 6, 7, 8, 9, 10, 11, 12 (School-age)
- XS, S, M, L, XL, XXL (Generic sizes)
```

---

#### Entity: `@color`

**Type:** Free-form (with suggestions)

**Common Values:**
```
- red, blue, green, yellow, orange, pink
- black, white, grey, brown
- navy, maroon, teal, purple
- multicolor, printed, striped
```

**Hinglish Synonyms:**
```
- laal (red)
- neela (blue)
- peela (yellow)
- safed (white)
- kala (black)
```

---

### System Entities

#### `@sys.date` - Date extraction
```
Examples:
- "tomorrow" → 2025-11-23
- "next monday" → 2025-11-25
- "25th November" → 2025-11-25
```

#### `@sys.number` - Numeric values
```
Examples:
- "three items" → 3
- "order 12345" → 12345
- "size 8" → 8
```

#### `@sys.email` - Email addresses
```
Examples:
- "customer@example.com"
- "support@kidswear.com"
```

#### `@sys.phone-number` - Phone numbers
```
Examples:
- "+91-9876543210"
- "9876543210"
- "022-12345678"
```

---

## 10. Best Practices

### Training Phrase Guidelines

#### 1. Quantity (20-30 phrases per intent)
```
✅ 25+ varied phrases
❌ Only 5-10 similar phrases
```

#### 2. Variety
```
✅ Mix of: questions, statements, commands, Hinglish
❌ All starting with "I want to..."
```

#### 3. Real User Language
```
✅ "where's my stuff" (casual)
✅ "delivery kab hogi" (Hinglish)
✅ "i ordered last week still not here" (real user)
❌ "Please provide me with the delivery status information" (too formal)
```

#### 4. Include Typos
```
✅ "ordder status"
✅ "trak my order"
✅ "whre is my package"
```

#### 5. Include Frustration
```
✅ "this is taking forever"
✅ "why is my order not here"
✅ "I'm very upset"
```

#### 6. Short and Long Phrases
```
✅ "status" (1 word)
✅ "i ordered blue jeans size 4 last monday still waiting want to know where it is" (long)
```

---

### Hinglish Integration Best Practices

#### Common Hindi Words in Customer Service:
```
- kya (what)
- kahan (where)
- kab (when)
- hai (is)
- chahiye (want/need)
- batao/dikhao (tell/show)
- help/madad (help)
- problem/samasya (problem)
- delivery/supaardgi (delivery)
```

#### Mixed Language Examples:
```
✅ "Mera order kab deliver hoga"
✅ "Blue jeans size 10 available hai kya"
✅ "Return policy kya hai batao"
```

---

### Entity Annotation

#### Correct Annotation:
```
Training Phrase: "check order 12345 status"
Annotation: check order @order_number:12345 status
```

#### Parameter Setting:
```
Intent: order.status
Required Parameter: order_number
Entity: @sys.any
Prompts: 
  - "Could you please provide your order number?"
  - "What's your order number? (e.g., ORD-12345)"
```

---

### Context Management

#### Use Contexts for Multi-Turn Conversations:

**Example Flow:**
```
User: "Track my order"
Bot: Sets output context: "awaiting-order-number"

User: "ORD-12345"
Bot: Uses input context: "awaiting-order-number"
     Fetches order status
     Sets output context: "order-details-shown"

User: "Cancel it"
Bot: Uses input context: "order-details-shown"
     Processes cancellation for ORD-12345
```

---

### Response Variation

#### Create Multiple Response Variants:

**Instead of:**
```
❌ Always saying: "Your order status is: Shipped"
```

**Use variations:**
```
✅ Variant 1: "Great news! Your order is on its way!"
✅ Variant 2: "Your package has been shipped and should arrive soon."
✅ Variant 3: "Good to go! Your order is out for delivery."
```

---

### Error Handling

#### No-Match Scenarios:

**Progressive Prompting:**
```
1st No-Match: "Sorry, I didn't quite catch that. Could you rephrase?"
2nd No-Match: "I'm having trouble understanding. Try saying 'help' to see what I can do."
3rd No-Match: "Let me connect you with an agent who can help better."
```

#### Fallback Intent:
```
Training Phrases:
- [Anything not matched by other intents]
- Random gibberish
- Off-topic questions

Response:
"I'm specialized in helping with KidsWear India orders and products. 

I can help with:
• Order tracking
• Product information
• Returns & exchanges
• Account management

What would you like help with?"
```

---

## Appendix: Complete Intent List (30+)

### Greeting & Navigation (5 intents)
1. greeting.hello
2. greeting.goodbye
3. greeting.help
4. greeting.feedback
5. greeting.hours

### Order Management (6 intents)
6. order.status
7. order.modify
8. order.cancel
9. order.track
10. order.history
11. order.invoice

### Product Information (5 intents)
12. product.inquiry
13. product.availability
14. product.size_guide
15. product.price
16. product.recommendations

### Returns & Refunds (4 intents)
17. return.policy
18. return.request
19. return.status
20. refund.status

### Account Management (4 intents)
21. account.balance
22. account.password
23. account.update
24. account.delete

### Payment & Billing (3 intents)
25. payment.methods
26. payment.issues
27. payment.refund_status

### Shipping & Delivery (3 intents)
28. shipping.estimate
29. shipping.change_address
30. shipping.tracking

### Customer Support (5 intents)
31. agent.request
32. complaint.register
33. feedback.positive
34. feedback.negative
35. escalation.manager

---

**Language Support:** English + Hinglish + Regional  
**Last Updated:** March 2026  
**Author:** Rajmohan M, Principal Consultant

---

**END OF APPENDIX A**
