from django.shortcuts import render
from rest_framework import generics

from recognition.models import Video
from recognition.serializers import VideoSerializer


# Create your views here.
class VideoListCreate(generics.ListCreateAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
