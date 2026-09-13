"""
ANISA AI - Permission System
Defines security classification for all tool actions.
"""
from enum import Enum
from typing import Dict, Any

class PermissionLevel(str, Enum):
    SAFE = "SAFE"
    CONFIRMATION_REQUIRED = "CONFIRMATION_REQUIRED"
    RESTRICTED = "RESTRICTED"

# Tool and Action Permission Mapping
TOOL_PERMISSIONS: Dict[str, Dict[str, PermissionLevel]] = {
    "dailyBriefing": {
        "get": PermissionLevel.SAFE
    },
    "getActiveWindow": {
        "get": PermissionLevel.SAFE
    },
    "listProcesses": {
        "list": PermissionLevel.SAFE,
        "check": PermissionLevel.SAFE,
        "terminate": PermissionLevel.CONFIRMATION_REQUIRED
    },
    "getNetworkStatus": {
        "get": PermissionLevel.SAFE
    },
    "wifiManager": {
        "status": PermissionLevel.SAFE,
        "list": PermissionLevel.SAFE,
        "connect": PermissionLevel.CONFIRMATION_REQUIRED,
        "disconnect": PermissionLevel.SAFE,
        "reconnect": PermissionLevel.SAFE
    },
    "lockSystem": {
        "lock": PermissionLevel.SAFE
    },
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
        "unmute": PermissionLevel.SAFE
    },
    "detectBiometric": {
        "detect": PermissionLevel.SAFE
    },
    "startBiometricEnrollment": {
        "open": PermissionLevel.SAFE
    },
    "powerpointControl": {
        "open": PermissionLevel.SAFE,
        "start": PermissionLevel.SAFE,
        "next": PermissionLevel.SAFE,
        "previous": PermissionLevel.SAFE,
        "goto": PermissionLevel.SAFE,
        "exit": PermissionLevel.SAFE,
        "status": PermissionLevel.SAFE,
        "modify": PermissionLevel.CONFIRMATION_REQUIRED
    },
    "visionAnalyze": {
        "analyze_image": PermissionLevel.SAFE,
        "describe_screen": PermissionLevel.SAFE,
        "read_text": PermissionLevel.SAFE
    },
    "fileSearch": {
        "search": PermissionLevel.SAFE,
        "list": PermissionLevel.SAFE,
        "read_metadata": PermissionLevel.SAFE
    },
    "fileOperation": {
        "open": PermissionLevel.SAFE,
        "create_folder": PermissionLevel.SAFE,
        "copy": PermissionLevel.SAFE,
        "rename": PermissionLevel.CONFIRMATION_REQUIRED,
        "move": PermissionLevel.CONFIRMATION_REQUIRED,
        "delete": PermissionLevel.CONFIRMATION_REQUIRED
    },
    "openWebsite": {
        "open": PermissionLevel.SAFE
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
    "hidden_record"
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
