"""
Unit tests for ANISA AI tool registry and dispatch.
"""
import unittest
from agent.tool_registry import ToolRegistry
from agent.smart_router import SmartToolRouter

class TestToolRegistry(unittest.TestCase):
    def test_tool_registry_contains_core_tools(self):
        tools = ToolRegistry.get_registered_tools()
        self.assertIn("launchApplication", tools)
        self.assertIn("closeApplication", tools)
        self.assertIn("getDeviceStatus", tools)
        self.assertIn("powerpointControl", tools)
        self.assertIn("mediaControl", tools)
        self.assertIn("findFile", tools)
        self.assertIn("dailyBriefing", tools)
        self.assertIn("lockSystem", tools)

    def test_unknown_tool_returns_error(self):
        res = ToolRegistry.dispatch("unknownToolXYZ", {})
        self.assertFalse(res["success"])
        self.assertIn("not registered", res["error"])

    def test_smart_router_blocks_unconfirmed_destructive_action(self):
        res = SmartToolRouter.route_and_execute(
            "fileOperation",
            {"action": "delete", "path": "somefile.txt"},
            user_confirmed=False
        )
        self.assertTrue(res.get("requires_confirmation"))
        self.assertEqual(res["level"], "CONFIRMATION_REQUIRED")

if __name__ == "__main__":
    unittest.main()
