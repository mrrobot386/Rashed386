"""
Unit tests for ANISA AI system agent security policies.
"""
import unittest
from agent.permissions import get_permission_level, PermissionLevel
from agent.security import is_safe_url, is_path_allowed

class TestAgentSecurity(unittest.TestCase):
    def test_safe_tools_permission_level(self):
        self.assertEqual(get_permission_level("getDeviceStatus", "default"), PermissionLevel.SAFE)
        self.assertEqual(get_permission_level("dailyBriefing", "default"), PermissionLevel.SAFE)
        self.assertEqual(get_permission_level("mediaControl", "pause"), PermissionLevel.SAFE)
        self.assertEqual(get_permission_level("findFile", "find"), PermissionLevel.SAFE)

    def test_destructive_actions_require_confirmation(self):
        self.assertEqual(get_permission_level("fileOperation", "delete"), PermissionLevel.CONFIRMATION_REQUIRED)
        self.assertEqual(get_permission_level("listProcesses", "terminate"), PermissionLevel.CONFIRMATION_REQUIRED)
        self.assertEqual(get_permission_level("sendMessage", "send"), PermissionLevel.CONFIRMATION_REQUIRED)

    def test_safe_urls(self):
        self.assertTrue(is_safe_url("https://www.youtube.com"))
        self.assertTrue(is_safe_url("http://localhost:8765"))
        self.assertFalse(is_safe_url("javascript:alert(1)"))
        self.assertFalse(is_safe_url("file:///etc/passwd"))
        self.assertFalse(is_safe_url("data:text/html,abc"))

    def test_prohibited_paths(self):
        self.assertFalse(is_path_allowed("/etc/shadow"))
        self.assertFalse(is_path_allowed("C:\\Windows\\System32"))

if __name__ == "__main__":
    unittest.main()
