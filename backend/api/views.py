import datetime

from django.contrib.auth import login, logout

from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from users.serialisers import UserRegisterSerialiser, UserLoginSerialiser, UserSerialiser

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



class UserLogin(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = (SessionAuthentication,)
 
	def post(self, request):
		data = request.data
		assert validate_email(data)
		assert validate_password(data)
		serialiser = UserLoginSerialiser(data=data)
		
		if serialiser.is_valid(raise_exception=True):
			user = serialiser.check_user(data)
			login(request, user)
			return Response(serialiser.data, status=status.HTTP_200_OK)
	


class UserLogout(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = ()
	def post(self, request):
		logout(request)
		return Response(status=status.HTTP_200_OK)


class UserView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	
	def get(self, request):
		serialiser = UserSerialiser(request.user)
		return Response({'user': serialiser.data}, status=status.HTTP_200_OK)