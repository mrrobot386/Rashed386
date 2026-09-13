"""
ANISA AI - Audit Logger
Safe logging without persisting sensitive data, credentials, or audio.
"""
import time
import json
import logging
from typing import Dict, Any, Optional

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("anisa_audit")

AUDIT_ENABLED = True

def set_audit_enabled(enabled: bool):
    global AUDIT_ENABLED
    AUDIT_ENABLED = enabled

def log_tool_invocation(tool: str, action: str, success: bool, metadata: Optional[Dict[str, Any]] = None):
    """
    Logs an audit event safely without secrets, credentials, or personal audio.
    """
    if not AUDIT_ENABLED:
        return

    safe_metadata = {}
    if metadata:
        # Filter out sensitive fields
        for k, v in metadata.items():
            if k.lower() in ["password", "key", "token", "secret", "audio", "auth", "image"]:
                safe_metadata[k] = "[REDACTED]"
            else:
                safe_metadata[k] = str(v)[:100]  # truncate length

    event = {
        "timestamp": time.time(),
        "tool": tool,
        "action": action,
        "success": success,
        "metadata": safe_metadata
    }
    logger.info("AUDIT_EVENT: %s", json.dumps(event))
