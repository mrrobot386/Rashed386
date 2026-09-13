"""
Unit tests for ANISA AI multi-step task planner.
"""
import unittest
from agent.planner import MultiStepPlanner, TaskStep

class TestMultiStepPlanner(unittest.TestCase):
    def test_planner_creates_presentation_steps(self):
        steps = MultiStepPlanner.plan_compound_goal("find my presentation and start slideshow")
        self.assertGreaterEqual(len(steps), 2)
        self.assertEqual(steps[0].tool_name, "findFile")
        self.assertTrue(any(s.tool_name == "powerpointControl" for s in steps))

    def test_planner_halts_on_unconfirmed_destructive_step(self):
        steps = [
            TaskStep(1, "findFile", "find", {"query": "notes"}),
            TaskStep(2, "fileOperation", "delete", {"path": "test.txt"})
        ]
        res = MultiStepPlanner.execute_plan(steps, user_confirmed=False)
        self.assertFalse(res["success"])
        self.assertTrue(res.get("requires_confirmation"))
        self.assertEqual(res["halted_at_step"], 2)

if __name__ == "__main__":
    unittest.main()
