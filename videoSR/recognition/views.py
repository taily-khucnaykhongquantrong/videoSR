# from django.shortcuts import render
from rest_framework import generics, status, views
from rest_framework.response import Response
# import base64

from recognition.models import Video
from recognition.serializers import VideoSerializer, CropSerializer
from binaries.ffmpeg import video2Frames

from recognition.SRModels.EDVR.test import generate


# Create your views here.
class VideoListCreate(generics.ListCreateAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer


class GenerateSRImageView(views.APIView):
    def post(self, request):
        serializer = CropSerializer(data = request.data)
        response = Response({"message": "Bad request"}, status.HTTP_404_NOT_FOUND,)

        if serializer.is_valid():
            crop = serializer.data
            video = Video.objects.get(name = "license_plate8_cut")
            video2Frames(
                crop,
                video.fps,
                video.totalTime,
                "static\\videos\\license_plate8_cut.mp4",
            )
            # Generate SR images
            result = generate()
            # with open(
            #     "recognition/SRModels/EDVR/result/03_2.png", "rb"
            # ) as image_file:
            #     encoded_string = base64.b64encode(image_file.read())

            response = Response(
                {"message": "Successfully generated", "result": result},
                status.HTTP_201_CREATED,
            )

        return response
