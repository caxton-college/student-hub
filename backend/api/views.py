import datetime

from django.contrib.auth import login, logout

from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from users.models import User
from users.serialisers import UserRegisterSerialiser, UserLoginSerialiser, UserSerialiser

from feed.models import Announcement, Suggestion, Poll, PollOption
from feed.serialisers import AnnouncementSerializer, SuggestionSerializer, PollSerializer, PollOptionSerializer

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


class GetSuggestions(APIView):
	permission_classes = (permissions.AllowAny,)
	
	def get(self, request):
		suggestions = Suggestion.objects.all()
		serialiser = SuggestionSerializer(suggestions, many=True)
		
		
		
		for i in range(len(serialiser.data)):
			serialiser.data[i]["owner"] = User.objects.all().filter(user_id=serialiser.data[i]["owner"])[0].name.capitalize()

			if (user := request.user): # Not the most efficient, just wanted to use walrus operator :)
				serialiser.data[i]["liked"] = user.user_id in serialiser.data[i]["liked_by"]
				del serialiser.data[i]["liked_by"]



		return Response(serialiser.data, status=status.HTTP_200_OK)
	

class GetAnnouncements(APIView):
	permission_classes = (permissions.AllowAny,)
	
	def get(self, request):
		announcements = Announcement.objects.all()
		serialiser = AnnouncementSerializer(announcements, many=True)
		
		for i in range(len(serialiser.data)):
			serialiser.data[i]["owner"] = User.objects.all().filter(user_id=serialiser.data[i]["owner"])[0].name.capitalize()
			
		return Response(serialiser.data, status=status.HTTP_200_OK)
	
	
class CreateSuggestion(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
 
	def post(self, request):
		
		suggestion_body = dict(request.data)["body"]
		user = request.user

		if user.role == "teacher":
			return Response(status=status.HTTP_403_FORBIDDEN)
  
		new_suggestion = Suggestion.objects.create(body=suggestion_body, owner=user, liked_by=user)
		new_suggestion.save()
  
		return Response(status=status.HTTP_200_OK)


class CreateAnnouncement(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
 
	def post(self, request):
		
		data = dict(request.data)
		user = request.user

		if user.role == "teacher":
			return Response(status=status.HTTP_403_FORBIDDEN)
  
		new_announcement = Announcement.objects.create(title=data["title"], body=data["body"], owner=user)
		new_announcement.save()
  
		return Response(status=status.HTTP_200_OK)



class UpdateSuggestionLikes(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	
	def post(self, request):
		user = request.user
		suggestion_id = dict(request.data)["suggestion_id"]
		
		suggestion = Suggestion.objects.get(id=suggestion_id)
		serialiser = SuggestionSerializer(suggestion)
		
		if user.role == "teacher":
			return Response(status=status.HTTP_403_FORBIDDEN)
		
		if user.user_id in serialiser.data["liked_by"]:
			suggestion.liked_by.remove(user.user_id)
			suggestion.likes -= 1
			suggestion.save()
			
		else:
			suggestion.liked_by.add(user.user_id)
			suggestion.likes += 1
			suggestion.save()
			
		return Response(status=status.HTTP_200_OK)
		

class UpdateSuggestionPin(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	
	def post(self, request):
		user = request.user
		suggestion_id = dict(request.data)["suggestion_id"]
		
		suggestion = Suggestion.objects.get(id=suggestion_id)
		
		
		if user.role == "teacher":
			return Response(status=status.HTTP_403_FORBIDDEN)
  
		elif user.role == "student":
			return Response(status=status.HTTP_403_FORBIDDEN)

		else:
			suggestion.pinned = not suggestion.pinned
			suggestion.save()
			return Response(status=status.HTTP_200_OK)


		
		
		
		
  

