import datetime

from django.shortcuts import render
from django.contrib.auth import login, logout
from django.core.exceptions import ValidationError
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from users.serialisers import UserRegisterSerialiser, UserLoginSerialiser, UserSerialiser
from rest_framework import permissions, status
from users.validations import custom_validation, validate_email, validate_password

# Create your views here.
class Index(APIView):
	permission_classes = (permissions.AllowAny,)
	def get(self, response):
		return Response({"status": "online"}, status=status.HTTP_200_OK)



class UserRegister(APIView):
	permission_classes = (permissions.AllowAny,)
	def post(self, request):
		clean_data = custom_validation(request.data)
		serialiser = UserRegisterSerialiser(data=clean_data)
		if serialiser.is_valid(raise_exception=True):
			user = serialiser.create(clean_data)
			user.save()
			return Response(serialiser.data, status=status.HTTP_201_CREATED)
		return Response(status=status.HTTP_400_BAD_REQUEST)