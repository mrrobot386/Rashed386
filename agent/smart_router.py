"""
ANISA AI - Smart Tool Router
Manages intent routing, argument validation, permission tiers, and structured execution.
"""
from typing import Dict, Any, Tuple
from agent.permissions import get_permission_level, PermissionLevel, is_action_allowed
from agent.security import is_safe_url, is_path_allowed
from agent.audit import log_audit_event

class SmartToolRouter:
    """Central router for all ANISA AI system actions."""

    @staticmethod
    def route_and_execute(tool_name: str, args: Dict[str, Any], user_confirmed: bool = False) -> Dict[str, Any]:
        action_name = args.get("action", "default")
        level = get_permission_level(tool_name, action_name)

        # 1. Restricted check (Level 2)
        if level == PermissionLevel.RESTRICTED:
            log_audit_event(tool_name, False, {"action": action_name, "reason": "Restricted operation prohibited"})
            return {
                "success": False,
                "tool": tool_name,
                "error": "This action is restricted by ANISA AI security policy and cannot be executed.",
                "level": "RESTRICTED"
            }

        # 2. Confirmation check (Level 1)
        if level == PermissionLevel.CONFIRMATION_REQUIRED and not user_confirmed:
            return {
                "success": False,
                "requires_confirmation": True,
                "level": "CONFIRMATION_REQUIRED",
                "tool": tool_name,
                "action": action_name,
                "message": f"This action ({tool_name}:{action_name}) modifies system state or contacts. Please provide voice confirmation to proceed."
            }

        # 3. Dispatch to registered modules
        from agent.tool_registry import ToolRegistry
        result = ToolRegistry.dispatch(tool_name, args, user_confirmed=user_confirmed)

        # 4. Audit log
        log_audit_event(tool_name, result.get("success", False), {"action": action_name})
        return result
