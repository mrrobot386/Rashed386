# ANISA AI — Real-Time Voice-to-Voice Personal AI Assistant

ANISA AI is a production-quality, real-time voice-to-voice personal AI assistant engineered with Gemini Live API, React, TypeScript, Web Audio API, and a secure local Python system agent.

## 1. Project Architecture

```text
                    ANISA AI
                       │
             ┌─────────┴─────────┐
             │                   │
       React Web UI        Android App
             │                   │
             └─────────┬─────────┘
                       │
                Gemini Live API
                       │
             Voice + Tool Dispatcher
                       │
          ┌────────────┴────────────┐
          │                         │
    Browser Tools             Local System Agent
          │                         │
   openWebsite              Secure Local API (:8765)
                                    │
        ┌───────────┬───────────┬────┴────┬───────────┐
        │           │           │         │           │
   briefing.py  process.py  network.py  lock.py   media.py
        │           │           │         │           │
        │           │           │         │           │
   enroll.py    detect.py    vision.py  file_op.py  powerpoint.py
```

## 2. Supported Spoken Languages

- **English**
- **Bengali (বাংলা)**
- **Hindi (हिंदी)**

Anisa automatically detects and speaks back in whichever language you use.

## 3. Installation & Requirements

### Node.js Requirements
- Node.js 18+ or 20+
- npm 9+

```bash
npm install
```

### Python Requirements
- Python 3.10+
- `psutil`

```bash
pip install psutil
```

## 4. Gemini API Key Setup

Configure your API key in `.env`:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

## 5. Starting the Application

### Start the React Frontend
```bash
npm run dev
```
Open `http://localhost:5173` in a modern browser (Chrome, Edge, Safari).

### Start the Python System Agent
```bash
python agent/main.py
```
The local agent runs at `http://127.0.0.1:8765` with session token security.

## 6. Security Model

- **No Arbitrary Execution**: Never executes arbitrary shell commands or unsanitized input.
- **Allowed Directories**: File operations are strictly restricted to `Desktop`, `Documents`, `Downloads`, `Pictures`, `Videos`, and `Music`.
- **Destructive Operation Protection**: Closing user processes or deleting files requires confirmation.
- **Privacy First**: Sensitive tokens, passwords, and private audio are never logged in audit files.

## 7. Available System Tools

1. `dailyBriefing`: Date, time, battery, CPU/RAM vitals, system overview.
2. `getActiveWindow`: Foreground application status.
3. `listProcesses`: User application monitoring and graceful closure.
4. `getNetworkStatus`: Wi-Fi name, connection state, signal.
5. `wifiManager`: Refresh and reconnect network.
6. `lockSystem`: Native OS workstation lock.
7. `mediaControl`: Play, pause, resume, next, previous, volume up/down, mute.
8. `detectBiometric`: Hardware biometric capability detection (Windows Hello, Touch ID).
9. `startBiometricEnrollment`: Directs to official OS security settings.
10. `powerpointControl`: Start presentation, next slide, previous slide, jump to slide, exit.
11. `visionAnalyze`: Visual interface and image explanation.
12. `fileSearch`: Search files within allowed user folders.
13. `fileOperation`: Safe copy, move, rename, and directory creation.
14. `openWebsite`: Opens verified HTTPS destinations.
