/**
 * Registered Tool Declarations for Gemini Live - ANISA AI Power Mode
 */
export const ANISA_TOOLS = [
  {
    functionDeclarations: [
      // 1. Application Launcher
      {
        name: 'launchApplication',
        description: 'Launches an approved application like WhatsApp, Chrome, YouTube, PowerPoint, VS Code, Calculator, Notes, or Terminal based on natural commands in Bengali, English, or Hindi (e.g. "WhatsApp খুলে দাও", "Open Chrome").',
        parameters: {
          type: 'OBJECT',
          properties: {
            app_name: {
              type: 'STRING',
              description: 'The application name, e.g. "whatsapp", "chrome", "youtube", "powerpoint", "vscode", "calculator", "notes", "terminal"',
            },
          },
          required: ['app_name'],
        },
      },
      {
        name: 'closeApplication',
        description: 'Safely closes an approved running application. Requires user confirmation.',
        parameters: {
          type: 'OBJECT',
          properties: {
            app_name: {
              type: 'STRING',
              description: 'Name of the application to close',
            },
            user_confirmed: {
              type: 'BOOLEAN',
              description: 'True if user gave explicit voice confirmation to close the app',
            },
          },
          required: ['app_name'],
        },
      },
      {
        name: 'focusApplication',
        description: 'Brings an application to the foreground or switches to it (e.g. "Switch to PowerPoint").',
        parameters: {
          type: 'OBJECT',
          properties: {
            app_name: {
              type: 'STRING',
              description: 'Name of the application to focus',
            },
          },
          required: ['app_name'],
        },
      },
      {
        name: 'detectApplication',
        description: 'Checks if an application is installed or currently running (e.g. "Is Chrome running?").',
        parameters: {
          type: 'OBJECT',
          properties: {
            app_name: {
              type: 'STRING',
              description: 'Name of the application to check',
            },
          },
          required: ['app_name'],
        },
      },

      // 2. Contacts & Messaging (WhatsApp)
      {
        name: 'findContact',
        description: 'Searches for a contact by name or alias (e.g. "Find Rahim", "রহিমকে খোঁজো").',
        parameters: {
          type: 'OBJECT',
          properties: {
            query: {
              type: 'STRING',
              description: 'Name or alias of the contact',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'openConversation',
        description: 'Opens a WhatsApp chat conversation with a specific contact (e.g. "Rahim-এর WhatsApp chat খুলে দাও").',
        parameters: {
          type: 'OBJECT',
          properties: {
            contact_name: {
              type: 'STRING',
              description: 'Name of the contact',
            },
          },
          required: ['contact_name'],
        },
      },
      {
        name: 'prepareMessage',
        description: 'Prepares and drafts a message for a contact. NEVER sends silently; stages the draft for voice confirmation (e.g. "Prepare a message saying I will call later").',
        parameters: {
          type: 'OBJECT',
          properties: {
            contact_name: {
              type: 'STRING',
              description: 'Name of the recipient',
            },
            message: {
              type: 'STRING',
              description: 'The drafted message body',
            },
          },
          required: ['contact_name', 'message'],
        },
      },
      {
        name: 'sendMessage',
        description: 'Sends the prepared message ONLY after the user explicitly confirms (e.g. "Yes send it", "হ্যাঁ পাঠিয়ে দাও").',
        parameters: {
          type: 'OBJECT',
          properties: {
            contact_name: {
              type: 'STRING',
              description: 'Name of the recipient',
            },
            message: {
              type: 'STRING',
              description: 'The message body',
            },
            user_confirmed: {
              type: 'BOOLEAN',
              description: 'True if user confirmed sending',
            },
          },
          required: ['contact_name', 'message', 'user_confirmed'],
        },
      },

      // 3. Web & App Shortcuts
      {
        name: 'openChrome',
        description: 'Opens Google Chrome to a specific website or blank page (e.g. "Chrome চালু করো").',
        parameters: {
          type: 'OBJECT',
          properties: {
            url: {
              type: 'STRING',
              description: 'Optional URL to open',
            },
          },
        },
      },
      {
        name: 'searchChrome',
        description: 'Searches Google for a query (e.g. "Search for latest AI news").',
        parameters: {
          type: 'OBJECT',
          properties: {
            query: {
              type: 'STRING',
              description: 'Search query',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'openYouTube',
        description: 'Opens YouTube or searches YouTube for videos (e.g. "YouTube open করো", "Play lo-fi on YouTube").',
        parameters: {
          type: 'OBJECT',
          properties: {
            query: {
              type: 'STRING',
              description: 'Search query or song title',
            },
          },
        },
      },
      {
        name: 'openWebsite',
        description: 'Opens a validated HTTPS website in the user browser.',
        parameters: {
          type: 'OBJECT',
          properties: {
            url: {
              type: 'STRING',
              description: 'The secure HTTPS URL to open, e.g. https://www.youtube.com',
            },
          },
          required: ['url'],
        },
      },

      // 4. Device Status & Vitals
      {
        name: 'getDeviceStatus',
        description: 'Checks detailed device health: battery level, charging status, CPU usage, memory usage, storage, uptime, network, and active app (e.g. "Check my device status", "ব্যাটারি কত?").',
        parameters: {
          type: 'OBJECT',
          properties: {},
        },
      },
      {
        name: 'dailyBriefing',
        description: 'Compiles morning or daily briefing: date, time, battery, CPU/RAM, and system overview.',
        parameters: {
          type: 'OBJECT',
          properties: {},
        },
      },
      {
        name: 'getActiveWindow',
        description: 'Gets information about the currently active foreground window or application.',
        parameters: {
          type: 'OBJECT',
          properties: {},
        },
      },
      {
        name: 'listProcesses',
        description: 'Lists running user applications or checks if a specific app is running.',
        parameters: {
          type: 'OBJECT',
          properties: {
            action: {
              type: 'STRING',
              description: "'list', 'check', or 'terminate'",
            },
            target: {
              type: 'STRING',
              description: 'Name of the process',
            },
            user_confirmed: {
              type: 'BOOLEAN',
              description: 'Whether user confirmed terminating',
            },
          },
        },
      },
      {
        name: 'getNetworkStatus',
        description: 'Retrieves network status and connected Wi-Fi SSID name (e.g. "What is my Wi-Fi status?").',
        parameters: {
          type: 'OBJECT',
          properties: {},
        },
      },
      {
        name: 'wifiManager',
        description: 'Manages Wi-Fi: status, available networks, reconnect, or disconnect.',
        parameters: {
          type: 'OBJECT',
          properties: {
            action: {
              type: 'STRING',
              description: "'status', 'list', 'reconnect', or 'disconnect'",
            },
          },
          required: ['action'],
        },
      },
      {
        name: 'lockSystem',
        description: 'Locks the computer screen using native OS lock mechanism (e.g. "Lock my computer", "কম্পিউটার লক করো").',
        parameters: {
          type: 'OBJECT',
          properties: {},
        },
      },

      // 5. Media Control
      {
        name: 'mediaControl',
        description: 'Controls universal audio/media playback: play, pause, next, previous, volume up, volume down, mute, or unmute (e.g. "music pause করো", "next song", "volume up").',
        parameters: {
          type: 'OBJECT',
          properties: {
            action: {
              type: 'STRING',
              description: "'play', 'pause', 'resume', 'stop', 'next', 'previous', 'volume_up', 'volume_down', 'mute', 'unmute'",
            },
          },
          required: ['action'],
        },
      },

      // 6. PowerPoint & Presentations
      {
        name: 'powerpointControl',
        description: 'Controls PowerPoint presentation: open, start slideshow, next slide, previous slide, goto slide, or exit (e.g. "PowerPoint চালু করো", "slide 8 এ যাও", "next slide").',
        parameters: {
          type: 'OBJECT',
          properties: {
            action: {
              type: 'STRING',
              description: "'open', 'start', 'next', 'previous', 'goto', 'exit', or 'status'",
            },
            slide_number: {
              type: 'INTEGER',
              description: 'Slide number for goto action',
            },
            file_path: {
              type: 'STRING',
              description: 'Optional file path to presentation',
            },
          },
          required: ['action'],
        },
      },

      // 7. File Intelligence
      {
        name: 'findFile',
        description: 'Finds files by keywords across user folders like Downloads, Documents, Desktop (e.g. "আমার Downloads থেকে presentation খুঁজে দাও", "Find my HSC notes").',
        parameters: {
          type: 'OBJECT',
          properties: {
            query: {
              type: 'STRING',
              description: 'File name keyword or topic',
            },
            folder: {
              type: 'STRING',
              description: 'Optional folder hint like "Downloads" or "Documents"',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'findFolder',
        description: 'Locates a specific folder by name (e.g. "Find my Project folder").',
        parameters: {
          type: 'OBJECT',
          properties: {
            query: {
              type: 'STRING',
              description: 'Folder name or keyword',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'recentFiles',
        description: 'Shows today\'s or recently downloaded/modified files (e.g. "Show today\'s downloaded files").',
        parameters: {
          type: 'OBJECT',
          properties: {
            limit: {
              type: 'INTEGER',
              description: 'Number of recent files to list',
            },
            folder: {
              type: 'STRING',
              description: 'Folder to inspect (default "Downloads")',
            },
          },
        },
      },
      {
        name: 'fileMetadata',
        description: 'Gets file size, type, and last modified date.',
        parameters: {
          type: 'OBJECT',
          properties: {
            path: {
              type: 'STRING',
              description: 'Path of the file',
            },
          },
          required: ['path'],
        },
      },
      {
        name: 'openFile',
        description: 'Opens a document or file using the system default program (e.g. "Open my presentation").',
        parameters: {
          type: 'OBJECT',
          properties: {
            path: {
              type: 'STRING',
              description: 'File path to open',
            },
          },
          required: ['path'],
        },
      },
      {
        name: 'organizeFiles',
        description: 'Groups files into category folders. Requires confirmation.',
        parameters: {
          type: 'OBJECT',
          properties: {
            folder_path: {
              type: 'STRING',
              description: 'Directory path to organize',
            },
            mode: {
              type: 'STRING',
              description: 'Organization mode (e.g. "extension")',
            },
            user_confirmed: {
              type: 'BOOLEAN',
              description: 'Whether user confirmed file organization',
            },
          },
          required: ['folder_path'],
        },
      },
      {
        name: 'fileSearch',
        description: 'Searches or lists files inside permitted directories.',
        parameters: {
          type: 'OBJECT',
          properties: {
            query: {
              type: 'STRING',
              description: 'File name to search for',
            },
            directory: {
              type: 'STRING',
              description: 'Directory path to list',
            },
          },
        },
      },
      {
        name: 'fileOperation',
        description: 'Performs safe file operations like create_folder, copy, rename, move, delete.',
        parameters: {
          type: 'OBJECT',
          properties: {
            action: {
              type: 'STRING',
              description: "'open', 'create_folder', 'copy', 'rename', 'move', 'delete'",
            },
            path: {
              type: 'STRING',
              description: 'Target path',
            },
            dest_path: {
              type: 'STRING',
              description: 'Destination path',
            },
            user_confirmed: {
              type: 'BOOLEAN',
              description: 'Whether user confirmed',
            },
          },
          required: ['action', 'path'],
        },
      },

      // 8. Vision & Screen Assistant
      {
        name: 'visionAnalyze',
        description: 'Explicit user-triggered screen analysis or OCR (e.g. "Look at my screen", "What button should I press?", "Explain this error").',
        parameters: {
          type: 'OBJECT',
          properties: {
            action: {
              type: 'STRING',
              description: "'analyze_image', 'read_text', or 'explain_error'",
            },
            prompt: {
              type: 'STRING',
              description: 'User question about the screen or image',
            },
          },
        },
      },

      // 9. Biometrics
      {
        name: 'detectBiometric',
        description: 'Detects supported biometric authentication hardware.',
        parameters: {
          type: 'OBJECT',
          properties: {},
        },
      },
      {
        name: 'startBiometricEnrollment',
        description: 'Guides user to official OS settings for fingerprint or facial recognition.',
        parameters: {
          type: 'OBJECT',
          properties: {},
        },
      },
    ],
  },
];
