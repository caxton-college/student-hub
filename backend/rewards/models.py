from django.db import models

from users.models import User
# Create your models here.
class Reward(models.Model):
    name = models.CharField(max_length=100)
    cost = models.PositiveSmallIntegerField(default=0)
    owners = models.ManyToManyField(User, blank=True)
    
    def __str__(self):
        return self.name
    
