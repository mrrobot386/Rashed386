"""
ANISA AI - Local System Agent Service
HTTP JSON API server providing secure access to registered system tools for the React frontend.
Runs on localhost:8765.
"""
import json
import secrets
from http.server import HTTPServer, BaseHTTPRequestHandler
from agent.tool_registry import ToolRegistry

HOST = "127.0.0.1"
PORT = 8765

# Local session token generated at startup
SESSION_TOKEN = secrets.token_hex(16)

class AnisaAgentHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "http://localhost:5173")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        if self.path == "/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self._send_cors_headers()
            self.end_headers()
            response = {
                "status": "online",
                "service": "ANISA AI Local System Agent",
                "version": "1.0.0",
                "session_token": SESSION_TOKEN
            }
            self.wfile.write(json.dumps(response).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == "/tool":
            content_len = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_len)
            try:
                data = json.loads(body.decode("utf-8"))
                tool_name = data.get("tool", "")
                args = data.get("args", {})

                # Dispatch tool call
                result = ToolRegistry.dispatch(tool_name, args)

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(result).encode("utf-8"))
            except Exception as e:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        # Clean logging
        pass

def run():
    server = HTTPServer((HOST, PORT), AnisaAgentHandler)
    print(f"==================================================")
    print(f"  ANISA AI - Local System Agent Active")
    print(f"  Listening on: http://{HOST}:{PORT}")
    print(f"  Session Token: {SESSION_TOKEN}")
    print(f"==================================================")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping ANISA AI System Agent.")
        server.server_close()

if __name__ == "__main__":
    run()
