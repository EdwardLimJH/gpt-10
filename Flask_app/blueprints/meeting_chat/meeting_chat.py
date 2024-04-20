from flask import Blueprint, request, session, redirect, url_for, jsonify
import json
import os
from utils import rag_chat, extract_json_string
from h2ogpte import H2OGPTE
from blueprints.get_LLM_response.prompts import MEETING_SYSTEM_PROMPT, MAIN_PROMPT, generate_sentiment_prompt

H2O_API_KEY = os.getenv("H2O_API_KEY")



meeting_chat_bp = Blueprint('meeting_chat', __name__)

# @meeting_chat_bp.route('/meeting_chat', methods=['GET'])
@meeting_chat_bp.route('/meeting_chat', methods=['POST'])
def meeting_chat():
    print("Hi im at meeting_chat")
    print("request.args")
    print(request.args)
    print("request.json")
    print(request.json)
    h2o_client = H2OGPTE(
        address='https://h2ogpte.genai.h2o.ai',
        api_key= H2O_API_KEY,
    )
    chat_session_id = request.json.get("chat_session_id")
    # chat_session_id = session["chat_session_id"]
    print("Getting initial meeting response")
    '''
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
    '''
    meeting_summary_response = rag_chat(h2o_client, chat_session_id, MAIN_PROMPT, MEETING_SYSTEM_PROMPT)

    print("Getting sentiment response")
    sentiment_prompt = generate_sentiment_prompt(meeting_summary_response.content)
    sentiment_reply = rag_chat(h2o_client, chat_session_id, sentiment_prompt, MEETING_SYSTEM_PROMPT)

    json_string = extract_json_string(sentiment_reply.content) 

    response_dic = json.loads(json_string)
    response_dic["doc_id_list"] = request.json.get("doc_id_list")
    response_dic["collection_id"] = request.json.get("collection_id")
    response_dic["chat_session_id"] = chat_session_id
    return json.dumps(response_dic)
    # return jsonify(json.loads(json_string))
