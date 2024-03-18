from flask import Blueprint, render_template, request, redirect, url_for, jsonify
import time

get_LLM_response_bp = Blueprint('get_LLM_response', __name__)

@get_LLM_response_bp.route('/get_LLM_response', methods=['GET','POST'])
def get_LLM_response():
    print("Hiii im at get_LLM_response_bp")
    data = request.json
    print(f"Inside llm response generating new meeting with{data}")
    time.sleep(1)
    llm_response = {
        "english": "meeting minutes are ready",
        "chinese": "会议记录准备好了",
    }
    return jsonify(llm_response)
