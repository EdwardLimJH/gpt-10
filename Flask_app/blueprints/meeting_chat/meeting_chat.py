from flask import Blueprint, request, session, redirect, url_for, jsonify
import json
import os
from h2ogpte import H2OGPTE
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


meeting_chat_bp = Blueprint('meeting_chat', __name__)

@meeting_chat_bp.route('/meeting_chat', methods=['GET'])
def meeting_chat():
    print("Hi im at meeting_chat")
    h2o_client = H2OGPTE(
        address='https://h2ogpte.genai.h2o.ai',
        api_key= H2O_API_KEY,
    )
    chat_session_id = session["chat_session_id"]
    print("Getting initial meeting response")
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
    # return jsonify(json.loads(resp))
    meeting_summary_response = rag_chat(h2o_client, chat_session_id, MAIN_PROMPT, MEETING_SYSTEM_PROMPT)

    print("Getting sentiment response")
    sentiment_prompt = generate_sentiment_prompt(meeting_summary_response.content)
    sentiment_reply = rag_chat(h2o_client, chat_session_id, sentiment_prompt, MEETING_SYSTEM_PROMPT)

    json_string = extract_json_string(sentiment_reply.content) 
    return jsonify(json.loads(json_string))
