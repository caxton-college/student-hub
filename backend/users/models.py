from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

class UserManager(BaseUserManager):
	def create_user(self, email: str, password: str, name: str, surname: str, role: int=1):
		if not email:
			raise ValueError('An email is required.')

		if not password:
			raise ValueError('A password is required.')

		if not name:
			raise ValueError('A name is required.')

		if not surname:
			raise ValueError('A surname is required.')


		email = self.normalize_email(email)
		user = self.model(email=email, name=name, surname=surname, role=role)
		user.set_password(password)
		user.save()
		return user

	
 
	def create_superuser(self, email: str, password: str, name: str, surname: str, role: int=3):
		if not email:
			raise ValueError('An email is required.')

		if not password:
			raise ValueError('A password is required.')

		if not name:
			raise ValueError('A name is required.')

		if not surname:
			raise ValueError('A surname is required.')

		
		user = self.create_user(email=email, password=password, name=name, surname=surname, role=role)
		user.is_superuser = True
		user.is_staff = True
		
		user.save()
		return user


class User(AbstractBaseUser, PermissionsMixin):
	class Role(models.IntegerChoices):
		STUDENT = 1
		AMBASSADOR = 2
		STUDENT_COUNCIL =  3
		CO_PRESIDENT = 4
		TEACHER = 5
  
	
 	
	user_id = models.AutoField(primary_key=True)
	email = models.EmailField(max_length=50, unique=True)
	name = models.CharField(max_length=50)
	surname = models.CharField(max_length=50)
	role = models.IntegerField(Role.choices, default=1)
	
 
	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['name', 'surname', 'role']
	
	is_active = models.BooleanField(default=True)  # Added 'is_active' field for user activation
	is_staff = models.BooleanField(default=False) 
 
	objects = UserManager()
	def __str__(self):
		return self.name