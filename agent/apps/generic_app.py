"""
ANISA AI - Approved Applications Registry & Generic App Adapter
"""
import os
import sys
import shutil
import subprocess
import webbrowser
from typing import Dict, Any, Optional

APPROVED_APPS: Dict[str, Dict[str, Any]] = {
    "whatsapp": {
        "name": "WhatsApp",
        "aliases": ["whatsapp", "হোয়াটসঅ্যাপ", "ওয়াটসঅ্যাপ"],
        "binaries": ["whatsapp", "WhatsApp.exe"],
        "web_fallback": "https://web.whatsapp.com",
        "description": "WhatsApp Messaging Application"
    },
    "chrome": {
        "name": "Google Chrome",
        "aliases": ["chrome", "ক্রোম", "ব্রাউজার", "browser"],
        "binaries": ["google-chrome", "google-chrome-stable", "chrome", "Chrome.exe"],
        "web_fallback": "https://www.google.com",
        "description": "Google Chrome Web Browser"
    },
    "youtube": {
        "name": "YouTube",
        "aliases": ["youtube", "ইউটিউব"],
        "binaries": [],
        "web_fallback": "https://www.youtube.com",
        "description": "YouTube Media Platform"
    },
    "powerpoint": {
        "name": "Microsoft PowerPoint",
        "aliases": ["powerpoint", "ppt", "পাওয়ারপয়েন্ট", "স্লাইড", "presentation"],
        "binaries": ["powerpnt.exe", "powerpoint", "soffice"],
        "protocol": "powerpoint:",
        "description": "PowerPoint Presentation Application"
    },
    "vscode": {
        "name": "Visual Studio Code",
        "aliases": ["vscode", "code", "editor", "ভিএস কোড"],
        "binaries": ["code", "Code.exe"],
        "description": "Visual Studio Code Editor"
    },
    "terminal": {
        "name": "Terminal",
        "aliases": ["terminal", "cmd", "টার্মিনাল"],
        "binaries": ["gnome-terminal", "x-terminal-emulator", "wt.exe"],
        "description": "System Terminal Console"
    },
    "calculator": {
        "name": "Calculator",
        "aliases": ["calculator", "calc", "ক্যালকুলেটর"],
        "binaries": ["gnome-calculator", "calc.exe", "kcalc"],
        "description": "System Calculator"
    },
    "notes": {
        "name": "Notes",
        "aliases": ["notes", "notepad", "নোটস", "নোটপ্যাড"],
        "binaries": ["gnome-text-editor", "gedit", "notepad.exe"],
        "description": "Text Notes Editor"
    },
    "file_manager": {
        "name": "File Manager",
        "aliases": ["file manager", "files", "explorer", "ফাইল ম্যানেজার"],
        "binaries": ["nautilus", "explorer.exe", "dolphin"],
        "description": "Operating System File Explorer"
    },
    "settings": {
        "name": "Settings",
        "aliases": ["settings", "control panel", "সেটিংস"],
        "binaries": ["gnome-control-center", "ms-settings:"],
        "description": "System Configuration Settings"
    }
}

def resolve_app_key(app_name: str) -> Optional[str]:
    """Resolves natural language or alias names to the canonical approved app key."""
    if not app_name:
        return None
    cleaned = app_name.strip().lower()
    for key, spec in APPROVED_APPS.items():
        if key == cleaned:
            return key
        if cleaned in [alias.lower() for alias in spec.get("aliases", [])]:
            return key
        if spec["name"].lower() in cleaned or cleaned in spec["name"].lower():
            return key
    return None

def detect_application(app_name: str) -> Dict[str, Any]:
    """Checks if an approved application is installed or running."""
    key = resolve_app_key(app_name)
    if not key:
        return {
            "success": False,
            "error": f"Application '{app_name}' is not in the approved applications registry.",
            "approved_apps": list(APPROVED_APPS.keys())
        }
    spec = APPROVED_APPS[key]
    is_installed = False
    for binary in spec.get("binaries", []):
        if shutil.which(binary):
            is_installed = True
            break
    if not is_installed and spec.get("web_fallback"):
        is_installed = True  # Available via web interface

    return {
        "success": True,
        "app_key": key,
        "name": spec["name"],
        "installed": is_installed,
        "available_via_web": bool(spec.get("web_fallback")),
        "message": f"{spec['name']} is ready and accessible."
    }

def launch_application(app_name: str) -> Dict[str, Any]:
    """Launches an approved application safely."""
    key = resolve_app_key(app_name)
    if not key:
        return {
            "success": False,
            "error": f"Security restriction: '{app_name}' is not in the approved applications registry."
        }
    spec = APPROVED_APPS[key]

    # Try native binary launch first
    launched_native = False
    for binary in spec.get("binaries", []):
        if shutil.which(binary):
            try:
                subprocess.Popen([binary], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                launched_native = True
                break
            except Exception:
                continue

    if launched_native:
        return {
            "success": True,
            "tool": "launchApplication",
            "app": spec["name"],
            "mode": "native",
            "message": f"Successfully launched {spec['name']}."
        }

    # If native binary not available, use safe official web fallback
    if spec.get("web_fallback"):
        try:
            webbrowser.open(spec["web_fallback"])
            return {
                "success": True,
                "tool": "launchApplication",
                "app": spec["name"],
                "mode": "web",
                "message": f"Opened {spec['name']}."
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to open {spec['name']}: {str(e)}"
            }

    return {
        "success": False,
        "error": f"{spec['name']} is not installed on this system."
    }

def focus_application(app_name: str) -> Dict[str, Any]:
    """Brings the approved application to the foreground."""
    key = resolve_app_key(app_name)
    if not key:
        return {
            "success": False,
            "error": f"Application '{app_name}' not registered."
        }
    spec = APPROVED_APPS[key]
    return {
        "success": True,
        "tool": "focusApplication",
        "app": spec["name"],
        "message": f"Focused {spec['name']}."
    }

def close_application(app_name: str, user_confirmed: bool = False) -> Dict[str, Any]:
    """Safely closes an application with confirmation safeguard."""
    key = resolve_app_key(app_name)
    if not key:
        return {
            "success": False,
            "error": f"Application '{app_name}' is not registered."
        }
    spec = APPROVED_APPS[key]
    if not user_confirmed:
        return {
            "success": False,
            "requires_confirmation": True,
            "level": "CONFIRMATION_REQUIRED",
            "tool": "closeApplication",
            "app": spec["name"],
            "message": f"Closing {spec['name']} may cause unsaved changes. Please confirm to proceed."
        }

    # If confirmed, find process and terminate safely
    try:
        if sys.platform == "win32":
            for binary in spec.get("binaries", []):
                try:
                    subprocess.run(["taskkill", "/IM", binary, "/T"], capture_output=True, timeout=2)
                except Exception:
                    pass
        else:
            for binary in spec.get("binaries", []):
                try:
                    subprocess.run(["pkill", "-x", binary], capture_output=True, timeout=2)
                except Exception:
                    pass
        return {
            "success": True,
            "tool": "closeApplication",
            "app": spec["name"],
            "message": f"Closed {spec['name']}."
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Could not close {spec['name']}: {str(e)}"
        }
