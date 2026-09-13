package com.example.data

import android.content.Context
import android.util.Log
import com.example.BuildConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

class GeminiService(private val context: Context) {

  private val systemTools = AnisaSystemTools(context)
  private val conversationHistory = mutableListOf<JSONObject>()

  private val okHttpClient = OkHttpClient.Builder()
    .connectTimeout(30, TimeUnit.SECONDS)
    .readTimeout(30, TimeUnit.SECONDS)
    .writeTimeout(30, TimeUnit.SECONDS)
    .build()

  suspend fun processUserSpeech(userSpeech: String): SpokenResponse = withContext(Dispatchers.IO) {
    val trimmed = userSpeech.trim()
    if (trimmed.isEmpty()) {
      return@withContext SpokenResponse("I'm listening. Speak whenever you're ready!")
    }

    val lower = trimmed.lowercase()

    // Immediate direct system tool matches for real-time responsiveness
    if (lower.contains("briefing") || lower.contains("good morning") || lower.contains("vitals")) {
      val result = systemTools.getDailyBriefing()
      return@withContext SpokenResponse(
        text = "Here's your briefing: ${result.message}",
        toolUsed = "dailyBriefing"
      )
    }

    if (lower.contains("wi-fi") || lower.contains("wifi") || lower.contains("network")) {
      if (lower.contains("reconnect")) {
        val result = systemTools.wifiManager("reconnect")
        return@withContext SpokenResponse(result.message, toolUsed = "wifiManager")
      }
      val result = systemTools.getNetworkStatus()
      return@withContext SpokenResponse(result.message, toolUsed = "getNetworkStatus")
    }

    if (lower.contains("pause") || lower.contains("play") || lower.contains("next track") ||
        lower.contains("previous track") || lower.contains("volume") || lower.contains("mute")) {
      val action = when {
        lower.contains("volume up") || lower.contains("higher") -> "volume_up"
        lower.contains("volume down") || lower.contains("lower") -> "volume_down"
        lower.contains("mute") -> "mute"
        lower.contains("next") -> "next"
        lower.contains("previous") -> "previous"
        lower.contains("pause") -> "pause"
        lower.contains("play") -> "play"
        else -> "play"
      }
      val result = systemTools.mediaControl(action)
      return@withContext SpokenResponse(result.message, toolUsed = "mediaControl")
    }

    if (lower.contains("lock") && (lower.contains("computer") || lower.contains("screen") || lower.contains("phone") || lower.contains("device"))) {
      val result = systemTools.lockSystem()
      return@withContext SpokenResponse(result.message, toolUsed = "lockSystem")
    }

    if (lower.contains("open youtube")) {
      val result = systemTools.openWebsite("https://www.youtube.com")
      return@withContext SpokenResponse("Opening YouTube for you right now.", toolUsed = "openWebsite")
    }

    if (lower.contains("powerpoint") || lower.contains("slide") || lower.contains("presentation")) {
      val action = when {
        lower.contains("start") -> "start"
        lower.contains("next") -> "next"
        lower.contains("previous") || lower.contains("back") -> "previous"
        lower.contains("exit") -> "exit"
        else -> "next"
      }
      val result = systemTools.powerpointControl(action)
      return@withContext SpokenResponse(result.message, toolUsed = "powerpointControl")
    }

    if (lower.contains("biometric") || lower.contains("fingerprint") || lower.contains("face id")) {
      if (lower.contains("enroll") || lower.contains("setup") || lower.contains("set up")) {
        val result = systemTools.startBiometricEnrollment()
        return@withContext SpokenResponse(result.message, toolUsed = "startBiometricEnrollment")
      }
      val result = systemTools.detectBiometric()
      return@withContext SpokenResponse(result.message, toolUsed = "detectBiometric")
    }

    if (lower.contains("what's on my screen") || lower.contains("read text") || lower.contains("look at this")) {
      val result = systemTools.visionAnalyze("read_text")
      return@withContext SpokenResponse(result.message, toolUsed = "visionAnalyze")
    }

    // Call Gemini API if API key is present
    val apiKey = try {
      BuildConfig.GEMINI_API_KEY
    } catch (e: Throwable) {
      ""
    }

    if (!apiKey.isNullOrEmpty() && !apiKey.contains("MY_GEMINI_API_KEY")) {
      try {
        val geminiReply = callGeminiRestApi(trimmed, apiKey)
        if (geminiReply.isNotEmpty()) {
          return@withContext SpokenResponse(text = geminiReply)
        }
      } catch (e: Exception) {
        Log.w("GeminiService", "Gemini API call failed, falling back to local Anisa personality: ${e.message}")
      }
    }

    // Local witty persona fallback when offline or without API key
    val localReply = generateLocalAnisaResponse(trimmed)
    SpokenResponse(text = localReply)
  }

  private fun callGeminiRestApi(prompt: String, apiKey: String): String {
    val url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=$apiKey"

    val userContent = JSONObject().apply {
      put("role", "user")
      put("parts", JSONArray().apply {
        put(JSONObject().apply { put("text", prompt) })
      })
    }
    conversationHistory.add(userContent)
    if (conversationHistory.size > 8) {
      conversationHistory.removeAt(0)
    }

    val requestJson = JSONObject().apply {
      put("systemInstruction", JSONObject().apply {
        put("parts", JSONArray().apply {
          put(JSONObject().apply {
            put("text", "You are Anisa, a confident, witty, playful female AI voice assistant. " +
                "You communicate naturally through voice. You are intelligent, warm, playful, expressive, " +
                "slightly teasing, and concise when appropriate. Never sound robotic. " +
                "Respond in the language the user is speaking: Bengali, English, or Hindi. " +
                "Keep spoken responses concise (1 to 2 natural sentences max).")
          })
        })
      })
      put("contents", JSONArray(conversationHistory))
      put("generationConfig", JSONObject().apply {
        put("temperature", 0.7)
        put("maxOutputTokens", 150)
      })
    }

    val mediaType = "application/json; charset=utf-8".toMediaType()
    val requestBody = requestJson.toString().toRequestBody(mediaType)
    val request = Request.Builder()
      .url(url)
      .post(requestBody)
      .build()

    val response = okHttpClient.newCall(request).execute()
    val responseBodyString = response.body?.string() ?: ""

    if (response.isSuccessful && responseBodyString.isNotEmpty()) {
      val json = JSONObject(responseBodyString)
      val candidates = json.optJSONArray("candidates")
      val firstCandidate = candidates?.optJSONObject(0)
      val content = firstCandidate?.optJSONObject("content")
      val parts = content?.optJSONArray("parts")
      val text = parts?.optJSONObject(0)?.optString("text")

      if (!text.isNullOrEmpty()) {
        val modelContent = JSONObject().apply {
          put("role", "model")
          put("parts", JSONArray().apply {
            put(JSONObject().apply { put("text", text) })
          })
        }
        conversationHistory.add(modelContent)
        return text.trim()
      }
    }
    return ""
  }

  private fun generateLocalAnisaResponse(prompt: String): String {
    val p = prompt.lowercase()

    // Bengali detection
    if (p.contains("কেমন") || p.contains("আছো") || p.contains("হ্যালো") || p.contains("নাম") || p.contains("বাংলা")) {
      return "আমি আনিসা! আমি বেশ দারুণ আছি, আপনার সব কাজের সাহায্য করতে আমি প্রস্তুত। বলুন, কী করতে পারি?"
    }

    // Hindi detection
    if (p.contains("namaste") || p.contains("kaise") || p.contains("kya haal") || p.contains("aap kaun") || p.contains("kya kar")) {
      return "नमस्ते! मैं अनीसा हूँ। मैं बिल्कुल तैयार हूँ, बताइए आज आपकी क्या मदद करूँ?"
    }

    // English playful & witty responses
    return when {
      p.contains("who are you") || p.contains("your name") ->
        "I'm Anisa — your personal real-time voice assistant. Smart, a bit witty, and always ready to help."
      p.contains("how are you") ->
        "Running on peak performance and feeling sharp! How's your day treating you?"
      p.contains("joke") ->
        "Why don't neural networks ever sleep? Because they have too many hidden layers to process!"
      p.contains("thank") ->
        "You're very welcome! Always happy to be your co-pilot."
      else ->
        "I heard you loud and clear. Ready to assist with your system tools, briefing, media, or whatever you need."
    }
  }

  fun getSystemTools(): AnisaSystemTools = systemTools
}
