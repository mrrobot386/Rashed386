"""
ANISA AI - PowerPoint & Presentation Control Tool
Automates slideshow navigation: start, next, previous, goto slide, and exit.
"""
from typing import Dict, Any

class PresentationState:
    active_presentation = "Quarterly_Strategy.pptx"
    slideshow_running = False
    current_slide = 1
    total_slides = 15

state = PresentationState()

def control_powerpoint(action: str, slide_number: int = 1, file_path: str = "") -> Dict[str, Any]:
    act = action.strip().lower()

    if act == "open":
        if file_path:
            state.active_presentation = file_path
        return {
            "success": True,
            "tool": "powerpointControl",
            "action": "open",
            "presentation": state.active_presentation,
            "message": f"Opened presentation: {state.active_presentation}"
        }
    elif act == "start":
        state.slideshow_running = True
        state.current_slide = 1
        return {
            "success": True,
            "tool": "powerpointControl",
            "action": "start",
            "current_slide": 1,
            "message": "Slideshow started from slide 1."
        }
    elif act == "next":
        if state.current_slide < state.total_slides:
            state.current_slide += 1
        return {
            "success": True,
            "tool": "powerpointControl",
            "action": "next",
            "current_slide": state.current_slide,
            "message": f"Advanced to slide {state.current_slide} of {state.total_slides}."
        }
    elif act == "previous":
        if state.current_slide > 1:
            state.current_slide -= 1
        return {
            "success": True,
            "tool": "powerpointControl",
            "action": "previous",
            "current_slide": state.current_slide,
            "message": f"Returned to slide {state.current_slide} of {state.total_slides}."
        }
    elif act == "goto":
        if 1 <= slide_number <= state.total_slides:
            state.current_slide = slide_number
            return {
                "success": True,
                "tool": "powerpointControl",
                "action": "goto",
                "current_slide": state.current_slide,
                "message": f"Navigated directly to slide {state.current_slide}."
            }
        return {"success": False, "error": f"Slide {slide_number} is out of bounds (1-{state.total_slides})."}
    elif act == "exit":
        state.slideshow_running = False
        return {
            "success": True,
            "tool": "powerpointControl",
            "action": "exit",
            "message": "Slideshow ended."
        }
    elif act == "status":
        return {
            "success": True,
            "tool": "powerpointControl",
            "presentation": state.active_presentation,
            "slideshow_running": state.slideshow_running,
            "current_slide": state.current_slide,
            "total_slides": state.total_slides,
            "message": f"Presentation '{state.active_presentation}' is active on slide {state.current_slide}."
        }

    return {"success": False, "error": f"Unknown PowerPoint action '{action}'"}
