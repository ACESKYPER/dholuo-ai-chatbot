from http.server import HTTPServer, BaseHTTPRequestHandler

class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(b'Serving at port 8080')

if __name__ == '__main__':
    port = 8080
    print(f"Serving at port {port}")
    httpd = HTTPServer(('127.0.0.1', port), SimpleHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('Shutting down')
        httpd.server_close()
