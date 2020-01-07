from django.db import models


# Create your models here.
class Video(models.Model):
    name = models.CharField(max_length=100)
    location = models.TextField()
    totalTime = models.FloatField()
    width = models.IntegerField()
    height = models.IntegerField()
    fps = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
