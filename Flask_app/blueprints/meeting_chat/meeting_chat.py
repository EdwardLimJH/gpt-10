from flask import Blueprint, request, session, redirect, url_for
import json
import os
from h2ogpte import H2OGPTE
from blueprints.get_LLM_response.prompts import MEETING_SYSTEM_PROMPT, MAIN_PROMPT

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

meeting_chat_bp = Blueprint('meeting_chat', __name__)

@meeting_chat_bp.route('/meeting_chat', methods=['GET'])
def meeting_chat():
    print("Hi im at meeting_chat")
    print("Getting meeting summary")
    h2o_client = H2OGPTE(
        address='https://h2ogpte.genai.h2o.ai',
        api_key= H2O_API_KEY,
    )
    chat_session_id = session["chat_session_id"]
    meeting_summary_response = rag_chat(h2o_client, chat_session_id, MAIN_PROMPT, MEETING_SYSTEM_PROMPT)
    print(meeting_summary_response)
    return redirect(url_for("sentiment_chat.sentiment_chat", message=meeting_summary_response.content))
