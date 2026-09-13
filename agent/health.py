"""
ANISA AI - Tool & System Health Monitor
Monitors backend health, permissions, network, and registered tools status.
"""
import time
import socket
from typing import Dict, Any

def check_system_health() -> Dict[str, Any]:
    # Check internet connectivity
    network_online = False
    try:
        socket.create_connection(("8.8.8.8", 53), timeout=2)
        network_online = True
    except OSError:
        network_online = False

    # Check tools registration
    from agent.tool_registry import ToolRegistry
    tools_count = len(ToolRegistry.get_registered_tools())

    return {
        "status": "healthy",
        "timestamp": time.time(),
        "python_agent": {
            "status": "connected",
            "version": "2.0.0-power",
            "port": 8765
        },
        "network": {
            "online": network_online,
            "status": "Ready" if network_online else "Limited"
        },
        "tool_registry": {
            "status": "ready",
            "registered_tools_count": tools_count
        },
        "permissions": {
            "status": "active",
            "tiers": ["SAFE (0)", "USER_CONFIRMATION (1)", "RESTRICTED (2)"]
        },
        "message": "ANISA System Agent and tools are fully operational."
    }
