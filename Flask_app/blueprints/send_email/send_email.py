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
    requested_by = data.get('requested_by', '[Your Name]')  # Default to '[Your Name]' if not provided

    # Format the post-meeting email
    email_subject = f"Post-Meeting Summary: {agenda}"
    email_body = f"Dear Team,\n\nHere's a summary of our recent meeting:\n\nAgenda: {agenda}\n\nMeeting Summary:\n{meeting_summary}\n\nActionables:\n"
    for action in actionables:
        email_body += f"- {action['Action']} (Assigned to: {action['Assigned']}, Deadline: {action['Deadline']}, Priority: {action['Priority']})\n"

    email_body += f"\nPlease let me know if anything needs clarification or if there are additional action items to add.\n\nBest regards,\n{requested_by}"
    return email_body


send_email_bp = Blueprint('send_email', __name__)

@send_email_bp.route('/send_email', methods=['POST'])
def send_email():
    print("Session info at send_email/")
    json_response = request.json
    print("request.json") # contains the collection_id,chat_session_id, doc_id_list
    print(json_response)
    if not json_response:
        return "Bad request, JSON data is missing", 400
    # email_body = json_response.get("email_body")
    # email_title = json_response.get("email_title")
    print("Try to parse json_response to see wtff is going on")
    for k in json_response:
        print(f"key=  {k}, vaalue = {json_response.get(k)}")
    doc_id_list = json_response["doc_id_list"]
    h2o_collection_id = json_response['collection_id'] 
    chat_session_id = json_response["chat_session_id"]
    print(f"doc_id = {doc_id_list}")
    print(f"collection_id = {h2o_collection_id}")
    print(f"chat_session_id = {chat_session_id}")
    email_date = json_response.get('meeting_date', "").split(" ")[0]

    email_body = string_like_JSON_to_txt(json_response)
    email_title = f"{email_date} Meeting Minutes"
    print(email_body)
    # to_email_list = session.get("email_list")
    # language_preferences = session["language_preferences"]

    # handle translation here
    emails_dict = {"english":email_body}
    # language_preferences = session["language_preferences"]
    language_preferences = json_response.get("language_preferences", ["english"])
    print(language_preferences)
    for language in language_preferences:
        if type(language) == list:
            language = language[0]
        if language.lower() not in emails_dict:
            print(language)
            # post request to /translate_chat with language & email_body
            request_dict = {'message':email_body, "language":language, "chat_session_id":chat_session_id }
            response = requests.post('http://localhost:5000/translate_chat', data=request_dict,)
            response_dict = response.json()
            emails_dict[language.lower()] = response_dict.get("translated_email")
    
    for language, translated_minutes in emails_dict.items():
        with open(f"./temp/{language}.txt", "w",encoding="utf-8") as f:
            f.write(translated_minutes)

    for k,v in emails_dict.items():
        print("="*35)
        print("Language:",k)
        print("="*35)
        print(v)
    
    # email_body = "".join(emails_dict.values())
    email_body = emails_dict.get("english")
    
    smtp_server = 'smtp-mail.outlook.com' 
    smtp_port = 587
    smtp_username = 'gpt10.4213.1@outlook.com' # dotenv() to load in main.py?
    smtp_password = 'gpt10email'

    from_email = 'gpt10.4213.1@outlook.com'
    # Assume emails are in session["email_list"]
    # to_email_list = session.get("email_list") # get email list from session, # Ensure not None

    to_email_list = json_response.get("email_list", [])
    if not to_email_list:
        return "Bad request, email list is missing", 400

    # Ensure it's a list, if it comes as a string, convert it to a list
    if isinstance(to_email_list, str):
        to_email_list = to_email_list.split(', ')

    subject = email_title
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = ", ".join(to_email_list) # send to multiple users
    msg['Subject'] = subject
    msg.attach(MIMEText(email_body))
    
    for language in emails_dict:
        with open(f'./temp/{language}.txt', 'rb') as f:
            attachment = MIMEApplication(f.read(), _subtype='txt')
            attachment.add_header('Content-Disposition', 'attachment', filename=f'{email_date} Minutes_{language.capitalize()}.txt')
            msg.attach(attachment)

    with smtplib.SMTP(smtp_server, smtp_port) as smtp:
        smtp.starttls()
        smtp.login(smtp_username, smtp_password)
        smtp.send_message(msg)

    requests.delete("http://localhost:5000/delete_folder", data={"collection_id":h2o_collection_id, 
                                                                 "doc_id_list":doc_id_list, 
                                                                 "chat_session_id":chat_session_id})
    return "Email sent successfully", 200

