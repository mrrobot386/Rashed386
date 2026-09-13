package com.example.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.GraphicEq
import androidx.compose.material.icons.filled.HelpOutline
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.MicOff
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.AssistantState
import com.example.ui.theme.CyberCyan
import com.example.ui.theme.EmeraldGlow
import com.example.ui.theme.NeonMagenta
import com.example.ui.theme.ObsidianBlack
import com.example.ui.theme.SurfaceDark
import com.example.ui.theme.SurfaceElevated
import com.example.ui.theme.TextMuted
import com.example.ui.theme.TextPrimary
import com.example.ui.theme.TextSecondary

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AnisaScreen(
  state: AssistantState,
  amplitude: Float,
  currentSpokenText: String,
  activeToolName: String?,
  onMicClick: () -> Unit,
  onSuggestionClick: (String) -> Unit
) {
  var showHelpSheet by remember { mutableStateOf(false) }
  val sheetState = rememberModalBottomSheetState()

  Box(
    modifier = Modifier
      .fillMaxSize()
      .background(ObsidianBlack)
      .testTag("anisa_root_container")
  ) {
    // Ambient background neon glow lights
    Box(
      modifier = Modifier
        .size(280.dp)
        .align(Alignment.TopStart)
        .alpha(0.12f)
        .blur(90.dp)
        .background(CyberCyan, CircleShape)
    )
    Box(
      modifier = Modifier
        .size(280.dp)
        .align(Alignment.BottomEnd)
        .alpha(0.12f)
        .blur(90.dp)
        .background(NeonMagenta, CircleShape)
    )

    Column(
      modifier = Modifier
        .fillMaxSize()
        .padding(horizontal = 20.dp, vertical = 24.dp),
      horizontalAlignment = Alignment.CenterHorizontally,
      verticalArrangement = Arrangement.SpaceBetween
    ) {
      // Top Bar: Brand, Status Pills, Help Icon
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
          Box(
            modifier = Modifier
              .size(10.dp)
              .background(CyberCyan, CircleShape)
          )
          Spacer(modifier = Modifier.width(8.dp))
          Text(
            text = "ANISA AI",
            color = TextPrimary,
            fontSize = 18.sp,
            fontWeight = FontWeight.ExtraBold,
            letterSpacing = 2.sp
          )
        }

        // Connection Indicators Pill
        Row(
          modifier = Modifier
            .clip(CircleShape)
            .background(SurfaceDark)
            .border(1.dp, Color(0xFF1E293B), CircleShape)
            .padding(horizontal = 12.dp, vertical = 6.dp),
          verticalAlignment = Alignment.CenterVertically,
          horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
          Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
              modifier = Modifier
                .size(6.dp)
                .background(
                  if (state == AssistantState.SPEAKING || state == AssistantState.LISTENING) CyberCyan else Color(0xFF475569),
                  CircleShape
                )
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
              text = "Gemini Live",
              color = TextSecondary,
              fontSize = 11.sp,
              fontWeight = FontWeight.Medium
            )
          }

          Box(
            modifier = Modifier
              .width(1.dp)
              .height(10.dp)
              .background(Color(0xFF334155))
          )

          Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
              modifier = Modifier
                .size(6.dp)
                .background(EmeraldGlow, CircleShape)
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
              text = "System Agent",
              color = TextSecondary,
              fontSize = 11.sp,
              fontWeight = FontWeight.Medium
            )
          }
        }

        IconButton(
          onClick = { showHelpSheet = true },
          modifier = Modifier
            .size(38.dp)
            .clip(CircleShape)
            .background(SurfaceDark)
            .border(1.dp, Color(0xFF1E293B), CircleShape)
            .testTag("help_button")
        ) {
          Icon(
            imageVector = Icons.Default.HelpOutline,
            contentDescription = "Capabilities and Tools",
            tint = TextSecondary,
            modifier = Modifier.size(20.dp)
          )
        }
      }

      // Centerpiece: Futuristic Orb & Audio Visualizer
      Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
        modifier = Modifier.weight(1f)
      ) {
        AnisaOrb(
          state = state,
          amplitude = amplitude,
          onClick = onMicClick
        )

        Spacer(modifier = Modifier.height(20.dp))

        // State Title
        val stateText = when (state) {
          AssistantState.CONNECTING -> "Connecting to Anisa..."
          AssistantState.LISTENING -> "Listening... Speak naturally"
          AssistantState.SPEAKING -> "Anisa is speaking..."
          AssistantState.ERROR -> "Connection offline"
          AssistantState.DISCONNECTED -> "Tap microphone to talk"
        }

        Text(
          text = stateText,
          color = TextPrimary,
          fontSize = 17.sp,
          fontWeight = FontWeight.SemiBold,
          textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(4.dp))

        Text(
          text = "BENGALI • ENGLISH • HINDI",
          color = CyberCyan.copy(alpha = 0.8f),
          fontSize = 10.sp,
          fontWeight = FontWeight.Bold,
          letterSpacing = 1.5.sp,
          fontFamily = FontFamily.Monospace
        )

        // Tool execution feedback badge
        AnimatedVisibility(
          visible = activeToolName != null,
          enter = fadeIn(),
          exit = fadeOut()
        ) {
          if (activeToolName != null) {
            Box(
              modifier = Modifier
                .padding(top = 12.dp)
                .clip(CircleShape)
                .background(SurfaceElevated)
                .border(1.dp, CyberCyan.copy(alpha = 0.4f), CircleShape)
                .padding(horizontal = 14.dp, vertical = 6.dp)
            ) {
              Text(
                text = "⚡ Executing $activeToolName",
                color = CyberCyan,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium
              )
            }
          }
        }

        // Live transcription / Anisa speech bubble
        AnimatedVisibility(
          visible = currentSpokenText.isNotEmpty(),
          enter = fadeIn(),
          exit = fadeOut()
        ) {
          Box(
            modifier = Modifier
              .padding(top = 16.dp, start = 12.dp, end = 12.dp)
              .clip(RoundedCornerShape(18.dp))
              .background(SurfaceDark.copy(alpha = 0.85f))
              .border(1.dp, Color(0xFF1E2A42), RoundedCornerShape(18.dp))
              .padding(horizontal = 16.dp, vertical = 10.dp)
          ) {
            Text(
              text = currentSpokenText,
              color = TextSecondary,
              fontSize = 13.sp,
              textAlign = TextAlign.Center,
              maxLines = 3
            )
          }
        }
      }

      // Bottom Section: Quick Command Suggestions & Floating Mic Button
      Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
      ) {
        // Horizontal Voice Command Chips
        Row(
          modifier = Modifier
            .fillMaxWidth()
            .horizontalScroll(rememberScrollState()),
          horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
          val suggestions = listOf(
            "Daily Briefing",
            "What's my Wi-Fi?",
            "Pause music",
            "Lock screen",
            "Start slides",
            "Next slide",
            "Biometric check",
            "Open YouTube"
          )

          suggestions.forEach { prompt ->
            Box(
              modifier = Modifier
                .clip(CircleShape)
                .background(SurfaceDark)
                .border(1.dp, Color(0xFF1E293B), CircleShape)
                .clickable { onSuggestionClick(prompt) }
                .padding(horizontal = 14.dp, vertical = 8.dp)
                .testTag("suggestion_$prompt")
            ) {
              Text(
                text = prompt,
                color = TextSecondary,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium
              )
            }
          }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Large Floating Glow Mic Action Button
        val isActive = state == AssistantState.LISTENING || state == AssistantState.SPEAKING
        val buttonGradient = if (isActive) {
          Brush.linearGradient(listOf(Color(0xFFE11D48), Color(0xFFBE123C)))
        } else {
          Brush.linearGradient(listOf(CyberCyan, Color(0xFF2563EB)))
        }

        Box(
          contentAlignment = Alignment.Center,
          modifier = Modifier
            .size(76.dp)
            .clip(CircleShape)
            .background(buttonGradient)
            .clickable { onMicClick() }
            .testTag("main_mic_action_button")
        ) {
          Icon(
            imageVector = if (isActive) Icons.Default.MicOff else Icons.Default.Mic,
            contentDescription = if (isActive) "Stop voice session" else "Start talking to Anisa",
            tint = Color.White,
            modifier = Modifier.size(34.dp)
          )
        }

        Spacer(modifier = Modifier.height(10.dp))

        Text(
          text = if (isActive) "Tap to pause or interrupt" else "Tap mic to awaken Anisa",
          color = TextMuted,
          fontSize = 12.sp,
          fontFamily = FontFamily.Monospace
        )
      }
    }
  }

  // Help & Capabilities Bottom Sheet
  if (showHelpSheet) {
    ModalBottomSheet(
      onDismissRequest = { showHelpSheet = false },
      sheetState = sheetState,
      containerColor = SurfaceDark
    ) {
      Column(
        modifier = Modifier
          .fillMaxWidth()
          .padding(24.dp)
      ) {
        Row(
          verticalAlignment = Alignment.CenterVertically,
          horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
          Icon(
            imageVector = Icons.Default.GraphicEq,
            contentDescription = null,
            tint = CyberCyan
          )
          Text(
            text = "ANISA AI Capabilities",
            color = TextPrimary,
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold
          )
        }

        Spacer(modifier = Modifier.height(12.dp))
        Text(
          text = "Anisa is a real-time voice-to-voice assistant with access to 14 verified system tools. Speak naturally in English, Bengali, or Hindi.",
          color = TextSecondary,
          fontSize = 13.sp
        )

        Spacer(modifier = Modifier.height(16.dp))

        val toolItems = listOf(
          "Daily Briefing" to "Date, time, battery level, memory vitals",
          "Network & Wi-Fi" to "Connection status, SSID, signal check",
          "Universal Media" to "Play, pause, skip tracks, volume up/down, mute",
          "Device Screen Lock" to "Locks your workstation safely",
          "PowerPoint Slides" to "Start presentation, next, previous, goto slide",
          "Biometric Settings" to "Hardware detection & OS enrollment guide",
          "Vision OCR" to "Reads visible text & summarizes layout",
          "Safe File Ops" to "Search and list documents in safe paths",
          "Website Launcher" to "Opens verified secure HTTPS destinations"
        )

        toolItems.forEach { (title, desc) ->
          Column(
            modifier = Modifier
              .fillMaxWidth()
              .padding(vertical = 6.dp)
              .clip(RoundedCornerShape(12.dp))
              .background(SurfaceElevated)
              .padding(12.dp)
          ) {
            Text(title, color = CyberCyan, fontSize = 13.sp, fontWeight = FontWeight.Bold)
            Text(desc, color = TextSecondary, fontSize = 12.sp)
          }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Row(
          verticalAlignment = Alignment.CenterVertically,
          horizontalArrangement = Arrangement.spacedBy(8.dp),
          modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .background(Color(0xFF0C2A38))
            .padding(12.dp)
        ) {
          Icon(Icons.Default.Security, contentDescription = null, tint = CyberCyan, modifier = Modifier.size(18.dp))
          Text(
            text = "No arbitrary command execution. Safe allowlisted tools only.",
            color = CyberCyan,
            fontSize = 11.sp
          )
        }
      }
    }
  }
}

@Composable
fun AnisaOrb(
  state: AssistantState,
  amplitude: Float,
  onClick: () -> Unit
) {
  val infiniteTransition = rememberInfiniteTransition()

  val rotation by infiniteTransition.animateFloat(
    initialValue = 0f,
    targetValue = 360f,
    animationSpec = infiniteRepeatable(
      animation = tween(durationMillis = if (state == AssistantState.SPEAKING) 4000 else 9000, easing = LinearEasing),
      repeatMode = RepeatMode.Restart
    )
  )

  val pulseScale by infiniteTransition.animateFloat(
    initialValue = 0.95f,
    targetValue = 1.05f,
    animationSpec = infiniteRepeatable(
      animation = tween(durationMillis = 1800, easing = FastOutSlowInEasing),
      repeatMode = RepeatMode.Reverse
    )
  )

  val animatedAmp by animateFloatAsState(
    targetValue = (amplitude * 0.4f).coerceIn(0f, 0.5f),
    animationSpec = tween(durationMillis = 100)
  )

  val orbScale = pulseScale + animatedAmp

  val coreGradient = when (state) {
    AssistantState.SPEAKING -> Brush.radialGradient(
      listOf(Color(0xFFFF2A85), NeonMagenta, Color(0xFF6B21A8))
    )
    AssistantState.LISTENING -> Brush.radialGradient(
      listOf(Color(0xFF5EEAD4), CyberCyan, Color(0xFF0369A1))
    )
    AssistantState.CONNECTING -> Brush.radialGradient(
      listOf(Color(0xFFFDE047), Color(0xFFF97316), Color(0xFFC2410C))
    )
    else -> Brush.radialGradient(
      listOf(Color(0xFF334155), Color(0xFF1E293B), Color(0xFF0F172A))
    )
  }

  Box(
    contentAlignment = Alignment.Center,
    modifier = Modifier
      .size(230.dp)
      .clickable { onClick() }
      .testTag("anisa_orb_touch")
  ) {
    // Outer dashed rotating ring
    Box(
      modifier = Modifier
        .size(220.dp)
        .rotate(rotation)
        .border(
          width = 1.5.dp,
          brush = Brush.sweepGradient(
            listOf(
              CyberCyan.copy(alpha = 0.7f),
              NeonMagenta.copy(alpha = 0.6f),
              Color.Transparent,
              CyberCyan.copy(alpha = 0.7f)
            )
          ),
          shape = CircleShape
        )
    )

    // Secondary subtle aura ring
    Box(
      modifier = Modifier
        .size(185.dp)
        .rotate(-rotation * 0.7f)
        .border(
          width = 1.dp,
          color = CyberCyan.copy(alpha = 0.25f),
          shape = CircleShape
        )
    )

    // Center Core Glowing Orb
    Box(
      contentAlignment = Alignment.Center,
      modifier = Modifier
        .size(130.dp)
        .scale(orbScale)
        .clip(CircleShape)
        .background(coreGradient)
        .border(1.5.dp, Color.White.copy(alpha = 0.35f), CircleShape)
    ) {
      // Audio Waveform frequency bars inside Orb
      Row(
        horizontalArrangement = Arrangement.spacedBy(4.dp),
        verticalAlignment = Alignment.CenterVertically
      ) {
        val barHeights = listOf(14, 26, 42, 22, 36, 18, 30)
        barHeights.forEachIndexed { i, baseH ->
          val heightMultiplier = if (state == AssistantState.SPEAKING) {
            1.2f + (amplitude * 0.8f)
          } else if (state == AssistantState.LISTENING) {
            0.8f + (amplitude * 0.5f)
          } else {
            0.3f
          }
          val currentH = (baseH * heightMultiplier).coerceIn(4f, 44f).dp

          Box(
            modifier = Modifier
              .width(3.dp)
              .height(currentH)
              .clip(CircleShape)
              .background(Color.White.copy(alpha = 0.9f))
          )
        }
      }
    }
  }
}
