import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import environ
import string
from random import choice
from typing import List, Dict

from django.contrib.auth.hashers import make_password

import pandas as pd
from tqdm import tqdm

from users.models import User

def email_creds(users: List[Dict[str, str]]) -> None:
    
    env = environ.Env()
    environ.Env.read_env()
    
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_username = env("email")
    smtp_password = env("passkey")
    
    

    with smtplib.SMTP(smtp_server, smtp_port) as smtp:
        smtp.starttls()
        smtp.login(smtp_username, smtp_password)
        
        for user in tqdm(users):
            recipient = user.get("email", "")
            password = user.get("password", "")
            name = user.get("name", "")
            
            from_email = smtp_username
            
            subject = 'Welcome to Student Hub!'
            
            body = f"""
            <html>
              <body>
                <p>Hi {name},</p>
                <p>We are thrilled to welcome you to Student Hub! 🎉</p>
                <p>Your login credentials are as follows:</p>
                <ul>
                  <li><strong>Username:</strong> {recipient}</li>
                  <li><strong>Password:</strong> {password}</li>
                </ul>
                <p>You can access the Student Hub platform using the following link: <a href="https://www.studenthub.com">Student Hub Platform</a></p>
                <p>We hope it imporves school and allows you to win prizes ;)</p>
                <p>Best regards,<br/>Carlos Lorenzo</p>
              </body>
            </html>
            """         

            msg = MIMEMultipart()
            msg['From'] = from_email
            msg['To'] = from_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'html'))
            
            smtp.send_message(msg)

        
def generate_password(length: int) -> str:
    
    return "".join([choice(string.ascii_letters) for _ in range(length)])
        
def create_user(email: str,
                name: str,
                surname: str,
                role: int,
                year: int,
                form: int,
                house: int) -> Dict[str, str]:
    
    password = generate_password(8)
    
    
    new_user = User.objects.create(
        email=email,
        name=name,
        surname=surname,
        password=make_password(password),
        role=role,
        year=year,
        form=form,
        house=house
    )
    
    new_user.save()
    
    
    
    
    return {
        "name": name,
        "email": email,
        "password": password
    }
    

def populate_db() -> None:
    df = pd.read_csv("test.csv")
    users = []
    
    print("Creating users...")
    for i, row in tqdm(df.iterrows()):
        users.append(create_user(email=row["email"],
                                 name=row["name"],
                                 surname=row["surname"],
                                 role=row["role"],
                                 form=row["form"],
                                 year=row["year"],
                                 house=row["house"]))
        
    print("Emailing credentials...")
    email_creds(users=users)