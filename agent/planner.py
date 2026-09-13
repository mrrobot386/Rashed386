"""
ANISA AI ULTRA - Multi-Step Task Planner
Plans, sequences, permission-checks, and executes multi-step system workflows.
"""
from typing import List, Dict, Any, Optional
from agent.permissions import get_permission_level, PermissionLevel
from agent.audit import log_audit_event

class TaskStep:
    def __init__(self, step_id: int, tool_name: str, action: str, args: Dict[str, Any]):
        self.step_id = step_id
        self.tool_name = tool_name
        self.action = action
        self.args = args
        self.permission_level = get_permission_level(tool_name, action)
        self.status = "pending"
        self.result: Optional[Dict[str, Any]] = None
        self.error: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "step_id": self.step_id,
            "tool_name": self.tool_name,
            "action": self.action,
            "args": self.args,
            "permission_level": self.permission_level.value,
            "status": self.status,
            "result": self.result,
            "error": self.error
        }

class MultiStepPlanner:
    """Manages multi-step compound system tasks."""

    @staticmethod
    def plan_compound_goal(goal: str) -> List[TaskStep]:
        text = goal.lower()
        steps: List[TaskStep] = []

        if "presentation" in text and ("start" in text or "slideshow" in text or "open" in text):
            # Step 1: Find recent presentation file
            steps.append(TaskStep(1, "findFile", "find", {"query": "presentation", "folder": "Downloads"}))
            # Step 2: Open presentation
            steps.append(TaskStep(2, "powerpointControl", "open", {"action": "open"}))
            # Step 3: Start slideshow
            steps.append(TaskStep(3, "powerpointControl", "start", {"action": "start"}))
        elif "briefing" in text:
            # Step 1: Check device status
            steps.append(TaskStep(1, "getDeviceStatus", "status", {}))
            # Step 2: Compile daily briefing
            steps.append(TaskStep(2, "dailyBriefing", "briefing", {}))

        return steps

    @staticmethod
    def execute_plan(steps: List[TaskStep], user_confirmed: bool = False) -> Dict[str, Any]:
        from agent.tool_registry import ToolRegistry
        results: List[Dict[str, Any]] = []

        for step in steps:
            # 1. Permission Gate
            if step.permission_level == PermissionLevel.RESTRICTED:
                step.status = "failed"
                step.error = "Step is restricted by security policy"
                return {
                    "success": False,
                    "halted_at_step": step.step_id,
                    "error": step.error,
                    "completed_steps": results
                }

            if step.permission_level == PermissionLevel.CONFIRMATION_REQUIRED and not user_confirmed:
                step.status = "waiting_confirmation"
                return {
                    "success": False,
                    "requires_confirmation": True,
                    "halted_at_step": step.step_id,
                    "message": f"Step {step.step_id} ({step.tool_name}) requires voice confirmation.",
                    "completed_steps": results
                }

            # 2. Execute Step
            step.status = "in_progress"
            merged_args = dict(step.args)
            merged_args["action"] = step.action
            merged_args["user_confirmed"] = user_confirmed

            step_res = ToolRegistry.dispatch(step.tool_name, merged_args, user_confirmed=user_confirmed)

            if step_res.get("success", False):
                step.status = "completed"
                step.result = step_res
                results.append(step_res)
            else:
                step.status = "failed"
                step.error = step_res.get("error", "Step execution failed")
                return {
                    "success": False,
                    "halted_at_step": step.step_id,
                    "error": f"Plan halted at step {step.step_id} ({step.tool_name}): {step.error}",
                    "completed_steps": results
                }

        return {
            "success": True,
            "steps_count": len(steps),
            "results": results
        }
