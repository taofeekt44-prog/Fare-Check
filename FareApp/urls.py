from django.urls import path
from . import views

urlpatterns = [
    path('signups/', views.RegisterView, name='register'),
    path('login/', views.LoginView, name='user_login'),
    path('logout/', views.Logout, name='user_logout'),
    path('Fare_check_Dashboard/', views.User_Dashboard, name='user_dashboard'),
    path('route-search/', views.route_search, name='user_search'),
    path("route/<int:route_id>/",views.route_detail,name="route_detail"),
    path('Fare-check-submit-fare/', views.Submit_Fare, name='submit-fare'),
    path('Fare-check/', views.User_Fare, name='user_fare'),
    path("all-fares/",views.All_Fares,name="all_fares"),
    path("FLag-Fare/<int:fare_id>/",views.Flag_Fare,name="flag_fare"),
    path("profile/",views.Profile_View,name="profile"),
    path("profile/edit/",views.Edit_Profile,name="edit_profile"),
    path("flag-success/",views.Flag_Success,name="flag_success"),
    path("flag-failure/",views.Flag_Failure,name="flag_failure"),
    path("admin-dashboard/",views.Admin_Dashboard,name="admin_dashboard"),
    path("admin-dashboard/flags/",views.Admin_Flags,name="admin_flags"),
    path("admin-dashboard/flags/<int:flag_id>/",views.Admin_Flag_Detail,name="admin_flag_detail"),
    path("admin-dashboard/flags/<int:flag_id>/resolve/",views.Resolve_Flag,name="resolve_flag"),
    path("admin-dashboard/fares/",views.Admin_Fares,name="admin_fares"),
    path("admin-dashboard/routes/",views.Admin_Routes,name="admin_routes"),
    path("admin-dashboard/users/",views.Admin_Users,name="admin_users"),
]