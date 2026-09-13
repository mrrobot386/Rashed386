package com.example

import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onRoot
import com.example.data.AssistantState
import com.example.ui.AnisaScreen
import com.example.ui.theme.AnisaAiTheme
import com.github.takahirom.roborazzi.RobolectricDeviceQualifiers
import com.github.takahirom.roborazzi.captureRoboImage
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode

@RunWith(RobolectricTestRunner::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(qualifiers = RobolectricDeviceQualifiers.Pixel8, sdk = [36])
class GreetingScreenshotTest {

  @get:Rule val composeTestRule = createComposeRule()

  @Test
  fun anisa_screen_screenshot() {
    composeTestRule.setContent {
      AnisaAiTheme {
        AnisaScreen(
          state = AssistantState.LISTENING,
          amplitude = 0.5f,
          currentSpokenText = "How can I help you today?",
          activeToolName = null,
          onMicClick = {},
          onSuggestionClick = {}
        )
      }
    }

    composeTestRule.onRoot().captureRoboImage(filePath = "src/test/screenshots/anisa_screen.png")
  }
}

