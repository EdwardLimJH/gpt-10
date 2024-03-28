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

# def rag_chat(client, chat_session_id, main_prompt, system_prompt):
#     with client.connect(chat_session_id) as session:
#         answer = session.query(
#             message=main_prompt,
#             system_prompt=system_prompt,
#             rag_config={
#             "rag_type": "rag", # https://h2oai.github.io/h2ogpte/getting_started.html#advanced-controls-for-document-q-a
#             },
#             llm="h2oai/h2ogpt-4096-llama2-70b-chat",
#         )
#         return answer

# def prettify_sentiment_reply(sentiment_reply):
#     # Sentiment_reply is a json string
#     # Extract only json portion of sentiment_reply
#     raw_reply = sentiment_reply.content
#     first_brace_pos = raw_reply.find("{")
#     last_brace_pos = raw_reply.rfind("}")
#     print(raw_reply[first_brace_pos:last_brace_pos+1])
#     data = json.loads(raw_reply[first_brace_pos:last_brace_pos+1])
#     print(data)
#     # Extract information from the parsed data
#     agenda = data.get('Agenda', '')
#     meeting_summary = data.get('Meeting Summary', '')
#     actionables = data.get('Actionables', [])

#     # Format the post-meeting email
#     email_subject = f"Post-Meeting Summary: {agenda}" # not sure if this is used later?
#     email_body = f"Dear Team,\n\nHere's a summary of our recent meeting:\n\nAgenda: {agenda}\n\nMeeting Summary:\n{meeting_summary}\n\nActionables:\n"
#     for action in actionables:
#         email_body += f"- {action['Action']} (Assigned to: {action['Assigned']}, Deadline: {action['Deadline']}, Priority: {action['Priority']})\n"

#     email_body += "\nPlease let me know if anything needs clarification or if there are additional action items to add.\n\nBest regards,\n[Your Name]"
#     return email_body

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
