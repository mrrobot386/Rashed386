package com.example.data

enum class AssistantState {
  DISCONNECTED,
  CONNECTING,
  LISTENING,
  SPEAKING,
  ERROR
}

data class ToolExecutionResult(
  val success: Boolean,
  val tool: String,
  val action: String = "default",
  val message: String = "",
  val details: String = "",
  val error: String? = null
)

data class SpokenResponse(
  val text: String,
  val toolUsed: String? = null,
  val language: String = "en"
)

data class SystemVitals(
  val batteryLevel: Int,
  val isCharging: Boolean,
  val networkName: String,
  val isWifiConnected: Boolean,
  val memoryUsagePercent: Int,
  val timeString: String,
  val dateString: String
)
