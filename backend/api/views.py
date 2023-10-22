import datetime

from django.contrib.auth import login, logout, authenticate

from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework import permissions, status
from django.http import HttpRequest
from users.models import User
from users.serialisers import UserRegisterSerialiser, UserLoginSerialiser, UserSerialiser

from feed.models import Announcement, Suggestion, Poll, PollOption
from feed.serialisers import AnnouncementSerializer, SuggestionSerializer, PollSerializer, PollOptionSerializer

from users.validations import custom_validation, validate_email, validate_password

# Create your views here.
class Index(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def get(self, request: HttpRequest) -> Response:
        """
        API index endpoint, check whether it is online.

        Args:
            request (HttpRequest): Nothing.

        Returns:
            Response: Response containing JSON with key "status".
        """
        return Response({"status": "online"}, status=status.HTTP_200_OK)




class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request: HttpRequest) -> Response:
        """
        Create a user.

        Args:
            request (HttpRequest): Request containing email, name, surname, password, and role.

        Returns:
            Response: Status code 201 if the user was created, 400 if not. 
        """
        clean_data = custom_validation(request.data)  # Assuming custom_validation function is defined elsewhere.
        serialiser = UserRegisterSerialiser(data=clean_data)  # Assuming UserRegisterSerializer is defined elsewhere.

        if serialiser.is_valid(raise_exception=True):
            user = serialiser.create(clean_data)
            user.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)




class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request: HttpRequest) -> Response:
        """
        Login with credentials

        Args:
            request (HttpRequest): Request containing email and password

        Returns:
            Response: Status code 200 if valid credentials, 400 if not
        """
        data = request.data
        email = data.get('email', '')
        password = data.get('password', '')

        if not email or not password:
            return Response({"message": "Both an email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password)

        if user is not None:
            login(request, user)
            return Response({"message": "Login successful."}, status=status.HTTP_200_OK)
        else:
            try:
                user = User.objects.get(email=email)
                return Response({"message": "Incorrect password."}, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({"message": "User not found."}, status=status.HTTP_400_BAD_REQUEST)
	


class UserLogout(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request: HttpRequest) -> Response:
        """
        Logout the currently authenticated user.

        This endpoint allows an authenticated user to log out, effectively ending their session.

        Args:
            request (HttpRequest): Request from the authenticated user.

        Returns:
            Response: Status code 200 indicating a successful logout.
        """
        logout(request)
        return Response(status=status.HTTP_200_OK)



class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    
    def get(self, request: HttpRequest) -> Response:
        """
        Retrieve the currently authenticated user's information.

        This endpoint allows an authenticated user to retrieve their own user information.

        Args:
            request (HttpRequest): Request from the authenticated user.

        Returns:
            Response: User information as serialized data and a status code of 200 (OK).
        """
        serialiser = UserSerialiser(request.user)
        return Response({'user': serialiser.data}, status=status.HTTP_200_OK)



class GetSuggestions(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def get(self, request: HttpRequest) -> Response:
        """
        Retrieve a list of suggestions.

        This endpoint allows users to retrieve a list of suggestions. It includes information about the owner of each suggestion and whether the authenticated user has liked each suggestion.

        Args:
            request (HttpRequest): Request from the user.

        Returns:
            Response: A list of suggestions as serialized data and a status code of 200 (OK).
        """
        suggestions = Suggestion.objects.all()
        serialiser = SuggestionSerializer(suggestions, many=True)
        
        for i in range(len(serialiser.data)):
            serialiser.data[i]["owner"] = User.objects.get(user_id=serialiser.data[i]["owner"]).name.capitalize()

            if (user := request.user):  # Not the most efficient, just wanted to use the walrus operator :)
                serialiser.data[i]["liked"] = user.user_id in serialiser.data[i]["liked_by"]
                del serialiser.data[i]["liked_by"]

        return Response(serialiser.data, status=status.HTTP_200_OK)

	

class GetAnnouncements(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def get(self, request: HttpRequest) -> Response:
        """
        Retrieve a list of announcements.

        This endpoint allows users to retrieve a list of announcements, including information about the owner of each announcement.

        Args:
            request (HttpRequest): Request from the user.

        Returns:
            Response: A list of announcements as serialized data and a status code of 200 (OK).
        """
        announcements = Announcement.objects.all()
        serialiser = AnnouncementSerializer(announcements, many=True)
        
        for i in range(len(serialiser.data)):
            serialiser.data[i]["owner"] = User.objects.get(user_id=serialiser.data[i]["owner"]).name.capitalize()
            
        return Response(serialiser.data, status=status.HTTP_200_OK)

	
class CreateSuggestion(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
 
    def post(self, request: HttpRequest) -> Response:
        """
        Create a new suggestion.

        This endpoint allows authenticated users (excluding teachers) to create a new suggestion.

        Args:
            request (HttpRequest): Request with the suggestion body.

        Returns:
            Response: Status code 200 (OK) if the suggestion is created, 403 (FORBIDDEN) if the user is a teacher.
        """
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
 
    def post(self, request: HttpRequest) -> Response:
        """
        Create a new announcement.

        This endpoint allows authenticated users (excluding teachers) to create a new announcement.

        Args:
            request (HttpRequest): Request with the announcement title and body.

        Returns:
            Response: Status code 200 (OK) if the announcement is created, 403 (FORBIDDEN) if the user is a teacher.
        """
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
    
    def post(self, request: HttpRequest) -> Response:
        """
        Update likes for a suggestion.

        This endpoint allows authenticated users (excluding teachers) to update the likes for a suggestion by toggling their like status.

        Args:
            request (HttpRequest): Request with the suggestion ID.

        Returns:
            Response: Status code 200 (OK) if the like is updated, 403 (FORBIDDEN) if the user is a teacher.
        """
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
    
    def post(self, request: HttpRequest) -> Response:
        """
        Update the pinned status of a suggestion.

        This endpoint allows authenticated users (excluding teachers and students) to update the pinned status of a suggestion, toggling it.

        Args:
            request (HttpRequest): Request with the suggestion ID.

        Returns:
            Response: Status code 200 (OK) if the pinned status is updated, 403 (FORBIDDEN) if the user is a teacher or student.
        """
        user = request.user
        suggestion_id = dict(request.data)["suggestion_id"]
        
        suggestion = Suggestion.objects.get(id=suggestion_id)
        
        if user.role == "teacher" or user.role == "student":
            return Response(status=status.HTTP_403_FORBIDDEN)
  
        suggestion.pinned = not suggestion.pinned
        suggestion.save()
        return Response(status=status.HTTP_200_OK)



		
		
		
