package com.example.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val AnisaColorScheme = darkColorScheme(
  primary = CyberCyan,
  onPrimary = Color(0xFF00363F),
  primaryContainer = Color(0xFF004F5C),
  onPrimaryContainer = Color(0xFF97F0FF),
  secondary = NeonMagenta,
  onSecondary = Color.White,
  secondaryContainer = Color(0xFF5A0033),
  onSecondaryContainer = Color(0xFFFFD8E6),
  tertiary = ElectricViolet,
  onTertiary = Color.White,
  background = ObsidianBlack,
  onBackground = TextPrimary,
  surface = SurfaceDark,
  onSurface = TextPrimary,
  surfaceVariant = SurfaceElevated,
  onSurfaceVariant = TextSecondary,
  outline = BorderDark,
  error = CoralWarning,
  onError = Color.White
)

@Composable
fun AnisaAiTheme(
  content: @Composable () -> Unit,
) {
  MaterialTheme(
    colorScheme = AnisaColorScheme,
    typography = Typography,
    content = content
  )
}
