from django.db import models

# Create your models here.
class Announcement(models.Model):
    message = models.CharField(max_length=2500)
    created = models.DateField(auto_now=True)