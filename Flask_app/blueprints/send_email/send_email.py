from flask import Blueprint, request, session
import requests
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication


def string_like_JSON_to_txt(data):
    """Input: dictionary 
    output: Email body string"""
    # Extract information from the parsed data
    agenda = data.get('Agenda', '')
    meeting_summary = data.get('Meeting Summary', '')
    actionables = data.get('Actionables', [])

    # Format the post-meeting email
    email_subject = f"Post-Meeting Summary: {agenda}"
    email_body = f"Dear Team,\n\nHere's a summary of our recent meeting:\n\nAgenda: {agenda}\n\nMeeting Summary:\n{meeting_summary}\n\nActionables:\n"
    for action in actionables:
        email_body += f"- {action['Action']} (Assigned to: {action['Assigned']}, Deadline: {action['Deadline']}, Priority: {action['Priority']})\n"

    email_body += "\nPlease let me know if anything needs clarification or if there are additional action items to add.\n\nBest regards,\n[Your Name]"
    return email_body


send_email_bp = Blueprint('send_email', __name__)

@send_email_bp.route('/send_email', methods=['POST'])
def send_email():
    json_response = request.json
    # email_body = json_response.get("email_body")
    # email_title = json_response.get("email_title")
    email_body = string_like_JSON_to_txt(json_response)
    email_title = "Temporary placeholder"
    print(email_body)

    # handle translation here
    emails_dict = {"english":email_body}
    language_preferences = session["language_preferences"]
    for language in language_preferences:
        if language.lower() not in emails_dict:
            print(language)
            # post request to /translate_chat with language & email_body
            request_dict = {'message':email_body, "language":language}
            response = requests.post('http://localhost:5000/translate_chat', data=request_dict, cookies=request.cookies)
            response_dict = response.json()
            emails_dict[language.lower()] = response_dict.get("translated_email")
    
    for k,v in emails_dict.items():
        print("="*35)
        print("Language:",k)
        print("="*35)
        print(v)
    
    email_body = "".join(emails_dict.values())

    smtp_server = 'smtp-mail.outlook.com' 
    smtp_port = 587
    smtp_username = 'gpt10.4213.1@outlook.com' # dotenv() to load in main.py?
    smtp_password = 'gpt10email'

    from_email = 'gpt10.4213.1@outlook.com'
    # Assume emails are in session["email_list"]
    to_email_list = session.get("email_list") # get email list from session, # Ensure not None

    # meeting_date = "5/3/2024"
    # subject = f"{meeting_date} Meeting Minutes"  # meeting_date either user input or LLM search through document.
    subject = email_title
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = ", ".join(to_email_list) # send to multiple users
    msg['Subject'] = subject
    msg.attach(MIMEText(email_body))

    with smtplib.SMTP(smtp_server, smtp_port) as smtp:
        smtp.starttls()
        smtp.login(smtp_username, smtp_password)
        smtp.send_message(msg)

    return "Email sent successfully"