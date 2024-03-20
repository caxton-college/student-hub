from django.urls import path

from rest_framework.authtoken.views import obtain_auth_token

from . import views

urlpatterns = [
    path("", views.Index.as_view(), name="index"),
    
    path("get_csrf_token", views.GetCSRFToken.as_view(), name="csrftoken"),
    path("register", views.UserRegister.as_view(), name="register"),
    path("login", obtain_auth_token, name="login"),
    path("logout", views.UserLogout.as_view(), name="logout"),
    path("user", views.UserView.as_view(), name="userview"),
    path("popular_suggestions", views.GetPopularSuggestions.as_view(), name="popularsuggestions"),
    path("new_suggestions", views.GetNewSuggestions.as_view(), name="newsuggestions"),
    path("user_suggestions", views.GetUserSuggestions.as_view(), name="usersuggestions"),
    path("delete_suggestion", views.DeleteSuggestion.as_view(), name="delete_suggestion"),
    path("announcements", views.GetAnnouncements.as_view(), name="announcements"),
    path("create_suggestion", views.CreateSuggestion.as_view(), name="createsuggestion"),
    path("create_announcement", views.CreateAnnouncement.as_view(), name="createannouncement"),
    path("delete_announcement", views.DeleteAnnouncement.as_view(), name="delete_announcement"),
    path("update_suggestion_likes", views.UpdateSuggestionLikes.as_view(), name="udpatesuggestionlikes"),
    path("update_suggestion_pin", views.UpdateSuggestionPin.as_view(), name="udpatesuggestionpin"),
    path("polls", views.GetPolls.as_view(), name="polls"),
    path("delete_poll", views.DeletePoll.as_view(), name="delete_poll"),
    path("create_poll", views.CreatePoll.as_view(), name="createpoll"),
    path("update_poll_likes", views.UpdatePollOptionLikedStatus.as_view(), name="updatepolllikedstatus"),
    path("search_user", views.SearchUser.as_view(), name="searchuser"),
    path("all_rewards", views.GetRewards.as_view(), name="all_rewards"),
    path("user_rewards", views.GetUserRewards.as_view(), name="userrewards"),
    path("current_user_rewards", views.GetCurrentUserRewards.as_view(), name="currentuserrewards"),
    path("purchase_reward", views.PurchaseReward.as_view(), name="purchasereward"),
    path("sell_reward", views.SellReward.as_view(), name="sellreward"),
    path("redeem_reward", views.RedeemReward.as_view(), name="redeemreward"),
    path("update_points", views.UpdateUserPoints.as_view(), name="updateuserpoints"),
    path("update_role", views.UpdateUserRole.as_view(), name="updaterole")
]

