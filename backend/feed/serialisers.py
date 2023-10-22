from rest_framework import serializers

from .models import Announcement, Suggestion, Poll, PollOption


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'
         
class SuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suggestion
        fields = '__all__'
        
class PollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Poll
        fields = '__all__'
        
class PollOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollOption
        fields = '__all__' 