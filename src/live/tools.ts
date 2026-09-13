/**
 * Registered Tool Declarations for Gemini Live.
 */
export const ANISA_TOOLS = [
  {
    functionDeclarations: [
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
      {
        name: 'dailyBriefing',
        description: 'Compiles the user morning or daily briefing including date, time, system health, battery, and status.',
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
        description: 'Lists running user applications or checks if a specific app is running, or safely requests closing an app.',
        parameters: {
          type: 'OBJECT',
          properties: {
            action: {
              type: 'STRING',
              description: "Action to perform: 'list', 'check', or 'terminate'",
            },
            target: {
              type: 'STRING',
              description: 'Name of the application or process',
            },
            user_confirmed: {
              type: 'BOOLEAN',
              description: 'True if user confirmed closing the application',
            },
          },
        },
      },
      {
        name: 'getNetworkStatus',
        description: 'Retrieves current network status and connected Wi-Fi SSID name.',
        parameters: {
          type: 'OBJECT',
          properties: {},
        },
      },
      {
        name: 'wifiManager',
        description: 'Manages Wi-Fi connections: status, available networks, reconnect, or disconnect.',
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
        description: 'Securely locks the computer screen using the native OS lock mechanism.',
        parameters: {
          type: 'OBJECT',
          properties: {},
        },
      },
      {
        name: 'mediaControl',
        description: 'Controls universal audio/media playback: play, pause, resume, next, previous, volume up, down, or mute.',
        parameters: {
          type: 'OBJECT',
          properties: {
            action: {
              type: 'STRING',
              description: "'play', 'pause', 'resume', 'stop', 'next', 'previous', 'volume_up', 'volume_down', 'mute'",
            },
          },
          required: ['action'],
        },
      },
      {
        name: 'detectBiometric',
        description: 'Detects supported biometric authentication hardware (Windows Hello, Touch ID, PAM).',
        parameters: {
          type: 'OBJECT',
          properties: {},
        },
      },
      {
        name: 'startBiometricEnrollment',
        description: 'Guides user to official OS settings to register fingerprint or facial recognition.',
        parameters: {
          type: 'OBJECT',
          properties: {},
        },
      },
      {
        name: 'powerpointControl',
        description: 'Controls PowerPoint presentation slideshow: open, start, next slide, previous slide, goto slide, or exit.',
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
          },
          required: ['action'],
        },
      },
      {
        name: 'visionAnalyze',
        description: 'Analyzes visual content, reads visible text (OCR), or explains interface layout.',
        parameters: {
          type: 'OBJECT',
          properties: {
            action: {
              type: 'STRING',
              description: "'analyze_image' or 'read_text'",
            },
            prompt: {
              type: 'STRING',
              description: 'Question about the image or screen',
            },
          },
        },
      },
      {
        name: 'fileSearch',
        description: 'Searches or lists files inside permitted directories (Documents, Downloads, Desktop).',
        parameters: {
          type: 'OBJECT',
          properties: {
            query: {
              type: 'STRING',
              description: 'File name or keyword to search for',
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
        description: 'Performs safe file operations like create_folder, copy, rename, or delete.',
        parameters: {
          type: 'OBJECT',
          properties: {
            action: {
              type: 'STRING',
              description: "'open', 'create_folder', 'copy', 'rename', 'move', 'delete'",
            },
            path: {
              type: 'STRING',
              description: 'Target file or folder path',
            },
            dest_path: {
              type: 'STRING',
              description: 'Destination path for move/copy/rename',
            },
            user_confirmed: {
              type: 'BOOLEAN',
              description: 'Whether user confirmed destructive actions',
            },
          },
          required: ['action', 'path'],
        },
      },
    ],
  },
];
