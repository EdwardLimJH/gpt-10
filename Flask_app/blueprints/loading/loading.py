from flask import Blueprint, render_template, request, session
import json

loading_bp = Blueprint('loading', __name__, template_folder='templates')

def _temp_process_data(data):
    language_data = data.getlist("language")
    email_data = data.getlist("email")
    email_data = email_data[0].split("\r\n")
    json_response = {"language_preferences":language_data, "participant_emails":email_data}
    return json.dumps(json_response)


@loading_bp.route('/loading', methods=['POST'])
def loading():
    form_data = request.form
    processed_data = _temp_process_data(form_data)
    processed_data = json.loads(processed_data)
    session["language_preferences"] = processed_data["language_preferences"]
    session["participant_emails"] = processed_data["participant_emails"]
    processed_data = json.dumps(processed_data)
    return render_template('loading/loading.html', data=processed_data)
