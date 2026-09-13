"""
ANISA AI - Google Chrome Application Adapter
"""
import urllib.parse
import webbrowser
from typing import Dict, Any

def open_chrome(url: str = None) -> Dict[str, Any]:
    target_url = url if url else "https://www.google.com"
    try:
        webbrowser.open(target_url)
        return {
            "success": True,
            "tool": "openChrome",
            "url": target_url,
            "message": f"Opened Chrome at {target_url}."
        }
    except Exception as e:
        return {"success": False, "error": f"Failed to open Chrome: {str(e)}"}

def search_query(query: str) -> Dict[str, Any]:
    if not query:
        return {"success": False, "error": "Search query cannot be empty."}
    encoded = urllib.parse.quote(query.strip())
    search_url = f"https://www.google.com/search?q={encoded}"
    try:
        webbrowser.open(search_url)
        return {
            "success": True,
            "tool": "searchChrome",
            "query": query,
            "message": f"Searching Google for '{query}'."
        }
    except Exception as e:
        return {"success": False, "error": f"Failed to execute search: {str(e)}"}
