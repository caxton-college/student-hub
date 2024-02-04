from rest_framework import serializers

from .models import Reward

class RewardSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Reward
        fields = ("id", "name", "cost")