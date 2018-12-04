import BaseHTTPServer
import SimpleHTTPServer
import ssl


class simpleHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):

    def do_GET(self):
        self.send_response(301)
        self.send_header('Location', 'http://192.168.1.78:80')
        self.end_headers()


handler = BaseHTTPServer.HTTPServer(("", 443), simpleHandler)
handler.socket = ssl.wrap_socket(
    handler.socket, certfile='./server.pem', server_side=True)
handler.serve_forever()
