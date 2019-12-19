from django.db import models


# Create your models here.
class Video(models.Model):
    name = models.CharField(max_length=100)
    file = models.FileField()
    totalTime = models.CharField(max_length=10)
    fps = models.CharField(max_length=2)
    created_at = models.DateTimeField(auto_now_add=True)
