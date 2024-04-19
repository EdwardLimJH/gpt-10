from flask import Flask, request, send_from_directory, jsonify
from werkzeug.utils import secure_filename
from blueprints.get_LLM_response.get_LLM_response import get_LLM_response_bp
from dotenv import load_dotenv

import os, json

app = Flask(__name__, static_folder='build')
app.secret_key = "gpt-10_A+For everyone!!"
app.register_blueprint(get_LLM_response_bp)
upload_directory = 'uploads'  # Define a directory name for uploads
data_file = 'data.jsonl'  # Define the name of the JSON Lines file

def append_to_jsonl(data, file_path):
    with open(file_path, 'a') as f:
        f.write(json.dumps(data) + '\n')


@app.route('/upload', methods=['POST'])
def upload_file():
    # Ensure the upload directory exists
    os.makedirs(upload_directory, exist_ok=True)
    
    uploaded_file = request.files['file']
    if uploaded_file and uploaded_file.filename != '':
        filename = secure_filename(uploaded_file.filename)
        save_path = os.path.join(upload_directory, filename)
        uploaded_file.save(save_path)
        # Extract language and email addresses from the form data
        language = request.form.get('language')
        email_addresses = request.form.get('emailAddresses').split(',')

        # Construct a data object to write to the JSON Lines file
        data = {
            'filename': filename,
            'language': language,
            'email_addresses': email_addresses
        }

        # Append the data object to the JSON Lines file
        append_to_jsonl(data, os.path.join(upload_directory, data_file))

        return jsonify({'message': 'File uploaded successfully'}), 200
    else:
        return jsonify({'message': 'No file selected'}), 400

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    load_dotenv()
    app.run(debug=True)

