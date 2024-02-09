import smtplib
import string
from random import choice

from django.contrib.auth.hashers import make_password

import pandas as pd

from users.models import User

def email_creds(recipient: str, password: str) -> None:
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_username = 'email'
    smtp_password = 'psw'

    from_email = 'email'
    to_email = recipient
    subject = 'Student Hub Account'
    body = f'You can log into the new plaform with the following credenials:\nEmail: {recipient}\nPassword: {password}'

    message = f'Subject: {subject}\n\n{body}'

    with smtplib.SMTP(smtp_server, smtp_port) as smtp:
        smtp.starttls()
        smtp.login(smtp_username, smtp_password)
        smtp.sendmail(from_email, to_email, message)
        
def generate_password(length: int) -> str:
    
    return "".join([choice(string.ascii_letters) for _ in range(length)])
        
def create_user(email: str,
                name: str,
                surname: str,
                role: int,
                year: int,
                form: int,
                house: int) -> None:
    
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
    
    email_creds(recipient=email, password=password)
    
    new_user.save()
    

def populate_db() -> None:
    df = pd.read_csv("test.csv")
    
    for i, row in df.iterrows():
        create_user(email=row["email"],
                    name=row["name"],
                    surname=row["surname"],
                    role=row["role"],
                    form=row["form"],
                    year=row["year"],
                    house=row["house"])