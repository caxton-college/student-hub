from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.Announcement)
admin.site.register(models.Suggestion)
admin.site.register(models.Poll)
admin.site.register(models.PollOption)