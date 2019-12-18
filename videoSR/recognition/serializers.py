from rest_framework import serializers
from recognition.models import Video


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ("name", "location", "totalTime", "fps")
