from rest_framework import serializers
from recognition.models import Video


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ("name", "location", "totalTime", "width", "height", "fps")


class CropSerializer(serializers.Serializer):
    x = serializers.IntegerField()
    y = serializers.IntegerField()
    width = serializers.IntegerField()
    height = serializers.IntegerField()
    currentTime = serializers.FloatField()
