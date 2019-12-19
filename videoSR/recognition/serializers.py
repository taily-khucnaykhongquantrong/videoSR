from rest_framework import serializers
from recognition.models import Video


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ("name", "file", "totalTime", "fps")
