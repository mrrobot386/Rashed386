package com.example.voice

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import java.util.Locale

class VoiceController(
  private val context: Context,
  private val scope: CoroutineScope,
  private val onSpeechRecognized: (String) -> Unit,
  private val onStateChange: (Boolean, Boolean) -> Unit, // isListening, isSpeaking
  private val onAmplitudeChanged: (Float) -> Unit,
  private val onError: (String) -> Unit
) : RecognitionListener, TextToSpeech.OnInitListener {

  private var speechRecognizer: SpeechRecognizer? = null
  private var textToSpeech: TextToSpeech? = null
  private var isTtsReady = false

  private var isListening = false
  private var isSpeaking = false
  private var amplitudeSimulationJob: Job? = null

  init {
    initSpeechRecognizer()
    textToSpeech = TextToSpeech(context, this)
  }

  private fun initSpeechRecognizer() {
    try {
      if (SpeechRecognizer.isRecognitionAvailable(context)) {
        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(context).apply {
          setRecognitionListener(this@VoiceController)
        }
      }
    } catch (e: Exception) {
      Log.w("VoiceController", "SpeechRecognizer creation failed: ${e.message}")
    }
  }

  fun startListening() {
    // If speaking, interrupt immediately!
    stopSpeaking()

    isListening = true
    onStateChange(true, false)
    startAmplitudeTracker(true)

    if (speechRecognizer == null) {
      initSpeechRecognizer()
    }

    try {
      val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
        putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
        putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
        putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3)
        putExtra(RecognizerIntent.EXTRA_LANGUAGE, "en-US")
      }
      speechRecognizer?.startListening(intent)
    } catch (e: Exception) {
      Log.w("VoiceController", "startListening error: ${e.message}")
    }
  }

  fun stopListening() {
    isListening = false
    onStateChange(false, isSpeaking)
    if (!isSpeaking) {
      stopAmplitudeTracker()
    }
    try {
      speechRecognizer?.stopListening()
    } catch (e: Exception) {
      // ignore
    }
  }

  fun speak(text: String, language: String = "en") {
    stopListening()
    stopSpeaking()

    isSpeaking = true
    onStateChange(false, true)
    startAmplitudeTracker(false)

    if (!isTtsReady || textToSpeech == null) {
      // TTS not ready yet, simulate duration
      scope.launch {
        delay(2500)
        stopSpeaking()
      }
      return
    }

    try {
      val locale = when {
        language == "bn" -> Locale("bn", "BD")
        language == "hi" -> Locale("hi", "IN")
        text.contains("বাংলা") || text.contains("আনিসা") -> Locale("bn", "BD")
        text.contains("नमस्ते") || text.contains("अनीसा") -> Locale("hi", "IN")
        else -> Locale.US
      }

      textToSpeech?.language = locale
      textToSpeech?.setPitch(1.15f) // Warm, natural voice pitch
      textToSpeech?.setSpeechRate(1.02f)

      val utteranceId = "ANISA_${System.currentTimeMillis()}"
      textToSpeech?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
        override fun onStart(id: String?) {
          isSpeaking = true
          onStateChange(false, true)
        }

        override fun onDone(id: String?) {
          isSpeaking = false
          onStateChange(isListening, false)
          stopAmplitudeTracker()
        }

        override fun onError(id: String?) {
          isSpeaking = false
          onStateChange(isListening, false)
          stopAmplitudeTracker()
        }
      })

      textToSpeech?.speak(text, TextToSpeech.QUEUE_FLUSH, null, utteranceId)
    } catch (e: Exception) {
      isSpeaking = false
      onStateChange(false, false)
      stopAmplitudeTracker()
    }
  }

  fun stopSpeaking() {
    if (isSpeaking) {
      try {
        textToSpeech?.stop()
      } catch (e: Exception) {
        // ignore
      }
      isSpeaking = false
      onStateChange(isListening, false)
      if (!isListening) {
        stopAmplitudeTracker()
      }
    }
  }

  private fun startAmplitudeTracker(listeningMode: Boolean) {
    amplitudeSimulationJob?.cancel()
    amplitudeSimulationJob = scope.launch(Dispatchers.Default) {
      var step = 0
      while (isActive && (isListening || isSpeaking)) {
        step++
        val base = if (isSpeaking) 0.65f else 0.35f
        val variance = kotlin.math.sin(step * 0.4).toFloat() * 0.3f
        val amp = (base + variance).coerceIn(0.1f, 1.0f)
        onAmplitudeChanged(amp)
        delay(80)
      }
      onAmplitudeChanged(0.05f)
    }
  }

  private fun stopAmplitudeTracker() {
    amplitudeSimulationJob?.cancel()
    amplitudeSimulationJob = null
    onAmplitudeChanged(0.05f)
  }

  override fun onInit(status: Int) {
    if (status == TextToSpeech.SUCCESS) {
      isTtsReady = true
      textToSpeech?.language = Locale.US
    }
  }

  override fun onResults(results: Bundle?) {
    val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
    if (!matches.isNullOrEmpty()) {
      val recognizedText = matches[0]
      onSpeechRecognized(recognizedText)
    }
    stopListening()
  }

  override fun onRmsChanged(rmsdB: Float) {
    if (isListening) {
      val normalized = ((rmsdB + 2f) / 12f).coerceIn(0.1f, 1.0f)
      onAmplitudeChanged(normalized)
    }
  }

  override fun onError(error: Int) {
    stopListening()
    Log.d("VoiceController", "Recognition error code: $error")
  }

  override fun onReadyForSpeech(params: Bundle?) {}
  override fun onBeginningOfSpeech() {}
  override fun onBufferReceived(buffer: ByteArray?) {}
  override fun onEndOfSpeech() {
    stopListening()
  }
  override fun onPartialResults(partialResults: Bundle?) {}
  override fun onEvent(eventType: Int, params: Bundle?) {}

  fun release() {
    stopListening()
    stopSpeaking()
    try {
      speechRecognizer?.destroy()
    } catch (e: Exception) {
      // ignore
    }
    try {
      textToSpeech?.shutdown()
    } catch (e: Exception) {
      // ignore
    }
  }
}
