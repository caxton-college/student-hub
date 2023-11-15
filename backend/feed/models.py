from django.db import models

# Create your models here.
class Announcement(models.Model):
    title = models.CharField(max_length=50)
    body = models.CharField(max_length=500)
    date_created = models.DateField(auto_now=True)
    owner = models.ForeignKey('users.User', related_name='announcements', on_delete=models.CASCADE)
    
    class Meta:
        ordering = ['-date_created']
    
    def __str__(self) -> str:
        return self.title
    
    
class Suggestion(models.Model):
    body = models.CharField(max_length=250)
    likes = models.PositiveSmallIntegerField(default=0)
    pinned = models.BooleanField(default=False)
    liked_by = models.ManyToManyField('users.User', related_name='liked_suggestions', blank=True)
    date_created = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey('users.User', related_name='suggestions', on_delete=models.CASCADE)
    
    class Meta:
        ordering = ['-pinned', '-likes']
    
    def __str__(self) -> str:
        return f"{self.body} - {self.likes}"
    
    

class Poll(models.Model):
    question = models.CharField(max_length=100)
    date_created = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey('users.User', related_name='poll', on_delete=models.CASCADE)
    
    class Meta:
        ordering = ['-date_created']
    
    def __str__(self) -> str:
        return self.question

class PollOption(models.Model):
    body = models.CharField(max_length=100)
    date_created = models.DateTimeField(auto_now=True)
    likes = models.PositiveSmallIntegerField(default=0)
    liked_by = models.ManyToManyField('users.User', related_name='liked_polloptions', blank=True)
    poll = models.ForeignKey('Poll', related_name='polloption', on_delete=models.CASCADE)
    
    class Meta:
        ordering = ['-likes']
    
    def __str__(self) -> str:
        return self.body
    
    
