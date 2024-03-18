from flask import Flask
from blueprints.index.index import index_bp
from blueprints.loading.loading import loading_bp
from blueprints.review.review import review_bp
from blueprints.get_LLM_response.get_LLM_response import get_LLM_response_bp
from blueprints.confirmation.confirmation import confirmation_bp
from blueprints.send_email.send_email import send_email_bp


app = Flask(__name__)
app.register_blueprint(index_bp)
app.register_blueprint(loading_bp)
app.register_blueprint(review_bp)
app.register_blueprint(get_LLM_response_bp)
app.register_blueprint(confirmation_bp)
app.register_blueprint(send_email_bp)


if __name__ == "__main__":
    app.run(debug=True)