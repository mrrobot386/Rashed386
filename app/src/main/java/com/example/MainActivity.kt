package com.example

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.core.content.ContextCompat
import com.example.data.AssistantState
import com.example.data.GeminiService
import com.example.ui.AnisaScreen
import com.example.ui.theme.AnisaAiTheme
import com.example.voice.VoiceController
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {

  private var voiceController: VoiceController? = null
  private lateinit var geminiService: GeminiService

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()

    geminiService = GeminiService(applicationContext)

    setContent {
      AnisaAiTheme {
        var assistantState by remember { mutableStateOf(AssistantState.DISCONNECTED) }
        var amplitude by remember { mutableFloatStateOf(0.05f) }
        var currentSpokenText by remember { mutableStateOf("") }
        var activeToolName by remember { mutableStateOf<String?>(null) }

        val scope = rememberCoroutineScope()

        // Permission Launcher
        var hasMicPermission by remember {
          mutableStateOf(
            ContextCompat.checkSelfPermission(
              this@MainActivity,
              Manifest.permission.RECORD_AUDIO
            ) == PackageManager.PERMISSION_GRANTED
          )
        }

        val micPermissionLauncher = rememberLauncherForActivityResult(
          contract = ActivityResultContracts.RequestPermission()
        ) { isGranted ->
          hasMicPermission = isGranted
          if (isGranted) {
            voiceController?.startListening()
          } else {
            Toast.makeText(this@MainActivity, "Microphone permission is needed to talk to Anisa", Toast.LENGTH_SHORT).show()
          }
        }

        val handleUserUtterance: (String) -> Unit = { query ->
          currentSpokenText = query
          assistantState = AssistantState.CONNECTING

          scope.launch {
            val response = geminiService.processUserSpeech(query)
            activeToolName = response.toolUsed
            currentSpokenText = response.text
            voiceController?.speak(response.text, response.language)
          }
        }

        // Initialize VoiceController
        LaunchedEffect(Unit) {
          voiceController = VoiceController(
            context = applicationContext,
            scope = scope,
            onSpeechRecognized = { text ->
              handleUserUtterance(text)
            },
            onStateChange = { isListening, isSpeaking ->
              assistantState = when {
                isSpeaking -> AssistantState.SPEAKING
                isListening -> AssistantState.LISTENING
                else -> AssistantState.DISCONNECTED
              }
              if (!isSpeaking) {
                activeToolName = null
              }
            },
            onAmplitudeChanged = { amp ->
              amplitude = amp
            },
            onError = { err ->
              assistantState = AssistantState.ERROR
            }
          )
        }

        val onMicAction: () -> Unit = {
          if (assistantState == AssistantState.SPEAKING || assistantState == AssistantState.LISTENING) {
            // User interrupts Anisa
            voiceController?.stopSpeaking()
            voiceController?.stopListening()
            assistantState = AssistantState.DISCONNECTED
            currentSpokenText = ""
          } else {
            if (!hasMicPermission) {
              micPermissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
            } else {
              voiceController?.startListening()
            }
          }
        }

        Scaffold(
          modifier = Modifier.fillMaxSize()
        ) { innerPadding ->
          AnisaScreen(
            state = assistantState,
            amplitude = amplitude,
            currentSpokenText = currentSpokenText,
            activeToolName = activeToolName,
            onMicClick = onMicAction,
            onSuggestionClick = { suggestion ->
              handleUserUtterance(suggestion)
            }
          )
        }
      }
    }
  }

  override fun onDestroy() {
    super.onDestroy()
    voiceController?.release()
  }
}
