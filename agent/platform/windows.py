"""
ANISA AI - Windows Platform Provider
"""
import ctypes
import subprocess
from typing import Dict, Any, List

class WindowsPlatformProvider:
    @staticmethod
    def lock() -> bool:
        try:
            return ctypes.windll.user32.LockWorkStation() != 0
        except Exception:
            return False

    @staticmethod
    def media_control(action: str) -> bool:
        # VK_MEDIA_PLAY_PAUSE = 0xB3, VK_MEDIA_NEXT_TRACK = 0xB0, etc.
        VK_MAP = {
            "play_pause": 0xB3,
            "next": 0xB0,
            "previous": 0xB1,
            "stop": 0xB2,
            "volume_mute": 0xAD,
            "volume_down": 0xAE,
            "volume_up": 0xAF
        }
        vk = VK_MAP.get(action)
        if vk:
            ctypes.windll.user32.keybd_event(vk, 0, 0, 0)
            ctypes.windll.user32.keybd_event(vk, 0, 2, 0)
            return True
        return False

    @staticmethod
    def get_wifi_status() -> Dict[str, Any]:
        try:
            output = subprocess.check_output(["netsh", "wlan", "show", "interfaces"], text=True, errors="ignore")
            connected = "State" in output and "connected" in output.lower()
            ssid = "Unknown"
            for line in output.splitlines():
                if "SSID" in line and "BSSID" not in line:
                    parts = line.split(":")
                    if len(parts) > 1:
                        ssid = parts[1].strip()
                        break
            return {"connected": connected, "ssid": ssid if connected else None}
        except Exception as e:
            return {"connected": False, "error": str(e)}

    @staticmethod
    def open_powerpoint_presentation(path: str) -> bool:
        try:
            import win32com.client
            ppt = win32com.client.Dispatch("PowerPoint.Application")
            ppt.Visible = True
            ppt.Presentations.Open(path)
            return True
        except Exception:
            return False
