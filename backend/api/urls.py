from django.urls import path
from . import views

urlpatterns = [
    path("", views.Index.as_view(), name="index"),
    path("register", views.UserRegister.as_view(), name="register"),
    path("login", views.UserLogin.as_view(), name="login"),
    path("user", views.UserView.as_view(), name="userview")
]
