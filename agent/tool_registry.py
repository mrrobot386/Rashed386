"""
ANISA AI - Tool Registry
Central dispatcher for all registered system tools, applications, and smart actions.
Returns structured JSON to Gemini Live.
"""
from typing import Dict, Any, List
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
from agent.file_op import (
    search_files, list_files, file_operation,
    find_file, find_folder, recent_files, file_metadata, open_file, organize_files
)
from agent.powerpoint import control_powerpoint
from agent.device_status import get_device_status
from agent.health import check_system_health
from agent.apps.generic_app import (
    launch_application, close_application, focus_application, detect_application, APPROVED_APPS
)
from agent.apps.whatsapp import find_contact, open_conversation, prepare_message, send_prepared_message
from agent.apps.chrome import open_chrome, search_query
from agent.apps.youtube import open_youtube

class ToolRegistry:
    REGISTERED_TOOLS: List[str] = [
        "launchApplication",
        "closeApplication",
        "focusApplication",
        "detectApplication",
        "findContact",
        "openConversation",
        "prepareMessage",
        "sendMessage",
        "getDeviceStatus",
        "findFile",
        "findFolder",
        "recentFiles",
        "fileMetadata",
        "openFile",
        "organizeFiles",
        "openChrome",
        "searchChrome",
        "openYouTube",
        "dailyBriefing",
        "getActiveWindow",
        "listProcesses",
        "getNetworkStatus",
        "wifiManager",
        "lockSystem",
        "mediaControl",
        "detectBiometric",
        "startBiometricEnrollment",
        "powerpointControl",
        "visionAnalyze",
        "fileSearch",
        "fileOperation",
        "openWebsite",
        "systemHealth"
    ]

    @classmethod
    def get_registered_tools(cls) -> List[str]:
        return cls.REGISTERED_TOOLS

    @staticmethod
    def dispatch(tool_name: str, args: Dict[str, Any], user_confirmed: bool = False) -> Dict[str, Any]:
        result: Dict[str, Any] = {}
        action = args.get("action", "default")
        confirmed = user_confirmed or args.get("user_confirmed", False)
        success = False

        try:
            # 1. App Launcher
            if tool_name == "launchApplication":
                app_name = args.get("app_name", args.get("app", ""))
                result = launch_application(app_name)
            elif tool_name == "closeApplication":
                app_name = args.get("app_name", args.get("app", ""))
                result = close_application(app_name, user_confirmed=confirmed)
            elif tool_name == "focusApplication":
                app_name = args.get("app_name", args.get("app", ""))
                result = focus_application(app_name)
            elif tool_name == "detectApplication":
                app_name = args.get("app_name", args.get("app", ""))
                result = detect_application(app_name)

            # 2. Smart App Actions (WhatsApp, Chrome, YouTube)
            elif tool_name == "findContact":
                result = find_contact(args.get("query", args.get("name", "")))
            elif tool_name == "openConversation":
                result = open_conversation(args.get("contact_name", args.get("name", "")))
            elif tool_name == "prepareMessage":
                result = prepare_message(
                    args.get("contact_name", args.get("contact", "")),
                    args.get("message", args.get("text", ""))
                )
            elif tool_name == "sendMessage":
                result = send_prepared_message(
                    args.get("contact_name", args.get("contact", "")),
                    args.get("message", args.get("text", "")),
                    user_confirmed=confirmed
                )
            elif tool_name == "openChrome":
                result = open_chrome(args.get("url"))
            elif tool_name == "searchChrome":
                result = search_query(args.get("query", ""))
            elif tool_name == "openYouTube":
                result = open_youtube(args.get("query"))

            # 3. Device Status & Vitals
            elif tool_name == "getDeviceStatus":
                result = get_device_status()
            elif tool_name == "dailyBriefing":
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
                result = manage_wifi(action, args.get("ssid", ""), user_confirmed=confirmed)
            elif tool_name == "lockSystem":
                result = lock_system()

            # 4. Media Controls
            elif tool_name == "mediaControl":
                act = args.get("action", args.get("command", "play_pause"))
                result = control_media(act)

            # 5. PowerPoint & Presentations
            elif tool_name == "powerpointControl":
                slide = int(args.get("slide_number", 1))
                file_path = args.get("file_path", "")
                result = control_powerpoint(action, slide_number=slide, file_path=file_path)

            # 6. Vision & Screen Analysis
            elif tool_name == "visionAnalyze":
                if action == "read_text":
                    result = read_text_from_screen()
                else:
                    result = analyze_image(args.get("image_path", ""), args.get("prompt", ""))

            # 7. File Intelligence
            elif tool_name == "findFile":
                result = find_file(args.get("query", ""), folder_hint=args.get("folder", ""))
            elif tool_name == "findFolder":
                result = find_folder(args.get("query", ""))
            elif tool_name == "recentFiles":
                limit = int(args.get("limit", 5))
                result = recent_files(limit=limit, folder_hint=args.get("folder", "Downloads"))
            elif tool_name == "fileMetadata":
                result = file_metadata(args.get("path", args.get("file_path", "")))
            elif tool_name == "openFile":
                result = open_file(args.get("path", args.get("file_path", "")))
            elif tool_name == "organizeFiles":
                result = organize_files(
                    args.get("folder_path", args.get("path", "")),
                    category_mode=args.get("mode", "extension"),
                    user_confirmed=confirmed
                )
            elif tool_name == "fileSearch":
                if action == "list":
                    result = list_files(args.get("directory", ""))
                else:
                    result = search_files(args.get("query", ""))
            elif tool_name == "fileOperation":
                path = args.get("path", "")
                dest = args.get("dest_path", "")
                result = file_operation(action, path, dest_path=dest, user_confirmed=confirmed)

            # 8. Biometrics
            elif tool_name == "detectBiometric":
                result = detect_biometrics()
            elif tool_name == "startBiometricEnrollment":
                result = start_biometric_enrollment()

            # 9. Health & System Status
            elif tool_name == "systemHealth":
                result = check_system_health()

            # 10. Web Browser
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
