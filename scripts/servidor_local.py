# Servidor local do portfólio: igual ao http.server, mas manda
# Cache-Control: no-store — ferramentas de teste nunca veem JS/CSS
# velho do cache do navegador. Raiz = repositório (uma pasta acima).
import http.server
import os
import socketserver

PORTA = int(os.environ.get("PORT", "8791"))
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Manipulador(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=RAIZ, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


class Servidor(socketserver.ThreadingTCPServer):
    allow_reuse_address = True


if __name__ == "__main__":
    with Servidor(("0.0.0.0", PORTA), Manipulador) as httpd:
        print(f"portfólio em http://localhost:{PORTA} (no-store)")
        httpd.serve_forever()
