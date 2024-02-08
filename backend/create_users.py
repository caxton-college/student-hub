import smtplib
import string
from random import choice

from users.models import User

def email_creds(recipient: str, password: str) -> None:
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_username = 'email'
    smtp_password = 'pws'

    from_email = 'email'
    to_email = recipient
    subject = 'Student Hub Account'
    body = f'You can the new plaform with the following credenials:\nEmail: {recipient}\nPassword: {password}'

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
        role=role,
    )
    new_user.set_password(password)
    new_user.year = year
    new_user.form = form
    new_user.house = house
    print(password)
    new_user.save()
    


