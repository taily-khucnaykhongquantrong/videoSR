from django.urls import path
from . import views

urlpatterns = [
    path("videos/", views.VideoListCreate.as_view()),
    path("sr/", views.GenerateSRImageView.as_view()),
]
