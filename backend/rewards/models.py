from django.db import models

# Create your models here.
class Reward(models.Model):
    name = models.CharField(max_length=100)
    cost = models.PositiveSmallIntegerField(default=0)
    
