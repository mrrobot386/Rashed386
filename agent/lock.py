"""
ANISA AI - System Lock Tool
Uses the native OS lock mechanism. Never fakes screen lock.
"""
import platform
from typing import Dict, Any
from agent.platform.windows import WindowsPlatformProvider
from agent.platform.linux import LinuxPlatformProvider
from agent.platform.macos import MacOSPlatformProvider

def lock_system() -> Dict[str, Any]:
    os_name = platform.system()
    success = False
    if os_name == "Windows":
        success = WindowsPlatformProvider.lock()
    elif os_name == "Darwin":
        success = MacOSPlatformProvider.lock()
    else:
        success = LinuxPlatformProvider.lock()

    if success:
        return {
            "success": True,
            "tool": "lockSystem",
            "message": "Your computer has been securely locked."
        }
    else:
        return {
            "success": False,
            "tool": "lockSystem",
            "error": f"Locking mechanism not directly supported or permitted on {os_name} in this session."
        }
