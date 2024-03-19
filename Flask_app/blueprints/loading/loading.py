from flask import Blueprint, render_template, request, session
import json
from dotenv import load_dotenv
import os
from h2ogpte import H2OGPTE

load_dotenv()
H2O_API_KEY = os.getenv("H2O_API_KEY") 


loading_bp = Blueprint('loading', __name__, template_folder='templates')

def _temp_process_data(data):
    print(f"form data = {data}")
    language_data = data.getlist("language")
    email_data = data.getlist("email")
    email_data = email_data[0].split("\r\n")
    json_response = {"language_preferences":language_data, "participant_emails":email_data}
    return json.dumps(json_response)

def _create_collection():
    client = H2OGPTE(
        address='https://h2ogpte.genai.h2o.ai',
        api_key= H2O_API_KEY,
    )

    # Create a new collection
    collection_id = client.create_collection(
        name='Temp_Meeting_Collection_filetempsave',
        description='Information related to the Meeting hosted',
    ) 
    # session["h2o_collection_id"] = collection_id
    # session["h2o_client"] = client
    return (collection_id, client)

def delete_directory(directory_path):
    try:
        # Iterate over all files and subdirectories in the directory
        for root, dirs, files in os.walk(directory_path, topdown=False):
            for name in files:
                # Remove files
                os.remove(os.path.join(root, name))
            for name in dirs:
                # Remove subdirectories
                os.rmdir(os.path.join(root, name))
        
        # Remove the top-level directory itself
        os.rmdir(directory_path)
        print(f"Directory '{directory_path}' and its contents deleted successfully")
    except OSError as e:
        print(f"Error deleting directory '{directory_path}': {e}")

def _upload_to_collection(files, collection_id, client):
    doc_id_list = []
    # client = session["h2o_client"]
    # collection_id = session["h2o_collection_id"]
    os.makedirs("./temp/", exist_ok=True) # create temporary folder for temp files
    for file in files:
        print("currently trying to index file")
        # file_data = file.read()
        file_name = file.filename
        file.save(f"./temp/{file_name}")  # Save the file temporarily
        with open(f"./temp/{file_name}", 'rb') as f:
            doc_id = client.upload(file_name, f)
            doc_id_list.append(doc_id)
    print(doc_id_list)
    client.ingest_uploads(collection_id, doc_id_list)
    delete_directory("./temp/")

@loading_bp.route('/loading', methods=['POST'])
def loading():
    form_data = request.form
    files = request.files.getlist('file')
    print("creating collection")
    collection_id, client = _create_collection()
    print("Tryna upload")
    _upload_to_collection(files, collection_id, client)
    print("done uploading")
    processed_data = _temp_process_data(form_data)
    processed_data = json.loads(processed_data)
    session["language_preferences"] = processed_data["language_preferences"]
    session["participant_emails"] = processed_data["participant_emails"]
    processed_data = json.dumps(processed_data)
    return render_template('loading/loading.html', data=processed_data)
