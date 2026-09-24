from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpRequest, HttpResponse
from django.contrib.auth.decorators import login_required,user_passes_test
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Min, Max, Avg
from decimal import Decimal, InvalidOperation
from datetime import timedelta
from .models import Route, FareSubmission, Flag, Profile

def RegisterView(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        username = request.POST.get("username", "").strip()
        email = request.POST.get("email", "").strip()
        password = request.POST.get("password", "")
        confirmpassword = request.POST.get("confirmpassword", "")
        if not username or not email or not password or not confirmpassword:
            return render(request,"user/register.html",{"error": "All fields are required"})
        if len(password) < 8:
            return render(request,"user/register.html",{"error": "Password must be at least 8 characters"})
        if password != confirmpassword:
            return render(request,"user/register.html",{"error": "Passwords do not match"})
        if User.objects.filter(username=username).exists():
            return render(request,"user/register.html",{"error": "That username is already taken"})
        if User.objects.filter(email=email).exists():
            return render(request,"user/register.html",{"error": "That email is already registered"})
        try:
            User.objects.create_user(username=username,email=email,password=password)
            return redirect("user_login")
        except Exception:
            return render(request,"user/register.html",{"error": "Something went wrong while creating your account"})
    return render(request, "user/register.html")

def LoginView(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        email = request.POST.get("email", "").strip()
        password = request.POST.get("password", "")
        if not email or not password:
            return render(request,"user/Login.html",{"error": "All fields are required"})
        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            user_obj = None
        except User.MultipleObjectsReturned:
            return render(request,"user/Login.html",{"error": "This email is associated with multiple accounts"})
        if user_obj:
            user = authenticate(request,username=user_obj.username,password=password)
        else:
            user = None
        if user is None:
            return render(request,"user/Login.html",{"error": "User credentials are not valid"})
        login(request, user)
        if user.is_superuser:
            return redirect("admin_dashboard")
        return redirect("user_dashboard")
    return render(request, "user/Login.html")

@login_required
def Logout(request: HttpRequest) -> HttpResponse:
    logout(request)
    return redirect("user_login")

@login_required
def User_Dashboard(request: HttpRequest) -> HttpResponse:
    if request.user.is_superuser:
        return redirect("admin_dashboard")
    fares = (FareSubmission.objects.select_related("route", "user").order_by("-created_at")[:3])
    return render(request,"user/user_dashboard.html",{"fares": fares})

@login_required
def route_search(request: HttpRequest) -> HttpResponse:
    if request.user.is_superuser:
        return redirect("admin_dashboard")
    origin = request.GET.get("origin", "").strip()
    destination = request.GET.get("destination", "").strip()
    routes = Route.objects.none()
    if origin and destination:
        routes = Route.objects.filter(origin__iexact=origin,destination__iexact=destination)
    return render(request,"user/route-search.html",{"routes": routes,"origin": origin,"destination": destination})

@login_required
def route_detail(request: HttpRequest,route_id: int) -> HttpResponse:
    if request.user.is_superuser:
        return redirect("admin_dashboard")
    route = get_object_or_404(Route,id=route_id)
    transport_type = request.GET.get("transport","").strip()
    today_only = request.GET.get("today")
    fares = FareSubmission.objects.filter(route=route).select_related("user","route")
    if transport_type:
        fares = fares.filter(transport_type=transport_type)
    if today_only:
        fares = fares.filter(created_at__date=timezone.localdate())
    stats = fares.aggregate(
        minimum=Min("amount"),
        maximum=Max("amount"),
        average=Avg("amount")
    )
    current_date = timezone.localdate()
    chart_labels = []
    chart_data = []
    for i in range(6, -1, -1):
        date = current_date - timedelta(days=i)
        chart_fares = FareSubmission.objects.filter(
            route=route,
            created_at__date=date
        )

        if transport_type:
            chart_fares = chart_fares.filter(transport_type=transport_type)
        average = chart_fares.aggregate(average=Avg("amount"))["average"]
        chart_labels.append(date.strftime("%d %b"))
        chart_data.append(float(average) if average else 0)
    return render(request,"user/route-detail.html",{
            "route": route,
            "minimum": stats["minimum"],
            "maximum": stats["maximum"],
            "average": stats["average"],
            "fares": fares,
            "selected_transport": transport_type,
            "today_selected": today_only,
            "chart_labels": chart_labels,
            "chart_data": chart_data,
        }
    )

@login_required
def Submit_Fare(request: HttpRequest) -> HttpResponse:
    if request.user.is_superuser:
        return redirect("admin_dashboard")
    if request.method == "POST":
        origin = request.POST.get("origin","").strip()
        destination = request.POST.get("destination","").strip()
        transport_type = request.POST.get("transport_type","").strip()
        amount = request.POST.get("amount","").strip()
        time_of_day = request.POST.get("time_of_day","").strip()
        if not origin or not destination or not transport_type or not amount:
            return render(request,"user/submit_fare.html",{"error": "Please fill in all required fields."})
        if origin.lower() == destination.lower():
            return render(request,"user/submit_fare.html",{"error": "Origin and destination cannot be the same."})
        try:
            amount = Decimal(amount)
        except (InvalidOperation, TypeError):
            return render(request,"user/submit_fare.html",{"error": "Please enter a valid fare amount."})
        if amount <= 0:
            return render(request,"user/submit_fare.html",{"error": "Fare amount must be greater than zero."})
        try:
            route, created = Route.objects.get_or_create(
                origin=origin,
                destination=destination
            )
            FareSubmission.objects.create(
                user=request.user,
                route=route,
                transport_type=transport_type,
                amount=amount,
                time_of_day=time_of_day
            )
            return redirect("route_detail",route_id=route.id)
        except Exception:
            return render(request,"user/submit_fare.html",{"error": "Something went wrong while submitting your fare."})
    return render(request,"user/submit_fare.html")

@login_required
def User_Fare(request: HttpRequest) -> HttpResponse:
    if request.user.is_superuser:
        return redirect("admin_dashboard")
    fares = (
        FareSubmission.objects
        .filter(user=request.user)
        .select_related("route")
        .order_by("-created_at")
    )
    return render(request,"user/user-fare.html",{"fares": fares})

@login_required
def All_Fares(request: HttpRequest) -> HttpResponse:
    if request.user.is_superuser:
        return redirect("admin_dashboard")
    fares = (
        FareSubmission.objects
        .select_related("route", "user")
        .order_by("-created_at")
    )

    return render(request,"user/all-fares.html",{"fares": fares})

@login_required
def Profile_View(request: HttpRequest) -> HttpResponse:
    if request.user.is_superuser:
        return redirect("admin_dashboard")
    profile, created = Profile.objects.get_or_create(user=request.user)
    fares = (
        FareSubmission.objects
        .filter(user=request.user)
        .select_related("route")
        .order_by("-created_at")[:3]
    )

    total_fares = FareSubmission.objects.filter(user=request.user).count()
    return render(request,"user/profile.html",{
            "profile": profile,
            "fares": fares,
            "total_fares": total_fares,
        }
    )

@login_required
def Edit_Profile(request: HttpRequest) -> HttpResponse:
    if request.user.is_superuser:
        return redirect("admin_dashboard")
    profile, created = Profile.objects.get_or_create(user=request.user)
    if request.method == "POST":
        username = request.POST.get("username","").strip()
        email = request.POST.get("email","").strip()
        first_name = request.POST.get("first_name","").strip()
        last_name = request.POST.get("last_name","").strip()
        phone_number = request.POST.get("phone_number","").strip()
        bio = request.POST.get("bio","").strip()
        profile_picture = request.FILES.get("profile_picture")
        if not username or not email:
            return render(request,"user/edit-profile.html",
                {"profile": profile,"error": "Username and email are required."}
            )
        username_exists = User.objects.filter(username=username).exclude(id=request.user.id).exists()
        if username_exists:
            return render(request,"user/edit-profile.html",
                {"profile": profile,"error": "That username is already taken."}
            )
        email_exists = User.objects.filter(email=email).exclude(id=request.user.id).exists()
        if email_exists:
            return render(request,"user/edit-profile.html",
                {"profile": profile,"error": "That email is already registered."}
            )
        request.user.username = username
        request.user.email = email
        request.user.first_name = first_name
        request.user.last_name = last_name
        request.user.save()
        profile.phone_number = phone_number
        profile.bio = bio
        if profile_picture:
            profile.profile_picture = profile_picture
        profile.save()
        return redirect("profile")
    return render(request,"user/edit-profile.html",{"profile": profile})

@login_required
def Flag_Fare(request: HttpRequest,fare_id: int) -> HttpResponse:
    if request.user.is_superuser:
        return redirect("admin_dashboard")
    fare_submission = get_object_or_404(
        FareSubmission,
        id=fare_id
    )
    if request.method == "POST":
        reason = request.POST.get("reason","").strip()
        if not reason:
            return redirect("flag_failure")
        already_flagged = Flag.objects.filter(
            user=request.user,
            fare_submission=fare_submission
        ).exists()
        if already_flagged:
            return redirect("flag_failure")
        try:
            Flag.objects.create(
                user=request.user,
                fare_submission=fare_submission,
                reason=reason
            )
            return redirect("flag_success")
        except Exception:
            return redirect("flag_failure")
    return render(request,"user/flag-fare.html",
        {"fare_submission": fare_submission}
    )
    
@login_required
def Flag_Success(request: HttpRequest) -> HttpResponse:
    return render(request,"user/success.html")

@login_required
def Flag_Failure(request: HttpRequest) -> HttpResponse:
    return render(request,"user/failure.html")
       
def admin_required(view_func):
    return user_passes_test(lambda user: user.is_authenticated and user.is_staff)(view_func)

@admin_required
def Admin_Dashboard(request):
    total_fares = FareSubmission.objects.count()
    pending_flags = Flag.objects.filter(status="PENDING").count()
    total_routes = Route.objects.count()
    total_users = User.objects.filter(is_superuser=False).count()
    recent_flags = Flag.objects.select_related(
        "user",
        "fare_submission",
        "fare_submission__route"
    ).order_by("-created_at")[:5]
    return render(request, "admin/admin-dashboard.html", {
        "total_fares": total_fares,
        "pending_flags": pending_flags,
        "total_routes": total_routes,
        "total_users": total_users,
        "recent_flags": recent_flags,
    })

@admin_required
def Admin_Flags(request):
    flags = Flag.objects.select_related(
        "user",
        "fare_submission",
        "fare_submission__route"
    ).order_by("-created_at")
    return render(request, "admin/admin-flags.html", {"flags": flags})

@admin_required
def Admin_Flag_Detail(request, flag_id):
    flag = get_object_or_404(
        Flag.objects.select_related(
            "user",
            "fare_submission",
            "fare_submission__route"
        ),
        id=flag_id
    )
    return render(request, "admin/admin-flag-detail.html", {"flag": flag})

@admin_required
def Resolve_Flag(request, flag_id):
    if request.method == "POST":
        flag = get_object_or_404(Flag, id=flag_id)
        flag.status = "RESOLVED"
        flag.save(update_fields=["status"])
    return redirect("admin_flag_detail", flag_id=flag_id)

@admin_required
def Admin_Fares(request):
    fares = FareSubmission.objects.select_related(
        "user",
        "route"
    ).order_by("-created_at")
    return render(request, "admin/admin-fares.html", {"fares": fares})

@admin_required
def Admin_Routes(request):
    routes = Route.objects.all()
    return render(request, "admin/admin-routes.html", {"routes": routes})

@admin_required
def Admin_Users(request):
    users = User.objects.filter(is_superuser=False).prefetch_related("fare_submissions").order_by("-date_joined")
    return render(request, "admin/admin-user.html", {"users": users})