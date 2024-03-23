from django.http import HttpRequest
from django.contrib.auth import login, logout, authenticate
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.db.models import Q

from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import permissions, status

from fuzzywuzzy import fuzz

from users.models import User
from users.serialisers import UserRegisterSerialiser, UserSerialiser
from users.validations import custom_validation

from datetime import datetime, timedelta
from django.utils import timezone

from feed.models import Announcement, Suggestion, Poll, PollOption
from feed.serialisers import AnnouncementSerializer, SuggestionSerializer, PollSerializer, PollOptionSerializer

from rewards.models import Reward
from rewards.serialisers import RewardSerialiser

class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def get(self, request: HttpRequest) -> Response:
        """
        API index endpoint, check whether it is online.

        Args:
            request (HttpRequest): Nothing.

        Returns:
            Response: Response containing JSON with key "status".
        """
        csrf_token = get_token(request)
        return JsonResponse({'csrfToken': csrf_token})

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
    permission_classes = (permissions.IsAdminUser,)
    
    
    def post(self, request: HttpRequest) -> Response:
        """
        Create a user.

        Args:
            request (HttpRequest): Request containing email, name, surname, password, and role.

        Returns:
            Response: Status code 201 if the user was created, 400 if not. 
        """
        
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        clean_data = custom_validation(request.data)  # Assuming custom_validation function is defined elsewhere.
        serialiser = UserRegisterSerialiser(data=clean_data)  # Assuming UserRegisterSerializer is defined elsewhere.

        if serialiser.is_valid(raise_exception=True):
            new_user = serialiser.create(clean_data)
            new_user.save()
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
        data: dict = request.data
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
        
        user_data["user_suggestions"] = len(Suggestion.objects.all().filter(owner=request.user))
        
        return Response({'user': user_data}, status=status.HTTP_200_OK)



# Suggestion views
class GetPopularSuggestions(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def get(self, request: HttpRequest) -> Response:
        """
        Retrieve a list of suggestions.

        This endpoint allows users to retrieve a list of suggestions. Ordered by popularity.
        It includes information about the owner of each suggestion and whether the authenticated user has liked each suggestion.

        Args:
            request (HttpRequest): Request from the user.

        Returns:
            Response: A list of suggestions as serialized data and a status code of 200 (OK).
        """
        suggestions = Suggestion.objects.all().filter(date_created__gte=datetime.now(tz=timezone.utc)-timedelta(days=30)).order_by("-likes").order_by("-pinned")
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

class GetNewSuggestions(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def get(self, request: HttpRequest) -> Response:
        """
        Retrieve a list of suggestions.

        This endpoint allows users to retrieve a list of suggestions. Ordered from newest to oldest. 
        It includes information about the owner of each suggestion and whether the authenticated user has liked each suggestion.

        Args:
            request (HttpRequest): Request from the user.

        Returns:
            Response: A list of suggestions as serialized data and a status code of 200 (OK).
        """
        suggestions = Suggestion.objects.all().filter(date_created__gte=datetime.now(tz=timezone.utc)-timedelta(days=30)).order_by("-date_created")
        
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
        
        if user.role == 5:
            return Response({"message": "You sure you're a student?"}, status=status.HTTP_403_FORBIDDEN)
        
        data = dict(request.data)
        if not "body" in data.keys() or len(data.get("body")) <= 10:
            return Response({"message": "Try explaining a little more..."}, status=status.HTTP_400_BAD_REQUEST)
        
        suggestion_body = data["body"]
        
        new_suggestion = Suggestion.objects.create(body=suggestion_body, owner=user)
       
        new_suggestion.save()

        suggestion_data = {
            "suggestion_id": new_suggestion.id,
            "body": new_suggestion.body,
            "name": new_suggestion.owner.name,
            "surname": new_suggestion.owner.surname
        }
        
        #log_suggestion(suggestion_data)
        
        return Response({"message": "Suggestion created"}, status=status.HTTP_200_OK)
        
        


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
        
        if user.role == 5:
            return Response({"message": "You sure you're a student?"}, status=status.HTTP_403_FORBIDDEN)
        
        data = dict(request.data)
        
        if "id" not in data.keys():
            return Response({"message": "suggestion_id missing"}, status=status.HTTP_400_BAD_REQUEST)
        
        suggestion_id = data["id"]
        
        suggestion = Suggestion.objects.get(id=suggestion_id)
        suggestion_owner = suggestion.owner
        
        if user == suggestion_owner:
            return Response({"message": "Can't like your own suggestion!"}, status=status.HTTP_400_BAD_REQUEST)
 
        
        serialiser = SuggestionSerializer(suggestion)
        liked_data = {}
            
        if user.user_id in serialiser.data["liked_by"]:
            suggestion.liked_by.remove(user.user_id)
            suggestion.likes -= 1
            
            suggestion.save()
            user.likes -= 1
            user.points -= 1
            user.save()
            
            if user != suggestion_owner:
                suggestion_owner.points += 5

                suggestion_owner.save()
            
        else:
            suggestion.liked_by.add(user.user_id)
            suggestion.likes += 1
            suggestion.save()
            user.likes += 1
            user.points += 1
            user.save()
            
            if user != suggestion_owner:
                suggestion_owner.points += 5
            
                suggestion_owner.save()
        
        serialiser = SuggestionSerializer(suggestion)
          
        if (user := request.user):  # Not the most efficient, just wanted to use the walrus operator :)
            if user.is_authenticated:
                
                liked_data["liked"] = user.user_id in serialiser.data["liked_by"]
    
                
            else:
                serialiser.data["liked"] = False
        
        liked_data["likes"] = serialiser.data["likes"]
        
        return Response(liked_data, status=status.HTTP_200_OK)
	

class UpdateSuggestionPin(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    
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
        
        if user.role == 5 or user.role == 1:
            return Response({"message": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)
        
        data = dict(request.data)
        
        if "suggestion_id" not in data.keys():
            return Response({"message": "suggestion_id missing"}, status=status.HTTP_400_BAD_REQUEST)
        
        suggestion_id = data["suggestion_id"]
        
        suggestion = Suggestion.objects.get(id=suggestion_id)
        suggestion_owner = suggestion.owner
        
        if not suggestion.pinned:
            suggestion_owner.points += 10
        
        elif suggestion.pinned:
            suggestion_owner.points -= 10
        
        suggestion_owner.save()
        
        suggestion.pinned = not suggestion.pinned
        suggestion.save()
        
        
        
        
        
        return Response({"pinned": suggestion.pinned} ,status=status.HTTP_200_OK)




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
        announcements = Announcement.objects.all().filter(date_created__gte=datetime.now(tz=timezone.utc)-timedelta(days=30))
        serialiser = AnnouncementSerializer(announcements, many=True)
        
        for i in range(len(serialiser.data)):
            serialiser.data[i]["owner"] = User.objects.get(user_id=serialiser.data[i]["owner"]).name.capitalize()
            
        return Response(serialiser.data, status=status.HTTP_200_OK)


class CreateAnnouncement(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
 
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
            
            announcement = Announcement.objects.get(id=data["announcement_id"])

            # Check if the user is the owner of the suggestion or has permission to delete it.
            if request.user == announcement.owner or request.user.role not in ["teacher", "student"]:
                announcement.delete()
                return Response({"message": "Announcement deleted"}, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response(
                    {"message": "You don't have permission to delete this announcement."},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Poll.DoesNotExist:
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
        polls = Poll.objects.all().filter(date_created__gte=datetime.now(tz=timezone.utc)-timedelta(days=30))
        poll_data = []

        # Get the authenticated user (if any)
        user = request.user

        for poll in polls:
            # Serialize poll and its options
            poll_serializer = PollSerializer(poll)
            options = PollOption.objects.filter(poll=poll)
            options_data = PollOptionSerializer(options, many=True).data

            # If the user is authenticated, add "liked" key to options
            if user.is_authenticated:
                for option in options_data:
                    option["liked"] = user.user_id in option["liked_by"]
                    del option["liked_by"]
            else:
                for option in options_data:
                    option["liked"] = True
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
        
        if user.role == 5 or user.role == 1:
            return Response({"message": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)
        
        
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
            
            poll = Poll.objects.get(id=data["poll_id"])

            # Check if the user is the owner of the suggestion or has permission to delete it.
            if request.user == poll.owner or request.user.role not in [5, 1]:
                poll.delete()
                return Response({"message": "Poll deleted"}, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response(
                    {"message": "You don't have permission to delete this suggestion."},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Poll.DoesNotExist:
            return Response(
                {"message": "Poll not found."},
                status=status.HTTP_404_NOT_FOUND
            )
                       
class UpdatePollOptionLikedStatus(APIView):
    permission_classes = (permissions.IsAuthenticated,) 

    def post(self, request):
        """
        Update the liked status of a poll option.

        Args:
            request: Request containing the poll option ID.

        Returns:
            Response: Status code 200 (OK) if liked status is updated, 400 (Bad Request) if not.
        """
        user = request.user
        
        if not user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        if user.role == 5:
            return Response({"message": "You sure you're a student?"}, status=status.HTTP_403_FORBIDDEN)
        
        
        data = request.data
        option_id = data.get('id', None)

        if not option_id:
            return Response({"message": "Option ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            option = PollOption.objects.get(id=option_id)
            option_data = PollOptionSerializer(option).data
            
        except PollOption.DoesNotExist:
            return Response({"message": "Poll option not found."}, status=status.HTTP_400_BAD_REQUEST)

        
        if option.poll.owner == user:
            # Return an error message if the user tries to like their own poll option.
            return Response({"message": "Can't like your own poll!"}, status=status.HTTP_400_BAD_REQUEST)

        options_liked_data: dict[int, dict[str, int | bool]] = {}
        
        # Un-like other poll options in the same poll
        other_options = PollOption.objects.filter(poll=option.poll).exclude(id=option_id)
        for other_option in other_options:
            other_option_data = PollOptionSerializer(other_option).data
            if user.user_id in other_option_data["liked_by"]:
                user.likes -= 1
                user.points -= 1
                user.save()
                other_option.liked_by.remove(user.user_id)
                if other_option.likes > 0:  # Check that likes count is greater than zero before decrementing.
                    other_option.likes -= 1
                
                other_option.save()
                
            options_liked_data[other_option.id] = {"likes": other_option.likes, "liked": False}

        if user.user_id in option_data["liked_by"]:
            # If the user has already liked the option, un-like it.
            user.likes -= 1
            user.points -= 1
            user.save()
            
            option.liked_by.remove(user.user_id)
            if option.likes > 0:  # Check that likes count is greater than zero before decrementing.
                option.likes -= 1
            option.save() 
            options_liked_data[option.id] = {"likes": option.likes, "liked": False}
        else:
            # If the user hasn't liked the option, like it.
            
            option.likes += 1
            user.likes += 1
            user.points += 1
            user.save()
            
            option.liked_by.add(user.user_id)
            option.save() 
            options_liked_data[option.id] = {"likes": option.likes, "liked": True}

        
        
        return Response(options_liked_data, status=status.HTTP_200_OK)



class GetRewards(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def get(self, request: HttpRequest) -> Response:
        """
            Retrieves a list of all the available rewards

            Args:
                request (HttpRequest): Request from the user.

            Returns:
                Response: A list of rewards as serialized data and a status code of 200 (OK).
        """
        
        rewards = Reward.objects.all()
        serialiser = RewardSerialiser(rewards, many=True)
     

        return Response(serialiser.data, status=status.HTTP_200_OK)
    
    
class GetCurrentUserRewards(APIView):
    
    permission_classes = (permissions.IsAuthenticated,)
    
    def get(self, request: HttpRequest) -> Response:
        """
            Retrieves a list of the rewards owned by the current user

            Args:
                request (HttpRequest): Request from the user.

            Returns:
                Response: A list of rewards as serialized data and a status code of 200 (OK).
        """
        user = request.user
        rewards = list(filter(lambda reward: user in reward.owners.all(), Reward.objects.all()))
        
        serialiser = RewardSerialiser(rewards, many=True)


        return Response(serialiser.data, status=status.HTTP_200_OK)
    
    
class GetUserRewards(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def get(self, request: HttpRequest) -> Response:
        """
            Retrieves a list of the rewards owned by the current user

            Args:
                request (HttpRequest): Request from the user.

            Returns:
                Response: A list of rewards as serialized data and a status code of 200 (OK).
        """
        try:
            user_id = request.GET.get("user", None)
            user = User.objects.get(user_id=user_id)
            rewards = list(filter(lambda reward: user in reward.owners.all(), Reward.objects.all()))
            
            serialiser = RewardSerialiser(rewards, many=True)


            return Response(serialiser.data, status=status.HTTP_200_OK)
        
        except User.DoesNotExist:
            return Response({"message": "user not found"}, status=status.HTTP_404_NOT_FOUND)


class SearchUser(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        """
            Seaches for users given name, surname and/or yeargroup
            Args:
                request (HttpRequest): Request from the user.

            Returns:
                Response: A list of found users
        """
        
        name = request.GET.get("name", "")
        surname = request.GET.get("surname", "")
        year = request.GET.get("year", -1)

        # Fetch all users from the database
        all_users = User.objects.all()

        # Filter users based on the fuzzy matching criteria
        filtered_users = filter(
            lambda user: (
                (fuzz.ratio(name, user.name) >= 80 or
                fuzz.ratio(surname, user.surname) >= 80) and
                int(year) == user.year) and 
                user.role != 5,
            all_users
        )
        
        serialiser = UserSerialiser(list(filtered_users), many=True)
        
       
       
        return Response(serialiser.data, status=status.HTTP_200_OK)
    
    

class PurchaseReward(APIView):
    
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request: HttpRequest) -> Response:
        """
            Purchases a reward given an id, sufficient funds and reward not already owned
            
            Args:
                request (HttpRequest): Request from the user.

            Returns:
                Response: HTTP_401_UNAUTHORIZED if insuficient funds / already owned. HTTP_200_OK if successful. HTTP_404_NOT_FOUND if reward not found
        """
        user = request.user
        data = dict(request.data)
        
        reward_id = data.get("reward_id", "")
        
        try:
            reward = Reward.objects.get(id=reward_id)
            
            if user.points < reward.cost:
                return Response({"message": "Insuficient funds!"}, status=status.HTTP_401_UNAUTHORIZED)
            
            if user in reward.owners.all():
                return Response({"message": "Already owned!"}, status=status.HTTP_401_UNAUTHORIZED)
            
            
            user.points -= reward.cost
            reward.owners.add(user)
            
            reward.save()
            user.save()
            
            return Response({"message": "Purschase successful!"}, status=status.HTTP_200_OK)

            
        
        except Reward.DoesNotExist:
            return Response({"message": "Reward not found"}, status=status.HTTP_404_NOT_FOUND)



class SellReward(APIView):
    
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request: HttpRequest) -> Response:
        """
            Sells a reward given an id, and reward already owned
            
            Args:
                request (HttpRequest): Request from the user.

            Returns:
                Response: HTTP_401_UNAUTHORIZED if not already owned. HTTP_200_OK if successful. HTTP_404_NOT_FOUND if reward not found
        """
        user = request.user
        data = dict(request.data)
        
        reward_id = data.get("reward_id", "")
        
        try:
            reward = Reward.objects.get(id=reward_id)
            
            
            
            if user not in reward.owners.all():
                return Response({"message": "Not owned"}, status=status.HTTP_401_UNAUTHORIZED)
            
            
            reward.owners.remove(user)
            user.points += reward.cost
            
            reward.save()
            user.save()
            
            return Response({"message": "Sell successful!"}, status=status.HTTP_200_OK)

            
        
        except Reward.DoesNotExist:
            return Response({"message": "Reward not found"}, status=status.HTTP_404_NOT_FOUND)


class RedeemReward(APIView):
    
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request: HttpRequest) -> Response:
        """
            Sells a reward given an id, and reward already owned
            
            Args:
                request (HttpRequest): Request from the user.

            Returns:
                Response: HTTP_401_UNAUTHORIZED if not already owned. HTTP_200_OK if successful. HTTP_404_NOT_FOUND if reward not found
        """
        
        data = dict(request.data)
        
        reward_id = data.get("reward_id", "")
        user_id = data.get("user_id", "")
        
        try:
            reward = Reward.objects.get(id=reward_id)
            user = User.objects.get(user_id=user_id)
            
            
            if user not in reward.owners.all():
                return Response({"message": "Not owned"}, status=status.HTTP_401_UNAUTHORIZED)
            
            
            reward.owners.remove(user)
            
            reward.save()
            
            return Response({"message": "Redeem successful!"}, status=status.HTTP_200_OK)

            
        
        except Reward.DoesNotExist:
            return Response({"message": "Reward not found"}, status=status.HTTP_404_NOT_FOUND)
        
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        


class UpdateUserPoints(APIView):
    
    permission_classes = (permissions.IsAdminUser,)
    
    def post(self, request: HttpRequest) -> Response:
        """
            Sells a reward given an id, and reward already owned
            
            Args:
                request (HttpRequest): Request from the user.

            Returns:
                Response: HTTP_200_OK if successful. HTTP_404_NOT_FOUND if user not found
        """
      
        data = dict(request.data)
        
        user_id = data.get("user_id", "")
        points = data.get("points", 0)
        
        
        try:
            user = User.objects.get(user_id=user_id)
            
            if new_points := (user.points + points) < 0:
                return Response({"message": "Attempted to set points below 0, points unchanged"}, status=status.HTTP_401_UNAUTHORIZED)
            
            user.points = new_points            
            
            user.save()
            
            return Response({"message": "Points updated successfully"}, status=status.HTTP_200_OK)

            
        
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class UpdateUserRole(APIView):
    permission_classes = (permissions.IsAdminUser,)
    def post(self, request):
        """
        A function to handle POST requests, updating the user's role based on the provided data.
        
        Parameters:
            request (HttpRequest): The request object containing the data to update the user's role.
            
        Returns:
            Response: A JSON response indicating the success or failure of the role update.
        """
        data = dict(request.data)
        
        user_id = data.get("user_id", -1)
        new_role = data.get("role", 1)
        
        try:
            user = User.objects.get(user_id=user_id)
            
            if new_role not in [1, 2, 3, 4, 5]:
                return Response({"message": "Attempted to set invalid role"}, status=status.HTTP_400_BAD_REQUEST)
            
            user.role = new_role           
            
            user.save()
            
            return Response({"message": "Role updated successfully"}, status=status.HTTP_200_OK)

            
        
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
