"""
ANISA AI - Permission System
Defines security classification for all tool actions:
Level 0: SAFE (Immediate execution)
Level 1: CONFIRMATION_REQUIRED (Requires user voice confirmation)
Level 2: RESTRICTED (Never allowed)
"""
from enum import Enum
from typing import Dict, Any

class PermissionLevel(str, Enum):
    SAFE = "SAFE"
    CONFIRMATION_REQUIRED = "CONFIRMATION_REQUIRED"
    RESTRICTED = "RESTRICTED"

# Tool and Action Permission Mapping
TOOL_PERMISSIONS: Dict[str, Dict[str, PermissionLevel]] = {
    # Apps & Application Launching
    "launchApplication": {
        "default": PermissionLevel.SAFE
    },
    "detectApplication": {
        "default": PermissionLevel.SAFE
    },
    "focusApplication": {
        "default": PermissionLevel.SAFE
    },
    "closeApplication": {
        "default": PermissionLevel.CONFIRMATION_REQUIRED
    },
    "openChrome": {
        "default": PermissionLevel.SAFE
    },
    "searchChrome": {
        "default": PermissionLevel.SAFE
    },
    "openYouTube": {
        "default": PermissionLevel.SAFE
    },

    # Contacts & Messaging
    "findContact": {
        "default": PermissionLevel.SAFE
    },
    "openConversation": {
        "default": PermissionLevel.SAFE
    },
    "prepareMessage": {
        "default": PermissionLevel.SAFE  # Preparing draft is safe; user is asked for confirmation to send
    },
    "sendMessage": {
        "default": PermissionLevel.CONFIRMATION_REQUIRED
    },

    # Device Status & System Vitals
    "getDeviceStatus": {
        "default": PermissionLevel.SAFE
    },
    "dailyBriefing": {
        "get": PermissionLevel.SAFE,
        "default": PermissionLevel.SAFE
    },
    "getActiveWindow": {
        "get": PermissionLevel.SAFE,
        "default": PermissionLevel.SAFE
    },
    "listProcesses": {
        "list": PermissionLevel.SAFE,
        "check": PermissionLevel.SAFE,
        "terminate": PermissionLevel.CONFIRMATION_REQUIRED,
        "default": PermissionLevel.SAFE
    },
    "getNetworkStatus": {
        "get": PermissionLevel.SAFE,
        "default": PermissionLevel.SAFE
    },
    "wifiManager": {
        "status": PermissionLevel.SAFE,
        "list": PermissionLevel.SAFE,
        "connect": PermissionLevel.CONFIRMATION_REQUIRED,
        "disconnect": PermissionLevel.SAFE,
        "reconnect": PermissionLevel.SAFE,
        "default": PermissionLevel.SAFE
    },
    "lockSystem": {
        "lock": PermissionLevel.SAFE,
        "default": PermissionLevel.SAFE
    },

    # Media Controls
    "mediaControl": {
        "play": PermissionLevel.SAFE,
        "pause": PermissionLevel.SAFE,
        "resume": PermissionLevel.SAFE,
        "stop": PermissionLevel.SAFE,
        "next": PermissionLevel.SAFE,
        "previous": PermissionLevel.SAFE,
        "volume_up": PermissionLevel.SAFE,
        "volume_down": PermissionLevel.SAFE,
        "mute": PermissionLevel.SAFE,
        "unmute": PermissionLevel.SAFE,
        "default": PermissionLevel.SAFE
    },

    # Biometrics
    "detectBiometric": {
        "detect": PermissionLevel.SAFE,
        "default": PermissionLevel.SAFE
    },
    "startBiometricEnrollment": {
        "open": PermissionLevel.SAFE,
        "default": PermissionLevel.SAFE
    },

    # PowerPoint & Presentations
    "powerpointControl": {
        "open": PermissionLevel.SAFE,
        "start": PermissionLevel.SAFE,
        "next": PermissionLevel.SAFE,
        "previous": PermissionLevel.SAFE,
        "goto": PermissionLevel.SAFE,
        "exit": PermissionLevel.SAFE,
        "status": PermissionLevel.SAFE,
        "modify": PermissionLevel.CONFIRMATION_REQUIRED,
        "default": PermissionLevel.SAFE
    },

    # Vision & Screen Assistant
    "visionAnalyze": {
        "analyze_image": PermissionLevel.SAFE,
        "describe_screen": PermissionLevel.SAFE,
        "read_text": PermissionLevel.SAFE,
        "explain_error": PermissionLevel.SAFE,
        "default": PermissionLevel.SAFE
    },

    # File Intelligence & Operations
    "findFile": {
        "default": PermissionLevel.SAFE
    },
    "findFolder": {
        "default": PermissionLevel.SAFE
    },
    "recentFiles": {
        "default": PermissionLevel.SAFE
    },
    "fileMetadata": {
        "default": PermissionLevel.SAFE
    },
    "openFile": {
        "default": PermissionLevel.SAFE
    },
    "organizeFiles": {
        "default": PermissionLevel.CONFIRMATION_REQUIRED
    },
    "fileSearch": {
        "search": PermissionLevel.SAFE,
        "list": PermissionLevel.SAFE,
        "read_metadata": PermissionLevel.SAFE,
        "default": PermissionLevel.SAFE
    },
    "fileOperation": {
        "open": PermissionLevel.SAFE,
        "create_folder": PermissionLevel.SAFE,
        "copy": PermissionLevel.SAFE,
        "rename": PermissionLevel.CONFIRMATION_REQUIRED,
        "move": PermissionLevel.CONFIRMATION_REQUIRED,
        "delete": PermissionLevel.CONFIRMATION_REQUIRED,
        "default": PermissionLevel.SAFE
    },

    # Health Monitor
    "systemHealth": {
        "default": PermissionLevel.SAFE
    },

    # Browser Navigation
    "openWebsite": {
        "open": PermissionLevel.SAFE,
        "default": PermissionLevel.SAFE
    }
}

RESTRICTED_ACTIONS = {
    "shell_exec",
    "powershell_exec",
    "eval",
    "exec",
    "password_dump",
    "credential_harvest",
    "bypass_auth",
    "hidden_record",
    "arbitrary_cmd",
    "raw_terminal"
}

def get_permission_level(tool_name: str, action: str = "default") -> PermissionLevel:
    if tool_name in RESTRICTED_ACTIONS or action in RESTRICTED_ACTIONS:
        return PermissionLevel.RESTRICTED
    tool_map = TOOL_PERMISSIONS.get(tool_name, {})
    return tool_map.get(action, tool_map.get("default", PermissionLevel.SAFE))

def is_action_allowed(tool_name: str, action: str = "default", user_confirmed: bool = False) -> bool:
    level = get_permission_level(tool_name, action)
    if level == PermissionLevel.RESTRICTED:
        return False
    if level == PermissionLevel.CONFIRMATION_REQUIRED:
        return user_confirmed
    return True
