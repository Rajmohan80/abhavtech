# Appendix D: Android Bot Integration Code

**Project:** KidsWear India - Cisco Webex Contact Center Deployment  
**Document Type:** Technical Appendix - AI/CCAI Implementation  
**Version:** 1.0  
**Date:** March 2026  
**Related Chapter:** Chapter 7, Section 7.7: Android Bot Architecture

---

## Purpose

This appendix provides complete Kotlin code for integrating Dialogflow CX virtual agent into the KidsWear India Android mobile app. The implementation includes chat UI, webhook integration, push notifications, and offline handling.

---

## Architecture Overview

```
Android App → Dialogflow CX API → Backend Webhook → Business Logic
     ↓
Firebase (Push Notifications, Analytics)
     ↓
Local SQLite (Offline Message Queue)
```

---

## 1. Build Configuration

### 1.1 build.gradle (Module)

```gradle
// app/build.gradle
plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
    id 'com.google.gms.google-services'
    id 'kotlin-kapt'
}

android {
    namespace 'com.kidswearindia.cc'
    compileSdk 34
    
    defaultConfig {
        applicationId "com.kidswearindia.cc"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0"
        
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        
        // Dialogflow CX configuration
        buildConfigField "String", "DIALOGFLOW_PROJECT_ID", "\"kidswear-cc-ai-project\""
        buildConfigField "String", "DIALOGFLOW_AGENT_ID", "\"your-agent-id\""
        buildConfigField "String", "DIALOGFLOW_LOCATION", "\"us-central1\""
    }
    
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    
    buildFeatures {
        viewBinding true
        buildConfig true
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
    
    kotlinOptions {
        jvmTarget = '17'
    }
}

dependencies {
    // Android Core
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    
    // Lifecycle
    implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0'
    implementation 'androidx.lifecycle:lifecycle-livedata-ktx:2.7.0'
    
    // Kotlin Coroutines
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3'
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-play-services:1.7.3'
    
    // Google Cloud Dialogflow CX
    implementation 'com.google.cloud:google-cloud-dialogflow-cx:0.46.0'
    
    // Firebase
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
    implementation 'com.google.firebase:firebase-messaging-ktx'
    implementation 'com.google.firebase:firebase-analytics-ktx'
    
    // Networking
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
    implementation 'com.squareup.okhttp3:logging-interceptor:4.12.0'
    
    // JSON
    implementation 'com.google.code.gson:gson:2.10.1'
    
    // RecyclerView
    implementation 'androidx.recyclerview:recyclerview:1.3.2'
    
    // Room (for offline storage)
    implementation 'androidx.room:room-runtime:2.6.1'
    implementation 'androidx.room:room-ktx:2.6.1'
    kapt 'androidx.room:room-compiler:2.6.1'
    
    // Testing
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
}
```

---

## 2. Dialogflow CX Client

### 2.1 DialogflowCXClient.kt

```kotlin
// com/kidswearindia/cc/dialogflow/DialogflowCXClient.kt
package com.kidswearindia.cc.dialogflow

import android.content.Context
import com.google.api.gax.core.FixedCredentialsProvider
import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.dialogflow.cx.v3.*
import com.google.protobuf.Struct
import com.google.protobuf.Value
import com.kidswearindia.cc.BuildConfig
import com.kidswearindia.cc.R
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.util.UUID

class DialogflowCXClient(private val context: Context) {
    
    private lateinit var sessionsClient: SessionsClient
    private var sessionId: String = UUID.randomUUID().toString()
    
    companion object {
        private const val PROJECT_ID = BuildConfig.DIALOGFLOW_PROJECT_ID
        private const val AGENT_ID = BuildConfig.DIALOGFLOW_AGENT_ID
        private const val LOCATION = BuildConfig.DIALOGFLOW_LOCATION
    }
    
    /**
     * Initialize Dialogflow CX client with credentials
     */
    suspend fun initialize() = withContext(Dispatchers.IO) {
        try {
            // Load credentials from raw resources
            val credentials = context.resources.openRawResource(R.raw.dialogflow_credentials).use {
                GoogleCredentials.fromStream(it)
            }
            
            // Create sessions client
            val sessionsSettings = SessionsSettings.newBuilder()
                .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
                .setEndpoint("$LOCATION-dialogflow.googleapis.com:443")
                .build()
            
            sessionsClient = SessionsClient.create(sessionsSettings)
            
        } catch (e: Exception) {
            throw DialogflowException("Failed to initialize Dialogflow CX client", e)
        }
    }
    
    /**
     * Send text message to Dialogflow CX and get response
     */
    suspend fun sendTextMessage(
        text: String,
        customerId: String? = null,
        parameters: Map<String, Any>? = null
    ): DialogflowResponse = withContext(Dispatchers.IO) {
        try {
            // Build session path
            val sessionPath = SessionName.ofProjectLocationAgentSessionName(
                PROJECT_ID,
                LOCATION,
                AGENT_ID,
                sessionId
            ).toString()
            
            // Build text input
            val textInput = TextInput.newBuilder()
                .setText(text)
                .setLanguageCode("en")
                .build()
            
            val queryInput = QueryInput.newBuilder()
                .setText(textInput)
                .setLanguageCode("en")
                .build()
            
            // Build query parameters
            val queryParamsBuilder = QueryParameters.newBuilder()
            
            // Add custom parameters
            if (parameters != null || customerId != null) {
                val paramsMap = mutableMapOf<String, Any>()
                customerId?.let { paramsMap["customer_id"] = it }
                parameters?.let { paramsMap.putAll(it) }
                
                val struct = buildStructFromMap(paramsMap)
                queryParamsBuilder.setParameters(struct)
            }
            
            // Build detect intent request
            val request = DetectIntentRequest.newBuilder()
                .setSession(sessionPath)
                .setQueryInput(queryInput)
                .setQueryParams(queryParamsBuilder.build())
                .build()
            
            // Send request
            val response = sessionsClient.detectIntent(request)
            
            // Parse response
            parseDialogflowResponse(response)
            
        } catch (e: Exception) {
            throw DialogflowException("Failed to send message to Dialogflow", e)
        }
    }
    
    /**
     * Parse Dialogflow CX response
     */
    private fun parseDialogflowResponse(response: DetectIntentResponse): DialogflowResponse {
        val queryResult = response.queryResult
        
        val messages = queryResult.responseMessagesList.mapNotNull { message ->
            when {
                message.hasText() -> {
                    message.text.textList.joinToString("\n")
                }
                message.hasPayload() -> {
                    // Handle custom payloads (e.g., cards, buttons)
                    message.payload.toString()
                }
                else -> null
            }
        }
        
        val parameters = queryResult.parameters?.fieldsMap?.mapValues { entry ->
            entry.value.stringValue ?: entry.value.numberValue ?: entry.value.boolValue
        } ?: emptyMap()
        
        return DialogflowResponse(
            messages = messages,
            intent = queryResult.intent.displayName,
            confidence = queryResult.intentDetectionConfidence,
            parameters = parameters,
            allRequiredParamsPresent = queryResult.allRequiredParamsPresent
        )
    }
    
    /**
     * Build Protobuf Struct from Map
     */
    private fun buildStructFromMap(map: Map<String, Any>): Struct {
        val structBuilder = Struct.newBuilder()
        
        map.forEach { (key, value) ->
            val valueBuilder = Value.newBuilder()
            
            when (value) {
                is String -> valueBuilder.setStringValue(value)
                is Number -> valueBuilder.setNumberValue(value.toDouble())
                is Boolean -> valueBuilder.setBoolValue(value)
                else -> valueBuilder.setStringValue(value.toString())
            }
            
            structBuilder.putFields(key, valueBuilder.build())
        }
        
        return structBuilder.build()
    }
    
    /**
     * Reset session (start new conversation)
     */
    fun resetSession() {
        sessionId = UUID.randomUUID().toString()
    }
    
    /**
     * Clean up resources
     */
    fun close() {
        if (::sessionsClient.isInitialized) {
            sessionsClient.close()
        }
    }
}

/**
 * Data class for Dialogflow response
 */
data class DialogflowResponse(
    val messages: List<String>,
    val intent: String,
    val confidence: Float,
    val parameters: Map<String, Any>,
    val allRequiredParamsPresent: Boolean
)

/**
 * Custom exception for Dialogflow errors
 */
class DialogflowException(message: String, cause: Throwable? = null) : Exception(message, cause)
```

---

## 3. Chat UI Implementation

### 3.1 ChatActivity.kt

```kotlin
// com/kidswearindia/cc/ui/ChatActivity.kt
package com.kidswearindia.cc.ui

import android.os.Bundle
import android.view.inputmethod.EditorInfo
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.kidswearindia.cc.databinding.ActivityChatBinding
import com.kidswearindia.cc.model.ChatMessage
import com.kidswearindia.cc.model.MessageType
import com.kidswearindia.cc.ui.adapter.ChatAdapter
import com.kidswearindia.cc.viewmodel.ChatViewModel
import kotlinx.coroutines.launch

class ChatActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityChatBinding
    private lateinit var viewModel: ChatViewModel
    private lateinit var chatAdapter: ChatAdapter
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        binding = ActivityChatBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        // Initialize ViewModel
        viewModel = ViewModelProvider(this)[ChatViewModel::class.java]
        
        // Setup RecyclerView
        setupRecyclerView()
        
        // Setup input
        setupMessageInput()
        
        // Observe messages
        observeMessages()
        
        // Initialize Dialogflow
        lifecycleScope.launch {
            viewModel.initializeDialogflow(this@ChatActivity)
        }
        
        // Send welcome message
        sendWelcomeMessage()
    }
    
    private fun setupRecyclerView() {
        chatAdapter = ChatAdapter()
        
        binding.recyclerViewChat.apply {
            layoutManager = LinearLayoutManager(this@ChatActivity).apply {
                stackFromEnd = true
            }
            adapter = chatAdapter
        }
    }
    
    private fun setupMessageInput() {
        binding.buttonSend.setOnClickListener {
            sendMessage()
        }
        
        binding.editTextMessage.setOnEditorActionListener { _, actionId, _ ->
            if (actionId == EditorInfo.IME_ACTION_SEND) {
                sendMessage()
                true
            } else {
                false
            }
        }
    }
    
    private fun observeMessages() {
        viewModel.messages.observe(this) { messages ->
            chatAdapter.submitList(messages)
            
            // Scroll to bottom
            if (messages.isNotEmpty()) {
                binding.recyclerViewChat.smoothScrollToPosition(messages.size - 1)
            }
        }
        
        viewModel.isLoading.observe(this) { isLoading ->
            binding.progressBar.visibility = if (isLoading) {
                android.view.View.VISIBLE
            } else {
                android.view.View.GONE
            }
        }
    }
    
    private fun sendMessage() {
        val messageText = binding.editTextMessage.text.toString().trim()
        
        if (messageText.isNotEmpty()) {
            // Clear input
            binding.editTextMessage.text.clear()
            
            // Send to ViewModel
            lifecycleScope.launch {
                viewModel.sendMessage(messageText)
            }
        }
    }
    
    private fun sendWelcomeMessage() {
        lifecycleScope.launch {
            viewModel.sendMessage("Hello")
        }
    }
    
    override fun onDestroy() {
        super.onDestroy()
        viewModel.cleanup()
    }
}
```

### 3.2 ChatViewModel.kt

```kotlin
// com/kidswearindia/cc/viewmodel/ChatViewModel.kt
package com.kidswearindia.cc.viewmodel

import android.content.Context
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.kidswearindia.cc.dialogflow.DialogflowCXClient
import com.kidswearindia.cc.model.ChatMessage
import com.kidswearindia.cc.model.MessageType
import com.kidswearindia.cc.repository.ChatRepository
import kotlinx.coroutines.launch
import java.util.Date

class ChatViewModel : ViewModel() {
    
    private val _messages = MutableLiveData<List<ChatMessage>>()
    val messages: LiveData<List<ChatMessage>> = _messages
    
    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading
    
    private lateinit var dialogflowClient: DialogflowCXClient
    private lateinit var chatRepository: ChatRepository
    
    private val messageList = mutableListOf<ChatMessage>()
    
    suspend fun initializeDialogflow(context: Context) {
        dialogflowClient = DialogflowCXClient(context)
        chatRepository = ChatRepository(context)
        
        try {
            dialogflowClient.initialize()
        } catch (e: Exception) {
            // Handle initialization error
            addBotMessage("Sorry, I'm having trouble connecting. Please try again later.")
        }
    }
    
    suspend fun sendMessage(text: String) {
        // Add user message to list
        val userMessage = ChatMessage(
            id = generateMessageId(),
            text = text,
            type = MessageType.USER,
            timestamp = Date()
        )
        
        addMessage(userMessage)
        
        // Save to repository
        chatRepository.saveMessage(userMessage)
        
        // Show loading
        _isLoading.value = true
        
        viewModelScope.launch {
            try {
                // Send to Dialogflow
                val response = dialogflowClient.sendTextMessage(
                    text = text,
                    customerId = getUserId()
                )
                
                // Add bot responses
                response.messages.forEach { message ->
                    val botMessage = ChatMessage(
                        id = generateMessageId(),
                        text = message,
                        type = MessageType.BOT,
                        timestamp = Date()
                    )
                    
                    addMessage(botMessage)
                    chatRepository.saveMessage(botMessage)
                }
                
            } catch (e: Exception) {
                // Handle error
                addBotMessage("Sorry, I couldn't process that. Could you try again?")
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    private fun addMessage(message: ChatMessage) {
        messageList.add(message)
        _messages.value = messageList.toList()
    }
    
    private fun addBotMessage(text: String) {
        val message = ChatMessage(
            id = generateMessageId(),
            text = text,
            type = MessageType.BOT,
            timestamp = Date()
        )
        addMessage(message)
    }
    
    private fun generateMessageId(): String {
        return "MSG_${System.currentTimeMillis()}_${(0..9999).random()}"
    }
    
    private fun getUserId(): String {
        // Get from shared preferences or auth
        return "CUST_12345"
    }
    
    fun cleanup() {
        dialogflowClient.close()
    }
}
```

### 3.3 ChatAdapter.kt

```kotlin
// com/kidswearindia/cc/ui/adapter/ChatAdapter.kt
package com.kidswearindia.cc.ui.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.kidswearindia.cc.databinding.ItemMessageBotBinding
import com.kidswearindia.cc.databinding.ItemMessageUserBinding
import com.kidswearindia.cc.model.ChatMessage
import com.kidswearindia.cc.model.MessageType
import java.text.SimpleDateFormat
import java.util.Locale

class ChatAdapter : ListAdapter<ChatMessage, RecyclerView.ViewHolder>(MessageDiffCallback()) {
    
    companion object {
        private const val VIEW_TYPE_USER = 1
        private const val VIEW_TYPE_BOT = 2
    }
    
    override fun getItemViewType(position: Int): Int {
        return when (getItem(position).type) {
            MessageType.USER -> VIEW_TYPE_USER
            MessageType.BOT -> VIEW_TYPE_BOT
        }
    }
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        return when (viewType) {
            VIEW_TYPE_USER -> {
                val binding = ItemMessageUserBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
                UserMessageViewHolder(binding)
            }
            VIEW_TYPE_BOT -> {
                val binding = ItemMessageBotBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
                BotMessageViewHolder(binding)
            }
            else -> throw IllegalArgumentException("Unknown view type: $viewType")
        }
    }
    
    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        val message = getItem(position)
        
        when (holder) {
            is UserMessageViewHolder -> holder.bind(message)
            is BotMessageViewHolder -> holder.bind(message)
        }
    }
    
    class UserMessageViewHolder(
        private val binding: ItemMessageUserBinding
    ) : RecyclerView.ViewHolder(binding.root) {
        
        fun bind(message: ChatMessage) {
            binding.textViewMessage.text = message.text
            binding.textViewTimestamp.text = formatTimestamp(message.timestamp)
        }
    }
    
    class BotMessageViewHolder(
        private val binding: ItemMessageBotBinding
    ) : RecyclerView.ViewHolder(binding.root) {
        
        fun bind(message: ChatMessage) {
            binding.textViewMessage.text = message.text
            binding.textViewTimestamp.text = formatTimestamp(message.timestamp)
        }
    }
    
    private fun formatTimestamp(date: Date): String {
        val format = SimpleDateFormat("HH:mm", Locale.getDefault())
        return format.format(date)
    }
}

class MessageDiffCallback : DiffUtil.ItemCallback<ChatMessage>() {
    override fun areItemsTheSame(oldItem: ChatMessage, newItem: ChatMessage): Boolean {
        return oldItem.id == newItem.id
    }
    
    override fun areContentsTheSame(oldItem: ChatMessage, newItem: ChatMessage): Boolean {
        return oldItem == newItem
    }
}
```

---

## 4. Firebase Push Notifications

### 4.1 MyFirebaseMessagingService.kt

```kotlin
// com/kidswearindia/cc/fcm/MyFirebaseMessagingService.kt
package com.kidswearindia.cc.fcm

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.kidswearindia.cc.R
import com.kidswearindia.cc.ui.ChatActivity

class MyFirebaseMessagingService : FirebaseMessagingService() {
    
    companion object {
        private const val CHANNEL_ID = "chat_notifications"
        private const val NOTIFICATION_ID = 1001
    }
    
    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        
        // Handle data payload
        remoteMessage.data.isNotEmpty().let {
            val title = remoteMessage.data["title"] ?: "KidsWear India"
            val body = remoteMessage.data["body"] ?: "New message"
            val conversationId = remoteMessage.data["conversation_id"]
            
            showNotification(title, body, conversationId)
        }
        
        // Handle notification payload
        remoteMessage.notification?.let {
            showNotification(
                it.title ?: "KidsWear India",
                it.body ?: "New message",
                null
            )
        }
    }
    
    override fun onNewToken(token: String) {
        super.onNewToken(token)
        
        // Send token to backend
        sendTokenToServer(token)
    }
    
    private fun showNotification(title: String, body: String, conversationId: String?) {
        createNotificationChannel()
        
        val intent = Intent(this, ChatActivity::class.java).apply {
            conversationId?.let {
                putExtra("conversation_id", it)
            }
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
        
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .build()
        
        val notificationManager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(NOTIFICATION_ID, notification)
    }
    
    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "Chat Notifications"
            val descriptionText = "Notifications for chat messages"
            val importance = NotificationManager.IMPORTANCE_HIGH
            val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
                description = descriptionText
            }
            
            val notificationManager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }
    
    private fun sendTokenToServer(token: String) {
        // Send FCM token to backend for push notifications
        // Implementation depends on your backend API
    }
}
```

---

## 5. Offline Message Handling

### 5.1 ChatRepository.kt

```kotlin
// com/kidswearindia/cc/repository/ChatRepository.kt
package com.kidswearindia.cc.repository

import android.content.Context
import com.kidswearindia.cc.database.AppDatabase
import com.kidswearindia.cc.model.ChatMessage
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class ChatRepository(context: Context) {
    
    private val database = AppDatabase.getDatabase(context)
    private val messageDao = database.messageDao()
    
    suspend fun saveMessage(message: ChatMessage) = withContext(Dispatchers.IO) {
        messageDao.insert(message)
    }
    
    suspend fun getAllMessages(): List<ChatMessage> = withContext(Dispatchers.IO) {
        messageDao.getAllMessages()
    }
    
    suspend fun getMessageById(id: String): ChatMessage? = withContext(Dispatchers.IO) {
        messageDao.getMessageById(id)
    }
    
    suspend fun deleteAllMessages() = withContext(Dispatchers.IO) {
        messageDao.deleteAll()
    }
}
```

---

**Last Updated:** March 2026  
**Author:** Rajmohan M, Principal Consultant

---

**END OF APPENDIX D**
