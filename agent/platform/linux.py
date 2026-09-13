"""
ANISA AI - Linux Platform Provider
"""
import shutil
import subprocess
from typing import Dict, Any

class LinuxPlatformProvider:
    @staticmethod
    def lock() -> bool:
        lock_commands = [
            ["loginctl", "lock-session"],
            ["xdg-screensaver", "lock"],
            ["gnome-screensaver-command", "-l"],
            ["xflock4"]
        ]
        for cmd in lock_commands:
            if shutil.which(cmd[0]):
                try:
                    subprocess.run(cmd, check=True)
                    return True
                except Exception:
                    continue
        return False

    @staticmethod
    def media_control(action: str) -> bool:
        if shutil.which("playerctl"):
            cmd_map = {
                "play": ["playerctl", "play"],
                "pause": ["playerctl", "pause"],
                "play_pause": ["playerctl", "play-pause"],
                "next": ["playerctl", "next"],
                "previous": ["playerctl", "previous"],
                "stop": ["playerctl", "stop"]
            }
            cmd = cmd_map.get(action)
            if cmd:
                try:
                    subprocess.run(cmd, check=True)
                    return True
                except Exception:
                    return False
        return False

    @staticmethod
    def get_wifi_status() -> Dict[str, Any]:
        if shutil.which("nmcli"):
            try:
                output = subprocess.check_output(["nmcli", "-t", "-f", "ACTIVE,SSID", "dev", "wifi"], text=True, errors="ignore")
                for line in output.splitlines():
                    if line.startswith("yes:"):
                        ssid = line.split("yes:")[1].strip()
                        return {"connected": True, "ssid": ssid}
                return {"connected": False, "ssid": None}
            except Exception as e:
                return {"connected": False, "error": str(e)}
        return {"connected": True, "ssid": "Interface eth0/wlan0"}
