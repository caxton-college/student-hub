from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError

from rest_framework import serializers

UserModel = get_user_model()

class UserRegisterSerialiser(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = '__all__'
  
  
	def create(self, data):
		user_obj = UserModel.objects.create_user(email=data['email'], password=data['password'], name=data['name'], surname=data['surname'], role=data['role'])
		
		user_obj.save()
		return user_obj

class UserLoginSerialiser(serializers.Serializer):
    
	email = serializers.EmailField()
	password = serializers.CharField()
 
	def check_user(self, data):
		user = authenticate(username=data['email'], password=data['password'])
		if not user:
			raise ValidationError('user not found')
		return user

class UserSerialiser(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		exclude = ('password', "user_permissions", "groups")