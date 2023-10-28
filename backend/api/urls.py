from django.urls import path
from . import views

urlpatterns = [
    path("", views.Index.as_view(), name="index"),
    path("get_csrf_token", views.GetCSRFToken.as_view(), name="csrftoken"),
    path("register", views.UserRegister.as_view(), name="register"),
    path("login", views.UserLogin.as_view(), name="login"),
    path("logout", views.UserLogout.as_view(), name="logout"),
    path("user", views.UserView.as_view(), name="userview"),
    path("suggestions", views.GetSuggestions.as_view(), name="suggestions"),
    path("user_suggestions", views.GetUserSuggestions.as_view(), name="usersuggestions"),
    path("delete_suggestion", views.DeleteSuggestion.as_view(), name="delete_suggestion"),
    path("announcements", views.GetAnnouncements.as_view(), name="announcements"),
    path("create_suggestion", views.CreateSuggestion.as_view(), name="createsuggestion"),
    path("create_announcement", views.CreateAnnouncement.as_view(), name="createannouncement"),
    path("update_suggestion_likes", views.UpdateSuggestionLikes.as_view(), name="udpatesuggestionlikes"),
    path("update_suggestion_pin", views.UpdateSuggestionPin.as_view(), name="udpatesuggestionpin"),
    path("get_polls", views.GetPolls.as_view(), name="createpoll"),
    path("create_poll", views.CreatePoll.as_view(), name="createpoll"),
    path("update_poll_liked_status", views.UpdatePollOptionLikedStatus.as_view(), name="updatepolllikedstatus"),
]

