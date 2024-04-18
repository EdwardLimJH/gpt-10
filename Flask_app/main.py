from flask import Flask
from flask_cors import CORS
from blueprints.index.index import index_bp
from blueprints.loading.loading import loading_bp
from blueprints.review.review import review_bp
from blueprints.get_LLM_response.get_LLM_response import get_LLM_response_bp
from blueprints.confirmation.confirmation import confirmation_bp
from blueprints.send_email.send_email import send_email_bp
from blueprints.cleanup.cleanup import cleanup_bp
from blueprints.meeting_chat.meeting_chat import meeting_chat_bp
from blueprints.sentiment_chat.sentiment_chat import sentiment_chat_bp
from blueprints.translate.translate import translate_chat_bp
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)
CORS(app, supports_credentials=True, resources={r'/send_email': {'origins': 'http://localhost:3000'}})
app.secret_key = "gpt-10_A+For everyone!!"
app.register_blueprint(index_bp)
app.register_blueprint(loading_bp)
app.register_blueprint(review_bp)
app.register_blueprint(get_LLM_response_bp)
app.register_blueprint(confirmation_bp)
app.register_blueprint(send_email_bp)
app.register_blueprint(cleanup_bp)
app.register_blueprint(meeting_chat_bp)
app.register_blueprint(sentiment_chat_bp)
app.register_blueprint(translate_chat_bp)


if __name__ == "__main__":
    load_dotenv()
    app.run(debug=True)