from django.http import HttpRequest
from django.contrib.auth import login, logout, authenticate

from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from users.models import User
from users.serialisers import UserRegisterSerialiser, UserSerialiser
from users.validations import custom_validation


from feed.models import Announcement, Suggestion, Poll, PollOption
from feed.serialisers import AnnouncementSerializer, SuggestionSerializer, PollSerializer, PollOptionSerializer



# Index
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


# User views
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
        user_data = serialiser.data
        user_data["name"] = serialiser.data["name"].capitalize()
        user_data["surname"] = serialiser.data["surname"].capitalize()
        
        return Response({'user': user_data}, status=status.HTTP_200_OK)




# Suggestion views
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
            owner = User.objects.get(user_id=serialiser.data[i]["owner"])
            serialiser.data[i]["owner"] = f"{owner.name.capitalize()} {owner.surname.capitalize()}"

            if (user := request.user):  # Not the most efficient, just wanted to use the walrus operator :)
                if user.is_authenticated:
                    serialiser.data[i]["liked"] = user.user_id in serialiser.data[i]["liked_by"]
                    del serialiser.data[i]["liked_by"]
                
            else:
                serialiser.data[i]["liked"] = False

        return Response(serialiser.data, status=status.HTTP_200_OK)


class GetUserSuggestions(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    
    def get(self, request: HttpRequest) -> Response:
        """
        Retrieve a list of all suggestions made by the current user.

        This endpoint allows a user to retrieve a list of suggestions. It includes information about the owner of each suggestion and whether the authenticated user has liked each suggestion.

        Args:
            request (HttpRequest): Request from the user.

        Returns:
            Response: A list of suggestions as serialized data and a status code of 200 (OK).
        """
        suggestions = Suggestion.objects.all().filter(owner=request.user)
        serialiser = SuggestionSerializer(suggestions, many=True)
        
        for i in range(len(serialiser.data)):
            serialiser.data[i]["owner"] = User.objects.get(user_id=serialiser.data[i]["owner"]).name.capitalize()

            if (user := request.user):  # Not the most efficient, just wanted to use the walrus operator :)
                serialiser.data[i]["liked"] = user.user_id in serialiser.data[i]["liked_by"]
                del serialiser.data[i]["liked_by"]

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
        user = request.user
        
        if user.role == "teacher":
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        data = dict(request.data)
        if not "body" in data.keys():
            return Response({"message": "suggestion body missing"}, status=status.HTTP_400_BAD_REQUEST)
        
        suggestion_body = data["body"]
        
        

    
        new_suggestion = Suggestion.objects.create(body=suggestion_body, owner=user)
        new_suggestion.liked_by.add(user)
        new_suggestion.save()
  
        return Response(status=status.HTTP_200_OK)


class DeleteSuggestion(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        """
        Delete a suggestion by ID.

        Args:
            request: Request to delete a suggestion.

        Returns:
            Response:
            Status code 200 (No Content) if the suggestion is successfully deleted.
            Status code 404 (Not Found) if the suggestion with the given ID is not found.
            Status code 403 (Forbidden) if the user is not allowed to delete the suggestion.
        """
        try:
            data = dict(request.data)
            suggestion = Suggestion.objects.get(id=data["suggestion_id"])

            # Check if the user is the owner of the suggestion or has permission to delete it.
            if request.user == suggestion.owner or request.user.role not in ["teacher", "student"]:
                suggestion.delete()
                return Response({"message": "Suggestion deleted"}, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response(
                    {"message": "You don't have permission to delete this suggestion."},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Suggestion.DoesNotExist:
            return Response(
                {"message": "Suggestion not found."},
                status=status.HTTP_404_NOT_FOUND
            )


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
        
        if user.role == "teacher":
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        data = dict(request.data)
        
        if "suggestion_id" not in data.keys():
            return Response({"message": "suggestion_id missing"}, status=status.HTTP_400_BAD_REQUEST)
        
        suggestion_id = data["suggestion_id"]
        
        suggestion = Suggestion.objects.get(id=suggestion_id)
        serialiser = SuggestionSerializer(suggestion)
        
        
        
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
        
        if user.role == "teacher" or user.role == "student":
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        data = dict(request.data)
        
        if "suggestion_id" not in data.keys():
            return Response({"message": "suggestion_id missing"}, status=status.HTTP_400_BAD_REQUEST)
        
        suggestion_id = data["suggestion_id"]
        
        suggestion = Suggestion.objects.get(id=suggestion_id)
        
        
  
        suggestion.pinned = not suggestion.pinned
        suggestion.save()
        return Response(status=status.HTTP_200_OK)




# Announcement views
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
        
        user = request.user

        if user.role in ["teacher", "student"]:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        
        data = dict(request.data)
        
        if "title" not in data.keys():
            return Response({"message": "Announcement title missing"}, status=status.HTTP_400_BAD_REQUEST)
        
        if "body" not in data.keys():
            return Response({"message": "Announcement body missing"}, status=status.HTTP_400_BAD_REQUEST)
        
        new_announcement = Announcement.objects.create(title=data["title"], body=data["body"], owner=user)
        new_announcement.save()
  
        return Response(status=status.HTTP_200_OK)


class DeleteAnnouncement(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def delete(self, request, announcement_id):
        """
        Delete an announcement by ID.

        Args:
            request: Request to delete an announcement.
            announcement_id (int): The ID of the announcement to be deleted.

        Returns:
            Response: 
            Status code 204 (No Content) if the announcement is successfully deleted.
            Status code 404 (Not Found) if the announcement with the given ID is not found.
            Status code 403 (Forbidden) if the user is not allowed to delete the announcement.
        """
        try:
            announcement = Announcement.objects.get(id=announcement_id)

            # Check if the user is the owner of the announcement or has permission to delete it.
            if request.user == announcement.owner or request.user.role not in ["teacher", "student"]:
                announcement.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response(
                    {"message": "You don't have permission to delete this announcement."},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Announcement.DoesNotExist:
            return Response(
                {"message": "Announcement not found."},
                status=status.HTTP_404_NOT_FOUND
            )




# Poll views
class GetPolls(APIView):
    permission_classes = (permissions.AllowAny,)  # Allow access to anyone.

    def get(self, request: HttpRequest) -> Response:
        """
        Retrieve a list of all polls with their options.

        Args:
            request: Request to retrieve polls.

        Returns:
            Response: A list of polls with their options and a status code of 200 (OK).
        """
        polls = Poll.objects.all()
        poll_data = []

        # Get the authenticated user (if any)
        user = request.user

        for poll in polls:
            # Serialize poll and its options
            poll_serializer = PollSerializer(poll)
            options = PollOption.objects.filter(poll=poll)
            options_data = PollOptionSerializer(options, many=True).data

            # If the user is authenticated, add "liked" key to options
            if user:
                for option in options_data:
                    option["liked"] = user.user_id in option["liked_by"]
                    del option["liked_by"]

            poll_data.append({
                'poll': poll_serializer.data,
                'options': options_data
            })

        return Response(poll_data, status=status.HTTP_200_OK)
		
class CreatePoll(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request: HttpRequest) -> Response:
        """
        Create a new poll.

        Args:
            request (HttpRequest): Request containing a JSON with a question and a list of poll options.

        Returns:
            Response: Status code 201 if the poll is created, 400 if not.
        """
        
        user = request.user
        
        if user.role == "teacher" or user.role == "student":
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        
        data = dict(request.data)

        if "question" not in data.keys():
            return Response({"message": "Poll question missing"}, status=status.HTTP_400_BAD_REQUEST)
        
        if "poll_options" not in data.keys():
            return Response({"message": "Poll options missing"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create a poll with the provided question and owner (authenticated user).
        poll_serializer = PollSerializer(data={'question': data.get('question'), 'owner': request.user.user_id})

        if poll_serializer.is_valid():
            poll = poll_serializer.save()

            # Create poll options from the list of options provided in the request.
            poll_option_data = data.get('poll_options', [])
            poll_option_instances = []

            for option_text in poll_option_data:
                poll_option_instances.append(PollOption(body=option_text, poll=poll))

            PollOption.objects.bulk_create(poll_option_instances)

            return Response({'message': 'Poll created successfully.'}, status=status.HTTP_201_CREATED)
        else:
            return Response(poll_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class DeletePoll(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def delete(self, request, poll_id):
        """
        Delete a poll by ID.

        Args:
            request: Request to delete a poll.
            poll_id (int): The ID of the poll to be deleted.

        Returns:
            Response: 
            Status code 204 (No Content) if the poll is successfully deleted.
            Status code 404 (Not Found) if the poll with the given ID is not found.
            Status code 403 (Forbidden) if the user is not allowed to delete the poll.
        """
        try:
            poll = Poll.objects.get(id=poll_id)

            # Check if the user is the owner of the poll or has permission to delete it.
            if request.user == poll.owner or request.user.role not in ["teacher", "student"]:
                poll.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response(
                    {"message": "You don't have permission to delete this poll."},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Poll.DoesNotExist:
            return Response(
                {"message": "Poll not found."},
                status=status.HTTP_404_NOT_FOUND
            )
                       
class UpdatePollOptionLikedStatus(APIView):
    permission_classes = (permissions.IsAuthenticated,)  # Requires authentication for the entire view.

    def post(self, request):
        """
        Update the liked status of a poll option.

        Args:
            request: Request containing the poll option ID.

        Returns:
            Response: Status code 200 (OK) if liked status is updated, 400 (Bad Request) if not.
        """
        user = request.user
        if user.role == "teacher":
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        
        data = request.data
        option_id = data.get('option_id', None)

        if not option_id:
            return Response({"message": "Option ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            option = PollOption.objects.get(id=option_id)
            option_data = PollOptionSerializer(option).data
        except PollOption.DoesNotExist:
            return Response({"message": "Poll option not found."}, status=status.HTTP_400_BAD_REQUEST)

        if option.poll.owner == user:
            # Return an error message if the user tries to like their own poll option.
            return Response({"message": "You cannot like your own poll option."}, status=status.HTTP_400_BAD_REQUEST)

        # Un-like other poll options in the same poll
        other_options = PollOption.objects.filter(poll=option.poll).exclude(id=option_id)

        for other_option in other_options:
            other_option_data = PollOptionSerializer(other_option).data
            if user.user_id in other_option_data["liked_by"]:
                other_option.liked_by.remove(user.user_id)
                if other_option.likes > 0:  # Check that likes count is greater than zero before decrementing.
                    other_option.likes -= 1
                other_option.save()

        if user.user_id in option_data["liked_by"]:
            # If the user has already liked the option, un-like it.
            option.liked_by.remove(user.user_id)
            if option.likes > 0:  # Check that likes count is greater than zero before decrementing.
                option.likes -= 1
        else:
            # If the user hasn't liked the option, like it.
            option.liked_by.add(user.user_id)
            option.likes += 1

        option.save()
        
        return Response({"message": "Liked status updated."}, status=status.HTTP_200_OK)


