from flask import Blueprint, request, session, url_for, redirect
import os
from h2ogpte import H2OGPTE

H2O_API_KEY = os.getenv("H2O_API_KEY")  

def _temp_process_data(data):
    print(f"form data = {data}")
    language_data = data.getlist("language")
    email_data = data.getlist("email_list")
    email_data = email_data[0].split("\n")
    processed_data = {"language_preferences":language_data, "email_list":email_data}
    return processed_data

def _create_collection():
    client = H2OGPTE(
        address='https://h2ogpte.genai.h2o.ai',
        api_key= H2O_API_KEY,
    )
    # Create a new collection
    collection_id = client.create_collection(
        name='Temp_Meeting_Collection_test_redirect1',
        description='Information related to the Meeting hosted',
    ) 
    return (collection_id, client)

def _upload_to_collection(files, collection_id, client):
    doc_id_list = []
    os.makedirs("./temp/", exist_ok=True) # create temporary folder for temp files
    for file in files:
        print("currently trying to index file")
        file_name = file.filename
        file.save(f"./temp/{file_name}")  # Save the file temporarily
        with open(f"./temp/{file_name}", 'rb') as f:
            doc_id = client.upload(file_name, f)
            doc_id_list.append(doc_id)
    print(doc_id_list)
    client.ingest_uploads(collection_id, doc_id_list)


get_LLM_response_bp = Blueprint('get_LLM_response', __name__)

@get_LLM_response_bp.route('/get_LLM_response', methods=['POST'])
def get_LLM_response():
    print("Hiii im at get_LLM_response_bp")
    form_data = request.form
    print(form_data)
    file_data = request.files.getlist('file')
    print(file_data)
    h2o_collection_id, h2o_client = _create_collection()
    print("Tryna upload to collection")
    _upload_to_collection(file_data, h2o_collection_id, h2o_client)
    print("done uploading")
    processed_data = _temp_process_data(form_data)
    session["language_preferences"] = processed_data["language_preferences"]
    session["email_list"] = processed_data["email_list"]
    
    print("Starting chat")
    chat_session_id = h2o_client.create_chat_session(h2o_collection_id)
    session["chat_session_id"] = chat_session_id
    print("Redirecting to meeting_chat now")
    return redirect(url_for("meeting_chat.meeting_chat"))
