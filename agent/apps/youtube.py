"""
ANISA AI - YouTube Application Adapter
"""
import urllib.parse
import webbrowser
from typing import Dict, Any

def open_youtube(query: str = None) -> Dict[str, Any]:
    if query:
        encoded = urllib.parse.quote(query.strip())
        url = f"https://www.youtube.com/results?search_query={encoded}"
        msg = f"Opening YouTube search for '{query}'."
    else:
        url = "https://www.youtube.com"
        msg = "Opening YouTube."

    try:
        webbrowser.open(url)
        return {
            "success": True,
            "tool": "openYouTube",
            "url": url,
            "message": msg
        }
    except Exception as e:
        return {"success": False, "error": f"Failed to open YouTube: {str(e)}"}
