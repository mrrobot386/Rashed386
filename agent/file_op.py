"""
ANISA AI - Unified File Operations Tool
Performs safe file search, listing, directory creation, copying, and moves within allowlisted directories.
Destructive operations (delete, move) require explicit confirmation.
"""
import os
import shutil
from typing import Dict, Any, List
from agent.security import is_path_allowed, ALLOWED_DIRECTORIES
from agent.permissions import is_action_allowed

def search_files(query: str, root_dir: str = "") -> Dict[str, Any]:
    target_dir = root_dir if root_dir else ALLOWED_DIRECTORIES[0]
    if not is_path_allowed(target_dir):
        return {"success": False, "tool": "fileSearch", "error": "Directory is outside allowed user paths."}

    matches = []
    q_lower = query.lower()
    for root, dirs, files in os.walk(target_dir):
        # Skip hidden folders
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        for f in files:
            if q_lower in f.lower():
                matches.append(os.path.join(root, f))
                if len(matches) >= 10:
                    break
        if len(matches) >= 10:
            break

    return {
        "success": True,
        "tool": "fileSearch",
        "query": query,
        "matches": matches,
        "count": len(matches),
        "message": f"Found {len(matches)} matching file(s) for '{query}'."
    }

def list_files(directory: str) -> Dict[str, Any]:
    if not is_path_allowed(directory):
        return {"success": False, "tool": "fileSearch", "error": "Access to this directory is not permitted."}

    try:
        entries = []
        for entry in os.scandir(directory):
            if not entry.name.startswith('.'):
                entries.append({
                    "name": entry.name,
                    "is_dir": entry.is_dir(),
                    "size": entry.stat().st_size if entry.is_file() else 0
                })
        return {
            "success": True,
            "tool": "fileSearch",
            "action": "list",
            "directory": directory,
            "items": entries[:25],
            "message": f"Listed {len(entries[:25])} item(s) in {os.path.basename(directory)}."
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

def file_operation(action: str, path: str, dest_path: str = "", user_confirmed: bool = False) -> Dict[str, Any]:
    if not is_path_allowed(path):
        return {"success": False, "tool": "fileOperation", "error": "Target path is restricted."}
    if dest_path and not is_path_allowed(dest_path):
        return {"success": False, "tool": "fileOperation", "error": "Destination path is restricted."}

    if not is_action_allowed("fileOperation", action, user_confirmed):
        return {
            "success": False,
            "tool": "fileOperation",
            "action": action,
            "confirmation_required": True,
            "error": f"File action '{action}' on '{os.path.basename(path)}' requires user confirmation."
        }

    try:
        if action == "create_folder":
            os.makedirs(path, exist_ok=True)
            return {"success": True, "tool": "fileOperation", "action": action, "message": f"Created directory: {path}"}
        elif action == "copy":
            if os.path.isdir(path):
                shutil.copytree(path, dest_path)
            else:
                shutil.copy2(path, dest_path)
            return {"success": True, "tool": "fileOperation", "action": action, "message": f"Copied to: {dest_path}"}
        elif action == "rename" or action == "move":
            shutil.move(path, dest_path)
            return {"success": True, "tool": "fileOperation", "action": action, "message": f"Moved/renamed to: {dest_path}"}
        elif action == "delete":
            # Safety: send to trash if send2trash available or remove if confirmed
            if os.path.isdir(path):
                shutil.rmtree(path)
            else:
                os.remove(path)
            return {"success": True, "tool": "fileOperation", "action": action, "message": f"Deleted {os.path.basename(path)}"}
        elif action == "open":
            import webbrowser
            webbrowser.open(path)
            return {"success": True, "tool": "fileOperation", "action": action, "message": f"Opened {os.path.basename(path)}"}
        return {"success": False, "error": f"Unknown action '{action}'"}
    except Exception as e:
        return {"success": False, "error": str(e)}
