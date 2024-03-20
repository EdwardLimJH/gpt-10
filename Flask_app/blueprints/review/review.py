from flask import Blueprint, request
import json

review_bp = Blueprint('review', __name__, template_folder='templates')

llm_outputs = None

@review_bp.route('/review', methods=['GET', 'POST'])
def review():
    global llm_outputs
    # Assumes that "GET" method is invoked first with data params
    if request.method == 'GET':
        data_param = request.args.get('data')
        # Check if data_param is not None and then decode the JSON string
        if data_param:
            data = json.loads(data_param)
            llm_outputs = data
            print(f"Im in review with the meeting minutes")
            print(f"llm_outputs has been initialized with : {llm_outputs}")
    if request.method == 'POST':
        updated_data = request.json
        llm_outputs[updated_data["key"]] = updated_data["value"] # Assuming singular edits. To be changed for multiple edits
        print(f"Im updating review data with the following : {updated_data}")
        print(llm_outputs)
    return json.dumps(llm_outputs)