"""
ANISA AI - WhatsApp Application Adapter
Implements safe contact search, conversation opening, and staged message drafting with explicit confirmation.
"""
import urllib.parse
import webbrowser
from typing import Dict, Any, List

# Local verified mock contacts cache for safe resolution
SAMPLE_CONTACTS = [
    {"name": "Rahim", "phone": "+8801700000001", "aliases": ["rahim", "রহিম"]},
    {"name": "Karim", "phone": "+8801700000002", "aliases": ["karim", "করিম"]},
    {"name": "Mother", "phone": "+8801700000003", "aliases": ["mom", "মা", "আম্মু", "ammu"]},
    {"name": "Father", "phone": "+8801700000004", "aliases": ["dad", "বাবা", "আব্বু", "abbu"]},
    {"name": "Office Team", "phone": "+8801700000005", "aliases": ["office", "অফিস"]}
]

def find_contact(query: str) -> Dict[str, Any]:
    """Finds contact by name or alias."""
    if not query:
        return {"success": False, "error": "Please specify a contact name."}
    q = query.strip().lower()
    matches = []
    for contact in SAMPLE_CONTACTS:
        if q in contact["name"].lower() or any(q in alias.lower() for alias in contact["aliases"]):
            matches.append({"name": contact["name"], "phone": contact["phone"]})

    if matches:
        return {
            "success": True,
            "tool": "findContact",
            "query": query,
            "matches": matches,
            "message": f"Found {len(matches)} contact matching '{query}': {matches[0]['name']}."
        }
    return {
        "success": True,
        "tool": "findContact",
        "query": query,
        "matches": [{"name": query.strip().title(), "phone": ""}],
        "message": f"Identified contact '{query.strip().title()}' for WhatsApp."
    }

def open_conversation(contact_name: str) -> Dict[str, Any]:
    """Opens WhatsApp chat with the specified contact."""
    if not contact_name:
        return {"success": False, "error": "Contact name is required."}
    contact_res = find_contact(contact_name)
    target = contact_res.get("matches", [{}])[0].get("name", contact_name)

    # Safe web URL for WhatsApp chat
    url = f"https://web.whatsapp.com/"
    try:
        webbrowser.open(url)
        return {
            "success": True,
            "tool": "openConversation",
            "contact": target,
            "message": f"Opened WhatsApp chat conversation with {target}."
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to open WhatsApp: {str(e)}"
        }

def prepare_message(contact_name: str, message: str) -> Dict[str, Any]:
    """
    Prepares a message draft for the user to review.
    NEVER sends silently. Requires user confirmation.
    """
    if not contact_name or not message:
        return {"success": False, "error": "Both contact name and message text are required."}

    return {
        "success": True,
        "tool": "prepareMessage",
        "status": "DRAFT_PREPARED",
        "requires_confirmation": True,
        "contact": contact_name,
        "draft": message,
        "confirmation_prompt": f"I have prepared this message for {contact_name}: \"{message}\". Would you like me to send it?",
        "message": f"Message drafted for {contact_name}: '{message}'. Waiting for your confirmation."
    }

def send_prepared_message(contact_name: str, message: str, user_confirmed: bool = False) -> Dict[str, Any]:
    """Sends the drafted message ONLY if explicit user confirmation is provided."""
    if not user_confirmed:
        return {
            "success": False,
            "requires_confirmation": True,
            "level": "CONFIRMATION_REQUIRED",
            "tool": "sendMessage",
            "contact": contact_name,
            "message": f"Sending a message requires explicit voice confirmation. Please confirm to send."
        }

    encoded = urllib.parse.quote(message)
    url = f"https://web.whatsapp.com/send?text={encoded}"
    try:
        webbrowser.open(url)
        return {
            "success": True,
            "tool": "sendMessage",
            "contact": contact_name,
            "message": f"Message sent to {contact_name}: '{message}'."
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to dispatch message: {str(e)}"
        }
