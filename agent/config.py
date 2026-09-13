"""
ANISA AI ULTRA - Local System Agent Configuration
Defines server parameters, allowed directories, and security policies.
"""
import os
from pathlib import Path

# Networking
HOST = "127.0.0.1"
PORT = 8765
TIMEOUT_SECONDS = 10

# Directory Boundaries (Least-Privilege Security)
USER_HOME = Path.home()
ALLOWED_DIRECTORIES = [
    str(USER_HOME / "Downloads"),
    str(USER_HOME / "Documents"),
    str(USER_HOME / "Desktop"),
    str(USER_HOME / "Pictures"),
    str(USER_HOME / "Videos"),
]

# Sensitive System Directories - Strictly Forbidden
FORBIDDEN_DIRECTORIES = [
    "/etc",
    "/var",
    "/bin",
    "/sbin",
    "/usr",
    "/root",
    "C:\\Windows",
    "C:\\Program Files",
    "C:\\Program Files (x86)",
    str(USER_HOME / ".ssh"),
    str(USER_HOME / ".gnupg"),
    str(USER_HOME / ".aws"),
]

# Security
REQUIRE_CONFIRMATION_FOR_DESTRUCTIVE = True
AUDIT_LOG_ENABLED = True
AUDIT_LOG_FILE = str(USER_HOME / ".anisa_audit.log")
MAX_PROCESS_LIMIT = 50
MAX_RECENT_FILES_LIMIT = 20
