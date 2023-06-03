import os
import re
import http.client
import json
import threading
import urllib.parse
import time
from flask import Flask, request, jsonify

app = Flask(__name__)

def get_input_value_from_html(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
        input_value = re.search(r'<input .*?id="search-term".*?value="(.*?)".*?>', content, re.DOTALL)
        if input_value:
            return input_value.group(1)
    return "Who are you?"

index_file_path = 'index.html'
results_file_path = 'results.html'

input_value = get_input_value_from_html(index_file_path)
previous_input_value = None
get_request_in_progress = False

window_open = False
assistant_response = None
response_ready = False
response_sent = True
search_term_changed = False

previous_response = None

@app.route('/check_window', methods=['GET'])
def check_window():
    global window_open
    window_open = request.args.get('window_status', 'false').lower() == 'true'
    return jsonify({"status": "success"})

@app.route('/assistant_response', methods=['GET'])
def get_assistant_response():
    global assistant_response, response_ready, response_sent, previous_response
    if response_ready:
        response_data = {'response': assistant_response}
        previous_response = assistant_response
        response_ready = False
        response_sent = True
        search_term_changed = False
        return jsonify(response_data)
    elif previous_response is not None:
        response_data = {'response': previous_response}
        return jsonify(response_data)
    else:
        return ('', 204)

@app.route('/start_script', methods=['GET'])
def start_script():
    return jsonify({"status": "success"})

@app.route('/submit_search_term', methods=['POST'])
def update_search_term():
    global input_value, search_term_changed
    input_value = request.form.get('search_term', '')
    search_term_changed = True
    return jsonify({"status": "success"})

def chatConversation(conversation, api_key):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    data = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "As Beamo Assistant, a collaboration between Beamo and OpenAI, you provide accurate, unbiased, and politically neutral information. you offer concise, well-researched answers but disclose speculation. you cannot answer real-time questions. you cite multiple sources and can continue or define single-word queries as needed."},
            *conversation
        ]
    }

    connection = http.client.HTTPSConnection("api.openai.com")
    connection.request("POST", "/v1/chat/completions", body=json.dumps(data), headers=headers)
    response = connection.getresponse()

    response_json = json.loads(response.read())
    if 'choices' in response_json and len(response_json['choices']) > 0:
        return response_json['choices'][0]['message']['content']
    else:
        print("Error: Unexpected response from API")
        print(response_json)
        return None

def main_loop():
    global input_value, previous_input_value, search_term_changed, response_ready, get_request_in_progress, response_sent
    api_key = "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"

    while True:
        if search_term_changed and not response_ready and not get_request_in_progress and response_sent:
            previous_input_value = input_value
            get_request_in_progress = True
            response_sent = False
            search_term_changed = True
            conversation = [{"role": "user", "content": input_value}]
            assistant_response = chatConversation(conversation, api_key)
            response_ready = True
            get_request_in_progress = False
            search_term_changed = False
        elif not search_term_changed:
            print("Waiting for a new search term")
        else:
            print("Assistant response already ready")
        time.sleep(0.1)

if __name__ == '__main__':
    server_thread = threading.Thread(target=main_loop)
    server_thread.daemon = True
    server_thread.start()
    app.run(port=8000)