from django.urls import path
from . import views

urlpatterns = [
    path("", views.Index.as_view(), name="index"),
    path("register", views.UserRegister.as_view(), name="register"),
    path("login", views.UserLogin.as_view(), name="login"),
    path("user", views.UserView.as_view(), name="userview"),
    path("suggestions", views.GetSuggestions.as_view(), name="suggestions"),
    path("announcements", views.GetAnnouncements.as_view(), name="announcements"),
    path("create_suggestion", views.CreateSuggestion.as_view(), name="createsuggestion"),
    path("create_announcement", views.CreateAnnouncement.as_view(), name="createannouncement"),

]

