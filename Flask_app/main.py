from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from blueprints.cleanup.cleanup import cleanup_bp
from blueprints.send_email.send_email import send_email_bp
from blueprints.translate.translate import translate_chat_bp
from blueprints.meeting_chat.meeting_chat import meeting_chat_bp
from blueprints.get_LLM_response.get_LLM_response import get_LLM_response_bp


app = Flask(__name__)
CORS(app)
CORS(app, supports_credentials=True, resources={r'/send_email': {'origins': 'http://localhost:3000'}})
app.secret_key = "gpt-10_A+For everyone!!"
app.register_blueprint(get_LLM_response_bp)
app.register_blueprint(send_email_bp)
app.register_blueprint(cleanup_bp)
app.register_blueprint(meeting_chat_bp)
app.register_blueprint(translate_chat_bp)


if __name__ == "__main__":
    load_dotenv()
    app.run(host='0.0.0.0', port=5000, debug=True)