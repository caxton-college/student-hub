import smtplib
import string
from random import choice
from typing import List, Dict

from django.contrib.auth.hashers import make_password

import pandas as pd
from tqdm import tqdm

from users.models import User

def email_creds(users: List[Dict[str, str]]) -> None:
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_username = 'clorenzozunigamari@caxtoncollege.net'
    smtp_password = 'Carlos-4407'

    

    with smtplib.SMTP(smtp_server, smtp_port) as smtp:
        
        smtp.starttls()
        smtp.login(smtp_username, smtp_password)
        
        for user in tqdm(users):
            recipient = user.get("recipient")
            password = user.get("password")
            
            from_email = 'email'
            to_email = "clorenzozunigamari@caxtoncollege.net"
            subject = 'Student Hub Account'
            body = f'You can log into the new plaform with the following credenials:\nEmail: {recipient}\nPassword: {password}'

            message = f'Subject: {subject}\n\n{body}'
            
            
            
            smtp.sendmail(from_email, to_email, message)
        
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