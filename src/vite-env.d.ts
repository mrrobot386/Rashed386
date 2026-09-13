/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string;
  readonly VITE_AGENT_ENDPOINT?: string;
  readonly VITE_AGENT_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
