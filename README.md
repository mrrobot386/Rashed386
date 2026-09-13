# ANISA AI ULTRA — REAL-TIME VOICE-TO-VOICE PERSONAL AI OPERATING LAYER

ANISA AI ULTRA is a production-grade, real-time voice-to-voice personal AI assistant engineered with the Gemini Live API, React, TypeScript, Web Audio API (16kHz PCM), and an extensible, zero-arbitrary-shell local Python system agent.

---

## 1. Architecture

```text
User Speech (Bengali, English, Hindi, Banglish, Hinglish)
     │
     ▼
Audio Engine (16kHz PCM / AudioWorklet / Web Audio API)
     │
     ▼
Gemini Live WebSocket (gemini-2.5-flash / gemini-3.1-flash-live-preview)
     │
     ├─► Live Audio Stream (24kHz PCM Aoede Voice) ──► AudioContext Output Queue
     │
     └─► Tool Call Requests (33 Registered Tools)
              │
              ▼
       ToolDispatcher / IntentEngine / ReasoningEngine
              │
       ┌──────┴──────────────────────────┐
       ▼                                 ▼
Browser Safe Tools              Local Python Agent
(openWebsite, search, etc.)     (http://127.0.0.1:8765)
                                         │
                                         ▼
                                  SmartToolRouter
                                         │
                                  Permission Gate
                         (SAFE / CONFIRMATION / RESTRICTED)
                                         │
                                ┌────────┴────────┐
                                ▼                 ▼
                         App Adapters      System Modules
                         (WhatsApp, etc.)  (Vitals, Files, Media, PPT)
```

---

## 2. Prerequisites & Installation

### 3. Node Version
- Node.js 18.x or 20.x+
- npm or yarn

### 4. Python Version
- Python 3.10+
- Optional packages: `psutil` (for live hardware vitals)

---

## 5. Gemini Setup
ANISA AI ULTRA connects directly to the official Gemini Multimodal Live API using bidirectional WebSocket streaming.
1. Get an API key from Google AI Studio (https://aistudio.google.com).
2. Configure it in `.env` (or via the AI Studio Secrets panel).

---

## 6. Environment Variables
Create a `.env` file in the root directory (based on `.env.example`):
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
ANISA_AGENT_URL=http://127.0.0.1:8765
ANISA_AGENT_TOKEN=optional_secret_token
```

---

## 7. React Startup
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 8. Python Agent Startup
```bash
python3 -m agent.main
```
The agent starts on `http://127.0.0.1:8765`.

---

## 9. Microphone Permissions
- ANISA follows the strict rule: **Never request microphone permission automatically on page load.**
- Click the glowing central microphone button to grant access.
- Audio is captured at native rates and resampled to single-channel 16kHz PCM.

---

## 10. System Permissions & Confirmation Model
The execution engine enforces a 3-tier permission hierarchy:
- **SAFE**: Immediate execution (e.g. check status, pause music, find presentation, daily briefing).
- **CONFIRMATION_REQUIRED**: Sensitive actions (e.g. file deletion, terminate app, send WhatsApp message, connect Wi-Fi). ANISA requires explicit voice or UI approval.
- **RESTRICTED**: Prohibited operations (e.g. arbitrary shell code, accessing `.ssh`, `.env`, passwords, system registry).

---

## 11. Supported Platforms
- **Frontend**: Google Chrome, Microsoft Edge, Brave, Android Chrome, and modern Chromium-based browsers.
- **System Agent**: Linux (Ubuntu, Debian, Fedora, Arch), macOS, Windows 10/11.

---

## 12. Tool Architecture (33 Registered Tools)
All tools adhere to strict schemas. No arbitrary shell execution is permitted:
1. `launchApplication` — Launch approved desktop applications.
2. `closeApplication` — Terminate running processes (confirmation required).
3. `detectApplication` — Check if an app is installed or running.
4. `listProcesses` — Inspect active tasks and resource usage.
5. `focusWindow` — Bring an app window to foreground.
6. `minimizeWindow` — Minimize window.
7. `maximizeWindow` — Maximize window.
8. `findFile` — Search files by name, type, or query.
9. `findFolder` — Locate specific directories.
10. `recentFiles` — Fetch recently modified files.
11. `openFile` — Open files with default system viewers.
12. `fileMetadata` — File attributes, sizes, and timestamps.
13. `fileOperation` — Safe copy, move, rename, delete (confirm required).
14. `organizeFiles` — Batch file organization.
15. `getDeviceStatus` — Live battery, CPU, RAM, disk vitals.
16. `getNetworkStatus` — Wi-Fi connection, IP, latency.
17. `wifiManager` — Scan and connect to networks.
18. `bluetoothManager` — List paired devices and state.
19. `volumeControl` — Set volume and mute states.
20. `brightnessControl` — Display brightness management.
21. `batteryStatus` — Battery health and charging telemetry.
22. `lockSystem` — Immediate workstation locking.
23. `powerpointControl` — Presentation slideshow navigation.
24. `mediaControl` — Play, pause, next, previous track.
25. `findContact` — Locate WhatsApp or system contacts.
26. `openConversation` — Open chat thread.
27. `prepareMessage` — Stage drafted message.
28. `sendMessage` — Send drafted message with confirmation.
29. `dailyBriefing` — Aggregate morning summary and news.
30. `visionAnalyze` — Inspect user-approved screen frames.
31. `openWebsite` — Open safe web URLs.
32. `searchChrome` — Google search in browser.
33. `openYouTube` — Direct YouTube playback or search.

---

## 13. Security Model
- **Zero Arbitrary Shell Execution**: Every action routes to an explicit adapter function.
- **Strict Blacklists**: Metacharacters (`;`, `&`, `|`, `` ` ``, `$`) and dangerous commands are filtered.
- **Localhost Boundary**: Python server binds strictly to `127.0.0.1`.
- **Credential Protection**: Strict refusal to read, store, or remember passwords, API keys, or tokens.

---

## 14. Memory System
- Manages user preferences (preferred language, response length, approved directories).
- Safe storage using structured local persistence.
- Rejection of credentials, passwords, or tokens.
- Complete user control: "Clear Memory" or forget individual items anytime via the Settings modal.

---

## 15. Planning System (`TaskPlanner` & `ReasoningEngine`)
- Multi-step task decomposition (e.g. "Find my latest presentation and start it").
- Step sequencing: Search files -> Validate path -> Open PowerPoint -> Start slideshow -> Verify -> Respond.
- Failure resilience: If any intermediate step fails, halts subsequent steps and reports the exact cause.

---

## 16. Adding New Tools
1. Define the tool schema in `src/types/tools.ts` and `src/live/toolDeclarations.ts`.
2. Implement frontend dispatch in `src/live/toolDispatcher.ts`.
3. Register the handler in Python agent `agent/tool_registry.py` and specify permission level in `agent/permissions.py`.

---

## 17. Adding New Application Adapters
1. Create a new adapter file in `agent/apps/<app_name>.py` inheriting or following standard adapter patterns.
2. Implement `launch()`, `focus()`, `is_running()`, `close()`.
3. Register in `agent/apps/__init__.py`.

---

## 18. Allowed Directories
Operations are strictly confined to:
- `~/Desktop`
- `~/Documents`
- `~/Downloads`
- `~/Pictures`
- `~/Videos`
- `~/Music`

System paths (`/etc`, `/var`, `C:\Windows`, `C:\Program Files`, `.ssh`, `.env`) are blocked by `agent/security.py`.

---

## 19. Troubleshooting
- **Mic Not Working**: Check browser site permissions and ensure microphone is plugged in.
- **Agent Shows Offline**: Ensure `python3 -m agent.main` is running on port 8765 and no firewall is blocking localhost.
- **Gemini Session Dropped**: Click the "Reconnect" button in Settings or toggle the mic button.

---

## 20. Limitations
- System agent controls local desktop features and requires local Python runtime execution.
- Sensitive actions require explicit voice or UI confirmation and cannot be bypassed.
