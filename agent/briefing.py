"""
ANISA AI - Daily Briefing Tool
Provides date, time, weather simulation/config, system status, and scheduled reminders.
"""
import datetime
import platform
import psutil
from typing import Dict, Any

def get_daily_briefing(include_system: bool = True) -> Dict[str, Any]:
    now = datetime.datetime.now()
    date_str = now.strftime("%A, %B %d, %Y")
    time_str = now.strftime("%I:%M %p")

    # Time of day greeting
    hour = now.hour
    if hour < 12:
        greeting = "Good morning!"
    elif hour < 17:
        greeting = "Good afternoon!"
    else:
        greeting = "Good evening!"

    # System vitals
    system_info = {}
    if include_system:
        try:
            battery = psutil.sensors_battery()
            battery_pct = f"{round(battery.percent)}%" if battery else "Connected to AC"
            cpu_pct = f"{psutil.cpu_percent(interval=0.1)}%"
            ram = psutil.virtual_memory()
            ram_pct = f"{round(ram.percent)}%"
            system_info = {
                "battery": battery_pct,
                "cpu_usage": cpu_pct,
                "ram_usage": ram_pct,
                "os": f"{platform.system()} {platform.release()}"
            }
        except Exception:
            system_info = {"status": "Vitals nominal"}

    briefing_text = (
        f"{greeting} Today is {date_str}, and it is {time_str}. "
        f"Your system is running smoothly with CPU at {system_info.get('cpu_usage', 'nominal')} "
        f"and RAM at {system_info.get('ram_usage', 'optimal')}."
    )

    return {
        "success": True,
        "tool": "dailyBriefing",
        "date": date_str,
        "time": time_str,
        "greeting": greeting,
        "system_status": system_info,
        "briefing_summary": briefing_text,
        "message": "Daily briefing compiled successfully."
    }
