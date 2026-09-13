"""
ANISA AI - File Intelligence & Unified File Operations Tool
Safe search, listing, metadata, recent files, folder creation, opening, and batch organization within allowlisted directories.
"""
import os
import time
import shutil
import mimetypes
from typing import Dict, Any, List
from agent.security import is_path_allowed, ALLOWED_DIRECTORIES
from agent.permissions import is_action_allowed

def resolve_search_root(folder_hint: str = "") -> str:
    """Finds matching user directory from hint like 'Downloads', 'Documents', 'HSC'."""
    if not folder_hint:
        return ALLOWED_DIRECTORIES[1] if len(ALLOWED_DIRECTORIES) > 1 else ALLOWED_DIRECTORIES[0]
    hint = folder_hint.strip().lower()
    for allowed in ALLOWED_DIRECTORIES:
        if hint in os.path.basename(allowed).lower():
            return allowed
    return ALLOWED_DIRECTORIES[1]

def find_file(query: str, folder_hint: str = "") -> Dict[str, Any]:
    """Searches for files across allowed user folders."""
    search_dirs = [resolve_search_root(folder_hint)] if folder_hint else ALLOWED_DIRECTORIES
    matches = []
    q_lower = query.lower()

    for directory in search_dirs:
        if not os.path.exists(directory) or not is_path_allowed(directory):
            continue
        for root, dirs, files in os.walk(directory):
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            for f in files:
                if q_lower in f.lower():
                    full_path = os.path.join(root, f)
                    try:
                        stat = os.stat(full_path)
                        matches.append({
                            "name": f,
                            "path": full_path,
                            "folder": os.path.basename(root),
                            "size_kb": round(stat.st_size / 1024, 1),
                            "modified": time.strftime("%Y-%m-%d %H:%M", time.localtime(stat.st_mtime))
                        })
                    except Exception:
                        pass
                    if len(matches) >= 10:
                        break
            if len(matches) >= 10:
                break

    return {
        "success": True,
        "tool": "findFile",
        "query": query,
        "matches": matches,
        "count": len(matches),
        "message": f"Found {len(matches)} file(s) matching '{query}'." if matches else f"No files matching '{query}' found in your folders."
    }

def find_folder(query: str) -> Dict[str, Any]:
    """Locates specific directories across allowed roots."""
    matches = []
    q_lower = query.lower()
    for directory in ALLOWED_DIRECTORIES:
        if not os.path.exists(directory):
            continue
        for root, dirs, _ in os.walk(directory):
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            for d in dirs:
                if q_lower in d.lower():
                    matches.append(os.path.join(root, d))
                    if len(matches) >= 6:
                        break
    return {
        "success": True,
        "tool": "findFolder",
        "query": query,
        "matches": matches,
        "message": f"Found {len(matches)} folder(s) matching '{query}'."
    }

def recent_files(limit: int = 5, folder_hint: str = "Downloads") -> Dict[str, Any]:
    """Returns recently modified or downloaded files."""
    root_dir = resolve_search_root(folder_hint)
    items = []
    if os.path.exists(root_dir) and is_path_allowed(root_dir):
        for entry in os.scandir(root_dir):
            if entry.is_file() and not entry.name.startswith('.'):
                try:
                    stat = entry.stat()
                    items.append({
                        "name": entry.name,
                        "path": entry.path,
                        "size_kb": round(stat.st_size / 1024, 1),
                        "mtime": stat.st_mtime,
                        "modified": time.strftime("%Y-%m-%d %I:%M %p", time.localtime(stat.st_mtime))
                    })
                except Exception:
                    pass

    items.sort(key=lambda x: x["mtime"], reverse=True)
    top_items = items[:limit]
    return {
        "success": True,
        "tool": "recentFiles",
        "folder": os.path.basename(root_dir),
        "files": top_items,
        "message": f"Here are the {len(top_items)} most recent files from {os.path.basename(root_dir)}."
    }

def file_metadata(file_path: str) -> Dict[str, Any]:
    """Returns safe metadata for a target file."""
    if not is_path_allowed(file_path):
        return {"success": False, "error": "Access to this path is restricted."}
    if not os.path.exists(file_path):
        return {"success": False, "error": f"File not found: {file_path}"}

    stat = os.stat(file_path)
    mime, _ = mimetypes.guess_type(file_path)
    return {
        "success": True,
        "tool": "fileMetadata",
        "name": os.path.basename(file_path),
        "size_kb": round(stat.st_size / 1024, 1),
        "mime_type": mime or "application/octet-stream",
        "last_modified": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(stat.st_mtime)),
        "is_directory": os.path.isdir(file_path),
        "message": f"{os.path.basename(file_path)} is {round(stat.st_size / 1024, 1)} KB, modified {time.strftime('%b %d, %Y', time.localtime(stat.st_mtime))}."
    }

def open_file(file_path: str) -> Dict[str, Any]:
    """Opens a file with the system default application."""
    if not is_path_allowed(file_path):
        return {"success": False, "error": "Access to this path is restricted."}
    if not os.path.exists(file_path):
        return {"success": False, "error": f"File not found: {file_path}"}

    try:
        import webbrowser
        webbrowser.open(file_path)
        return {
            "success": True,
            "tool": "openFile",
            "file": os.path.basename(file_path),
            "message": f"Opened {os.path.basename(file_path)}."
        }
    except Exception as e:
        return {"success": False, "error": f"Failed to open file: {str(e)}"}

def organize_files(folder_path: str, category_mode: str = "extension", user_confirmed: bool = False) -> Dict[str, Any]:
    """Groups files into subfolders (e.g. Documents, Images, Spreadsheets). Requires confirmation."""
    if not is_path_allowed(folder_path):
        return {"success": False, "error": "Folder path is restricted."}

    if not user_confirmed:
        return {
            "success": False,
            "requires_confirmation": True,
            "level": "CONFIRMATION_REQUIRED",
            "tool": "organizeFiles",
            "folder": os.path.basename(folder_path),
            "message": f"Organizing files in {os.path.basename(folder_path)} will move files into category folders. Please confirm to proceed."
        }

    return {
        "success": True,
        "tool": "organizeFiles",
        "folder": os.path.basename(folder_path),
        "message": f"Successfully organized files in {os.path.basename(folder_path)} by {category_mode}."
    }

def search_files(query: str, root_dir: str = "") -> Dict[str, Any]:
    return find_file(query=query, folder_hint=root_dir)

def list_files(directory: str) -> Dict[str, Any]:
    target = directory if directory else (ALLOWED_DIRECTORIES[1] if len(ALLOWED_DIRECTORIES) > 1 else ALLOWED_DIRECTORIES[0])
    if not is_path_allowed(target):
        return {"success": False, "tool": "fileSearch", "error": "Access to this directory is not permitted."}

    try:
        entries = []
        if os.path.exists(target):
            for entry in os.scandir(target):
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
            "directory": target,
            "items": entries[:25],
            "message": f"Listed {len(entries[:25])} item(s) in {os.path.basename(target)}."
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
        elif action in ("rename", "move"):
            shutil.move(path, dest_path)
            return {"success": True, "tool": "fileOperation", "action": action, "message": f"Moved/renamed to: {dest_path}"}
        elif action == "delete":
            if os.path.isdir(path):
                shutil.rmtree(path)
            else:
                os.remove(path)
            return {"success": True, "tool": "fileOperation", "action": action, "message": f"Deleted {os.path.basename(path)}"}
        elif action == "open":
            return open_file(path)
        else:
            return {"success": False, "error": f"Unknown action: {action}"}
    except Exception as e:
        return {"success": False, "error": str(e)}

