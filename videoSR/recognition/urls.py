from django.urls import path
from . import views

urlpatterns = [
    path("api/video/", views.VideoListCreate.as_view()),
]
