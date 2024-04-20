import os
from utils import rag_chat
from h2ogpte import H2OGPTE
from flask import Blueprint, request, jsonify
from blueprints.get_LLM_response.prompts import TRANSLATION_SYSTEM_PROMPT, generate_translate_prompt


H2O_API_KEY = os.getenv("H2O_API_KEY")  



translate_chat_bp = Blueprint('translate_chat', __name__)

@translate_chat_bp.route('/translate_chat', methods=['POST'])
def translate_chat():
    """
    Translates a chat message into the specified language using H2OGPTE.

    Returns:
        A JSON response containing the translated email content.
    """
    print("Currently at translate_chat")
    h2o_client = H2OGPTE(
        address='https://h2ogpte.genai.h2o.ai',
        api_key= H2O_API_KEY,
    )
    message = request.form.get('message')
    language = request.form.get("language")
    chat_session_id = request.form.get("chat_session_id")
    translation_prompt = generate_translate_prompt(lang=language, message=message)
    print(f"Translating the input into {language}")
    translated_email = rag_chat(h2o_client, chat_session_id, translation_prompt,TRANSLATION_SYSTEM_PROMPT)
    return jsonify({"translated_email":translated_email.content})