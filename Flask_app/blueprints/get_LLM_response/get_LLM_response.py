from flask import Blueprint, request, session, url_for, redirect, jsonify
import os
import json
from h2ogpte import H2OGPTE
import requests
from io import BufferedReader
from blueprints.get_LLM_response.prompts import MEETING_SYSTEM_PROMPT, MAIN_PROMPT, generate_sentiment_prompt

H2O_API_KEY = os.getenv("H2O_API_KEY")  


def rag_chat(client, chat_session_id, main_prompt, system_prompt):
    with client.connect(chat_session_id) as session:
        answer = session.query(
            message=main_prompt,
            system_prompt=system_prompt,
            rag_config={
            "rag_type": "rag", # https://h2oai.github.io/h2ogpte/getting_started.html#advanced-controls-for-document-q-a
            },
            llm="h2oai/h2ogpt-4096-llama2-70b-chat",
        )
        return answer

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

def extract_json_string(full_string): 
    """Extracts json-like string from LLM response. Outputs str."""

    start_index = full_string.find('{')  # Find the index of the first '{'
    end_index = full_string.rfind('}')   # Find the index of the last '}'
    
    if start_index != -1 and end_index != -1:
        return full_string[start_index:end_index + 1]
    else:
        return None
    

get_LLM_response_bp = Blueprint('get_LLM_response', __name__)

@get_LLM_response_bp.route('/get_LLM_response', methods=['POST'])
def get_LLM_response():
    print("Hiii im at get_LLM_response_bp")
    form_data = request.form
    print(form_data)
    file_data = request.files.getlist('file')
    # file_data = request.files.to_dict()
    print(file_data)
    # image = request.files.get('file') # Assumes 1 file
    # image.name = image.filename
    # image = BufferedReader(image)


    # init_collection_resp = requests.post("http://localhost:5000/initiate_collection",data=form_data, files={"file":image})
    # chat_session_id = init_collection_resp.json().get("chat_session_id")
    # session["chat_session_id"] = chat_session_id
    print("Trying to access chat sesison id from response")

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
    # meeting_chat_response =  requests.get("http://localhost:5000/meeting_chat", cookies=request.cookies)
    # print(meeting_chat_response)
    meeting_summary_response = rag_chat(h2o_client, chat_session_id, MAIN_PROMPT, MEETING_SYSTEM_PROMPT)

    print("Getting sentiment response")
    sentiment_prompt = generate_sentiment_prompt(meeting_summary_response.content)
    sentiment_reply = rag_chat(h2o_client, chat_session_id, sentiment_prompt, MEETING_SYSTEM_PROMPT)

    json_string = extract_json_string(sentiment_reply.content) 

    # print("trying the .content")
    # print(meeting_chat_response.content)
    # return json.dumps(json_string)
    return jsonify(json.loads(json_string))
    
