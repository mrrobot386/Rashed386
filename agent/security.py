"""
ANISA AI - Security Module
Validates inputs, file paths, URLs, and protects against unauthorized command execution.
"""
import os
import re
from pathlib import Path
from typing import List

# Permitted directory roots for file operations
ALLOWED_DIRECTORIES = [
    os.path.expanduser("~/Desktop"),
    os.path.expanduser("~/Documents"),
    os.path.expanduser("~/Downloads"),
    os.path.expanduser("~/Pictures"),
    os.path.expanduser("~/Videos"),
    os.path.expanduser("~/Music")
]

# Sensitive patterns that must never be accessed or exposed
RESTRICTED_PATTERNS = [
    r"\.ssh",
    r"\.aws",
    r"\.gnupg",
    r"\.gitconfig",
    r"id_rsa",
    r"credentials",
    r"password",
    r"secrets?",
    r"\.env",
    r"keychain",
    r"sam\.dat",
    r"system32"
]

SAFE_URL_REGEX = re.compile(
    r"^(https:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?)(?:\/[^\s]*)?$",
    re.IGNORECASE
)

FORBIDDEN_PROTOCOLS = ["javascript:", "data:", "file:", "vbscript:", "blob:"]

def is_safe_url(url: str) -> bool:
    """Validates URL for openWebsite tool."""
    if not url or not isinstance(url, str):
        return False
    lower_url = url.strip().lower()
    for proto in FORBIDDEN_PROTOCOLS:
        if lower_url.startswith(proto):
            return False
    return bool(SAFE_URL_REGEX.match(url.strip()))

def is_path_allowed(target_path: str) -> bool:
    """Verifies that the target path resolves inside an allowed directory."""
    try:
        resolved = Path(target_path).expanduser().resolve()
        # Check against restricted substrings
        for pattern in RESTRICTED_PATTERNS:
            if re.search(pattern, str(resolved), re.IGNORECASE):
                return False
        # Must be within one of the allowed directories
        for allowed in ALLOWED_DIRECTORIES:
            allowed_resolved = Path(allowed).expanduser().resolve()
            if resolved == allowed_resolved or allowed_resolved in resolved.parents:
                return True
        return False
    except Exception:
        return False

def sanitize_command_arg(arg: str) -> str:
    """Removes shell metacharacters to avoid injection."""
    return re.sub(r'[;&|`$><!]', '', arg)
