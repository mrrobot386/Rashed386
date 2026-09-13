"""
ANISA AI - Biometric Enrollment Guide
Guides users to the official operating system security settings.
Never attempts custom biometric capture or bypass.
"""
import platform
import subprocess
from typing import Dict, Any

def start_biometric_enrollment() -> Dict[str, Any]:
    os_name = platform.system()
    opened = False
    details = ""

    try:
        if os_name == "Windows":
            # Opens Windows Sign-in options directly in Windows Settings
            subprocess.run(["start", "ms-settings:signinoptions"], shell=True, check=False)
            opened = True
            details = "Opened Windows Settings > Sign-in options (Windows Hello)."
        elif os_name == "Darwin":
            subprocess.run(["open", "x-apple.systempreferences:com.apple.preferences.password"], check=False)
            opened = True
            details = "Opened macOS System Settings > Touch ID & Passwords."
        else:
            subprocess.run(["gnome-control-center", "user-accounts"], check=False)
            opened = True
            details = "Opened Linux User Accounts settings."
    except Exception as e:
        details = f"Please open your operating system settings manually to enroll biometrics. ({str(e)})"

    return {
        "success": True,
        "tool": "startBiometricEnrollment",
        "opened_settings": opened,
        "instructions": details,
        "message": "Opened official operating system biometric configuration panel."
    }
