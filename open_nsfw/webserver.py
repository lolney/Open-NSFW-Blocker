from classify_nsfw import classify
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import json


def get_score(image):
    input_file = "tempfile.png"
    model_def = "nsfw_model/deploy.prototxt"
    pretrained_model = "nsfw_model/resnet_50_1by2_nsfw.caffemodel"

    image_data = image.decode('base64')
    with open("tempfile.png", "wb") as fh:
        fh.write(image_data)

    # Doesn't work with certain image formats, like GIF
    try:
        score = classify(image_data, model_def, pretrained_model)[1]
        print('Score:', score)
        return score
    except IOError:
        return 0


class ImageHandler(BaseHTTPRequestHandler):

    def above_threshold(self, scores, threshold):
        for score in scores:
            if score > threshold:
                return True
        return False

    def _write_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

    def do_GET(self):
        self._write_headers()
        self.wfile.write("<html><body><h1>hi!</h1></body></html>")

    def do_POST(self):
        self.data_string = self.rfile.read(int(self.headers['Content-Length']))
        body = json.loads(self.data_string)

        self.send_header('Content-type', 'application/json')

        try:
            images = body['images']
            threshold = body['threshold']

        except KeyError:
            self.wfile.write(json.dumps(
                {"message": "Must set 'images' and 'threshold' params"}))
            self.send_response(422)

        else:
            scores = map(get_score, images)

            # add self.above_threshold(scores) to response
            self._write_headers()
            self.wfile.write(json.dumps(
                {"shouldBlock": self.above_threshold(scores, threshold)}))


def main():
    PORT = 8000
    print "Webserver running"
    httpd = HTTPServer(("", PORT), ImageHandler)
    httpd.serve_forever()


if __name__ == '__main__':
    main()
