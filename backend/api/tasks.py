from typing import Dict

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import environ


def log_suggestion(suggestion_data: Dict[str, str]) -> None:
    
    env = environ.Env()
    environ.Env.read_env("./.env")
    
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_username = env("email")
    smtp_password = env("passkey")
    
    print(suggestion_data)
    

    with smtplib.SMTP(smtp_server, smtp_port) as smtp:
        smtp.starttls()
        smtp.login(smtp_username, smtp_password)
        
        name = suggestion_data.get("name", "")
        surname = suggestion_data.get("surname", "")
        body = suggestion_data.get("body", "")
        suggestion_id = suggestion_data.get("suggestion_id", "")
        from_email = smtp_username
        
        subject = 'Suggestion Log'
        
        body = f"""
        <html>
            <body>
                <p>{name} {surname} sent the following suggestion: {body}</p>
                
                <a href='http://192.168.1.64:8000/admin/feed/suggestion/{suggestion_id}/change'>Access suggestion through admin pannel</a>
            </body>
        </html>
        """         


        msg = MIMEMultipart()
        msg['From'] = from_email
        msg['To'] = from_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))
        
        smtp.send_message(msg)