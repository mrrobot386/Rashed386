"""
ANISA AI - Tool Registry
Central dispatcher for all registered system tools.
Returns structured JSON to Gemini Live.
"""
from typing import Dict, Any
from agent.security import is_safe_url
from agent.audit import log_tool_invocation
from agent.briefing import get_daily_briefing
from agent.process import list_processes, check_process_running, terminate_process
from agent.network import get_network_status, manage_wifi
from agent.lock import lock_system
from agent.media import control_media
from agent.detect import detect_biometrics
from agent.enroll import start_biometric_enrollment
from agent.vision import analyze_image, read_text_from_screen
from agent.file_op import search_files, list_files, file_operation
from agent.powerpoint import control_powerpoint

class ToolRegistry:
    @staticmethod
    def dispatch(tool_name: str, args: Dict[str, Any]) -> Dict[str, Any]:
        result: Dict[str, Any] = {}
        action = args.get("action", "default")
        success = False

        try:
            if tool_name == "dailyBriefing":
                result = get_daily_briefing()
            elif tool_name == "getActiveWindow":
                result = {
                    "success": True,
                    "tool": "getActiveWindow",
                    "window": "ANISA AI Voice Assistant - Active",
                    "application": "ANISA AI",
                    "message": "ANISA AI is currently focused and listening."
                }
            elif tool_name == "listProcesses":
                if action == "terminate":
                    target = args.get("target", args.get("name", ""))
                    confirmed = args.get("user_confirmed", False)
                    result = terminate_process(target, user_confirmed=confirmed)
                elif action == "check":
                    target = args.get("target", args.get("name", ""))
                    result = check_process_running(target)
                else:
                    limit = int(args.get("limit", 15))
                    result = list_processes(limit)
            elif tool_name == "getNetworkStatus":
                result = get_network_status()
            elif tool_name == "wifiManager":
                confirmed = args.get("user_confirmed", False)
                result = manage_wifi(action, args.get("ssid", ""), user_confirmed=confirmed)
            elif tool_name == "lockSystem":
                result = lock_system()
            elif tool_name == "mediaControl":
                act = args.get("action", args.get("command", "play_pause"))
                result = control_media(act)
            elif tool_name == "detectBiometric":
                result = detect_biometrics()
            elif tool_name == "startBiometricEnrollment":
                result = start_biometric_enrollment()
            elif tool_name == "powerpointControl":
                slide = int(args.get("slide_number", 1))
                file_path = args.get("file_path", "")
                result = control_powerpoint(action, slide_number=slide, file_path=file_path)
            elif tool_name == "visionAnalyze":
                if action == "read_text":
                    result = read_text_from_screen()
                else:
                    result = analyze_image(args.get("image_path", ""), args.get("prompt", ""))
            elif tool_name == "fileSearch":
                if action == "list":
                    result = list_files(args.get("directory", ""))
                else:
                    result = search_files(args.get("query", ""))
            elif tool_name == "fileOperation":
                path = args.get("path", "")
                dest = args.get("dest_path", "")
                confirmed = args.get("user_confirmed", False)
                result = file_operation(action, path, dest_path=dest, user_confirmed=confirmed)
            elif tool_name == "openWebsite":
                url = args.get("url", "")
                if is_safe_url(url):
                    import webbrowser
                    webbrowser.open(url)
                    result = {
                        "success": True,
                        "tool": "openWebsite",
                        "url": url,
                        "message": f"Opened {url} in your default browser."
                    }
                else:
                    result = {
                        "success": False,
                        "tool": "openWebsite",
                        "error": "The specified URL is not a safe HTTPS URL."
                    }
            else:
                result = {
                    "success": False,
                    "tool": tool_name,
                    "error": f"Tool '{tool_name}' is not registered in ANISA AI system registry."
                }

            success = result.get("success", False)
        except Exception as e:
            result = {
                "success": False,
                "tool": tool_name,
                "error": f"Execution error in {tool_name}: {str(e)}"
            }
            success = False

        log_tool_invocation(tool_name, action, success, metadata=args)
        return result
