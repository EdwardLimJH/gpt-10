from flask import Blueprint, request, session, url_for, redirect, jsonify
from utils import rag_chat, extract_json_string
import os
import json
from h2ogpte import H2OGPTE
import requests
from io import BufferedReader
from blueprints.get_LLM_response.prompts import MEETING_SYSTEM_PROMPT, MAIN_PROMPT, generate_sentiment_prompt

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
    return doc_id_list

  

get_LLM_response_bp = Blueprint('get_LLM_response', __name__)

@get_LLM_response_bp.route('/get_LLM_response', methods=['POST'])
def get_LLM_response():
    print("Hiii im at get_LLM_response_bp")
    form_data = request.form
    print(form_data)
    file_data = request.files.getlist('file')
    # file_data = request.files.to_dict()
    print(file_data)

    h2o_collection_id, h2o_client = _create_collection()
    print("Tryna upload to collection")
    doc_id_list = _upload_to_collection(file_data, h2o_collection_id, h2o_client)
    print("done uploading")
    processed_data = _temp_process_data(form_data)
    
    chat_session_id = h2o_client.create_chat_session(h2o_collection_id)

    # resp = """
    # {
    #     "Agenda": "Reviewing progress on the project, discussing roadblocks, and planning next steps",
    #     "Meeting Summary": "The meeting discussed the current status of the project, reviewed the design proposal, and finalized the budget allocation. The team also discussed potential roadblocks and found solutions, and scheduled a follow-up discussion. The meeting concluded with a summary of actionables and their deadlines.",
    #     "Actionables": [
    #         {
    #             "Action": "Complete design proposal",
    #             "Deadline": "Wednesday",
    #             "Assigned": "Ryan_Edward",
    #             "Priority": "High"
    #         },
    #         {
    #             "Action": "Confirm meeting with design specialist",
    #             "Deadline": "Thursday",
    #             "Assigned": "Ben_CH",
    #             "Priority": "Medium"
    #         },
    #         {
    #             "Action": "Resolve integration issue",
    #             "Deadline": "Friday",
    #             "Assigned": "Chan Yi Ru Micole",
    #             "Priority": "High"
    #         },
    #         {
    #             "Action": "Share progress document",
    #             "Deadline": "After the meeting",
    #             "Assigned": "Ryan_Edward",
    #             "Priority": "Low"
    #         },
    #         {
    #             "Action": "Send out meeting details",
    #             "Deadline": "Thursday",
    #             "Assigned": "Ben_CH",
    #             "Priority": "Medium"
    #         }
    #     ]
    # }
    # """

    # resp_dic = json.loads(resp)
    # resp_dic["doc_id_list"] = doc_id_list
    # resp_dic["collection_id"] = h2o_collection_id
    # resp_dic["chat_session_id"] = chat_session_id
    # print(resp_dic)
    # return json.dumps(resp_dic)
    print("Getting initial meeting response")
    meeting_summary_response = rag_chat(h2o_client, chat_session_id, MAIN_PROMPT, MEETING_SYSTEM_PROMPT)

    print("Getting sentiment response")
    sentiment_prompt = generate_sentiment_prompt(meeting_summary_response.content)
    print(sentiment_prompt)
    sentiment_reply = rag_chat(h2o_client, chat_session_id, sentiment_prompt, MEETING_SYSTEM_PROMPT)

    json_string = extract_json_string(sentiment_reply.content) 
    response_dic = json.loads(json_string)
    response_dic["doc_id_list"] = doc_id_list
    response_dic["collection_id"] = h2o_collection_id
    response_dic["chat_session_id"] = chat_session_id
    return json.dumps(response_dic)

    
