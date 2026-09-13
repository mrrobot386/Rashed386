"""
ANISA AI - PowerPoint App Adapter
Integrates dedicated presentation mode and slide navigation.
"""
from typing import Dict, Any
from agent.powerpoint import control_powerpoint, get_presentation_status

def presentation_action(action: str, slide_number: int = 1, file_path: str = "") -> Dict[str, Any]:
    return control_powerpoint(action=action, slide_number=slide_number, file_path=file_path)

def presentation_status() -> Dict[str, Any]:
    return get_presentation_status()
