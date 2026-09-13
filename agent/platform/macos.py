"""
ANISA AI - macOS Platform Provider
"""
import subprocess
from typing import Dict, Any

class MacOSPlatformProvider:
    @staticmethod
    def lock() -> bool:
        try:
            subprocess.run([
                "osascript", "-e",
                'tell application "System Events" to set require password to wake of security preferences to true'
            ], check=False)
            subprocess.run(["pmset", "displaysleepnow"], check=True)
            return True
        except Exception:
            return False

    @staticmethod
    def media_control(action: str) -> bool:
        script_map = {
            "play_pause": 'tell application "Music" to playpause',
            "next": 'tell application "Music" to next track',
            "previous": 'tell application "Music" to previous track',
            "stop": 'tell application "Music" to stop',
            "volume_up": "set volume output volume ((output volume of (get volume settings)) + 10)",
            "volume_down": "set volume output volume ((output volume of (get volume settings)) - 10)"
        }
        script = script_map.get(action)
        if script:
            try:
                subprocess.run(["osascript", "-e", script], check=True)
                return True
            except Exception:
                return False
        return False

    @staticmethod
    def get_wifi_status() -> Dict[str, Any]:
        airport_path = "/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport"
        try:
            output = subprocess.check_output([airport_path, "-I"], text=True, errors="ignore")
            ssid = None
            for line in output.splitlines():
                if " SSID:" in line and "BSSID" not in line:
                    ssid = line.split("SSID:")[1].strip()
                    break
            return {"connected": ssid is not None, "ssid": ssid}
        except Exception:
            return {"connected": False, "ssid": None}
