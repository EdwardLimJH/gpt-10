from flask import Blueprint

send_email_bp = Blueprint('send_email', __name__)

@send_email_bp.route('/send_email', methods=['POST'])
def send_email():
    print("Sent email successfully")
    return "Email sent successfully"