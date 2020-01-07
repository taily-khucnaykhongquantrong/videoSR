# from django.shortcuts import render
from rest_framework import generics, status, views
from rest_framework.response import Response

from recognition.models import Video
from recognition.serializers import VideoSerializer, CropSerializer


# Create your views here.
class VideoListCreate(generics.ListCreateAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer


class GenerateSRImageView(views.APIView):
    def post(self, request):
        serializer = CropSerializer(data=request.data)
        serializer.is_valid()
        data = serializer.data

        response = {
            "status_code": status.HTTP_200_OK,
            "message": "Successfully generated",
            "result": data,
        }

        return Response(response, status.HTTP_201_CREATED)
