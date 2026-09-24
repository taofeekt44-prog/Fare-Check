from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField

# Create your models here.
class Route(models.Model):
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ["origin", "destination"]
        constraints = [
            models.UniqueConstraint(
                fields=["origin", "destination"],
                name="unique_route"
            )
        ]
    def __str__(self):
        return f"{self.origin} to {self.destination}"

class FareSubmission(models.Model):
    TRANSPORT_TYPE = [
        ("BUS", "Bus"),
        ("KEKE", "Keke"),
        ("TAXI", "Taxi"),
    ]

    TIME_OF_DAY = [
        ("MORNING", "Morning"),
        ("AFTERNOON", "Afternoon"),
        ("EVENING", "Evening"),
        ("NIGHT", "Night"),
    ]
    
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="fare_submissions")
    route = models.ForeignKey(Route,on_delete=models.CASCADE,related_name="fare_submissions")
    transport_type = models.CharField(max_length=20,choices=TRANSPORT_TYPE,default="BUS")
    amount = models.DecimalField(max_digits=8,decimal_places=2)
    time_of_day = models.CharField(max_length=20,choices=TIME_OF_DAY,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ["-created_at"]
    def __str__(self):
        return (
            f"{self.user} through "
            f"{self.route} paid "
            f"₦{self.amount}"
        )

class Flag(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("RESOLVED", "Resolved"),
    ]

    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="flags")
    fare_submission = models.ForeignKey(FareSubmission,on_delete=models.CASCADE,related_name="flags")
    reason = models.CharField(max_length=200)
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default="PENDING")
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return (
            f"{self.user} flagged "
            f"{self.fare_submission}"
        )
        
class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    profile_picture = CloudinaryField(
        "profile_picture",
        blank=True,
        null=True
    )

    phone_number = models.CharField(
        max_length=20,
        blank=True
    )

    bio = models.TextField(
        max_length=300,
        blank=True
    )

    def __str__(self):
        return self.user.username