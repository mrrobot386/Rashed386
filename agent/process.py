"""
ANISA AI - Process Manager Tool
Safely checks active applications, lists user processes, and requests safe terminations.
"""
import psutil
from typing import Dict, Any, List
from agent.permissions import is_action_allowed

CRITICAL_SYSTEM_PROCESSES = {
    "system", "registry", "csrss.exe", "wininit.exe", "winlogon.exe", "services.exe",
    "lsass.exe", "svchost.exe", "init", "systemd", "kernel", "launchd"
}

def list_processes(limit: int = 15) -> Dict[str, Any]:
    procs = []
    for p in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
        try:
            info = p.info
            name = info.get('name')
            if name and name.lower() not in CRITICAL_SYSTEM_PROCESSES:
                procs.append({
                    "pid": info['pid'],
                    "name": name,
                    "cpu_percent": info.get('cpu_percent', 0.0),
                    "memory_percent": round(info.get('memory_percent', 0.0), 1)
                })
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue
    procs.sort(key=lambda x: x['cpu_percent'], reverse=True)
    return {
        "success": True,
        "tool": "listProcesses",
        "action": "list",
        "processes": procs[:limit],
        "total_active": len(procs),
        "message": f"Retrieved top {len(procs[:limit])} active applications."
    }

def check_process_running(name: str) -> Dict[str, Any]:
    target = name.strip().lower()
    matches = []
    for p in psutil.process_iter(['pid', 'name']):
        try:
            pname = p.info.get('name', '').lower()
            if target in pname:
                matches.append({"pid": p.info['pid'], "name": p.info['name']})
        except Exception:
            continue
    running = len(matches) > 0
    return {
        "success": True,
        "tool": "listProcesses",
        "action": "check",
        "query": name,
        "running": running,
        "instances": matches,
        "message": f"{name} is {'currently running' if running else 'not running'}."
    }

def terminate_process(name_or_pid: str, user_confirmed: bool = False) -> Dict[str, Any]:
    if not is_action_allowed("listProcesses", "terminate", user_confirmed):
        return {
            "success": False,
            "tool": "listProcesses",
            "action": "terminate",
            "confirmation_required": True,
            "error": f"Terminating '{name_or_pid}' requires explicit user confirmation."
        }

    terminated = []
    try:
        if name_or_pid.isdigit():
            pid = int(name_or_pid)
            p = psutil.Process(pid)
            if p.name().lower() in CRITICAL_SYSTEM_PROCESSES:
                return {"success": False, "error": "Cannot terminate critical operating system process."}
            p.terminate()
            terminated.append(p.name())
        else:
            target = name_or_pid.strip().lower()
            if target in CRITICAL_SYSTEM_PROCESSES:
                return {"success": False, "error": "Cannot terminate critical operating system process."}
            for p in psutil.process_iter(['pid', 'name']):
                try:
                    if target in p.info.get('name', '').lower():
                        p.terminate()
                        terminated.append(p.info['name'])
                except Exception:
                    continue
        return {
            "success": True,
            "tool": "listProcesses",
            "action": "terminate",
            "terminated": terminated,
            "message": f"Successfully closed {len(terminated)} instance(s) of {name_or_pid}."
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
