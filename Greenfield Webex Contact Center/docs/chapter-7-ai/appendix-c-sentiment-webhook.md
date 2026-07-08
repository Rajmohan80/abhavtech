# Appendix C: Sentiment Analysis Webhook Implementation

**Project:** KidsWear India - Cisco Webex Contact Center Deployment  
**Document Type:** Technical Appendix - AI/CCAI Implementation  
**Version:** 1.0  
**Date:** March 2026  
**Related Chapter:** Chapter 7, Section 7.6: Sentiment Analysis & Escalation

---

## Purpose

This appendix provides complete webhook implementation for real-time sentiment analysis during customer interactions. The webhook integrates with Google Cloud Natural Language API to detect sentiment, trigger escalations, and alert supervisors when negative sentiment is detected.

---

## Architecture Overview

```
Customer Call → Webex CC → Dialog flow CX → Sentiment Webhook → Google NL API
                                    ↓
                            Supervisor Alert (if negative)
                                    ↓
                            Database Logging
```

---

## 1. Express.js Webhook Server

### 1.1 Main Server Setup

```javascript
// server.js
/**
 * Real-time Sentiment Analysis Webhook for Webex Contact Center
 * Integrates with Google Cloud Natural Language API
 */

const express = require('express');
const bodyParser = require('body-parser');
const { LanguageServiceClient } = require('@google-cloud/language');
const winston = require('winston');
const { Pool } = require('pg');
const axios = require('axios');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

// Google Cloud NL API client
const languageClient = new LanguageServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

// PostgreSQL database pool
const dbPool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'sentiment-analysis-webhook',
    timestamp: new Date().toISOString()
  });
});

// Main sentiment analysis webhook endpoint
app.post('/webhook/sentiment', async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Extract Dialogflow CX request data
    const sessionInfo = req.body.sessionInfo || {};
    const fulfillmentInfo = req.body.fulfillmentInfo || {};
    const text = req.body.text || '';
    
    const sessionId = sessionInfo.session || 'unknown';
    const conversationId = sessionInfo.parameters?.conversation_id || 'unknown';
    const customerId = sessionInfo.parameters?.customer_id || 'unknown';
    
    logger.info(`Sentiment analysis request for session: ${sessionId}`);
    
    // Analyze sentiment
    const sentimentResult = await analyzeSentiment(text);
    
    // Determine if escalation is needed
    const escalationNeeded = shouldEscalate(sentimentResult);
    
    // Log to database
    await logSentiment({
      conversation_id: conversationId,
      customer_id: customerId,
      text: text,
      sentiment_score: sentimentResult.score,
      sentiment_magnitude: sentimentResult.magnitude,
      sentiment_category: sentimentResult.category,
      escalation_triggered: escalationNeeded,
      timestamp: new Date()
    });
    
    // Trigger supervisor alert if needed
    if (escalationNeeded) {
      await triggerSupervisorAlert({
        conversation_id: conversationId,
        customer_id: customerId,
        sentiment_score: sentimentResult.score,
        text: text
      });
    }
    
    // Prepare Dialogflow CX response
    const response = {
      fulfillmentResponse: {
        messages: [
          {
            text: {
              text: [generateEmpathyResponse(sentimentResult)]
            }
          }
        ]
      },
      sessionInfo: {
        parameters: {
          sentiment_score: sentimentResult.score,
          sentiment_category: sentimentResult.category,
          escalation_triggered: escalationNeeded
        }
      }
    };
    
    const latency = Date.now() - startTime;
    logger.info(`Sentiment analysis completed in ${latency}ms`);
    
    res.json(response);
    
  } catch (error) {
    logger.error(`Sentiment analysis error: ${error.message}`, { error });
    
    // Return fallback response
    res.json({
      fulfillmentResponse: {
        messages: [
          {
            text: {
              text: ["I'm here to help you. Let me check on that for you."]
            }
          }
        ]
      }
    });
  }
});

// Analyze sentiment using Google Cloud NL API
async function analyzeSentiment(text) {
  const document = {
    content: text,
    type: 'PLAIN_TEXT'
  };
  
  const [result] = await languageClient.analyzeSentiment({ document });
  
  const sentiment = result.documentSentiment;
  const score = sentiment.score; // Range: -1.0 (negative) to 1.0 (positive)
  const magnitude = sentiment.magnitude; // Strength of emotion (0.0 to +inf)
  
  // Categorize sentiment
  let category;
  if (score >= 0.25) {
    category = 'positive';
  } else if (score >= 0 && score < 0.25) {
    category = 'neutral';
  } else if (score >= -0.25 && score < 0) {
    category = 'slightly_negative';
  } else if (score >= -0.5 && score < -0.25) {
    category = 'negative';
  } else {
    category = 'very_negative';
  }
  
  return {
    score: score,
    magnitude: magnitude,
    category: category
  };
}

// Determine if escalation is needed
function shouldEscalate(sentimentResult) {
  // Escalate if:
  // 1. Sentiment score is very negative (< -0.5)
  // 2. OR magnitude is high (> 2.0) with negative sentiment (< -0.25)
  
  const isVeryNegative = sentimentResult.score < -0.5;
  const isIntenselyNegative = sentimentResult.score < -0.25 && sentimentResult.magnitude > 2.0;
  
  return isVeryNegative || isIntenselyNegative;
}

// Log sentiment to database
async function logSentiment(data) {
  const query = `
    INSERT INTO sentiment_logs (
      conversation_id,
      customer_id,
      text,
      sentiment_score,
      sentiment_magnitude,
      sentiment_category,
      escalation_triggered,
      timestamp
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `;
  
  const values = [
    data.conversation_id,
    data.customer_id,
    data.text,
    data.sentiment_score,
    data.sentiment_magnitude,
    data.sentiment_category,
    data.escalation_triggered,
    data.timestamp
  ];
  
  try {
    await dbPool.query(query, values);
    logger.info(`Sentiment logged for conversation: ${data.conversation_id}`);
  } catch (error) {
    logger.error(`Database logging error: ${error.message}`);
  }
}

// Trigger supervisor alert
async function triggerSupervisorAlert(data) {
  logger.warn(`Triggering supervisor alert for conversation: ${data.conversation_id}`);
  
  // Send Slack notification
  await sendSlackAlert(data);
  
  // Send email alert
  await sendEmailAlert(data);
  
  // Update supervisor dashboard (via API)
  await updateSupervisorDashboard(data);
}

// Send Slack alert
async function sendSlackAlert(data) {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  
  if (!slackWebhookUrl) {
    logger.warn('Slack webhook URL not configured');
    return;
  }
  
  const message = {
    text: `🚨 *Negative Sentiment Alert*`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🚨 Negative Sentiment Detected'
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Conversation ID:*\n${data.conversation_id}`
          },
          {
            type: 'mrkdwn',
            text: `*Customer ID:*\n${data.customer_id}`
          },
          {
            type: 'mrkdwn',
            text: `*Sentiment Score:*\n${data.sentiment_score.toFixed(2)} (Very Negative)`
          },
          {
            type: 'mrkdwn',
            text: `*Timestamp:*\n${new Date().toLocaleString()}`
          }
        ]
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Customer Message:*\n> ${data.text.substring(0, 200)}${data.text.length > 200 ? '...' : ''}`
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '👂 Monitor Call'
            },
            url: `https://kidswear-cc.com/supervisor/monitor/${data.conversation_id}`,
            style: 'danger'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '👥 View Customer Profile'
            },
            url: `https://kidswear-cc.com/customers/${data.customer_id}`
          }
        ]
      }
    ]
  };
  
  try {
    await axios.post(slackWebhookUrl, message);
    logger.info(`Slack alert sent for conversation: ${data.conversation_id}`);
  } catch (error) {
    logger.error(`Slack alert error: ${error.message}`);
  }
}

// Send email alert
async function sendEmailAlert(data) {
  // Implementation using SendGrid, AWS SES, or similar
  // Placeholder for brevity
  logger.info(`Email alert sent for conversation: ${data.conversation_id}`);
}

// Update supervisor dashboard
async function updateSupervisorDashboard(data) {
  const dashboardApiUrl = process.env.DASHBOARD_API_URL;
  
  if (!dashboardApiUrl) {
    return;
  }
  
  try {
    await axios.post(`${dashboardApiUrl}/escalations`, {
      conversation_id: data.conversation_id,
      customer_id: data.customer_id,
      sentiment_score: data.sentiment_score,
      priority: 'high',
      timestamp: new Date().toISOString()
    });
    
    logger.info(`Supervisor dashboard updated for conversation: ${data.conversation_id}`);
  } catch (error) {
    logger.error(`Dashboard update error: ${error.message}`);
  }
}

// Generate empathetic response based on sentiment
function generateEmpathyResponse(sentimentResult) {
  const { category, score } = sentimentResult;
  
  // Positive sentiment - acknowledge and encourage
  if (category === 'positive') {
    return "I'm glad I could help! Is there anything else you'd like to know?";
  }
  
  // Neutral sentiment - standard response
  if (category === 'neutral') {
    return "I understand. Let me see how I can assist you further.";
  }
  
  // Slightly negative - show understanding
  if (category === 'slightly_negative') {
    return "I understand this may be frustrating. Let me help you resolve this.";
  }
  
  // Negative sentiment - empathy and escalation offer
  if (category === 'negative') {
    return "I'm sorry you're experiencing this issue. I want to make sure we resolve this for you. Let me connect you with a senior specialist who can help immediately.";
  }
  
  // Very negative sentiment - immediate escalation
  if (category === 'very_negative') {
    return "I sincerely apologize for this experience. I'm connecting you right now with our senior team who will personally handle your case and ensure this is resolved to your satisfaction.";
  }
  
  return "I'm here to help you. Let me check on that for you.";
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  
  await dbPool.end();
  
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Start server
const server = app.listen(PORT, () => {
  logger.info(`✅ Sentiment analysis webhook server listening on port ${PORT}`);
});

module.exports = app;
```
