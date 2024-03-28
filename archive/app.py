from flask import Flask, render_template, request, session
from blueprints.index.index import index_bp
from blueprints.loading.loading import loading_bp
from blueprints.review.review import review_bp
from blueprints.get_LLM_response.get_LLM_response import get_LLM_response_bp
from blueprints.confirmation.confirmation import confirmation_bp
from blueprints.send_email.send_email import send_email_bp
from dotenv import load_dotenv
import os
import json
from h2ogpte import H2OGPTE
from flask import Flask
from flask_wtf import FlaskForm
from wtforms import FileField
load_dotenv()
H2O_API_KEY = os.getenv("H2O_API_KEY") 

app = Flask(__name__)
app.secret_key = "gpt-10_A+For everyone!!"
app.register_blueprint(index_bp)
app.register_blueprint(loading_bp)
app.register_blueprint(review_bp)
app.register_blueprint(get_LLM_response_bp)
app.register_blueprint(confirmation_bp)
app.register_blueprint(send_email_bp)

@app.route('/loading', methods=['GET'])
def upload_file(data_dir):
    client = H2OGPTE(
        address='https://h2ogpte.genai.h2o.ai',
        api_key= H2O_API_KEY,
    )

    # Create a new collection
    collection_id = client.create_collection(
        name='devMeetingAssistant',
        description='Test development for meeting assistant (prompt engineering)',
    )
    with open(data_dir, 'rb') as f:
        meeting_data = client.upload('Data/fake_sample.txt', f)
    client.ingest_uploads(collection_id, [meeting_data,])
    session['client'], session['client'], session['client'] = client, collection_id, meeting_data
    return render_template('INSERT_HERE.html',form=form)



if __name__ == "__main__":
    load_dotenv()
    app.run(debug=True)