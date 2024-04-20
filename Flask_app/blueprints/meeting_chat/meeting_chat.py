import os
import json
from h2ogpte import H2OGPTE
from flask import Blueprint, request
from utils import rag_chat, extract_json_string
from blueprints.get_LLM_response.prompts import MEETING_SYSTEM_PROMPT, MAIN_PROMPT, generate_sentiment_prompt

H2O_API_KEY = os.getenv("H2O_API_KEY")


meeting_chat_bp = Blueprint('meeting_chat', __name__)

@meeting_chat_bp.route('/meeting_chat', methods=['POST'])
def meeting_chat():
    """
    Endpoint for handling meeting chat requests.

    This function receives a POST request with a JSON payload containing the following parameters:
    - chat_session_id: The ID of the chat session.
    - doc_id_list: A list of document IDs.
    - collection_id: The ID of the document collection.

    The function performs the following steps:
    1. Initializes an H2OGPTE client.
    2. Retrieves the meeting summary response using the RAG chat model.
    3. Generates a sentiment prompt based on the meeting summary response.
    4. Retrieves the sentiment response using the RAG chat model.
    5. Extracts the JSON string from the sentiment response.
    6. Parses the JSON string into a dictionary.
    7. Adds the doc_id_list, collection_id, and chat_session_id to the response dictionary.
    8. Returns the response dictionary as a JSON string.

    Returns:
    A JSON string containing the response dictionary.
    """

    print("Currently at meeting_chat")
    h2o_client = H2OGPTE(
        address='https://h2ogpte.genai.h2o.ai',
        api_key= H2O_API_KEY,
    )
    chat_session_id = request.json.get("chat_session_id")
    print("Getting initial meeting response")
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
