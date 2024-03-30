from flask import Blueprint, session, request, jsonify
import json
import os
from h2ogpte import H2OGPTE
from blueprints.get_LLM_response.prompts import TRANSLATION_SYSTEM_PROMPT, generate_translate_prompt

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


translate_chat_bp = Blueprint('translate_chat', __name__)

@translate_chat_bp.route('/translate_chat', methods=['POST'])
def translate_chat():
    print("Hi im at translate_chat")
    h2o_client = H2OGPTE(
        address='https://h2ogpte.genai.h2o.ai',
        api_key= H2O_API_KEY,
    )
    message = request.form.get('message')
    language = request.form.get("language")
    chat_session_id = session["chat_session_id"]
    translation_prompt = generate_translate_prompt(lang=language, message=message)
    print(f"I am translating the email into {language}")
    translated_email = rag_chat(h2o_client, chat_session_id, translation_prompt,TRANSLATION_SYSTEM_PROMPT)
    return jsonify({"translated_email":translated_email.content})