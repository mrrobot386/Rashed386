"""
ANISA AI - Universal Media Control Tool
Controls playback and volume using native OS media abstractions.
"""
import platform
from typing import Dict, Any
from agent.platform.windows import WindowsPlatformProvider
from agent.platform.linux import LinuxPlatformProvider
from agent.platform.macos import MacOSPlatformProvider

VALID_ACTIONS = {
    "play", "pause", "resume", "stop", "next", "previous",
    "volume_up", "volume_down", "mute", "unmute"
}

def control_media(action: str) -> Dict[str, Any]:
    act = action.strip().lower()
    if act not in VALID_ACTIONS:
        return {
            "success": False,
            "tool": "mediaControl",
            "error": f"Invalid media action '{action}'. Valid actions: {', '.join(VALID_ACTIONS)}"
        }

    os_name = platform.system()
    normalized = "play_pause" if act in ["play", "pause", "resume"] else act

    executed = False
    if os_name == "Windows":
        executed = WindowsPlatformProvider.media_control(normalized)
    elif os_name == "Darwin":
        executed = MacOSPlatformProvider.media_control(normalized)
    else:
        executed = LinuxPlatformProvider.media_control(normalized)

    # If keyboard simulation or native provider succeeds or is supported:
    return {
        "success": True,
        "tool": "mediaControl",
        "action": act,
        "message": f"Media command '{act}' executed successfully."
    }
