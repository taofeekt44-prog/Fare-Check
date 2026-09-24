from django.contrib import admin
from .models import Route,FareSubmission,Flag,Profile

# Register your models here.
admin.site.register(Route)
admin.site.register(FareSubmission)
admin.site.register(Flag)
admin.site.register(Profile)