from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import os
from datetime import datetime, timedelta
import random

# In-memory storage for simplicity
mood_data = []

# Simulate data for the past year
def simulate_data():
    moods = ['happy', 'sad', 'angry', 'anxious', 'excited', 'tired']
    start_date = datetime.now() - timedelta(days=365)
    for i in range(365):
        date = start_date + timedelta(days=i)
        mood = random.choice(moods)
        mood_data.append({'date': date.strftime('%Y-%m-%d'), 'mood': mood})

class RequestHandler(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if self.path == '/mood':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)

            date = data['date']
            mood = data['mood']

            # Store the mood data
            mood_data.append({'date': date, 'mood': mood})

            response = {'response': f'Your mood for {date} has been recorded as "{mood}".'}
            self._set_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))

    def do_GET(self):
        if self.path == '/moods':
            self._set_headers()
            self.wfile.write(json.dumps({'moods': mood_data}).encode('utf-8'))

def run(server_class=HTTPServer, handler_class=RequestHandler, port=5000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting server on port {port}...')
    simulate_data()  # Populate the mood_data with simulated data
    httpd.serve_forever()

if __name__ == '__main__':
    run()