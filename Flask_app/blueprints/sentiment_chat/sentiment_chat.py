from flask import Blueprint, request, session
import json
import os
from h2ogpte import H2OGPTE
from blueprints.get_LLM_response.prompts import MEETING_SYSTEM_PROMPT, generate_sentiment_prompt

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

def extract_json_string(full_string): 
    """Extracts json-like string from LLM response. Outputs str."""

    start_index = full_string.find('{')  # Find the index of the first '{'
    end_index = full_string.rfind('}')   # Find the index of the last '}'
    
    if start_index != -1 and end_index != -1:
        return full_string[start_index:end_index + 1]
    else:
        return None
    
def string_like_JSON_to_txt(json_str):
    """Input: json-like string
    output: Email body string"""
    if json_str is None:
        return "Invalid JSON format. Cannot parse the response."

    # Parse the extracted JSON string
    try:
        data = json.loads(json_str)
    except json.JSONDecodeError:
        return "Error parsing JSON data."

    # Extract information from the parsed data
    agenda = data.get('Agenda', '')
    meeting_summary = data.get('Meeting Summary', '')
    actionables = data.get('Actionables', [])

    # Format the post-meeting email
    email_subject = f"Post-Meeting Summary: {agenda}"
    email_body = f"Dear Team,\n\nHere's a summary of our recent meeting:\n\nAgenda: {agenda}\n\nMeeting Summary:\n{meeting_summary}\n\nActionables:\n"
    for action in actionables:
        email_body += f"- {action['Action']} (Assigned to: {action['Assigned']}, Deadline: {action['Deadline']}, Priority: {action['Priority']})\n"

    email_body += "\nPlease let me know if anything needs clarification or if there are additional action items to add.\n\nBest regards,\n[Your Name]"
    return email_body


sentiment_chat_bp = Blueprint('sentiment_chat', __name__)

@sentiment_chat_bp.route('/sentiment_chat', methods=['GET'])
def sentiment_chat():
    print("Hi im at sentiment_chat")
    h2o_client = H2OGPTE(
        address='https://h2ogpte.genai.h2o.ai',
        api_key= H2O_API_KEY,
    )
    chat_session_id = session["chat_session_id"]
    meeting_summary_response = request.args['message']
    sentiment_prompt = generate_sentiment_prompt(meeting_summary_response)
    sentiment_reply = rag_chat(h2o_client, chat_session_id, sentiment_prompt, MEETING_SYSTEM_PROMPT)
    print(sentiment_reply.content)
    # email_body = prettify_sentiment_reply(sentiment_reply.content) #Still need double checking
    email_body = {
    "Agenda": "Review progress on the project, discuss roadblocks, and plan next steps.",
    "Meeting Summary": "The meeting started with Eugene introducing the agenda and asking for confirmation from the attendees. Ryan provided an update on completing the research phase and starting the design proposal. Ben shared that the budget allocation has been finalized and submitted for approval. Micole mentioned a minor issue with software integration but believed it could be resolved with more testing. The discussion then moved to potential roadblocks, with Ryan suggesting consulting a design specialist for guidance. Ben was assigned to schedule a meeting with the design specialist. Micole mentioned no immediate issues impacting the timeline. The action plan for the upcoming week included completing the design proposal by Ryan and confirming the meeting with the design specialist by Ben.",
    "Actionables": [
        {
        "Action": "Complete the design proposal",
        "Deadline": "Wednesday",
        "Assigned": "Ryan",
        "Priority": "Medium"
        },
        {
        "Action": "Confirm the meeting with the design specialist",
        "Deadline": "Thursday",
        "Assigned": "Ben",
        "Priority": "High"
        }]
    } # Placeholder
    return json.dumps(email_body)
